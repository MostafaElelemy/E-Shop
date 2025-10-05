export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function formatUSD(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function debounce(callback, delay = 300) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}
