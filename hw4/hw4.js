class TwoLinkArm {
  constructor() {
    this.theta1 = 0;
    this.theta2 = 0;
  }
  init(color) {
    let twoLink = new THREE.Object3D();

    let mat = new THREE.MeshBasicMaterial({ color: color });
    this.link1 = new THREE.Object3D();
    this.link1.add(new THREE.AxisHelper(10))
    let mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 5), mat)
    this.link1.add(mesh);
    mesh.position.x = 5

    twoLink.add(this.link1)

    this.link2 = new THREE.Object3D();
    this.link2.add(new THREE.AxisHelper(10))
    let mesh2 = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 5), mat)
    this.link2.add(mesh2);
    mesh2.position.x = 5

    this.link1.add(this.link2)
    this.link2.position.x = 10

    let paddle = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 4), mat)
    this.link2.add(paddle)
    paddle.position.x = 10
    paddle.name = "paddle"

    return twoLink;

  }
  update(thetas) {
    this.theta1 = thetas[0]
    this.theta2 = thetas[1]
    this.link1.rotation.y = this.theta1
    this.link2.rotation.y = this.theta2
  }
}

class Puck {
  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 2, 32),
      new THREE.MeshLambertMaterial({
        color: 0xfcf280,
        emissive: 0xfcf280
      })
    );
    //scene.add(this.mesh);

    this.pos = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.light = new THREE.PointLight(0xfcf280, 20, 20);
  }
}

class Wall {
  constructor() {
    var FBGeometry = new THREE.BoxGeometry(84, 20, 4);
    var LRGeometry = new THREE.BoxGeometry(108, 20, 4);
    var goalGeometry = new THREE.BoxGeometry(30, 10, 4);
    var meometry = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    var goalMeometry = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3
    });
    
    this.frontMesh = new THREE.Mesh(FBGeometry, meometry);
    this.leftMesh = new THREE.Mesh(LRGeometry, meometry);
    this.rightMesh = new THREE.Mesh(LRGeometry, meometry);
    this.backMesh = new THREE.Mesh(FBGeometry, meometry);
    this.frontGoal = new THREE.Mesh(goalGeometry, goalMeometry);
    this.backGoal = new THREE.Mesh(goalGeometry, goalMeometry);

    this.frontMesh.position.set(0, 9, 52);
    this.leftMesh.position.set(-40, 9, 0);
    this.leftMesh.rotation.y = Math.PI / 2;
    this.rightMesh.position.set(40, 9, 0);
    this.rightMesh.rotation.y = Math.PI / 2;
    this.backMesh.position.set(0, 9, -52);
    this.frontGoal.position.set(0, 4, 52);
    this.backGoal.position.set(0, 4, -52);
  }
}

var camera, scene, renderer;
var twoLinkArm, twoLink;
var twoLinkArm2, twoLink2;

var raycaster;
var mouse = new THREE.Vector2();
var pickables = [];

var clock = new THREE.Clock();
var paddlePos = new THREE.Vector3();

var collisionWallSound = document.getElementById ('collisionWall');
var collisionPuckSound = document.getElementById ('collisionPuck');

init();
animate();

