// Deal Beacon's search, filter, sort and summary helpers. One job: take
// the deal list and the shopper's current choices and hand back the deals
// to show, in order, plus the numbers the board's stats strip prints.

export function percentOff(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedDollars(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

// Verdict order for the default sort: a new low outranks a strong price,
// which outranks a routine sale, so the best-verdict deals surface first.
const verdictRank = { "new-low": 0, strong: 1, routine: 2 };

function matchesQuery(deal, query) {
  if (query === "") return true;
  const haystack = `${deal.title} ${deal.store} ${deal.category} ${deal.note}`.toLowerCase();
  return haystack.includes(query);
}

export function applyFilters(deals, choice) {
  const query = (choice.query ?? "").trim().toLowerCase();
  const kept = deals.filter((deal) => {
    if (!matchesQuery(deal, query)) return false;
    if (choice.category !== "all" && deal.category !== choice.category) return false;
    if (choice.store !== "all" && deal.store !== choice.store) return false;
    if (choice.minDiscount > 0 && percentOff(deal) < choice.minDiscount) return false;
    if (choice.verdict !== "all" && deal.verdict !== choice.verdict) return false;
    return true;
  });
  return sortDeals(kept, choice.sort);
}

export function sortDeals(deals, sort) {
  const rows = [...deals];
  switch (sort) {
    case "discount":
      return rows.sort((a, b) => percentOff(b) - percentOff(a) || savedDollars(b) - savedDollars(a));
    case "saved":
      return rows.sort((a, b) => savedDollars(b) - savedDollars(a));
    case "price-low":
      return rows.sort((a, b) => a.price - b.price);
    case "price-high":
      return rows.sort((a, b) => b.price - a.price);
    case "verdict":
    default:
      return rows.sort(
        (a, b) => verdictRank[a.verdict] - verdictRank[b.verdict] || percentOff(b) - percentOff(a),
      );
  }
}

// The board's headline numbers: how many deals, how many are new lows,
// the deepest cut on the board and the dollars saved across every deal.
export function boardStats(deals) {
  return {
    count: deals.length,
    newLows: deals.filter((d) => d.verdict === "new-low").length,
    biggestPct: deals.reduce((best, d) => Math.max(best, percentOff(d)), 0),
    totalSaved: deals.reduce((sum, d) => sum + savedDollars(d), 0),
  };
}
