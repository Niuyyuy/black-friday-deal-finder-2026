// Deal Beacon's wiring: hash routes plus the board's search, filters and
// sorting. The board lives at #/ and each deal at #/deal/<id>. Every control
// re-renders the board in place, so the page never reloads.
//
//   window.__shotReady is false while a page renders and true once it is on
//   screen, so a screenshot script knows when to capture.

import { deals, stores, categories } from "./data.js";
import { applyFilters } from "./filters.js";
import { board, dealPage, missingPage } from "./views.js";

const app = document.getElementById("app");

const choice = {
  query: "",
  category: "all",
  store: "all",
  minDiscount: 0,
  verdict: "all",
  sort: "verdict",
};

function options(values, current, allLabel) {
  const all = `<option value="all">${allLabel}</option>`;
  return all + values.map((v) => `<option value="${v}"${v === current ? " selected" : ""}>${v}</option>`).join("");
}

function controls() {
  return `<form class="controls" id="controls">
  <label class="search">Search <input type="search" id="q" placeholder="Headphones, TV, Dyson…" value="${choice.query.replace(/"/g, "&quot;")}"></label>
  <label>Category <select id="category">${options(categories, choice.category, "All categories")}</select></label>
  <label>Store <select id="store">${options(stores, choice.store, "All stores")}</select></label>
  <label>Discount <select id="discount">
    <option value="0"${choice.minDiscount === 0 ? " selected" : ""}>Any discount</option>
    <option value="20"${choice.minDiscount === 20 ? " selected" : ""}>20% off or more</option>
    <option value="40"${choice.minDiscount === 40 ? " selected" : ""}>40% off or more</option>
    <option value="50"${choice.minDiscount === 50 ? " selected" : ""}>50% off or more</option>
  </select></label>
  <label>Verdict <select id="verdict">
    <option value="all"${choice.verdict === "all" ? " selected" : ""}>Any verdict</option>
    <option value="new-low"${choice.verdict === "new-low" ? " selected" : ""}>New lows only</option>
    <option value="strong"${choice.verdict === "strong" ? " selected" : ""}>Strong prices only</option>
    <option value="routine"${choice.verdict === "routine" ? " selected" : ""}>Routine sales only</option>
  </select></label>
  <label>Sort <select id="sort">
    <option value="verdict"${choice.sort === "verdict" ? " selected" : ""}>Best verdict first</option>
    <option value="discount"${choice.sort === "discount" ? " selected" : ""}>Biggest discount</option>
    <option value="saved"${choice.sort === "saved" ? " selected" : ""}>Most dollars saved</option>
    <option value="price-low"${choice.sort === "price-low" ? " selected" : ""}>Lowest price</option>
    <option value="price-high"${choice.sort === "price-high" ? " selected" : ""}>Highest price</option>
  </select></label>
</form>`;
}

function renderBoard() {
  const shown = applyFilters(deals, choice);
  app.innerHTML = controls() + board(shown, deals.length);
  app.querySelector("#q").addEventListener("input", (event) => {
    choice.query = event.target.value;
    renderBoard();
    const box = app.querySelector("#q");
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  });
  app.querySelector("#category").addEventListener("change", (event) => {
    choice.category = event.target.value;
    renderBoard();
  });
  app.querySelector("#store").addEventListener("change", (event) => {
    choice.store = event.target.value;
    renderBoard();
  });
  app.querySelector("#discount").addEventListener("change", (event) => {
    choice.minDiscount = Number(event.target.value);
    renderBoard();
  });
  app.querySelector("#verdict").addEventListener("change", (event) => {
    choice.verdict = event.target.value;
    renderBoard();
  });
  app.querySelector("#sort").addEventListener("change", (event) => {
    choice.sort = event.target.value;
    renderBoard();
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | Deal Beacon`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = "Deal Beacon — Black Friday 2026";
    renderBoard();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
