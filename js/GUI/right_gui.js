function resize( camera, renderer, panel, bar, gui ) {
    
    if( panel ) gui.panelResize( panel, bar );
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.updateProjectionMatrix();

}

function makeTrace( str ) {

    const boundary = document.querySelector('#tracer');
    
    if( boundary ) {

        boundary.innerHTML += '<p>[tracer]:. . . . . . . .' + str + '</p>';
        boundary.scrollTop = boundary.scrollHeight;
    
    }

}

function makeTraceInput () {

    const traceEleInput = document.createElement( 'input' );

    traceEleInput.type = "button";
    traceEleInput.value = "-";
    traceEleInput.style.position = "absolute";
    traceEleInput.style.top = "30px";
    traceEleInput.style.right = "0px";
    traceEleInput.className = "staste";
    traceEleInput.onclick = tclick;

    return traceEleInput

}


// Events
function tclick( event ){

    let tracer = document.getElementById("tracer");

	if( event.target.value == "+" ){
	
        event.target.value = "-";
		if( tracer) tracer.style.display = "block";
	
    }else{
	
        event.target.value = "+";
		if( tracer ) tracer.style.display = "none";
	
    }
}


function onProgress( event ) {

    const board = document.getElementById("info").getElementsByTagName('p')[0];
	const percentComplete = Math.round( event.loaded / event.total * 100 );
	
    if( board ) {

        ( percentComplete < 100 ) 
        ? board.innerHTML = "Please Wait!... " + percentComplete + " %"
        : board.innerHTML = "";

    }

}


export { makeTrace, makeTraceInput, onProgress, resize }