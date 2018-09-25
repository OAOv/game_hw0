init();
animate();

var renderer, camera, controls, scene;
var group
var angle

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 50;  // important

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  scene = new THREE.Scene();
  
  let gridXZ = new THREE.GridHelper(100, 10, 'red', 'white');
  scene.add(gridXZ);

  let axes = new THREE.AxisHelper (10);
  scene.add (axes);

  var cubeGeometry = new THREE.BoxGeometry(20, 5, 10)
  var cubeMaterial = new THREE.MeshNormalMaterial()
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.setY(2.5)
  
  var cylinderGeometry = new THREE.CylinderGeometry(2.5, 2.5, 6, 20)
  var cylinderMaterial = new THREE.MeshNormalMaterial()
  var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
  cylinder.position.setY(7.5)
  cylinder.position.setX(7.5)
  
  group = new THREE.Group()
  group.add(cube)
  group.add(cylinder)
  
  scene.add(group)
  angle = 0
}

function animate() {
  angle += 0.01
  group.position.set(45 * Math.cos(angle), 0, -45 * Math.sin(angle))
  group.rotation.y = angle + Math.PI / 2

  controls.update();
  renderer.render (scene, camera);
  
  requestAnimationFrame (animate);
}
