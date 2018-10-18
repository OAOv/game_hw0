var camera, scene, renderer;
var keyboard = new KeyboardState();
var disk;
var collisionWall, collisionDisk;
var numOfDisk = 15;

var clock = new THREE.Clock();

class Disk {
  constructor(geometry, color) {
    this.light = new THREE.PointLight(color, 15, 50);
    this.mesh = new THREE.Mesh(geometry,
      new THREE.MeshLambertMaterial({
        color: color,
        emissive: color
      }));

    scene.add(this.mesh, this.light);
    
    this.pos = new THREE.Vector3(Math.random() * (100 + 100) - 100,
                                 0,
                                 Math.random() * (100 + 100) - 100);
                                 
    this.vel = new THREE.Vector3(Math.random() * (100 + 200) - 100,
                                 0,
                                 Math.random() * (100 + 200) - 100);
  }
}

class Floor {
  constructor(geometry, color) {
    this.mesh = new THREE.Mesh(geometry,
      new THREE.MeshPhongMaterial({
        color: color,
        emissive: color
      }));
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = -3
    scene.add(this.mesh);
  }
}

class Wall {
  constructor(geometry, meometry) {
    this.frontMesh = new THREE.Mesh(geometry, meometry);
    this.leftMesh = new THREE.Mesh(geometry, meometry);
    this.rightMesh = new THREE.Mesh(geometry, meometry);
    this.backMesh = new THREE.Mesh(geometry, meometry);
      
    this.frontMesh.position.set(0, 12.5, 195);
    this.leftMesh.position.set(-195, 12.5, 0);
    this.leftMesh.rotation.y = Math.PI / 2;
    this.rightMesh.position.set(195, 12.5, 0);
    this.rightMesh.rotation.y = Math.PI / 2;
    this.backMesh.position.set(0, 12.5, -195);
    
    scene.add(this.frontMesh, this.leftMesh, this.rightMesh, this.backMesh);
  }
}

init();
animate();

function init() {
  collisionWall = document.getElementById ('collisionWall');
  collisionDisk = document.getElementById ('collisionDisk');

  scene = new THREE.Scene();
  
  buildStar_test();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 500;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 0);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);
  ////////////////////////////////////////////////////////////////////////

  var diskGeometry = new THREE.CylinderGeometry(10, 10, 5, 32);
  disk = new Array(
    new Disk(diskGeometry, 0xff8484),
    new Disk(diskGeometry, 0xffb984),
    new Disk(diskGeometry, 0xfcf280),
    new Disk(diskGeometry, 0x84fc80),
    new Disk(diskGeometry, 0x80abfc),
    new Disk(diskGeometry, 0x6c51cc),
    new Disk(diskGeometry, 0xd280fc),
    new Disk(diskGeometry, 0xb73333),
    new Disk(diskGeometry, 0xf9982f),
    new Disk(diskGeometry, 0xf7f259),
    new Disk(diskGeometry, 0x54b72d),
    new Disk(diskGeometry, 0x48d3db),
    new Disk(diskGeometry, 0x48d3db),
    new Disk(diskGeometry, 0xf248b9),
    new Disk(diskGeometry, 0xc1bdc0)
  );

  console.log(disk);

  var floorGeometry = new THREE.PlaneGeometry(400, 400, 4, 4);
  var floor = new Floor(floorGeometry, 0x444444);
 
  var wallGeometry = new THREE.BoxGeometry(400, 30, 10);
  var wallMeometry = new THREE.MeshPhongMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
  });
  var wall = new Wall(wallGeometry, wallMeometry);
}

function animate() {

  keyboard.update();
  
  var dt = clock.getDelta();
  for(var i = 0; i < numOfDisk; i++) {
    disk[i].pos.add(disk[i].vel.clone().multiplyScalar(dt));
    collision(disk[i])

    if(i > 0) {
      for(var j = 0; j < i; j++) {
        var dis = Math.sqrt(
          (disk[j].pos.x - disk[i].pos.x) * (disk[j].pos.x - disk[i].pos.x) + 
          (disk[j].pos.z - disk[i].pos.z) * (disk[j].pos.z - disk[i].pos.z)
        );
        if(dis <= 20) {
          collisionWithDisk(disk[i], disk[j], dis);
        }
      }
    }
  }

  for(i = 0; i < numOfDisk; i++) {
    disk[i].mesh.position.copy(disk[i].pos);
    disk[i].light.position.set(disk[i].pos.x, disk[i].pos.y - 2.6, disk[i].pos.z);
  }

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function collision (disk) {
  if (disk.pos.x > 187.5) {
    disk.vel.x *= -1;
    disk.pos.x = 186.5;
    collisionWall.play();
  }
  else if (disk.pos.x < -187.5) {
    disk.vel.x *= -1;
    disk.pos.x = -186.5;
    collisionWall.play();
  }
  else if (disk.pos.z > 187.5) {
    disk.vel.z *= -1;
    disk.pos.z = 186.5;
    collisionWall.play();
  }
  else if (disk.pos.z < -187.5) {
    disk.vel.z *= -1;
    disk.pos.z = -186.5;
    collisionWall.play();
  }
}

function collisionWithDisk(d1, d2, dis) {
  collisionDisk.play();

  if(d1.pos.x < d2.pos.x && d1.pos.z < d2.pos.z) {
    d1.pos.x -= 1; d1.pos.z -= 1;
    d2.pos.x += 1; d2.pos.z += 1;
  }
  else if(d1.pos.x > d2.pos.x && d1.pos.z < d2.pos.z) {
    d1.pos.x += 1; d1.pos.z -= 1;
    d2.pos.x -= 1; d2.pos.z += 1;
  }
  else if(d1.pos.x > d2.pos.x && d1.pos.z > d2.pos.z) {
    d1.pos.x += 1; d1.pos.z += 1;
    d2.pos.x -= 1; d2.pos.z -= 1;
  }
  else {
    d1.pos.x -= 1; d1.pos.z += 1;
    d2.pos.x += 1; d2.pos.z -= 1;
  }
  
  var tmpVel = d1.vel.clone();
  var tmpPos = d1.pos.clone();
  d1.vel.sub(d1.pos.clone().sub(d2.pos).multiplyScalar(d1.vel.clone().sub(d2.vel).dot(d1.pos.clone().sub(d2.pos)) / (d1.pos.clone().distanceToSquared(d2.pos))));
  d2.vel.sub(d2.pos.clone().sub(tmpPos).multiplyScalar(d2.vel.clone().sub(tmpVel).dot(d2.pos.clone().sub(tmpPos)) / (d2.pos.clone().distanceToSquared(d1.pos))));
}

function buildStar_test() {
  var star = new THREE.BoxGeometry(1, 1, 1);
  var starMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  for(var count = 0; count < 250; count++) {
    var starMesh = new THREE.Mesh(star, starMaterial);
    starMesh.position.set(Math.random() * (300 + 300) - 300,
                          Math.random() * (300 + 300) - 300,
                          Math.random() * (300 + 300) - 300);
    scene.add(starMesh);
  }
}

// important to add this 
// in jsfiddle!
window.focus();
