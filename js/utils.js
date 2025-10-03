export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const formatUSD = (n) => `$${Number(n).toFixed(2)}`;
export const debounce = (fn, t = 200) => {
  let id;
  return (...a) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...a), t);
  };
};
