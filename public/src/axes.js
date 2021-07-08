
// Reference Constants

const AXES_FONT_PATH = "font/Latin Modern Math_Regular.json";
const CHROMA_TEX_MAP = "textures/chroma.jpg";

const lineMaterial   = new THREE.LineBasicMaterial({ color: 0x0 });
const labelMaterial  = new THREE.MeshBasicMaterial({ color: 0x0 });
const chromaMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(CHROMA_TEX_MAP) });
const fontLoader     = new THREE.FontLoader();


//
// Axes Grid
//
// Stage upon which surface may be presented.
//

class Axes {
  
  constructor (size, scene) {
 
    this.state = {
      font: null,
      size: size,
      zScale: 1,
      zScaleTarget: 1,
      lerpSpeed: 0.3
    };


    // ThreeJS setup
    
    this.root = new THREE.Object3D();    
    this.root.name = "Axes";

    this.grid = new THREE.GridHelper(size, size, 0xffffff, 0);
    this.grid.name = "Grid";
    this.grid.position.y = 0.001;
    this.root.add(this.grid);

    let notches = new THREE.Geometry();
    for (let i = 0; i <= size; i++) {
      notches.vertices.push(new THREE.Vector3(size/-2, i, -size/2));
      notches.vertices.push(new THREE.Vector3(size/ 2, i, -size/2));
    }
    this.ruler = new THREE.LineSegments(notches, lineMaterial);
    this.ruler.name = "Ruler";
    this.root.add(this.ruler);
    let vert = new THREE.Geometry();
    vert.vertices.push(new THREE.Vector3(0, 0, -size/2));
    vert.vertices.push(new THREE.Vector3(0, size, -size/2));
    this.root.add(new THREE.Line(vert, new THREE.LineBasicMaterial({ color: 0xffffff })));
    
    // Append to heirarchy
    if (scene) this.install(scene);

    // Await external resources
    fontLoader.load(AXES_FONT_PATH, (font) => {
      this.state.font = font;
      this.setAxesLabels('ℜ(z)', 'ℑ(z)', '|w|', '∠w');
    });
  }

  install (scene) {
    scene.add(this.root);
  }

  setVerticalScale (s) {
    this.state.zScaleTarget = s;
  }

  setAxesLabels (a, b, c, d) {
    [a, b, c, d].forEach((text, ix) => {
      let geometry = new THREE.TextGeometry(text, { font: this.state.font, size: 0.5, height: 0 });
      geometry.center();
      let label = new THREE.Mesh(geometry, labelMaterial);
      
      switch (ix) {
        case 0:
          label.position.x = this.state.size/2 + 1;
          break;
        case 1:
          label.position.z = this.state.size/2 + 1;
          label.rotation.y = PI/2;
          break;
        case 2:
          label.position.x = -1;
          label.position.z = -this.state.size/2;
          label.position.y = this.state.size + 1;
          break;
        case 3:
          label.position.x = 1;
          label.position.y = this.state.size + 1;
          label.position.z = -this.state.size/2;
          label.material = chromaMaterial;
          break;
      }
      scene.add(label);
    });    
  }
  
  update (dt) {
    this.state.zScale = lerp(this.state.zScale, this.state.zScaleTarget, this.state.lerpSpeed);
  }
  
}
