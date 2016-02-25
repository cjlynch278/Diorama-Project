/*
 * dioramaProject.js
 * Authors: Sean Jeffers, Chris Lynch, Herman Haine
 * Last Revision 2/22/2016
 * This is the java script file that draws a number of cubes and rotates
 * them around the y axis.
 * We used this file from the book to help us complete this project
 * https://www.cs.unm.edu/~angel/WebGL/7E/04/cube.js
 */
var canvas;
var gl;

var points = [];

var colors = [];

var yAxis = 1;
var axis = null;
var theta = [ 0, 0, 0 ];
var thetaLoc;
var spinning = false;

window.onload = function init()
{
	//Initiate the objects
    var bottleBottom = [
        
        //    X     Y     Z
        vec4(-0.2, -0.75, 0.2, 1.0), // left bottom front 
        vec4(-0.2, 0.25, 0.2, 1.0), // left top front
        vec4(0.2, 0.25, 0.2, 1.0), // right top front
        vec4(0.2, -0.75, 0.2, 1.0), // right bottom front
        vec4(-0.2, -0.75, -0.2, 1.0), // left bottom back  
        vec4(-0.2, 0.25, -0.2, 1.0), // left top back
        vec4(0.2, 0.25, -0.2, 1.0), // right top back
        vec4(0.2, -0.75, -0.2, 1.0), // right bottom back
    ];

    var bottleCap = [
        vec4(-0.125, 0.25, 0.125, 1.0), // left bottom back
        vec4(-0.125, 0.5, 0.125, 1.0), // left top back
        vec4(0.125, 0.5, 0.125, 1.0), // right top back
        vec4(0.125, 0.25, 0.125, 1.0), // right bottom back
        vec4(-0.125, 0.25, -0.125, 1.0), // left bottom front
        vec4(-0.125, 0.5, -0.125, 1.0), // left top front 
        vec4(0.125, 0.5, -0.125, 1.0), // right top front
        vec4(0.125, 0.25, -0.125, 1.0)  // right bottom front
    ];

    var phone = [
        vec4(-0.75, -0.75, -0.4, 1.0), // left bottom back
        vec4(-0.75, -0.65, -0.4, 1.0), // left top back
        vec4(-0.25, -0.65, -0.4, 1.0), // right top back
        vec4(-0.25, -0.75, -0.4, 1.0), // right bottom back
        vec4(-0.75, -0.75, -0.6, 1.0), // left bottom front
        vec4(-0.75, -0.65, -0.6, 1.0), // left top front 
        vec4(-0.25, -0.65, -0.6, 1.0), // right top front
        vec4(-0.25, -0.75, -0.6, 1.0)  // right bottom front
    ];

    var pack = [

        //    X     Y     Z
        vec4(0.8, -0.2, 0.3, 1.0), // left bottom front 
        vec4(0.8, 0.8, 0.3, 1.0), // left top front
        vec4(0.9, 0.8, 0.3, 1.0), // right top front
        vec4(0.9, -0.2, 0.3, 1.0), // right bottom front
        vec4(0.8, -0.2, -0.3, 1.0), // left bottom back  
        vec4(0.8, 0.8, -0.3, 1.0), // left top back
        vec4(0.9, 0.8, -0.3, 1.0), // right top back
        vec4(0.9, -0.2, -0.3, 1.0), // right bottom back
    ];

    canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //Call colorCube on each of the objects
    colorCube(bottleBottom);
    colorCube(bottleCap);
    colorCube(pack);
    colorCube(phone);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
 
    document.getElementById( "Button" ).onclick = function () {
    	//Simple boolean to toggle rotate
    	if(!spinning){
        	axis = yAxis;
        	spinning = true;
        }
        else{
        	axis = null;
        	spinning = false;
        }
    };
    
    render();
    
}

function colorCube(vert)
{ 
	//How the program will color the cube
    quad( 1, 0, 3, 2, vert );
    quad( 2, 3, 7, 6, vert );
    quad( 3, 0, 4, 7, vert);
    quad( 6, 5, 1, 2, vert);
    quad( 4, 5, 6, 7, vert );
    quad( 5, 4, 0, 1, vert);
}

function quad(a, b, c, d, vert) 
{
    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    var indices = [ a, b, c, a, c, d ];
    //Push each of the vertices onto the object
    for ( var i = 0; i < indices.length; ++i ) {
        points.push(vert[indices[i]] );
        
        // This function is for solid faces
        colors.push(vertexColors[a]);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //Increment to add spin
    theta[axis] += 2.0;
    //Spins the object by the incremented amount
    gl.uniform3fv(thetaLoc, theta);
    //Draw the object
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    requestAnimFrame( render );
}