function fk(thetas, joints) { // all memory assumed in place
  joints[0].set(0, 0, 0);

  var localzero = new THREE.Vector3(0, 0, 0);
  var m = new THREE.Matrix4();
  m.makeRotationY(thetas[0]);
  m.multiply(new THREE.Matrix4().makeTranslation(10, 0, 0));
  localzero.applyMatrix4(m);
  joints[1].copy(localzero);

  localzero.set(0, 0, 0);
  m.multiply(new THREE.Matrix4().makeRotationY(thetas[1]));
  m.multiply(new THREE.Matrix4().makeTranslation(10, 0, 0));
  localzero.applyMatrix4(m);
  joints[2].copy(localzero);
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.y = 150;

  /*light = new THREE.PointLight(0xffffff);
  light.position.set(100, 300, 200);
  scene.add(light);*/

  /*var gridXZ = new THREE.GridHelper(100, 10, 'red', 'white');
  scene.add(gridXZ);*/
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(
    new THREE.Vector3(-40, -2.5, 0),
    new THREE.Vector3(40, -2.5, 0)
  );
  var centerLine = new THREE.Line(
    lineGeometry,
    new THREE.LineBasicMaterial({
      color: 0xff0000
    })
  )
  scene.add(centerLine);

  var circleGeometry = new THREE.CircleGeometry(20, 64, 0, Math.PI);
  var circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  var circle = new THREE.Line(circleGeometry, circleMaterial);
  circle.rotation.x = -Math.PI / 2;
  circle.position.y = -2.5;
  circle.position.z = 50;
  scene.add(circle);
  var circle2 = circle.clone();
  circle2.position.z = -50;
  circle2.position.y = -2.5;
  circle2.rotation.x = Math.PI / 2;
  scene.add(circle2);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888, 0);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);
  ///////////////////////////////////////////////////////////

  twoLinkArm = new TwoLinkArm(); // global 
  twoLink = twoLinkArm.init(0x9bd6ff);
  scene.add(twoLink);
  twoLink.position.set(0, 0, 50)

  twoLinkArm2 = new TwoLinkArm(); // global 
  twoLink2 = twoLinkArm2.init(0xff9999);
  scene.add(twoLink2);
  twoLink2.position.set(0, 0, -50)
  twoLink2.rotation.y = Math.PI

  //////////////////////////////////////
  twoLinkArm.ccdSys = new CCDSys(fk)
  twoLinkArm.ccdSys.setCCDAxis(new THREE.Vector3(0, 1, 0), 0)
  twoLinkArm.ccdSys.setCCDAxis(new THREE.Vector3(0, 1, 0), 1)

  twoLinkArm.target = new THREE.Vector3();

  twoLinkArm2.ccdSys = new CCDSys(fk)
  twoLinkArm2.ccdSys.setCCDAxis(new THREE.Vector3(0, 1, 0), 0)
  twoLinkArm2.ccdSys.setCCDAxis(new THREE.Vector3(0, 1, 0), 1)

  twoLinkArm2.target = new THREE.Vector3();

  //theta1 = theta2 = 0
  ///////////////////////////////////////////
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(80, 100, 100, 100), new THREE.MeshPhongMaterial({
    color: 0x777777,
    emissive: 0x777777,
    transparent: true,
    opacity: 0.5,
    visible: true
  }));
  scene.add(plane);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1.2;
  pickables = [plane];

  var wall = new Wall();
  scene.add(wall.frontMesh, wall.leftMesh, wall.rightMesh, wall.backMesh, wall.frontGoal, wall.backGoal);

  puck = new Puck();
  scene.add(puck.mesh, puck.light);

  raycaster = new THREE.Raycaster();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);


}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var dis = Math.sqrt(
    (twoLink.position.x - puck.pos.x) * (twoLink.position.x - puck.pos.x) +
    (twoLink.position.z - puck.pos.z) * (twoLink.position.z - puck.pos.z)
  );

  /*
  var dis = Math.sqrt(
    (twoLink.getObjectByName("paddle").position.x - puck.pos.x) * (twoLink.getObjectByName("paddle").position.x - puck.pos.x) + 
    (twoLink.getObjectByName("paddle").position.z - puck.pos.z) * (twoLink.getObjectByName("paddle").position.z - puck.pos.z)
  );
  */

  // find intersections
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(pickables);
  if (intersects.length > 0 && dis <= 28) {
    if (puck.vel.x == 0 && puck.vel.z == 0) {
      puck.vel.x = intersects[0].point.x * 2;
      puck.vel.z = -intersects[0].point.z * 2;
    } else if (dis <= 28) {
      intersects[0].point.x *= 1.5;
      intersects[0].point.z *= -1.5;
      intersects[0].point.y *= 0;
      puck.vel.sub(puck.pos.clone().sub(twoLink.position).multiplyScalar(puck.vel.clone().sub(intersects[0].point).dot(puck.pos.clone().sub(twoLink.position)) / (puck.pos.clone().distanceToSquared(twoLink.position))));
      puck.vel.y = 0;
      collisionPuck.play();
    }
  }
}

