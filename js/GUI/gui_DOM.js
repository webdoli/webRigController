
const CreateGUI = {
	panel_loc: 'left',

	createHeaderBar : () => {
		
		let p_pegel = document.createElement("input");

		p_pegel.type = "range";
		p_pegel.min = Math.PI/-1;
		p_pegel.max = Math.PI;
		p_pegel.value = 0;
		p_pegel.id = "Pegel";
		p_pegel.style.position = "absolute";
		p_pegel.style.right = "-50px";
		p_pegel.style.top = "36px";
		p_pegel.style.width = "80%";
		p_pegel.step = Math.PI/180;
		p_pegel.disabled = true;
		p_pegel.style.display = "none";

    	return p_pegel;
	},

	createBtn: ( nam, val ) => {

		let ele = document.createElement('input');
		ele.type = 'button';
		ele.name = nam;
		ele.value = val;
		return ele;
		
	},

	createLeftBar: ( panel ) => {
		
		let bar = document.createElement('input');
		bar.type = 'button';
		bar.value = "}";
		bar.id = 'ltaste';
		bar.onclick = (e) => {
			CreateGUI.panelLocOption( e, panel );
		}

		return bar

	},

    create_text: ( str ) => {

        const pr = document.createElement('p');
	    pr.style.color = '0x000000';
	    pr.innerHTML = str;
	    return pr

    },

    create_radio_btn: ( val, label, name, cb ) => {

        let span = document.createElement( 'label' );
		let butt = document.createElement( 'input' );
		
		span.name = name;
		span.onchange = cb;
		butt.type = "radio";
		butt.value = val;
		butt.name = "p_c";
		span.appendChild( butt );
		span.innerHTML += "" + label;
		
		return span;

    },

	create_fullScreen_btn: () => {

        const fscreen_btn = createBtn( "fullscreen", "FULL" );
		fscreen_btn.style.position = "absolute";
		fscreen_btn.style.right = "0px";
		fscreen_btn.style.top = "0px";
		fscreen_btn.className = "staste";
		fscreen_btn.onclick = sceneFull;
		
		return fscreen_btn;

    },

	panelResize: ( panel, bar ) => {

		if(window.innerWidth < window.innerHeight){	
	
			panel.style.left = "0px";
			panel.style.bottom = "-310px";
			panel.style.width = "100%";
			panel.style.height = "330px";
			//---------------------------
			bar.style.height = "32px";
			bar.style.width = "100%";
			bar.style.left = "0px";
			bar.style.top = "-12px";
			CreateGUI.panel_loc = "bottom";
	
		} else {
	
			panel.style.left = "-310px";
			panel.style.bottom = "0px";
			panel.style.height = "100%";
			panel.style.width = "320px";
			//---------------------------
			bar.style.height = "100%";
			bar.style.width = "32px";
			bar.style.left = "310px";
			bar.style.top = "0px";
			//================
			CreateGUI.panel_loc = "left";
	
		}
	},

	panelLocOption: ( e, panel ) => {
		
		let panel_loc = CreateGUI.panel_loc;
		let o_interval;
		
		if( panel.style[panel_loc] == "-310px" ) {

			e.target.value = "{";
			o_interval = setInterval( () => {
				if( panel.style[panel_loc] !== "0px" ) {

					let lft = parseInt( panel.style[panel_loc]) + 31;
					panel.style[panel_loc] = lft + "px";
				
				}else{

					clearInterval( o_interval );
				
				}
			},Math.round( 1000/60 ));
		
		} else {
			e.target.value = "}";
			o_interval = setInterval( () => {

				if( panel.style[panel_loc] !== "-310px" ) {
				
					let lft = parseInt( panel.style[panel_loc]) - 31;
					panel.style[panel_loc] = lft + "px";
				
				} else {

					clearInterval( o_interval );
				
				}
			}, Math.round( 1000/60 ));
		}
	},

	// 포즈 컨트롤 관련
	pose_ctrl_dom: ( zeigHelper ) => {

		const pose_ctrl = document.createElement('form');

		let no_ctrl = CreateGUI.create_radio_btn( 'nichts', 'Х', 'kont', zeigHelper );
		let d_ctrl = CreateGUI.create_radio_btn( 'dreh', 'Rotate', 'kont', zeigHelper );
		let p_ctrl = CreateGUI.create_radio_btn( 'posit', 'Translate', 'kont', zeigHelper );
		let s_ctrl = CreateGUI.create_radio_btn( 'scal', 'Scale', 'kont', zeigHelper );

		pose_ctrl.appendChild( no_ctrl );
		pose_ctrl.appendChild( d_ctrl );
		pose_ctrl.appendChild( p_ctrl );
		pose_ctrl.appendChild( s_ctrl );
		pose_ctrl.elements[0].checked = true;

		return pose_ctrl;
	},

	create_mov_ctrl_select_btn: ( parentEl, texLoader, mat_map ) => {

		let btn = document.createElement( 'input' );
		btn.type = 'file';
		btn.name = '';
		btn.setAttribute('accept', 'image/*');
		parentEl.appendChild( btn );
		btn.onchange = function( event ) {
			texLoader.load( 
				URL.createObjectURL( event.target.files[0] ), ( n_txr ) => {
					mat_map.map = n_txr;
				}
			);
		}

		return btn;
	},

	create_change_model: ( controls, models_arr, ml_feld, scene, poser_ctrl, 
		fbxLoader, loadersManager, modelLoad_manager , onProgress, obj01_ctrl_cls, gbox3 ) => {

		const isform = document.createElement( 'form' );

		isform.addEventListener( 'mousedown', function(){ controls.enabled = false; });
		isform.addEventListener( 'mouseup', function(){ controls.enabled = true; });
		isform.addEventListener( 'mouseout', function(){ controls.enabled = true; });

		const iselect = document.createElement('select');

		for( let s=0; s < models_arr.length; s++ ) {
		
			let select1 = document.createElement( 'option' );
			select1.setAttribute( 'value', models_arr[s][1] );
			select1.innerHTML = models_arr[s][0];
			iselect.appendChild( select1 );
		
		}

		ml_feld.onchange = function( event ) {
			let cnfm = confirm( "Do you really want to download another model? All settings of the current model will be reset!" );
			if( cnfm ) {
				scene.remove( scene.getObjectByName( "PoseModel" ));
				fbxLoader( event.target.value, "PoseModel", loadersManager, 
					modelLoad_manager , onProgress, obj01_ctrl_cls, gbox3 );
				poser_ctrl.elements[0].checked = true;
			}
		}

		isform.appendChild( iselect );

		return isform;
	}

}

function createBtn( nam, val ) {

	let ele = document.createElement('input');
	ele.type = 'button';
	ele.name = nam;
	ele.value = val;
	return ele;
}

function sceneFull( event ) {
	
	if( event.target.label == "fscreen_aus" ) {
		
		document.body.requestFullscreen({

		});
		event.target.label = "fscreen_ein";

	} else {

		if( document.fullscreenElement ) {
			event.target.label = "fscreen_aus";
			document.exitFullscreen();
		}

	}
}


export default CreateGUI