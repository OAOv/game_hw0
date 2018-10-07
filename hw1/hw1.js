var camera, camera1, camera2, scene, renderer;
var useOne = true;

var car;
var speed, angle, power;
var pos = new THREE.Vector3();
var vel = new THREE.Vector3();
var force = new THREE.Vector3();

var clock;
var keyboard = new KeyboardState();

(function() {
  Math.clamp = function(val,min,max){
    return Math.min(Math.max(val,min),max);
    
  }})();

init();
animate();

window.focus();

$("#toggle").click(function() {
  useOne = !useOne;
});

function buildCar() {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(30, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 10));
  geometry.vertices.push(new THREE.Vector3(0, 0, -10));
  geometry.vertices.push(new THREE.Vector3(0, 10, 0));

  var face;
  face = new THREE.Face3(0, 3, 1);
  face.materialIndex = 0;
  geometry.faces.push(face);
  face = new THREE.Face3(0, 2, 3);
  face.materialIndex = 1;
  geometry.faces.push(face);
  face = new THREE.Face3(3, 2, 1);
  face.materialIndex = 2;
  geometry.faces.push(face);
  face = new THREE.Face3(0, 2, 1);
  face.materialIndex = 3;
  geometry.faces.push(face);

  geometry.computeBoundingSphere();
  geometry.computeFaceNormals();
  /*geometry.computeVertexNormals();*/

  var material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

function buildObstacle() {
  var geometry = new THREE.Geometry();
  
  geometry.vertices.push(new THREE.Vector3(100, 0, -100));
  geometry.vertices.push(new THREE.Vector3(100, 0, 100));
  geometry.vertices.push(new THREE.Vector3(100, 20, 100));
  geometry.vertices.push(new THREE.Vector3(100, 20, -100));
  geometry.vertices.push(new THREE.Vector3(-100, 0, -100));
  geometry.vertices.push(new THREE.Vector3(-100, 0, 100));
  geometry.vertices.push(new THREE.Vector3(-100, 20, 100));
  geometry.vertices.push(new THREE.Vector3(-100, 20, -100));
  
  var face;
  face = new THREE.Face3(0, 1, 3);
  geometry.faces.push(face);
  face = new THREE.Face3(1, 2, 3);
  geometry.faces.push(face);
  face = new THREE.Face3(1, 2, 5);
  geometry.faces.push(face);
  face = new THREE.Face3(2, 6, 5);
  geometry.faces.push(face);
  face = new THREE.Face3(4, 6, 5);
  geometry.faces.push(face);
  face = new THREE.Face3(4, 7, 6);
  geometry.faces.push(face);
  face = new THREE.Face3(0, 3, 4);
  geometry.faces.push(face);
  face = new THREE.Face3(3, 7, 4);
  geometry.faces.push(face);
  //
  face = new THREE.Face3(5, 2, 1);
  geometry.faces.push(face);
  face = new THREE.Face3(5, 6, 2);
  geometry.faces.push(face);

  geometry.computeBoundingSphere();
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  var material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
  
}

function init() {
  car = buildCar();
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera1 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera1.position.z = 200;
  camera1.position.y = 100;
  camera1.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera1);
  
  //third person
  camera2 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
  camera2.position.copy(new THREE.Vector3(-20, 15, 0))
  camera2.lookAt(car.position)
  //scene.add(camera2);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x00000, 0);

  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  
  let gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
  scene.add(gridXZ);
  
  scene.add(car);
  scene.add(buildObstacle());
  car.add(camera2);
  
  power = 0.0;
  angle = 0.0;
  
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if(useOne)
    camera = camera1;
  else
    camera = camera2;
  
  var dt = clock.getDelta();
  update(dt);
    
  // car update
  if(pos.x >= 70)
    pos.x = 70;
  else if(pos.x <= -70)
    pos.x = -70;
  if(pos.z >= 70)
    pos.z= 70;
  else if(pos.z <= -70)
    pos.z= -70;
    
  car.position.copy(pos);
  car.rotation.y = angle;

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function update(dt) {

  keyboard.update();
  
  if (vel.length() > 0) {
    angle = Math.atan2(-vel.z, vel.x); // update orientation
  }
  
  if(keyboard.pressed("home"))
    power = 1.2;
  if (keyboard.pressed("space"))  
    power = 0.1;               
  if (keyboard.pressed("up"))  
    power *= 1.2;        
  if (keyboard.pressed("down"))  
    power /= 1.2;
    
  power = Math.clamp (power, 0, 80.0); 
  
  var angle_thrust = angle;
  if (keyboard.pressed("left"))
    angle_thrust += 0.3;
  if (keyboard.pressed("right"))
    angle_thrust -= 0.3;

  // compute force
  var thrust = new THREE.Vector3(1,0,0).multiplyScalar(power).applyAxisAngle       (new THREE.Vector3(0,1,0), angle_thrust);
  force.copy (thrust);
  force.add(vel.clone().multiplyScalar(-2))

  // eulers
  vel.add(force.clone().multiplyScalar(dt));
  pos.add(vel.clone().multiplyScalar(dt));

  /*speed = Math.clamp (speed, 0.1, 20.0);    
  vel = new THREE.Vector3(speed,0,0);
  
  vel.applyAxisAngle (new THREE.Vector3(0,1,0), angle);
  pos.add (vel.clone().multiplyScalar(dt));   */
}