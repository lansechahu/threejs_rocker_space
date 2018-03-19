//摄像机控制器，手指左右划动控制盒子左右转，上下划动控制盒子里的摄像头上下转

var Controls = function(__camera, __scene) {
	this.speed = 1; //移动速度
	this.enabled = true; //是否启用
	this.panY = 0; //Y轴的偏移量，让镜头不是正对着对象
	this.cameraBox = null; //摄像机盒子

	var scope = this;
	var myCamera = __camera;
	var myScene = __scene;

	//var radius = Math.abs(camera.position.z - this.target.z); //移动半径，为目标到摄像机的距离
	var angle = 0;
	var angleY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var mouseX = 0;
	var mouseY = 0;
	var mouseXOnMouseDown = 0;
	var mouseYOnMouseDown = 0;
	var targetX = 0;
	var targetY = 0;
	var targetXOnMouseDown = 0;
	var targetYOnMouseDown = 0;

	this.init = function() {
		this.cameraBox = new THREE.Object3D();
		this.cameraBox.add(myCamera);
		myScene.add(this.cameraBox);
		document.addEventListener('touchstart', onMouseDown, false);
	}

	this.setTarget = function(__target) {
		targetX = 45;
	}

	this.setPosition = function(__obj) {
		this.cameraBox.position.x = __obj.x;
		this.cameraBox.position.y = __obj.y;
		this.cameraBox.position.z = __obj.z;
	}

	function onMouseDown(event) {
		event.preventDefault();
		if(!scope.enabled) return;
		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetXOnMouseDown = targetX;

		mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
		targetYOnMouseDown = targetY;

		document.addEventListener('touchmove', onMouseMove, false);
		document.addEventListener('touchend', onMouseUp, false);
	}

	function onMouseMove(event) {
		event.preventDefault();
		if(!scope.enabled) return;

		mouseX = event.touches[0].pageX - windowHalfX;
		targetX = targetXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.08;

		mouseY = event.touches[0].pageY - windowHalfY;
		targetY = targetYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.08;
	}

	function onMouseUp() {
		document.removeEventListener('touchmove', onMouseMove, false);
		document.removeEventListener('touchend', onMouseUp, false);
	}

	this.update = function(__delta) {
		if(!scope.enabled) {
			return;
		}

		angle = targetX * Math.PI / 180;
		angleY = targetY * Math.PI / 180;

		myCamera.rotation.x = angleY;
		this.cameraBox.rotation.y = angle;
	}
};