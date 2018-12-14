class MD2Wrapper {
  constructor (config, controls, pos, scale = 1) {

    this.md2 = new THREE.MD2CharacterComplex();
    this.md2.scale = scale
    this.md2.controls = controls
    
    this.md2.onLoadComplete = function () {
      // here: 'this' is md2
      
      // cast and receive shadows
      this.enableShadows( true );

      this.setWeapon( 0 );
      this.setSkin( 0 );

      //this.root.position.copy (pos);
      this.root.position.x = pos.x;
      this.root.position.z = pos.z;
      
      // y is automatically set, accoording to scale ...        
      console.log ('y is ' + this.root.position.y)
      
      scene.add( this.root );
            
    }
    this.md2.loadParts( config );
          
  }
}


var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, stats;
var camera, scene, renderer;

var yohkoWrap;
var light;
var treasureList = [], flag = [];
var lowPlatform = [], highPlatform = [];

var box3, box3Helper;

var cameraControls;
var clock = new THREE.Clock();

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // CAMERA

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
  camera.position.set( 0, 150, 1300 );

  // SCENE

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );

  scene.add( camera );

  // LIGHTS

  scene.add( new THREE.AmbientLight( 0x222222 ) );

  light = new THREE.DirectionalLight( 0xffffff, 2.25 );
  light.position.set( 200, 450, 500 );

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 512;

  light.shadow.camera.near = 100;
  light.shadow.camera.far = 1200;

  light.shadow.camera.left = -1000;
  light.shadow.camera.right = 1000;
  light.shadow.camera.top = 350;
  light.shadow.camera.bottom = -350;

  scene.add( light );
  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );


  //  GROUND

  //var gt = new THREE.TextureLoader().load( "grasslight-big.jpg" );
  var gt = new THREE.TextureLoader().load("https://i.imgur.com/p8CRm9W.jpg");
  var gg = new THREE.PlaneBufferGeometry( 16000, 16000 );
  var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

  var ground = new THREE.Mesh( gg, gm );
  ground.rotation.x = - Math.PI / 2;
  ground.material.map.repeat.set( 64, 64 );
  ground.material.map.wrapS = THREE.RepeatWrapping;
  ground.material.map.wrapT = THREE.RepeatWrapping;
  // note that because the ground does not cast a shadow, .castShadow is left false
  ground.receiveShadow = true;

  scene.add( ground );
  
  let axes = new THREE.AxesHelper (100)
  scene.add (axes)

  // RENDERER

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  container.appendChild( renderer.domElement );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  // EVENTS

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  // CONTROLS

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 50, 0 );
  cameraControls.update();


  //
  for(var i = 0; i < 20; i++) {
    let platform = new THREE.Mesh (new THREE.CylinderGeometry(25, 25, 40, 32), new THREE.MeshBasicMaterial ({transparent:true, opacity:0.62, color: 0xffffff}))
    scene.add (platform);
    platform.position.set(Math.random() * 1000 - 500, 20, Math.random() * 1000 - 500);
    lowPlatform.push(platform);
  }
  
  for(var i = 0; i < 20; i++) {
    let platform = new THREE.Mesh (new THREE.CylinderGeometry(25, 25, 100, 32), new THREE.MeshBasicMaterial ({color: 0x000000}))
    scene.add (platform);
    platform.position.set(Math.random() * 1000 - 500, 50, Math.random() * 1000 - 500);
    highPlatform.push(platform);
  }

  for(var i = 0; i < 5; i++) {
    var treasure = new THREE.Mesh(new THREE.DodecahedronGeometry(15, 1), new THREE.MeshNormalMaterial());
    scene.add(treasure);
    treasure.position.set(Math.random() * 1000 - 500, 175, Math.random() * 1000 - 500);
    treasureList.push(treasure);
    flag[i] = false;
  }

  /////////////////////////////////////////////////////////////////////////////
  // CHARACTER: yohko

  let configYoshi = {

    baseUrl: "yohko/",

    body: "tris.md2",
    skins: [ "ctf_r.png" ],
    weapons:  [  ],

    animations: {
      move: "run",
      idle: "stand",
      jump: "jump",
      attack: "attack",
      crouchMove: "cwalk",
      crouchIdle: "cstand",
      crouchAttach: "crattack"
    },

    walkSpeed: 350, //translation speed
    crouchSpeed: 175

  };
  let controls = {

    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false

  };

  yohkoWrap = new MD2Wrapper (configYoshi, controls, new THREE.Vector3(0,0,0), 3 );
  var gyro = new THREE.Gyroscope();  
  gyro.add( camera );

  gyro.add( light, light.target );
  yohkoWrap.md2.root.add( gyro );   
  
  box3 = new THREE.Box3();
  box3Helper = new THREE.Box3Helper(box3)
  scene.add ( box3Helper )

}

