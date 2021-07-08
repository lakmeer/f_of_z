
//
// Branch Surface class
//

class Branch {

  constructor (resolution, type, chromaMode) {
    this.resolution = resolution;
    this.type = type;

    this.state = {
      chromaMode: chromaMode,
      surfaceType: type,
      currentFunction: id,
      targetOpacity: 1,
      verticalOffset: 0,
      valueA: 1,
      valueB: 1,
      valueC: 1,
    };
 
    // Mathematical values (and their lerp states)
    this.values = {
      actual: [],
      target: [],
      stale:  [],
    };

    // Chromatic values
    this.chroma = {
      canvas:  document.createElement('canvas'),
      pixels:  null,
      context: null,
      texture: null,
    };
    
    this.chroma.context = this.chroma.canvas.getContext('2d');
    this.chroma.texture = new THREE.CanvasTexture(this.chroma.canvas);
    this.chroma.canvas.className = 'chroma';
    this.chroma.canvas.width  = resolution;
    this.chroma.canvas.height = resolution;

    // ThreeJS object setup
    this.material = new THREE.MeshStandardMaterial({
      map: this.chroma.texture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.01
    });

    this.mesh = this.genMeshOfType(type);

    // Initial values
    this.setInitialValues();
  }
  
  setInitialValues () {    
    this.values.stale  = this.mesh.geometry.vertices.map(this.vertexToComplex(this.state.currentFunction));
    this.values.target = this.values.stale.map(id);
    this.values.actual = this.values.stale.map(id);
  }

  changeFunction (fn) {
    this.state.currentFunction = fn;
    this.calcValues(fn);
  }

  updateParams (a, b, c) {
    if (typeof a != 'undefined') this.state.valueA = a;
    if (typeof b != 'undefined') this.state.valueB = b;
    if (typeof c != 'undefined') this.state.valueC = c;
    this.calcValues(this.state.currentFunction);
  }
  
  vertexToComplex (fn) {
    return (v) => fn(
      C(v.x, this.state.surfaceType === SURFACE_TYPE_CIRCLE ? v.z : v.y),
      this.state.valueA,
      this.state.valueB,
      this.state.valueC)
  }
    
  colorPixel (p, color) {
    this.chroma.pixels.data[p*4+0] = floor(color.r * 255);
    this.chroma.pixels.data[p*4+1] = floor(color.g * 255);
    this.chroma.pixels.data[p*4+2] = floor(color.b * 255);
    this.chroma.pixels.data[p*4+3] = 255;
  }
  
  calcValues () {
    this.values.stale  = this.values.target;
    this.values.target = this.mesh.geometry.vertices.map(this.vertexToComplex(this.state.currentFunction));
  }

  setType (type, scene) {
    scene.remove(this.mesh);
    this.state.surfaceType = type;
    this.mesh = this.genMeshOfType(type);
    scene.add(this.mesh);
    this.setInitialValues();
  }

  setOpacity (alpha, instant = false) {
    log("Branch::setOpacity -", alpha, instant);
    if (instant) this.mesh.material.opacity = alpha;
    this.state.targetOpacity = alpha;
  }

  setValuesFromOtherBranch (branch) {
    this.values.stale  = branch.values.stale.map(id);
    //this.values.target = branch.values.stale.map(id);
  }

  genMeshOfType (type) {
    let mesh;
    switch (type) {
      case SURFACE_TYPE_CIRCLE:
        mesh = new THREE.Mesh(new THREE.ConeGeometry(range[0]/2, 0, this.resolution, this.resolution, true), this.material);
        mesh.geometry.rotateY(-PI/2);
        break;
      
      case SURFACE_TYPE_SQUARE:
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(range[0], range[1], this.resolution, this.resolution), this.material);
        mesh.geometry.scale(1,-1,1);
        mesh.rotation.x = PI/2;
        mesh.scale.y = -1;
        break;
    }
    mesh.geometry.verticesNeedUpdate = true;
    mesh.castShadow = true;
    return mesh;
  }

  update (dt, tween) {
    let res = this.resolution;
    this.mesh.material.opacity = lerp(this.mesh.material.opacity, this.state.targetOpacity, ease(tween));
    this.mesh.position.y = this.mesh.material.opacity;
    
    // updateValues
    this.values.actual = this.values.stale.map((v, i) => c_lerp(v, this.values.target[i], ease(tween)));

    // updateSurface
    let d = this.state.surfaceType == SURFACE_TYPE_SQUARE;
    this.mesh.geometry.vertices.map((v,i) => d ? v.z = -this.values.actual[i].m : v.y = this.values.actual[i].m);
    this.mesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.computeVertexNormals();

    // updateChroma
    this.chroma.pixels = this.chroma.context.getImageData(0, 0, res, res);

    switch (this.state.chromaMode) {
      case CHROMA_MODE_DEBUG:
        this.mesh.material.map.magFilter = THREE.NearestFilter;
        for (let p = 0; p <= res * res; p++) {
          let x = p % res;
          let y = floor(p / res);
          let chroma = new THREE.Color(
            x == 0 || y == 0 || x == res - 1 || y == res - 1     ? 0xffffff :
            abs(x - res/2 + 0.5) < 1 || abs(y - res/2 + 0.5) < 1 ? 0xff0000 :
            0x0000ff);
          this.colorPixel(p, chroma);
        }
        break;
    
      case CHROMA_MODE_ZEROES:
        this.mesh.material.map.magFilter = THREE.LinearFilter;
        for (let p = 0; p <= res * res; p++) {
          let chroma = new THREE.Color(0x0);
          this.colorPixel(p, chroma);
        }
        break;
        
      case CHROMA_MODE_OUTPUT_PHASE:
        this.mesh.material.map.magFilter = THREE.LinearFilter;
        switch (this.state.surfaceType) {
          case SURFACE_TYPE_SQUARE:
            let q = 0;
            this.mesh.geometry.vertices.map((v, i) => {
              let x = i%res, y = floor(i/res);
              this.colorPixel(i + q, new THREE.Color(c_color(this.values.actual[i])));            
              if (y < res && x >= res - 1) q--;
            });
            break;
      
          case SURFACE_TYPE_CIRCLE:
            this.mesh.geometry.vertices.map((v, i) => {
              this.colorPixel(i, new THREE.Color(c_color(this.values.actual[i])));
            });
            break;
        }
    }

    this.chroma.context.putImageData(this.chroma.pixels, 0, 0);
    this.chroma.texture.needsUpdate = true;
  }

  install (scene) {
    scene.add(this.mesh);
  }
}
