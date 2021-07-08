
// Complex Numbers

const C  = (r, i=0) => ({ r, i, m: hyp(r, i), p: atan2(i, r) % TAU });
const C2 = (m, p=0) => ({ r: m * cos(p), i: m * sin(p), m:abs(m), p });


// Complex Operations

const c_neg   = (z) => C(-z.r, z.i)
const c_conj  = (z) => C(z.r, -z.i)
const c_recip = (z) => C2(z.m > 0 ? 1 / z.m : LOCAL_INFINITY, -z.p)
const c_sqrt  = (z) => C2(sqrt(z.m), z.p/2)
const c_sqrt2 = (z) => C2(sqrt(z.m), (z.p + TAU)/2)
const c_cbrt  = (z) => C2(cbrt(z.m), z.p/3)
const c_cbrt2 = (z) => C2(cbrt(z.m), (z.p + TAU)/3)
const c_cbrt3 = (z) => C2(cbrt(z.m), (z.p + TAU * 2)/3)

const c_add   = (z, w) => C(z.r + w.r, z.i + w.i)
const c_sub   = (z, w) => C(z.r - w.r, z.i - w.i)

const c_mul   = (z, w) => C2(z.m * w.m, z.p + w.p)
const c_div   = (z, w) => C2(w.m > 0 ? z.m / w.m : LOCAL_INFINITY, z.p - w.p)

const c_scale = (z, x) => C2(z.m * x, z.p)
const c_pow   = (z, a) => C2(z.m ** a, z.p * a)

const c_lerp  = (z, w, t) => C2(lerp(z.m, w.m, t), lerp(z.p, w.p, t)) // phase lerp
const c_lerp2 = (z, w, t) =>  C(lerp(z.r, w.r, t), lerp(z.i, w.i, t)) // box lerp


// Complex Representations

const c_color = (z) => {
  return hsl(
    THREE.MathUtils.euclideanModulo(z.p,TAU), 
    1, 
    clamp(pow(z.m, 0.5))/2 + 1 - clamp(pow(z.m, -0.05)));
}

const c_string = (z, pr=3) => {
  return z.i > 0 
    ? `${z.r.toFixed(pr)} + ${ z.i.toFixed(pr)}i` 
    : `${z.r.toFixed(pr)} - ${-z.i.toFixed(pr)}i`;
}


// Complex Constants

const I = C(0, 1)
const LOCAL_INFINITY = 1000;