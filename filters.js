// Filtering and sorting for the deal board. One job: take the full deal list
// plus the shopper's current choices and return the deals to show, in order.

export function percentOff(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedDollars(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

// The verdict order for sorting: a new low outranks a strong price, which
// outranks a routine sale, so the best-verdict deals surface first.
const verdictRank = { "new-low": 0, strong: 1, routine: 2 };

export function applyFilters(deals, choice) {
  const query = (choice.query ?? "").trim().toLowerCase();
  const kept = deals.filter((deal) => {
    if (query !== "" && !`${deal.title} ${deal.store} ${deal.category}`.toLowerCase().includes(query)) return false;
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
