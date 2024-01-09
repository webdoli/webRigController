import * as THREE from "three";
import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';

function Core( container ) {

    this.container = container;
    this.core = THREE;
    this.aspect = {};

    this.renderer; 
    this.scene;
    this.cameras = {};
    this.container; 
    
    this.controls;
    this.lights = {};
    this.raycaster;
    this.grid;

    this.setScene();

}

Core.prototype.setScene = function() {
    
    this.scene = new THREE.Scene();

    this.aspect.width = window.innerWidth;
    this.aspect.height = window.innerHeight;
    
    this.cameras.mainCam = new THREE.PerspectiveCamera( 
        60, 
        ( this.aspect.width - 1 ) / ( this.aspect.height - 1 ), 
        1, 
        10000
    );
    this.cameras.mainCam.position.set( 400, 400, 400 );
    
    this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
    });

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.aspect.width, this.aspect.height );
    this.renderer.shadowMap.enabled = true;
	this.renderer.autoClearDepth = true;

    this.container.appendChild( this.renderer.domElement );

    this.lights.hemi = new THREE.HemisphereLight( 0xffffff, 0x444444, 2 );
	this.lights.hemi.position.set( 0, 20, 0 );
	this.scene.add( this.lights.hemi );
	
	this.lights.direct = new THREE.DirectionalLight( 0xffffff, 1.2 );
	this.lights.direct.position.set( 5, 8, 2 );
	this.lights.direct.castShadow = true;
	this.lights.direct.shadow.camera.top = 1000;
	this.lights.direct.shadow.camera.bottom = -1000;
	this.lights.direct.shadow.camera.left = -1000;
	this.lights.direct.shadow.camera.right = 1000;
	this.lights.direct.shadow.camera.far = 1000;
	this.scene.add( this.lights.direct );

    this.controls = new OrbitControls( this.cameras.mainCam, this.renderer.domElement );

    this.raycaster = new THREE.Raycaster();
    this.grid = new THREE.GridHelper( 10, 30 );
    this.scene.add( this.grid );

}

Core.prototype.getScene = function() {
    return this.scene;
}

Core.prototype.getRenderer = function() {
    return this.renderer;
}

Core.prototype.getCameras = function() {
    return this.cameras;
}

Core.prototype.getControl = function() {
    return this.controls;
}

Core.prototype.getRaycaster = function() {
    return this.raycaster;
}


export default Core