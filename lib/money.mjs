export function priceInCents(value) {
  const s = String(value).trim();
  if (!/^(?:\d{1,7}(?:\.\d{0,2})?|\.\d{1,2})$/.test(s)) return null;
  const [whole, fraction = ''] = s.split('.');
  const cents = Number(whole || 0) * 100 + Number(fraction.padEnd(2, '0'));
  return cents <= 100000000 ? cents : null;
}
export function positiveAmount(value) {
  const s = String(value).trim();
  return /^(?:\d{1,5}(?:\.\d{1,3})?|\.\d{1,3})$/.test(s) &&
    Number(s) > 0 &&
    Number(s) <= 10000
    ? Math.round(Number(s) * 1000)
    : null;
}
