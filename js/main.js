import * as THREE from "three";
// import { GLTFLoader } from 'https://unpkg.com/three@0.159.0/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'https://unpkg.com/three@0.159.0/examples/jsm/loaders/DRACOLoader.js';
import 'https://cdn.jsdelivr.net/npm/@theatre/browser-bundles@0.5.0-insiders.88df1ef/dist/core-and-studio.js'
import Core from "./core.js";
import { makeTraceInput, onProgress, resize } from "./GUI/right_gui.js";
import CreateGUI from "./GUI/gui_DOM.js";
import Environment from "./Model/environment.js";
import { LoadingsManager, fbxLoader, gltfLoader_ } from "./Loader/loaders.js";
import { ObjCtrl_Cls } from "./Ctrl/control_utils.js";
import { ctrlHelper, headerBarCtrl_Evt, ctrlReset_Evt, ctrlDrag_Evt, 
	mouseUpfromRotation_Evt, mouseUpfromScale_Evt, mouseUpfromPositon_Evt } from "./Ctrl/event_func.js";

const { core, studio } = Theatre;
studio.initialize();


// Three.js
let container = document.getElementById("monitor");
let threejs_core = new Core( container );
let aspect = { width: window.innerWidth, height: window.innerHeight };

let renderer = threejs_core.getRenderer();
let scene = threejs_core.getScene();
let controls = threejs_core.getControl();
let camera = threejs_core.getCameras().mainCam;
let raycaster = threejs_core.getRaycaster();
let mouse = new THREE.Vector2();

// skeleton box material 설정
let mat_default = new THREE.LineBasicMaterial( { color: 0x00cc66,linewidth: 2,depthTest: false, transparent: true } );
let mat_auswahl = new THREE.LineBasicMaterial( { color: 0xffcc33,linewidth: 2, depthTest: false, transparent: true } );
let txl = new THREE.TextureLoader();

// make GUI
const panel = document.getElementById("leftpanel");
const bar = CreateGUI.createLeftBar( panel );
const viewport = document.getElementById('monitor');
let meldung = document.getElementById("info").getElementsByTagName('p')[0];
let makeTraceIpt = makeTraceInput();

makeTraceIpt.click();
container.appendChild( makeTraceIpt );


/************************/
/****  Model 임포트  ****/
/***********************/
const models_arr = [];
models_arr.push([ "Bunny", "../src/models/hase/hase.fbx" ]);
models_arr.push([ "Azamat", "../src/models/azamat/Azamat.fbx" ]);
models_arr.push([ "Deadpool", "../src/models/deadpool/dpool.fbx" ]);
models_arr.push([ "Nefertiti", "../src/models/nefertiti/Nefertiti.fbx" ]);

let control_type ={};
let skeleton;
let ctrlBox_grp = [];
let skeleton_ctrls;
const loadersManager = new LoadingsManager( meldung, controls ).getLoadingManager();

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

threejs_core.setScene();
animate();

CreateGUI.panelResize( panel, bar );
panel.appendChild(bar);

window.addEventListener('resize', () => {
	resize( camera, renderer, panel, bar, CreateGUI );
})


let auswahl;
let obj01_ctrl_cls = new ObjCtrl_Cls({ aspect: aspect });

let moveRotEvt = ( e ) => obj01_ctrl_cls.rotateAxis( e );
let moveScaleEvt = ( e ) => obj01_ctrl_cls.scaleAxis( e );
let mMovePos = ( e ) => obj01_ctrl_cls.move_pos( e, mouse, raycaster, camera, meldung );

let mouseUpRotation = (e) => mouseUpfromRotation_Evt( e, controls, obj01_ctrl_cls, control_type, moveRotEvt );
let mouseUpScale = (e) => mouseUpfromScale_Evt( e, controls, obj01_ctrl_cls, control_type, moveScaleEvt );
let mouseUpPos = (e) => mouseUpfromPositon_Evt( e, controls, obj01_ctrl_cls, control_type, scene, mMovePos, mark );

