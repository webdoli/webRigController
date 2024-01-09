
const ctrlHelper = ( event, ctrl_cls, skeleton, renderer, raycast_ ) => {
	
	ctrl_cls.set_poseMode( event.target.value );
	let pose_mode = ctrl_cls.get_poseMode();

	if ( pose_mode == 'nichts' ) {

		skeleton.visible = false;			
		renderer.domElement.removeEventListener('pointerdown', raycast_);
		document.getElementById('Pegel').disabled = true;
		document.getElementById('Pegel').style.display = "none";

	} else {

		if( pose_mode != 'posit' ) {
			document.getElementById('Pegel').disabled = false;
			document.getElementById('Pegel').style.display = "block";

		} else {
			document.getElementById('Pegel').disabled = true;
			document.getElementById('Pegel').style.display = "none";
		}
		
		if( !skeleton.visible ) {	
			console.log('zeigHelper pos_mode: ', pose_mode );
            console.log('skeleton: ', skeleton );
			skeleton.visible = true;
			renderer.domElement.addEventListener( 'pointerdown', raycast_ );
		}
	}
}

const ctrlReset_Evt = ( info_el, obj_ctrl, skeleton_ctrls ) => {

	let pose_mode = obj_ctrl.get_poseMode();
	let jnt_ctrl = obj_ctrl.get_obj();
	let selected_jnt_ctrl = skeleton_ctrls;

	if( jnt_ctrl ){
		switch( pose_mode ){	

		case'dreh':
			info_el.innerHTML = jnt_ctrl.name + " Rotation restored";
			jnt_ctrl.parent.rotation.set(
				selected_jnt_ctrl[jnt_ctrl.name]['rot'].x,
				selected_jnt_ctrl[jnt_ctrl.name]['rot'].y,
				selected_jnt_ctrl[jnt_ctrl.name]['rot'].z
			);
			break;

		case 'scal':
			info_el.innerHTML = jnt_ctrl.name + " Scale restored";
			jnt_ctrl.parent.scale.set( 1, 1, 1);
			break;

		case 'posit':
			info_el.innerHTML = jnt_ctrl.name + " Position restored";
			jnt_ctrl.parent.position.set(
				selected_jnt_ctrl[jnt_ctrl.name]['pos'].x,
				selected_jnt_ctrl[jnt_ctrl.name]['pos'].y,
				selected_jnt_ctrl[jnt_ctrl.name]['pos'].z
			);
		}
	}

}

const headerBarCtrl_Evt = ( event, obj_ctrl, headerBar_el ) => {

	let pose_mode = obj_ctrl.get_poseMode();
	let jnt_ctrl = obj_ctrl.get_obj();

	switch( pose_mode ){
	//========================================================
	case 'dreh':
		headerBar_el.innerHTML = `Selected: ${ jnt_ctrl.name }, ${ event.target.value }` + '</br>';
		obj_ctrl.rot_bar( event );
		break;
	case 'scal':
		headerBar_el.innerHTML = jnt_ctrl.name + "</br>";
		headerBar_el.innerHTML = "Scale: " + event.target.value;
		jnt_ctrl.parent.scale.set( event.target.value, event.target.value, event.target.value );
		break;
		
	case 'posit':
		headerBar_el.innerHTML = jnt_ctrl.name+"</br>";
		headerBar_el.innerHTML = "Translate";
		// auswahl.parent.translateOnAxis(dreh_achse, (event.target.value - dreh_val_alt)*10);
		// dreh_val_alt = event.target.value;
		break;
	}
}

const ctrlDrag_Evt = ( event, controls, slc_obj_cls, cam_distance, skeleton ) => {
	
	let jnt_ctrl = slc_obj_cls.get_obj();

	if( controls && jnt_ctrl ){

		if( event.type == 'pointerdown' ){
			controls.enabled = false;
			jnt_ctrl.parent.worldToLocal( cam_distance );

			slc_obj_cls.cam_normalizeVec( cam_distance );
			slc_obj_cls.skeletonOff();

		} else {
			skeleton.visible = true;
			controls.enabled = true;
			event.target.value = 0;
		}
	}

}

const mouseUpfromRotation_Evt = ( e, controls, obj01_ctrl_cls, control_type, moveRotEvt ) => {

	removeEventListener( control_type['mmove'], moveRotEvt );
	removeEventListener( control_type['mup'], mouseUpfromRotation_Evt );
	controls.enabled = true;
	if ( obj01_ctrl_cls.skeleton.visible == false ) obj01_ctrl_cls.skeletonOn();

}

const mouseUpfromScale_Evt = ( e, controls, obj01_ctrl_cls, control_type, moveScaleEvt ) => {

	removeEventListener( control_type['mmove'], moveScaleEvt );
	removeEventListener( control_type['mup'], mouseUpfromScale_Evt );
	controls.enabled = true;
	if( obj01_ctrl_cls.skeleton.visible == false ) obj01_ctrl_cls.skeletonOn();
	
}

const mouseUpfromPositon_Evt = ( e, controls, obj01_ctrl_cls, control_type, scene, mMovePos, mark ) => {

	removeEventListener( control_type['mmove'], mMovePos );
	removeEventListener( control_type['mup'], mouseUpfromPositon_Evt );
	
    controls.enabled = true;
	
    scene.remove( mark );
	if( obj01_ctrl_cls.skeleton.visible == false ) obj01_ctrl_cls.skeletonOn();
}



export { 
	ctrlHelper,  ctrlReset_Evt, headerBarCtrl_Evt, ctrlDrag_Evt, mouseUpfromRotation_Evt,
	mouseUpfromScale_Evt, mouseUpfromPositon_Evt
}