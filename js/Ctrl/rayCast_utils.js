function raycastModule ( props ) {
	
    const pose_mod = props.type;
    const skeleton = props.skeleton;
    let event = props.evt;
    let mat_default = props.unselect_ctrl_material;
    let mat_auswahl = props.select_ctrl_material;
    let touchscreen = props.touchscreen;
    const obj01_ctrl_cls = props.objCls;
    const meldung = props.info_dom;
    const { camera, mouse, controls, raycaster, control_type, 
			moveRotEvt, mUpDreh, moveScaleEvt, mUpScal, mUpPos, mMovePos, scene } = props;
    const currentBoneAng = props.currentBoneAngle;
	let obj = obj01_ctrl_cls.get_obj();
    let newVec3 = props.resetVec3;
    let cam_punkt;
    let scn_group = props.scnGroup;

	switch( pose_mod ){
		
		case 'dreh':
	//========================================================================
		if(( skeleton.visible && !touchscreen )||( skeleton.visible && !event.isPrimary )) {
			
			mouse.x = ( event.pageX / window.innerWidth ) * 2 - 1;
			mouse.y = -( event.pageY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );
			
            let intersects = raycaster.intersectObjects( scn_group );
			console.log('intersects: ', intersects );
            if( intersects.length > 0 ) {
				
				if( obj && obj.name != intersects[ 0 ].object.name ) {
					obj.material = mat_default;
				}
				
				obj01_ctrl_cls.set_obj( intersects[0].object );

				let slc_obj = obj01_ctrl_cls.get_obj();
				slc_obj.material = mat_auswahl;
				meldung.innerHTML = "Selected :" + slc_obj.name;

				if( !touchscreen ) {
					cam_punkt = newVec3.copy( camera.position );
					slc_obj.parent.worldToLocal( cam_punkt );

					obj01_ctrl_cls.cam_normalizeVec( cam_punkt );
					
					// dreh_x = event.pageX;
					// dreh_y = event.pageY;
					
					controls.enabled = false;

					addEventListener( control_type['mmove'], moveRotEvt, false);
					addEventListener( control_type['mup'], mUpDreh, false);
					
				} else {
					meldung.innerHTML="TouchScreen. "+ slc_obj.name;
				}
			} else { 
                obj01_ctrl_cls.init();
			}
		}
	//==================================================================
		break;
		case 'scal':
	//========================================================================
		if(( skeleton.visible && !touchscreen )||( skeleton.visible && !event.isPrimary )) {
			
			mouse.x = ( event.pageX / window.innerWidth ) * 2 - 1;
			mouse.y = -( event.pageY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );    

			let intersects = raycaster.intersectObjects( scn_group );
			
			if( intersects.length > 0 ) {

				if( obj && obj.name != intersects[ 0 ].object.name){
					obj.material = mat_default;
				}

				obj01_ctrl_cls.set_obj( intersects[0].object );
				
				let slc_obj = obj01_ctrl_cls.get_obj();
				slc_obj.material = mat_auswahl;

				meldung.innerHTML = "Selected :" + slc_obj.name;

				if( !touchscreen ){

					cam_punkt = newVec3.copy( camera.position );
					slc_obj.parent.worldToLocal( cam_punkt );

					controls.enabled = false;

					addEventListener( control_type['mmove'], moveScaleEvt, false );
					addEventListener( control_type['mup'], mUpScal, false );
				
				}else{

					meldung.innerHTML="TouchScreen. " + slc_obj.name;

				}
			}else{ 

				obj01_ctrl_cls.init();
			}
		}
	// //==================================================================
		break;
	//----------------------------------------------------------------
	case 'posit':
	//========================================================================
		if(( skeleton.visible && !touchscreen )||( skeleton.visible && !event.isPrimary )) {
			
			mouse.x = ( event.pageX / window.innerWidth ) * 2 - 1;
			mouse.y = -( event.pageY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			let intersects = raycaster.intersectObjects( scn_group );

			if( intersects.length > 0 ) {
				if( obj && obj.name != intersects[ 0 ].object.name ) {
					obj.material = mat_default;
				}

				obj01_ctrl_cls.set_obj( intersects[0].object );

				let slc_obj = obj01_ctrl_cls.get_obj();
				slc_obj.material = mat_auswahl;

				meldung.innerHTML = " Selected :" + slc_obj.name;
				
				if( !touchscreen ) {

					cam_punkt = newVec3.copy( camera.position );
					obj01_ctrl_cls.mark_arr[0].lookAt(cam_punkt);

					let mpos = newVec3;

					obj01_ctrl_cls.object.parent.getWorldPosition( mpos );
					obj01_ctrl_cls.mark_arr[0].position.set( mpos.x, mpos.y, mpos.z );
					
					controls.enabled = false;
					
					addEventListener(control_type['mmove'], mMovePos, false);
					addEventListener(control_type['mup'], mUpPos, false);
					scene.add( obj01_ctrl_cls.mark_arr[0] );

				} else {
					meldung.innerHTML="TouchScreen. "+ this.object.name;
				}
			} else { 

				obj01_ctrl_cls.init();
			
			}
		}
	}
}

export default raycastModule