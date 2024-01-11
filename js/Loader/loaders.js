import * as THREE from "three";
import { FBXLoader } from 'https://unpkg.com/three@0.159.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.159.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.159.0/examples/jsm/loaders/DRACOLoader.js';
import { makeTrace } from "../GUI/right_gui.js";

let mat_default = new THREE.LineBasicMaterial( { color: 0x00cc66,linewidth: 2,depthTest: false, transparent: true } );
let mat_ctrl = new THREE.LineBasicMaterial( { color: 0xffcc33,linewidth: 2, depthTest: false, transparent: true } );

class ModelLoad {
    constructor ( model, ctrl, size, ctrlSize ) {

        this.model = model;
        this.ctrl = ctrl;
        this.materials = [];
        this.skeleton_ctrl = {};
        this.skeleton;
        this.skeleton_all = {};
        this.ctrlBox_grp = [];
        this.init();
        this.set_scale( size );
        this.setting_bone();
        this.setting_ctrl( ctrlSize );

    }

    init() {
        
        if( this.materials.length > 0 ){
            for( let mat = 0; mat < this.materials.length; mat++ ) {
                this.materials[mat].dispose();
                // trace("model disposed");
            }
        }
    
        mat_ctrl.dispose();
        mat_default.dispose();
        // this.ctrl.set_obj( this.model );

        if( this.model ) {
            this.model.traverse( child => {

                if( child.isMesh ) {
                    
                    child.castShadow = true;
                    child.receiveShadow = true;
    
                    ( !child.material.length ) 
                    ? this.materials.push( child.material )
                    : child.material.map( mat => this.materials.push( mat )  );
                    
                }
            })
        }

        this.model.rotateY( Math.PI / 4 );
        
        
    }

    set_scale( size ) {
        
        if( this.model ) {

            let center_box = new THREE.Box3();
            let root_box = new THREE.Box3Helper( center_box, 0x0000ff );
            let box_3 = new THREE.Box3().setFromObject( this.model );
            let obj_boundary_box_helper = new THREE.Box3Helper( box_3, 0xff0000 );
            obj_boundary_box_helper.visible = false;

            let koe = Math.round( size.getSize( new THREE.Vector3() ).y / box_3.getSize( new THREE.Vector3() ).y * 100 ) / 100;
            let obj_scale = koe / 3;

            this.model.add( obj_boundary_box_helper );
            this.model.scale.set( obj_scale, obj_scale, obj_scale );
            this.model.add( root_box );
            
        }
        
    }

    setting_bone() {
        
        for( let s = 0; s < this.model.children.length; s++ ) {

            if ( this.model.children[s].children.length > 0 && this.model.children[s].children[0].isBone ) {
                
                // *** Insert Bone
                this.ctrl.init();
                this.ctrl.set_rotateVec( new THREE.Vector3() );
                this.ctrl.set_skeleton( this.model.children[s].children[0] );
    
                this.skeleton = this.model.children[s].children[0];
                this.skeleton.visible = false;
                this.skeleton_all['counter'] = 1;
                
                this.model.children[s].children[0].traverse( bone => {
    
                    if( bone.isBone && !this.skeleton_all[ bone.name ] ) {
    
                        this.skeleton_all[ bone.name ] = bone.rotation;
                    
                    } else if( bone.isMesh ){
    
                        trace ( "nonBone: " + bone.name + "  TYP: " + bone.type );
                    
                    }
    
                });
                
            
            }
    
        }

        
    }

    setting_ctrl( ctrl_size ) {
        
        for ( let jnt in this.skeleton_all ) {
    
            if( jnt != 'counter' ) {
                
                let current_jnt = this.skeleton.getObjectByName( jnt );
                
                this.skeleton_ctrl[ current_jnt.name ] = {
                    pos: new THREE.Vector3().copy( current_jnt.position ),                        
                    rot: new THREE.Vector3().copy( current_jnt.rotation )
                }
                
                //Add Bone Ctrl
                const ctrl_box = boneCtrl( current_jnt );
                ctrl_box.name = current_jnt.name;
                current_jnt.add( ctrl_box );
    
                // ksprite.position.set( 0, 0, 0 );
                let origin_axis = new THREE.Box3().setFromObject( ctrl_box );
                console.log('setting ctrl size: ', ctrl_size );
                ctrl_box.scale.set( 
                    1 / origin_axis.getSize( new THREE.Vector3() ).x * ctrl_size,
                    1 / origin_axis.getSize( new THREE.Vector3() ).y * ctrl_size,
                    1 / origin_axis.getSize( new THREE.Vector3() ).z * ctrl_size
                );

                this.ctrlBox_grp.push( ctrl_box );
                this.skeleton_all.counter++
            
            }
        }

        makeTrace( 'Alle Knochen: ' + this.skeleton_all.counter );
        
    }

    get_model_skeleton_ctrl() {
        return this.skeleton_ctrl;
    }

    get model_skeleton() {

        if( this.skeleton ) return this.skeleton;

    }
    
}

function fbxLoader ( model_url, model_name, loadersManager, callback, onProgress, obj_ctrl, size, ctrl_size ){
	
	let loader = new FBXLoader( loadersManager );

	loader.load( model_url, fbx => {
        
        console.log('fbx model: ', fbx );
		fbx.name = model_name;
        const newModel = new ModelLoad( fbx, obj_ctrl, size, ctrl_size );
        // callback( fbx );
		callback( newModel );
	}, onProgress );

}

function gltfLoader_ ( name, obj_ctrl, callback, size, path, ctrl_size, tex ) {

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // const loadingManager = new THREE.LoadingManager();

    dracoLoader.setDecoderPath("https://unpkg.com/three@0.159.0/examples/jsm/libs/draco/");
    gltfLoader.setDRACOLoader( dracoLoader );

    const loader = gltfLoader.setPath( path );

    loader.load( name + '.gltf', async function ( gltf ) {
        
        gltf.scene.name = name;
        applyToTex( gltf.scene, tex );
    	const model = new ModelLoad( gltf.scene, obj_ctrl, size, ctrl_size );
        callback( model );
    
    });


}

function applyToTex( model, tex ) {
    model.traverse( child => {
        if( child instanceof THREE.Mesh ) {
            child.material.map = tex;
        }
    })
}

function LoadingsManager ( el, controls ) {

    this.loadingManager = new THREE.LoadingManager();

    this.loadingManager.onStart = () => {
        if( el ) el.innerHTML = 'STARTING';
        if( controls ) controls.enabled = false;
    };

    this.loadingManager.onLoad = () => {
        if( controls ) controls.enabled = true;
    }

}

LoadingsManager.prototype.getLoadingManager = function () {
    
    return this.loadingManager;

}

function boneCtrl( obj3 ) {

    let bone_hiearchy_length = obj3.children.length;
	let bone_ctrl_box = new THREE.BoxGeometry( 1, 1, 1 );
	let knmesh = new THREE.EdgesGeometry( bone_ctrl_box );
	let line = new THREE.LineSegments( knmesh, mat_default );

	return line;	

}

export { LoadingsManager, boneCtrl, ModelLoad, fbxLoader, gltfLoader_ }