var scene, renderer, camera, controls;
var model, head, body, leftArm, rightArm, leftLeg, rightLeg;
var clock = new THREE.Clock();
var ts = clock.getElapsedTime();
var intKey = [];

var T = 26/3;
var pose1 = {xla: 0, yla: -1.04, zla: -0.38,
             xra: 0, yra: 1.21, zra: 0.29,
             xll: 0, yll: 0, zll: 0,
             xrl: 0, yrl: 0, zrl: 0,
             xh: 0.56, yh: 0, zh: 0,
             xb: 0, yb: 0, zb: 0,
             h: 0};

var pose2 = {xla: 0, yla: -0.28, zla: -0.38,
             xra: 0, yra: 0.40, zra: 0.30,
             xll: 0, yll: 0, zll: 0,
             xrl: 0, yrl: 0, zrl: 0,
             xh: 0, yh: 0, zh: 0,
             xb: 0, yb: 0, zb: 0,
             h: 0};

var pose3 = {xla: -0.45, yla: -0.82, zla: 0.12,
             xra: 0, yra: 0.40, zra: 0.30,
             xll: 0, yll: 0, zll: 0,
             xrl: 0, yrl: 0, zrl: 0,
             xh: 0, yh: 0.02, zh: 0.38,
             xb: 0, yb: 0, zb: 0,
             h: 0};

var pose4 = {xla: -0.45, yla: -0.30, zla: -0.45,
             xra: 0, yra: 0.66, zra: -0.55,
             xll: 0, yll: 0, zll: 0,
             xrl: 0, yrl: 0, zrl: 0,
             xh: 0.02, yh: 0, zh: -0.28,
             xb: 0, yb: 0, zb: 0,
             h: 0};

var pose5 = {xla: -0.45, yla: -0.30, zla: -0.45,
             xra: -0.14, yra: 1.50, zra: 0.30,
             xll: -0.80, yll: 0, zll: 0.40,
             xrl: 0, yrl: 0, zrl: 0,
             xh: 0.02, yh: 0, zh: 0.02,
             xb: 0.22, yb: 0.45, zb: 0,
             h: 0};

var pose6 = {xla: -0.45, yla: -1.50, zla: -0.48,
             xra: -0.14, yra: 0.32, zra: 0.30,
             xll: 0, yll: 0, zll: 0,
             xrl: -0.97, yrl: 0, zrl: -0.38,
             xh: 0.02, yh: 0, zh: 0.02,
             xb: 0.22, yb: -0.45, zb: 0,
             h: 0};

var pose7 = {xla: -0.45, yla: -1.50, zla: -0.48,
             xra: -0.14, yra: 1.40, zra: 0.22,
             xll: 0, yll: 0, zll: 0,
             xrl: 0, yrl: 0, zrl: 0,
             xh: 0.83, yh: 0, zh: 0,
             xb: 0, yb: 0, zb: 0,
             h: 0};

var pose8 = {xla: 0, yla: 0, zla: 0.45,
             xra: 0, yra: 0, zra: -0.45,
             xll: 0, yll: 0, zll: 0,
             xrl: 0, yrl: 0, zrl: 0,
             xh: -0.1, yh: 0, zh: 0.02,
             xb: 0.25, yb: 0, zb: 0,
             h: 20};
             
var keys = [
  [0, pose1], [0.05, pose2],
  [0.1, pose3], [0.15, pose4], 
  [0.2, pose5], [0.25, pose6],
  [0.3, pose3], [0.35, pose4],
  [0.4, pose1], [0.45, pose7],
  [0.5, pose3], [0.55, pose2], 
  [0.6, pose5], [0.65, pose4],
  [0.7, pose3], [0.75, pose2],
  [0.8, pose6], [0.85, pose4],
  [0.9, pose7], [0.95, pose8],
  [1, pose1]
];


/*var gui = new dat.GUI();
gui.domElement.id = 'gui';

gcontrolsLA = {
  x: 0.01,
  y: 0.01,
  z: 0.01
};

gcontrolsRA = {
  x: 0.01,
  y: 0.01,
  z: 0.01
};

gcontrolsLL = {
  x: 0.01,
  y: 0.01,
  z: 0.01
};

gcontrolsRL = {
  x: 0.01,
  y: 0.01,
  z: 0.01
};

gcontrolsH = {
  x: 0.01,
  y: 0.01,
  z: 0.01
};

gcontrolsB = {
  x: 0.01,
  y: 0.01,
  z: 0.01
};
*/

init();
animate();