// EVENT HANDLERS

function onWindowResize( event ) {

  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

  camera.aspect = SCREEN_WIDTH/ SCREEN_HEIGHT;
  camera.updateProjectionMatrix();

}

function onKeyDown ( event ) {

  event.stopPropagation();
  let controlsY = yohkoWrap.md2.controls;

  switch( event.keyCode ) {

    case 38: /*up*/
    case 87: /*W*/  controlsY.moveForward = true; break;

    case 40: /*down*/
    case 83: /*S*/   controlsY.moveBackward = true; break;

    case 37: /*left*/
    case 65: /*A*/   controlsY.moveLeft = true; break;

    case 39: /*right*/
    case 68: /*D*/    controlsY.moveRight = true; break;

    case 32: /*space*/ controlsY.jump = true; 
                       if(getTreasure(yohkoWrap.md2.root.position.x, yohkoWrap.md2.root.position.z) >= 0) {
                         alert("get treasure");
                       }
                       break;
    // jump: should save the animation before jump
    // return to that animation, when SPACE is up
    
    case 67: /*C*/     controlsY.crouch = true; break;
    case 17: /*ctrl*/  controlsY.attack = true; break;

  }

}

function onKeyUp ( event ) {

  event.stopPropagation();
  let controlsY = yohkoWrap.md2.controls;
  
  switch( event.keyCode ) {

    case 38: /*up*/
    case 87: /*W*/ controlsY.moveForward = false; break;

    case 40: /*down*/
    case 83: /*S*/   controlsY.moveBackward = false; break;

    case 37: /*left*/
    case 65: /*A*/   controlsY.moveLeft = false; break;

    case 39: /*right*/
    case 68: /*D*/    controlsY.moveRight = false; break;

    case 32: /*space*/ controlsY.jump = false; break;
    // jump: should save the animation before jump
    // return to that animation, when SPACE is up

    case 67: /*C*/     controlsY.crouch = false; break;
    case 17: /*ctrl*/  controlsY.attack = false; break;

  }

}

function height(x, z) {
  for(var i = 0; i < 20; i++) {
    if(Math.abs(highPlatform[i].position.x - x) <= 25 || Math.abs(highPlatform[i].position.z - z) <= 25 )
      return 100;
  }
  for(var i = 0; i < 20; i++) {
    if(Math.abs(highPlatform[i].position.x - x) <= 25 || Math.abs(highPlatform[i].position.z - z) <= 25 )
      return 40;
  }
  return 0;
}

//

function getTreasure(x, z) {
  for(var i = 0; i < 5; i++)
    if((Math.abs(treasureList[i].position.x - x) <= 10 || Math.abs(treasureList[i].position.z - z) <= 10)
        && flag[i] == false) {
      flag[i] = true;
      return i;
    }
  return -1;
}

function animate() {

  requestAnimationFrame( animate );
  render();
}

function update() {
  var y = height( yohkoWrap.md2.root.position.x, yohkoWrap.md2.root.position.z);
  if(y < 70) {
    if(y == 40)
      yohkoWrap.md2.root.position.y = 113.42663764953613;
    else
      yohkoWrap.md2.root.position.y = 73.42663764953613;
  }
}

function render() {

  box3.setFromObject (yohkoWrap.md2.root)
  
  var delta = clock.getDelta();
  if (yohkoWrap.md2) {
    yohkoWrap.md2.update (delta)
    update();
  }
  renderer.render( scene, camera );

}