import * as THREE from "three";
import raycastModule from "./rayCast_utils.js";
function ObjCtrl_Cls( props ) {
    
    this.aspect = props.aspect;
    this.object;
    this.current_bone_rot_angle;
    this.changing_bone_rot_angle;
    this.current_bone_scale;
    this.changing_bone_scale;
    this.rotateVec3;
    this.skeleton;
    this.pose_mode;
    this.raycast = raycastModule;
    this.mark_arr = [];
    this.mouse = new THREE.Vector2();
}

ObjCtrl_Cls.prototype.init = function() {
    this.current_bone_rot_angle = 0;
}

ObjCtrl_Cls.prototype.get_boneRotAngle = function () {
    return this.current_bone_rot_angle;
}

ObjCtrl_Cls.prototype.set_rotateVec = function ( val ) {
    this.rotateVec3 = val;
}

ObjCtrl_Cls.prototype.set_poseMode = function ( val ) {
    this.pose_mode = val;
}

ObjCtrl_Cls.prototype.get_poseMode = function () {
    return this.pose_mode;
}

ObjCtrl_Cls.prototype.cam_normalizeVec = function ( camera_position ) {
    this.rotateVec3.subVectors( new THREE.Vector3( 0, 0, 0 ), camera_position );
    this.rotateVec3.normalize();
}

ObjCtrl_Cls.prototype.set_skeleton = function ( val ) {
    this.skeleton = val;
}

ObjCtrl_Cls.prototype.skeletonOff = function () {
    // console.log('skeleton off');
    this.skeleton.visible = false;
}

ObjCtrl_Cls.prototype.skeletonOn = function () {
    // console.log('skeleton on');
    this.skeleton.visible = true;
}

ObjCtrl_Cls.prototype.set_obj = function ( val ) {
    this.object = val;
}

ObjCtrl_Cls.prototype.get_obj = function () {
    return this.object;
}

// Rotating
ObjCtrl_Cls.prototype.rotateAxis = function ( event ) {

    this.changing_bone_rot_angle = (( event.pageX / this.aspect.width * Math.PI ) - Math.PI/2 ) * 2 ;
    
    this.object.parent.rotateOnAxis( 
        this.rotateVec3, 
        this.changing_bone_rot_angle - this.current_bone_rot_angle,
    );

    this.current_bone_rot_angle = this.changing_bone_rot_angle;
    if( this.skeleton.visible ) this.skeletonOff();

}

ObjCtrl_Cls.prototype.rot_bar = function( event ) {

    this.object.parent.rotateOnAxis( 
        this.rotateVec3, 
        event.target.value - this.current_bone_rot_angle
    );
    this.current_bone_rot_angle = event.target.value;

}

// Scale
ObjCtrl_Cls.prototype.scaleAxis = function ( event ) {

    this.changing_bone_scale = (( event.pageX / this.aspect.width * Math.PI ) - Math.PI/2 ) * 2 ;
    
    this.object.parent.scale.set( 
        this.changing_bone_scale,
        this.changing_bone_scale,
        this.changing_bone_scale
    );

    this.current_bone_scale = this.changing_bone_scale;
    if( this.skeleton.visible ) this.skeletonOff();

}

ObjCtrl_Cls.prototype.scale_bar = function( event ) {

    this.object.parent.rotateOnAxis( 
        this.rotateVec3, 
        event.target.value - this.current_bone_rot_angle
    );
    this.current_bone_rot_angle = event.target.value;

}

// Position
ObjCtrl_Cls.prototype.add_mark = function ( val ) {
    this.mark_arr.push( val );
}

ObjCtrl_Cls.prototype.get_mark = function () {
    return this.mark_arr;
}

ObjCtrl_Cls.prototype.reset_mark = function () {
    this.mark_arr = [];
}

ObjCtrl_Cls.prototype.move_pos = function ( event, mouse, raycaster, camera, el ) {
    mouse.x = ( event.pageX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.pageY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let inter = raycaster.intersectObjects( this.mark_arr );

    if( inter.length > 0 ) {
		
        el.innerHTML="X : "+inter[0].point.x+"Z: "+inter[0].point.z;
        let lok_punkt = inter[0].point;

		this.object.parent.parent.worldToLocal(lok_punkt);
		this.object.parent.position.set( lok_punkt.x, lok_punkt.y, lok_punkt.z );

	}

}


ObjCtrl_Cls.prototype.exe_raycast = function( props ) {
    
    this.raycast({
        ...props, 
        skeleton: this.skeleton, 
        auswahl: this.object,
        currentBoneAngle: this.current_bone_rot_angle,
        objCls: this,
        resetVec3: new THREE.Vector3(),
    });
}

export { ObjCtrl_Cls }