////////////////////////////////////////////////////////////////

function init() {
  ///
  document.getElementById ('playAudio').play();

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888, 0);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.y = 360;
  camera.position.z = 400;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  document.body.appendChild(renderer.domElement);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
  scene.add(gridXZ);

  //////////////////////////////////////////////////
  /*
  var f1 = gui.addFolder("leftArm");
  f1.add(gcontrolsLA, 'x', -1.5, 1.5);
  f1.add(gcontrolsLA, 'y', -1.5, 1.5);
  f1.add(gcontrolsLA, 'z', -1.5, 1.5);
  var f2 = gui.addFolder("rightArm");
  f2.add(gcontrolsRA, 'x', -1.5, 1.5);
  f2.add(gcontrolsRA, 'y', -1.5, 1.5);
  f2.add(gcontrolsRA, 'z', -1.5, 1.5);
  var f3 = gui.addFolder("leftLeg");
  f3.add(gcontrolsLL, 'x', -1.5, 1.5);
  f3.add(gcontrolsLL, 'y', -1.5, 1.5);
  f3.add(gcontrolsLL, 'z', -1.5, 1.5);
  var f4 = gui.addFolder("rightLeg");
  f4.add(gcontrolsRL, 'x', -1.5, 1.5);
  f4.add(gcontrolsRL, 'y', -1.5, 1.5);
  f4.add(gcontrolsRL, 'z', -1.5, 1.5);
  var f5 = gui.addFolder("Head");
  f5.add(gcontrolsH, 'x', -1.5, 1.5);
  f5.add(gcontrolsH, 'y', -1.5, 1.5);
  f5.add(gcontrolsH, 'z', -1.5, 1.5);
  var f6 = gui.addFolder("Body");
  f6.add(gcontrolsB, 'x', -1.5, 1.5);
  f6.add(gcontrolsB, 'y', -1.5, 1.5);
  f6.add(gcontrolsB, 'z', -1.5, 1.5);
  
  gui.remember(gcontrolsLA);
  gui.remember(gcontrolsRA);
  gui.remember(gcontrolsLL);
  gui.remember(gcontrolsRL);
  gui.remember(gcontrolsH);
  gui.remember(gcontrolsB);
  */
  
  window.addEventListener('resize', onWindowResize, false);

  ////////////////////
  buildModel();
  buildStar_test();
}

function buildModel() {
  model = new THREE.Object3D();
  var material = new THREE.MeshNormalMaterial();
  
  var headGeometry = new THREE.SphereGeometry(20, 32, 32);
  head = new THREE.Object3D();
  var h1 = new THREE.Mesh(headGeometry, material);
  h1.position.set(0, 20, 0);
  head.add(h1)
  head.position.set(0, 40, 0);
  model.add(head);
  
  var bodyGeometry = new THREE.CylinderGeometry(10, 20, 30, 32);
  body = new THREE.Object3D();
  var b1 = new THREE.Mesh(bodyGeometry, material);
  b1.position.set(0, -15, 0);
  body.add(b1);
  body.position.set(0, 45, 0);
  model.add(body);
  
  var armGeometry = new THREE.BoxGeometry(20, 8, 8);
  leftArm = new THREE.Object3D();
  var arm1 = new THREE.Mesh(armGeometry, material);
  arm1.position.set(10, 4, 0);
  leftArm.add(arm1);
  body.add(leftArm);
  leftArm.position.set(10, -10, 0);
  
  rightArm = new THREE.Object3D();
  var arm2 = new THREE.Mesh(armGeometry, material);
  arm2.position.set(-10, 4, 0);
  rightArm.add(arm2);
  body.add(rightArm);
  rightArm.position.set(-10, -10, 0);
  
  var legGeometry = new THREE.BoxGeometry(8, 15, 8);
  leftLeg = new THREE.Object3D();
  var leg1 = new THREE.Mesh(legGeometry, material);
  leg1.position.set(4, -7.5, 0);
  leftLeg.add(leg1);
  body.add(leftLeg);
  leftLeg.position.set(7.5, -30, 0);
  
  rightLeg = new THREE.Object3D();
  var leg2 = new THREE.Mesh(legGeometry, material);
  leg2.position.set(-4, -7.5, 0);
  rightLeg.add(leg2);
  body.add(rightLeg);
  rightLeg.position.set(-7.5, -30, 0);
  
  
  scene.add(model);
}

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function keyframe(t) {
  var s = ((t - ts) % T) / T;

  for (var i = 1; i < keys.length; i++) {
    if (keys[i][0] > s) break;
  }

  var ii = i - 1;
  console.log(ii);
  var a = (s - keys[ii][0]) / (keys[ii + 1][0] - keys[ii][0]);
  intKey = [keys[ii][1].xla*(1-a) + keys[ii+1][1].xla*a,
            keys[ii][1].yla*(1-a) + keys[ii+1][1].yla*a,
            keys[ii][1].zla*(1-a) + keys[ii+1][1].zla*a,
            
            keys[ii][1].xra*(1-a) + keys[ii+1][1].xra*a,
            keys[ii][1].yra*(1-a) + keys[ii+1][1].yra*a,
            keys[ii][1].zra*(1-a) + keys[ii+1][1].zra*a,
            
            keys[ii][1].xll*(1-a) + keys[ii+1][1].xll*a,
            keys[ii][1].yll*(1-a) + keys[ii+1][1].yll*a,
            keys[ii][1].zll*(1-a) + keys[ii+1][1].zll*a,
            
            keys[ii][1].xrl*(1-a) + keys[ii+1][1].xrl*a,
            keys[ii][1].yrl*(1-a) + keys[ii+1][1].yrl*a,
            keys[ii][1].zrl*(1-a) + keys[ii+1][1].zrl*a,
            
            keys[ii][1].xh*(1-a) + keys[ii+1][1].xh*a,
            keys[ii][1].yh*(1-a) + keys[ii+1][1].yh*a,
            keys[ii][1].zh*(1-a) + keys[ii+1][1].zh*a,
            
            keys[ii][1].xb*(1-a) + keys[ii+1][1].xb*a,
            keys[ii][1].yb*(1-a) + keys[ii+1][1].yb*a,
            keys[ii][1].zb*(1-a) + keys[ii+1][1].zb*a,
            
            keys[ii][1].h*(1-a) + keys[ii+1][1].h*a
  ]
}

