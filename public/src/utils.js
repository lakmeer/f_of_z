
// Utils

const id = (x) => x
const log = (...args) => { console.log(...args); return args[0]; }
const whichKey = (code, fn) => (event) => { if (event.which === code) fn.call(this, event); }
const hyp = (x, y) => sqrt(x*x + y*y)
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (n) => min(1, max(0, n))
const wrap = (n, m) => n < 0 ? m : n > m ? 0 : n;
const rnd = (n, m) => (typeof m === 'undefined') ? Math.random() * n : n + Math.random() * (m - n)
const { abs, sqrt, cbrt, sin, cos, atan, atan2, PI, min, max, floor, ceil, sign, pow } = Math
const TAU = PI * 2
const RAD_TO_DEG = 180/PI
const head = (xs) => xs.length ? null : xs[ xs.length - 1 ]
const select = (xs, fn) => head(xs.filter(fn))
const percent = (n) => floor(n * 100) + '%'

const greyscale = (n) => rgb(n,n,n)

const element = (tag, className = "") => {
  let el = document.createElement(tag);
  el.className = className;
  return el;
}

const rgb = (r,g,b) => {
  r = clamp(r) * 255;
  g = clamp(g) * 255;
  b = clamp(b) * 255;
  return `rgb(${r},${g},${b})`;
}

const hsl = (h,s,l) => {
  return `hsl(${(h*360/TAU).toFixed(3)},${percent(clamp(s))},${percent(clamp(l))})`;
}

const ease = (n) => 1 - (1 - n) * (1 - n) * (1 - n)

const elastic = (n) => {
  const c4 = (2 * Math.PI) / 3;
  return (n === 0 ? 0 : n === 1 ? 1 : pow(2, -10 * n) * sin((n * 10 - 0.75) * c4) + 1);
}