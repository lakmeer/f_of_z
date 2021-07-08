
// Constants

const floorMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xddeeff,
  roughness: 0.5,
  metalness: 0.0,
});

const FLOOR_HEIGHT = 9;


//
// Stage
//
// Ground plane and lights and other settings to make it look nice
//

class Stage {
  
  constructor (height, scene) {
    
    this.root = new THREE.Object3D();
    this.root.name = "Stage";
    
    // Lighting
    let spot    = new THREE.SpotLight(0xffffff, 0.35, height, PI/6, 1, 2);
    let light   = new THREE.SpotLight(0xffffff, 0.5,  height, PI/6, 1, 2);
    let uplight = new THREE.PointLight(0xffffff, 1, height/2, 10);
    let ambient = new THREE.AmbientLight(0xffffff, 0.5);

    light.castShadow = true;
    light.shadow.mapSize.width  = 2048;
    light.shadow.mapSize.height = 2048;
    spot.position.set(0, height/4, 0);
    light.position.set(0, height/4, height/-10);
    uplight.position.set(0, -FLOOR_HEIGHT + 0.1, 0);
    this.root.add(ambient, spot, light, uplight);

    // Ground plane
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), floorMaterial);
    this.ground.rotation.x = -PI/2;
    this.ground.position.y = -FLOOR_HEIGHT;
    this.ground.receiveShadow = true;
    this.root.add(this.ground);
  
    scene.add(this.root);
  }
  
  showHelpers () {
    scene.add(new THREE.DirectionalLightHelper(light));
    scene.add(new THREE.SpotLightHelper(light));
    scene.add(new THREE.PointLightHelper(uplight));
  }
  
  setGroundVisibility (mode) {
    log(mode);
    this.ground.visible = mode;
  }

}