function animate() {  
  /*
  leftArm.rotation.x = gcontrolsLA.x;
  leftArm.rotation.y = gcontrolsLA.y;
  leftArm.rotation.z = gcontrolsLA.z;
  
  rightArm.rotation.x = gcontrolsRA.x;
  rightArm.rotation.y = gcontrolsRA.y;
  rightArm.rotation.z = gcontrolsRA.z;
  
  leftLeg.rotation.x = gcontrolsLL.x;
  leftLeg.rotation.y = gcontrolsLL.y;
  leftLeg.rotation.z = gcontrolsLL.z;
  
  rightLeg.rotation.x = gcontrolsRL.x;
  rightLeg.rotation.y = gcontrolsRL.y;
  rightLeg.rotation.z = gcontrolsRL.z;
  
  head.rotation.x = gcontrolsH.x;
  head.rotation.y = gcontrolsH.y;
  head.rotation.z = gcontrolsH.z;
  
  body.rotation.x = gcontrolsB.x;
  body.rotation.y = gcontrolsB.y;
  body.rotation.z = gcontrolsB.z;
  */

  keyframe(clock.getElapsedTime());
  requestAnimationFrame(animate);
  render();
}

function render() {
  leftArm.rotation.x = intKey[0];
  leftArm.rotation.y = intKey[1];
  leftArm.rotation.z = intKey[2];
  
  rightArm.rotation.x = intKey[3];
  rightArm.rotation.y = intKey[4];
  rightArm.rotation.z = intKey[5];
  
  leftLeg.rotation.x = intKey[6];
  leftLeg.rotation.y = intKey[7];
  leftLeg.rotation.z = intKey[8];
  
  rightLeg.rotation.x = intKey[9];
  rightLeg.rotation.y = intKey[10];
  rightLeg.rotation.z = intKey[11];
  
  head.rotation.x = intKey[12];
  head.rotation.y = intKey[13];
  head.rotation.z = intKey[14];
  
  body.rotation.x = intKey[15];
  body.rotation.y = intKey[16];
  body.rotation.z = intKey[17];
  
  model.position.y = intKey[18];
  
  renderer.render(scene, camera);
}

function buildStar_test() {
  var star = new THREE.SphereGeometry(1, 1, 32);
  //var starMaterial = new THREE.MeshBasicMaterial();
  
  for(var count = 0; count < 250; count++) {
    var starMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    var starMesh = new THREE.Mesh(star, starMaterial);
    starMesh.position.set(Math.random() * (300 + 300) - 300,
                          Math.random() * (300 + 300) - 300,
                          Math.random() * (300 + 300) - 300);
    scene.add(starMesh);
  }
}