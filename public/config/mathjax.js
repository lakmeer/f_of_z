
// For some reason, MathJax likes to take it's config from a 
// conventionally-named obejct, and then replace that object
// with it's actual instance when its source loads. I assume
// this makes sense if you're MathJax.

window.MathJax = {
  startup: {
    typeset: false, 
    showMathMenu: false,
  },
  options: {
    renderActions: {
      addMenu: []
    }
  }
}; 
