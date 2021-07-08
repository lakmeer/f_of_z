
//
// Multi-branch Surface class
//

class Surface {

  constructor (resolution, type, chromaMode, scene) {
    this.scene = scene;
    this.resolution = resolution;
    this.type = type;
    this.chromaMode = chromaMode;
    this.branches = [];
    
    // State
    this.state = {
      currentBranch: 0,
      tweenTimer: 0,
      tweenSpeed: 2.0
    };
    
    // Chroma Preview
    this.chromaContainer = element('div', 'multicanvas');
    document.body.appendChild(this.chromaContainer);
  }
  
  setFunction (fn) {
    this.state.tweenTimer = 0;
    while (this.branches.length < fn.length) this.newBranch();
    while (this.branches.length > fn.length) this.destroyBranch(this.branches.pop());
    this.state.currentBranch = min(this.state.currentBranch, this.branches.length - 1);
    this.branches.map((branch, ix) => {
      if (ix > 0) branch.setValuesFromOtherBranch(this.branches[0]);
      branch.setOpacity(ix === this.state.currentBranch ? 1 : 0, true);
      branch.changeFunction(fn[ix]);
    });
  }

  newBranch () {
    let branch = new Branch(this.resolution, this.type, this.chromaMode);
    this.scene.add(branch.mesh);
    this.chromaContainer.appendChild(branch.chroma.canvas);
    this.branches.push(branch);
  }

  destroyBranch (branch) {
    this.scene.remove(branch.mesh);
    this.chromaContainer.removeChild(branch.chroma.canvas);
  }

  showChromaSwatches () {
    this.chromaContainer.style.display = 'flex';
  }

  hideChromaSwatches () {
    this.chromaContainer.style.display = 'none';
  }

  prevBranch () {
    this.state.currentBranch = wrap(this.state.currentBranch + 1, this.branches.length - 1);
    this.branches.map((b, ix) => b.setOpacity(ix === this.state.currentBranch ? 1 : 0));
  }

  nextBranch () {
    this.state.currentBranch = wrap(this.state.currentBranch - 1, this.branches.length - 1);
    this.branches.map((b, ix) => b.setOpacity(ix === this.state.currentBranch ? 1 : 0));
  }

  setType (type) {
    this.type = type;
    this.branches.map((b) => b.setType(type, this.scene));
  }
  
  setOpacity (a) {
    console.log("Surface::setOpacity");
  }

  updateParams (a, b, c) {
    this.branches.map((b) => b.updateParams(a, b, c));
  }

  update (dt) {
    this.state.tweenTimer += dt * this.state.tweenSpeed;
    if (this.state.tweenTimer > 1) this.state.tweenTimer = 1;
    this.branches.map((b) => b.update(dt, this.state.tweenTimer));
  }
  
}
