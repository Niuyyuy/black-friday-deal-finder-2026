// HTML for the deal board's pages, built from the deal data. Every value is
// escaped before it goes into the page, so a deal title can never break the
// markup. Two pages: the board (a card per deal) and one deal's detail.

import { percentOff, savedDollars } from "./filters.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const usd = (n) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;

const checkedDay = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

const verdictLabel = {
  "new-low": "New low",
  strong: "Strong price",
  routine: "Routine sale",
};

export function verdictPill(deal) {
  return `<span class="verdict ${deal.verdict}">${verdictLabel[deal.verdict]}</span>`;
}

export function dealCard(deal) {
  return `<article class="card">
  <a class="card-title" href="#/deal/${encodeURIComponent(deal.id)}">${escape(deal.title)}</a>
  <p class="card-meta"><span class="store">${escape(deal.store)}</span> · <span>${escape(deal.category)}</span></p>
  <p class="card-price"><strong>${usd(deal.price)}</strong> <s>${usd(deal.was)}</s> <span class="off">${percentOff(deal)}% off</span></p>
  <p class="card-save">You save ${usd(savedDollars(deal))} ${verdictPill(deal)}</p>
  <p class="card-checked">Checked ${checkedDay(deal.checked)}</p>
  <p class="card-link"><a href="${escape(deal.url)}" rel="noopener" target="_blank">Find it at ${escape(deal.store)} →</a></p>
</article>`;
}

export function board(deals, total) {
  if (deals.length === 0) {
    return `<p class="empty">No deal matches those filters. Clear the search or pick a wider filter.</p>`;
  }
  return `<p class="count">Showing ${deals.length} of ${total} deals</p>
<section class="grid">${deals.map(dealCard).join("")}</section>`;
}

export function dealPage(deal) {
  const cross = deal.also
    ? `<p class="cross">Same product elsewhere: <strong>${escape(deal.also.store)} — ${usd(deal.also.price)}</strong> (this listing: ${escape(deal.store)} — ${usd(deal.price)}).</p>`
    : "";
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <h1>${escape(deal.title)}</h1>
  <p class="detail-meta"><span class="store">${escape(deal.store)}</span> · ${escape(deal.category)}</p>
  <p class="detail-price"><strong>${usd(deal.price)}</strong> <s>${usd(deal.was)}</s> <span class="off">${percentOff(deal)}% off</span></p>
  <p>You save ${usd(savedDollars(deal))}. ${verdictPill(deal)}</p>
  <h2>Is it really a deal?</h2>
  <p>${escape(deal.note)}</p>
  ${cross}
  <dl>
    <dt>Store</dt><dd>${escape(deal.store)}</dd>
    <dt>Category</dt><dd>${escape(deal.category)}</dd>
    <dt>Checked</dt><dd>${checkedDay(deal.checked)}</dd>
    <dt>Read in</dt><dd>${escape(deal.source)}</dd>
  </dl>
  <p class="detail-link"><a href="${escape(deal.url)}" rel="noopener" target="_blank">Find it at ${escape(deal.store)} →</a></p>
</article>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
