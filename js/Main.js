var wid, hei;
var renderer;
var scene;
var camera;
var light;
var controls;
var clock, delta;

var cameraBox;

var mouseX = 0;
var mouseXOnMouseDown = 0;
var targetX = 0;
var windowHalfX;

var scale = chroma.scale(['white', 'blue', 'red', 'yellow', 'green']);

$(function() {
	clock = new THREE.Clock();
	delta = clock.getDelta();

	getSize(); //获取场景大小
	initThree(); //初始化Threejs
	initScene(); //初始化场景
	initCamera(); //初始化摄像机
	initControl(); //初始化控制器
	initLight(); //初始化灯光

	load_sky();
	create_box();

	initPixi();

	render();
});

function getSize() {
	wid = window.innerWidth;
	hei = window.innerHeight;
	windowHalfX = wid / 2;
}

function initThree() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		preserveDrawingBuffer: true
	});
	renderer.setSize(wid, hei);
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
	renderer.setClearColor(0x000000, 1.0);
}

function initScene() {
	scene = new THREE.Scene();
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(45, wid / hei, 1, 2000);
}

function initControl() {
	controls = new Controls(camera, scene);
	controls.init();
	var obj = {
		x: 0,
		y: 0,
		z: 50
	};
	controls.setPosition(obj);
}

function controlState(__state) {
	controls.enabled = __state;
}

function initLight() {
	//环境光
	light = new THREE.AmbientLight(0x000000);
	scene.add(light);

	var light2 = new THREE.DirectionalLight(0xff0000, 1);
	light2.position.set(20, 20, 30);
	scene.add(light2);

	var helper2 = new THREE.DirectionalLightHelper(light2);
	scene.add(helper2);

	var light3 = new THREE.DirectionalLight(0x0000ff, 1);
	light3.position.set(-20, 20, -30);
	scene.add(light3);

	var helper3 = new THREE.DirectionalLightHelper(light3);
	scene.add(helper3);

}

//====================================================================//

function create_box() {
	var _num = 1;
	for(var i = 0; i < 5; i++) {
		var material = new THREE.MeshBasicMaterial({
			color: scale(Math.random()).hex()
		});
		var geom = new THREE.CubeGeometry(3, 3, 3);
		var mesh = new THREE.Mesh(geom, material);
		scene.add(mesh);
		mesh.position.x = (Math.random() * 10) * _num;
		mesh.position.z = -5 * i;
		_num *= -1;
	}
}

//=======================================================================//

//制作天空盒
function load_sky() {
	var skyboxGeometry = new THREE.SphereGeometry(100, 20, 20);
	var map = new THREE.TextureLoader().load("images/background.jpg");
	map.wrapT = THREE.RepeatWrapping;
	var skyboxMaterial = new THREE.MeshBasicMaterial({
		map: map,
		side: THREE.BackSide
	});
	skyBox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skyBox);
}

//========================================================================//

//==================================================================================================//
var wid = window.innerWidth;
var hei = window.innerHeight;

var app, stage, container;
var pixiControl;

function initPixi() {
	app = new PIXI.Application(640, 640 / (wid / hei), {
		backgroundColor: 0x000000,
		transparent: true
	});
	document.getElementById('pixiStage').appendChild(app.view);

	stage = app.stage;

	container = new PIXI.Container();

	stage.addChild(container);

	//摇杆
	pixiControl = new Rocker();
	container.addChild(pixiControl);
	pixiControl.init(setCameraBox);

	pixiControl.x = app.view.width * 0.8 - 0;
	pixiControl.y = app.view.height * 0.9 - 0;

}

//通过摇杆改变摄像头盒子的位置
function setCameraBox(__speedX,__speedZ){
	controls.cameraBox.translateX(__speedX);
	controls.cameraBox.translateZ(__speedZ);
}

//==================================================================================================//

function render() {
	delta = clock.getDelta();

	if(controls) {
		controls.update(delta);
	}

	if(pixiControl) {
		pixiControl.update(delta);
	}

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}