const mark_arr = obj01_ctrl_cls.get_mark();
let marker_geo = new THREE.PlaneGeometry( window.innerWidth, window.innerWidth );
let marker_mat = new THREE.MeshBasicMaterial({ color: 0xfff000, transparent: true, opacity: 0});
let mark = new THREE.Mesh( marker_geo, marker_mat );

obj01_ctrl_cls.add_mark( mark );
mark.lookAt( camera.position );

let raycast_ = (e) => { 
	
	obj01_ctrl_cls.exe_raycast({
		scene: scene,
		evt: e,
		type: obj01_ctrl_cls.get_poseMode(),
		mouse: mouse,
		aspect: aspect,
		raycaster: raycaster,
		scnGroup: ctrlBox_grp,
		unselect_ctrl_material: mat_default,
		select_ctrl_material: mat_auswahl,
		info_dom: meldung,
		camera: camera,
		controls: controls,
		touchscreen: touchscreen,
		control_type: control_type,
		moveRotEvt: moveRotEvt,
		mUpDreh: mouseUpRotation,
		moveScaleEvt: moveScaleEvt,
		mUpScal: mouseUpScale,
		mMovePos: mMovePos,
		mUpPos: mouseUpPos
	}) 
}

//////////////////  TOUCHSCREEN   <<<<<<<<<<<
var touchscreen = false;
addEventListener( 'mousedown', mouseControl );
addEventListener( 'touchstart', mouseControl );

function mouseControl( event ){
	console.log('화면 마우스 클릭');
	if( event.type == "touchstart" ) touchscreen = true;
	
	control_type['mdown'] = "pointerdown";
	control_type['mmove'] = "pointermove";
	control_type['mup'] = "pointerup";
	control_type['funct'] = raycast_;

	removeEventListener( 'mousedown', mouseControl );
	removeEventListener( 'touchstart', mouseControl );
}

//----------------------------------TOUCH PEGLER
const headerbarMoving_Evt = (e) => { headerBarCtrl_Evt( e, obj01_ctrl_cls, meldung ) }
const controlDrag_Evt = (e) => {
	let cam_distance = new THREE.Vector3().copy( camera.position );
	ctrlDrag_Evt( e, controls, obj01_ctrl_cls, cam_distance, skeleton ) 
}

let headerBar_Ctrl = CreateGUI.createHeaderBar();
document.getElementById('info').appendChild( headerBar_Ctrl );

headerBar_Ctrl.oninput = headerbarMoving_Evt;
headerBar_Ctrl.onpointerdown = controlDrag_Evt;
headerBar_Ctrl.onpointerup = controlDrag_Evt;


// Environment
let mat_geo_x = new THREE.MeshLambertMaterial({ transparent:true, map: txl.load("../src/maps/xpanno.png") });
let mat_geo_y = new THREE.MeshLambertMaterial({ transparent:true, map: txl.load("../src/maps/ypanno.png") });
let mat_geo_z = new THREE.MeshLambertMaterial({ transparent:true, map: txl.load("../src/maps/xpanno.png") });
let environment = Environment.create_ground( mat_geo_x, mat_geo_y, mat_geo_z );
scene.add( environment );
Environment.create_bg( scene );

let gbox3 = new THREE.Box3().setFromObject( environment );
let gbox_helper = new THREE.Box3Helper( gbox3, 0xff00ff );
scene.add( gbox_helper );


