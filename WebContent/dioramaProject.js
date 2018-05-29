//Chris Lynch, Sean Jeffers, and Herman Haile
// 4/29/2016
//dioramaProject.js
//JS Code:
var program;
var canvas;
var gl;
var cubeMap;
var numVertices = 36;

var image;


var texSize = 64;
var gif;
// Create a checkerboard pattern using floats


var modelView, projection;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var fovy = 15.0;  // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0;       // Viewport aspect ratio

var near = 9;
var far = 50;

const at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);



var normalsArray = [];

//Helps create image3
var image1 = new Array()
for (var i = 0; i < texSize; i++) image1[i] = new Array();
for (var i = 0; i < texSize; i++)
    for (var j = 0; j < texSize; j++)
        image1[i][j] = new Float32Array(4);
for (var i = 0; i < texSize; i++) for (var j = 0; j < texSize; j++) {
    var c = (((i & 0x8) == 0) ^ ((j & 0x8) == 0));
    image1[i][j] = [c, c, c, 1];
}

// Convert floats to ubytes for texture

var image3 = new Uint8Array(4 * texSize * texSize);

// Create a checkerboard pattern
for (var i = 0; i < texSize; i++) {
    for (var j = 0; j < texSize; j++) {
        image3[4 * i * texSize + 4 * j] = 127 + 127 * Math.sin(0.1 * i * j);
        image3[4 * i * texSize + 4 * j + 1] = 127 + 127 * Math.sin(0.1 * i * j);
        image3[4 * i * texSize + 4 * j + 2] = 127 + 127 * Math.sin(0.1 * i * j);
        image3[4 * i * texSize + 4 * j + 3] = 255;
    }
}



//Create spiral Pattern
var image2 = new Uint8Array(4 * texSize * texSize);

for (var i = 0; i < texSize; i++)
    for (var j = 0; j < texSize; j++)
        for (var k = 0; k < 4; k++)
            image2[4 * texSize * i + 4 * j + k] = 255 * image1[i][j][k];

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];



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
// vertices for the bottleCap
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
// vertices for the representation of the camera
var pack = [
    vec4(-0.75, -0.75, -0.4, 1.0), // left bottom back
    vec4(-0.75, -0.65, -0.4, 1.0), // left top back
    vec4(-0.25, -0.65, -0.4, 1.0), // right top back
    vec4(-0.25, -0.75, -0.4, 1.0), // right bottom back
    vec4(-0.75, -0.75, -0.6, 1.0), // left bottom front
    vec4(-0.75, -0.65, -0.6, 1.0), // left top front 
    vec4(-0.25, -0.65, -0.6, 1.0), // right top front
    vec4(-0.25, -0.75, -0.6, 1.0)  // right bottom front
];


// vertices for the representation of the light source.
var phone = [

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
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];
window.onload = init;


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [45.0, 45.0, 45.0];

var thetaLoc;

//Creates a texture given an image
function configureTexture(image) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

}

function quad(a, b, c, d, vertices) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[a]);
    var normal = cross(t1, t2);
    normal[3] = 0.0;

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal);


    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[3]);
    normalsArray.push(normal);

}

//We got help from this site with the function below and modified 
//http://math.hws.edu/eck/cs424/notes2013/webgl/skybox-and-reflection/skybox-and-env-map.html
//This function will create a skycube, given an image, for an object to reflect
function loadTextureCube() {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    var ct = 0;
    var img = new Array(6);
    // The image from the angel examples is what we used as our skybox, because it looked nice
    var urls = 
       "SA2011_black.gif";
    // loop for each side
    for (var i = 0; i < 6; i++) {
    	//load the image
        img[i] = new Image();
        img[i].onload = function () {
            ct++;
            if (ct == 6) {
                texID = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texID);
                var targets = [
                   //Specifies which way the box faces the image
                   gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];
                for (var j = 0; j < 6; j++) {
                	
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    
            }
        }
        img[i].src = urls;
    }
    
}

function colorCube(vertices) {
    quad(1, 0, 3, 2, vertices);
    quad(2, 3, 7, 6, vertices);
    quad(3, 0, 4, 7, vertices);
    quad(6, 5, 1, 2, vertices);
    quad(4, 5, 6, 7, vertices);
    quad(5, 4, 0, 1, vertices);
}


function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    
    //Set one program to deal with textures and the other for reflections
    alt = initShaders(gl, "vertex-shader", "texture");
    gl.useProgram(alt);

    program = initShaders(gl, "vertex-shader", "reflection");
    gl.useProgram(program);

    //Create vertices
    colorCube(phone);
    colorCube(bottleCap);
    colorCube(bottleBottom);
    colorCube(pack);
   
    //Call verify to set up our programs
    verify(alt);
    verify(program);

    //Call render functions for each object
    render();
    render1();
    render2();

}
//This function sets each of our programs up
var verify = function (program) {


    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");


}

n = -50;


var render2 = function () {
    //    configureGif(image);
    gl.useProgram(alt);
    verify(alt);
    configureTexture(image3);
    gl.drawArrays(gl.TRIANGLES, 0, 36);



    eye = vec3(10, 5, -8);

    
    n += 0.1;

    if (n > 50) {
        n = -50;
    }

    eye = vec3(n, 5, -10);
 
    // defining the matrices that give perspective
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);


    var normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(gl.getUniformLocation(alt, "normalMatrix"), false, flatten(normalMatrix));

    // calling functions that give the image perspective
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    requestAnimFrame(render2);

}
var render1 = function () {
    gl.useProgram(program);
    verify(program);
    gl.drawArrays(gl.TRIANGLES, 36, 108 - 36);
    eye = vec3(10, 5, -10);

    n += 0.1;
    if (n > 50) {
        n = -50;
    }
    eye = vec3(n, 5, -10);


    // defining the matrices that give perspective
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    var normalMatrix = [
       vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
       vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
       vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));

    // calling functions that give the image perspective
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    loadTextureCube();
    requestAnimFrame(render1);
}


var render = function () {
    gl.useProgram(alt);
    verify(alt);
    configureTexture(image2);
    gl.drawArrays(gl.TRIANGLES, 108, 36);
    eye = vec3(10, 5, -8);

    n += 0.1;

    if (n > 50) {
        n = -50;
    }

    eye = vec3(n, 5, -10);

    // defining the matrices that give perspective
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);


    var normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(gl.getUniformLocation(alt, "normalMatrix"), false, flatten(normalMatrix));

    // calling functions that give the image perspective
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    requestAnimFrame(render);

}
