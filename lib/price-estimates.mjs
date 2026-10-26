import { priceInCents, positiveAmount } from './money.mjs';
export function quoteFor(need, quotes = []) {
  const candidates = quotes.filter(
    (q) => q.ingredientId === need.id && q.unit === need.unit,
  );
  if (candidates.length !== 1) return null;
  const q = candidates[0],
    amount = positiveAmount(q.amount),
    price = priceInCents(q.price);
  if (amount === null || price === null) return null;
  const packages = Math.ceil(Math.round(need.quantity * 1000) / amount);
  if (packages > 10000 || packages * price > 100000000) return null;
  return { quote: q, packages, cents: packages * price };
}
export function estimateGroceries(missing, quotes = [], budget = '') {
  const lines = missing.map((need) => ({
    need,
    estimate: quoteFor(need, quotes),
  }));
  const subtotalCents = lines.reduce((s, l) => s + (l.estimate?.cents || 0), 0),
    unpriced = lines.filter((l) => !l.estimate).length;
  const overflow = subtotalCents > 100000000,
    complete = unpriced === 0 && !overflow,
    budgetCents = priceInCents(budget);
  return {
    lines,
    subtotalCents: overflow ? null : subtotalCents,
    unpriced,
    complete,
    budgetCents,
    status:
      budgetCents === null || overflow
        ? 'unknown'
        : subtotalCents > budgetCents
          ? 'over'
          : complete
            ? 'within'
            : 'unknown',
  };
}
