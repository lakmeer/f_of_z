
// Functions

const functions = [
  {
    tex: "f(z) = 0",
    zScale: 1,
    fn: [ (z) => C(0) ]
  },
  {
    tex: "f(z) = 1",
    zScale: 1,
    fn: [ (z) => C(1) ]
  },
  {
    tex: "f(z) = i",
    zScale: 1,
    fn: [ (z) => I ]
  },
  {
    tex: "f(z) = z",
    zScale: 1,
    fn: [ (z) => z ]
  },
  {
    tex: "f(z) = iz",
    zScale: 1,
    fn: [ (z) => c_mul(I, z) ]
  },
  {
    tex: "f(z) = -z",
    zScale: 1,
    fn: [ (z) => c_mul(C(-1), z) ]
  },
  {
    tex: "f(z) = z^2 - \\alpha",
    zScale: 1/5,
    fn: [ (z, a) => c_add(c_mul(z, z), C(-a)) ]
  },
  {
    tex: "f(z) = z^3 - \\alpha",
    zScale: 1/25,
    fn: [ (z, a) => c_add(c_pow(z, 3), C(-a)) ]
  },
  {
    tex: "f(z) = z^4 - \\alpha",
    zScale: 1/125,
    fn: [ (z, a) => c_add(c_pow(z, 4), C(-a)) ]
  },
  {
    tex: "f(z) = {1 \\over z}",
    zScale: 1,
    fn: [ (z) => c_div(C(1), z) ]
  },
  {
    tex: "f(z) = \\sqrt z",
    zScale: 1,
    fn: [
      (z) => c_sqrt(z),
      (z) => c_sqrt2(z)
    ]
  },
  {
    tex: "f(z) = \\sqrt[3] z",
    zScale: 1,
    fn: [
      (z) => c_cbrt(z),
      (z) => c_cbrt2(z),
      (z) => c_cbrt3(z)
    ]
  },
  {
    tex: "f(z) = 0",
    zScale: 1,
    fn: [ (z) => C(0) ]
  }
];