// FBX Import
function modelLoad_manager( newModel ) {
	
	skeleton = newModel.skeleton;
	let test_model = newModel.model;
	skeleton_ctrls = newModel.get_model_skeleton_ctrl();
	obj01_ctrl_cls.set_obj( test_model );
	auswahl = test_model;
	ctrlBox_grp = newModel.ctrlBox_grp;
	scene.add( test_model );

	console.log('model name: ', test_model.name );

	// Theatre 
	const project = core.getProject('ThreeJS Rig Ctrl Test');
	const rot_sheet = project.sheet('Rotation');
	console.log('core: ', core );
	console.log('testModel rotation.x: ', test_model.rotation.x );
	console.log('testModel rotation.x: ', test_model.rotation.y );
	const types = core.types;
	const default_obj = rot_sheet.object(
		test_model.name, 
		{
			rotation: types.compound({
				x: types.number( test_model.rotation.x, { range: [ -2, 2 ] }),
				y: types.number( test_model.rotation.y, { range: [ -2, 2 ] }),
				z: types.number( test_model.rotation.z, { range: [ -2, 2 ] }),
			})
		}
	);

	default_obj.onValuesChange((values) => {
		const { x, y, z } = values.rotation;

		test_model.rotation.set( x* Math.PI, y * Math.PI, z * Math.PI );
	})


}

var load_link = "../src/models/hase/hase.fbx";
gltfLoader_( 'gamjabawi', obj01_ctrl_cls, modelLoad_manager, gbox3 );
// fbxLoader( load_link, "PoseModel", loadersManager, modelLoad_manager , onProgress, obj01_ctrl_cls, gbox3 );


////////////////////////////////////////////////////////
const zeigHelper = ( event ) => ctrlHelper( event, obj01_ctrl_cls, skeleton, renderer, raycast_ )
const ctrlModeResetEvt = ( event ) => { ctrlReset_Evt( meldung, obj01_ctrl_cls, skeleton_ctrls ) }

const ctrlResetBtn = CreateGUI.createBtn( 'reset_mode', 'RESET')
ctrlResetBtn.addEventListener('click', ctrlModeResetEvt );
panel.appendChild( ctrlResetBtn );


/*************************/
/****   컨트롤러 GUI   ****/
/*************************/
let skel_label = CreateGUI.create_text( "Modify: " );
let poser_ctrl = CreateGUI.pose_ctrl_dom( zeigHelper );
let fscreen_btn = CreateGUI.create_fullScreen_btn();
let btx_field = CreateGUI.create_text( "Background_X: " );
let btz_field = CreateGUI.create_text( "Background_Z: " );
let bty_field = CreateGUI.create_text( "Background_Y: " );

skel_label.appendChild( poser_ctrl );
panel.appendChild( skel_label );
viewport.appendChild( fscreen_btn );

let btn_x = CreateGUI.create_mov_ctrl_select_btn( btx_field, txl, mat_geo_x );
let btn_z = CreateGUI.create_mov_ctrl_select_btn( btz_field, txl, mat_geo_z );
let btn_y = CreateGUI.create_mov_ctrl_select_btn( bty_field, txl, mat_geo_y );

panel.appendChild(btx_field);
panel.appendChild( btz_field );
panel.appendChild(bty_field);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var ml_field = CreateGUI.create_text( "Change Model" );
const change_form = CreateGUI.create_change_model( 
	controls, models_arr, ml_field, scene, poser_ctrl, fbxLoader, loadersManager, 
	modelLoad_manager , onProgress, obj01_ctrl_cls, gbox3 );
ml_field.appendChild( change_form );

panel.appendChild( ml_field );



// 파일에서 찾아서 업로드하는 방식
// var sfbx_loader = document.createElement( 'input' );
// sfbx_loader.type = 'file';
// sfbx_loader.name = "";
// sfbx_loader.setAttribute( 'accept', '' );

// //ml_field.appendChild(sfbx_loader);
// sfbx_loader.onchange = function( e ) {
// 	scene.remove( scene.getObjectByName( "PoseModel" ) );
// 	let flink = URL.createObjectURL( e.target.files[0] );
// 	// fbxLoader( flink, "PoseModel", loadersManager, fbxOnLoad, onProgress );	
// }