function onDocumentMouseMove(event) {

  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // find intersections
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(pickables);
  if (intersects.length > 0) {
    if (puck.vel.x == 0 && puck.vel.z == 0) {
      puck.mesh.position.copy(intersects[0].point);
      puck.pos = puck.mesh.position.clone();
      puck.pos.y = puck.mesh.position.y = 0;
    }
    twoLinkArm.target.copy(twoLink.worldToLocal(intersects[0].point));

  }

}

function animate() {
  var dt = clock.getDelta();
  puck.pos.add(puck.vel.clone().multiplyScalar(dt));
  puck.pos.y = 0;
  puck.light.position.set(puck.pos.x, puck.pos.y - 1.1, puck.pos.z);
  collisionWall(puck);
  collisionPaddle(puck);
  goal(puck);

  if (puck.vel.x != 0 && puck.vel.z != 0) {
    puck.mesh.position.copy(puck.pos);
  }

  twoLinkArm2.target.copy(twoLink2.worldToLocal(puck.mesh.position.clone()));

  requestAnimationFrame(animate);
  render();
}

function render() {
  update();
  renderer.render(scene, camera);
}

function update() {


  var thetas = [twoLinkArm.theta1, twoLinkArm.theta2];
  twoLinkArm.ccdSys.solve(twoLinkArm.target, thetas);
  twoLinkArm.update(thetas)

  thetas = [twoLinkArm2.theta1, twoLinkArm2.theta2];
  twoLinkArm2.ccdSys.solve(twoLinkArm2.target, thetas);
  twoLinkArm2.update(thetas);
}

function goal(puck) {
  if(puck.pos.z >= 47 && puck.pos.x >= -15 && puck.pos.x <= 15 && puck.vel.x != 0 && puck.vel.z != 0) {
    alert("game over!");
    puck.vel.x = puck.vel.z = 0;
  }
  else if(puck.pos.z >= 47 && puck.pos.x >= -15 && puck.pos.x <= 15 && puck.vel.x != 0 && puck.vel.z != 0) {
    alert("You !");
    puck.vel.x = puck.vel.z = 0;
  }
}

function collisionPaddle(puck) {
  var dis = Math.sqrt(
    (twoLink2.position.x - puck.pos.x) * (twoLink2.position.x - puck.pos.x) +
    (twoLink2.position.z - puck.pos.z) * (twoLink2.position.z - puck.pos.z)
  );

  if (dis <= 28) {
    console.log(twoLinkArm2.target)
    puck.vel.sub(puck.pos.clone().sub(twoLink2.position).multiplyScalar(puck.vel.clone().sub(twoLinkArm2.target.clone().multiplyScalar(-2)).dot(puck.pos.clone().sub(twoLink2.position)) / (puck.pos.clone().distanceToSquared(twoLink2.position))));
    puck.vel.y = 0;
    collisionPuckSound.play();
  }
}

function collisionWall(puck) {
  if (puck.pos.x > 37) {
    puck.vel.x *= -1;
    puck.pos.x = 37;
    collisionWallSound.play();
  } else if (puck.pos.x < -37) {
    puck.vel.x *= -1;
    puck.pos.x = -37;
    collisionWallSound.play();
  } else if (puck.pos.z > 47) {
    puck.vel.z *= -1;
    puck.pos.z = 47;
    collisionWallSound.play();
  } else if (puck.pos.z < -47) {
    puck.vel.z *= -1;
    puck.pos.z = -47;
    collisionWallSound.play();
  }
}
