// Prog2 based on: LightedCube.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' + 
  'attribute vec4 a_Color;\n' + 
  'attribute vec4 a_Normal;\n' +        // Normal
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightDirection;\n' + // Light direction (in the world coordinate, normalized)
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position ;\n' +
  // Make the length of the normal 1.0
  '  vec3 normal = normalize(a_Normal.xyz);\n' +
  // Dot product of the light direction and the orientation of a surface (the normal)
  '  float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
  // Calculate the color due to diffuse reflection
  '  vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
  '  v_Color = vec4(diffuse, a_Color.a);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

const maxScale = 2;
const maxMove = [3, 3, 3];

let wireframe = false;
let scaleAmount = 1;
let moveAmount = new Float32Array([-1.0, 0.0, 0.0]);  // x, y, z
let rotation = [0, 0, 0];

let wireframe2 = false;
let scaleAmount2 = 0.5;
let moveAmount2 = new Float32Array([1.0, 0.0, 0.0]);  // x, y, z
let rotation2 = [0, 0, 0];

document.getElementById("wireframe").addEventListener("change", function() {
    wireframe = this.checked;
    main();
});

document.getElementById("scale").addEventListener("input", function() {
  scaleAmount = this.value / (100 / maxScale);
  main();
});

document.getElementById("moveX").addEventListener("input", function() {
  moveAmount[0] = this.value / (100 / maxMove[0]);
  main();
});

document.getElementById("moveY").addEventListener("input", function() {
  moveAmount[1] = this.value / (100 / maxMove[1]);
  main();
});

document.getElementById("moveZ").addEventListener("input", function() {
  moveAmount[2] = this.value / (100 / maxMove[2]);
  main();
});

document.getElementById("rotationX").addEventListener("input", function() {
  rotation[0] = this.value;
  main();
});

document.getElementById("rotationY").addEventListener("input", function() {
  rotation[1] = this.value;
  main();
});

document.getElementById("rotationZ").addEventListener("input", function() {
  rotation[2] = this.value;
  main();
});

// OBJECT 2 //
document.getElementById("wireframe2").addEventListener("change", function() {
  wireframe2 = this.checked;
  main();
});

document.getElementById("scale2").addEventListener("input", function() {
scaleAmount2 = this.value / (100 / maxScale);
main();
});

document.getElementById("moveX2").addEventListener("input", function() {
moveAmount2[0] = this.value / (100 / maxMove[0]);
main();
});

document.getElementById("moveY2").addEventListener("input", function() {
moveAmount2[1] = this.value / (100 / maxMove[1]);
main();
});

document.getElementById("moveZ2").addEventListener("input", function() {
moveAmount2[2] = this.value / (100 / maxMove[2]);
main();
});

document.getElementById("rotationX2").addEventListener("input", function() {
rotation2[0] = this.value;
main();
});

document.getElementById("rotationY2").addEventListener("input", function() {
rotation2[1] = this.value;
main();
});

document.getElementById("rotationZ2").addEventListener("input", function() {
rotation2[2] = this.value;
main();
});


// Retrieve <canvas> element
var canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
var gl = getWebGLContext(canvas);
if (!gl) {
  console.log('Failed to get the rendering context for WebGL');
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to intialize shaders.');
}

function main() {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);


  var colors = new Float32Array([    // Colors
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
 ]);

 var colors2 = new Float32Array([    // Colors
    0, 1, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v0-v1-v2-v3 front
    0, 1, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v0-v3-v4-v5 right
    0, 0, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v0-v5-v6-v1 up
    0, 0, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v1-v6-v7-v2 left
    0, 0, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v7-v4-v3-v2 down
    0, 0, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0　    // v4-v7-v6-v5 back
 ]);


  var normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);


  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  // Set the clear color and enable the depth test
  gl.clearColor(1, 1, 1, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  if (!u_MvpMatrix || !u_LightColor || !u_LightDirection) { 
    console.log('Failed to get the storage location');
    return;
  }

  // Set the light color (white)
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  var lightDirection = new Vector3([1, 1, 1]);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(u_LightDirection, lightDirection.elements);

  // Calculate the view projection matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  mvpMatrix.lookAt(0, 0, 10, 0, 0, 0, 0, 1, 0);
  // Pass the model view projection matrix to the variable u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let vertices1 = rotatePoints(rotation, vertices, false);
  let normals1 = rotatePoints(rotation, normals, true);
  vertices1 = scalePoints(scaleAmount, vertices1);
  vertices1 = translatePoints(moveAmount, vertices1);
  drawObj(vertices1, colors, normals1, indices, wireframe);

  let vertices2 = rotatePoints(rotation2, vertices, false);
  let normals2 = rotatePoints(rotation2, normals, true);
  vertices2 = scalePoints(scaleAmount2, vertices2);
  vertices2 = translatePoints(moveAmount2, vertices2);
  drawObj(vertices2, colors2, normals2, indices, wireframe2);
}

function drawObj(vertices, colors, normals, indices, wireframe) {
  // Set the vertex coordinates, the color and the normal
  var n = initVertexBuffers(gl, vertices, colors, normals, indices);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  if (wireframe) {
    gl.drawElements(gl.LINE_LOOP, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube (wireframe)
  } else {
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube
  }
}

function initVertexBuffers(gl, vertices, colors, normals, indices) {
  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer (gl, attribute, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}

// Multiply matrix by scalar
function scalePoints(s, points) {
  let scaledPoints = points.map((x) => x * s);
  return scaledPoints;
}

function translatePoints(moveAmount, points) {
  let translatedPoints = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    let newPoint = points[i] + moveAmount[i % 3];
    translatedPoints[i] = newPoint;
  }
  return translatedPoints;
}

// Creates rotation matrix, multiplies it by each point vector
function rotatePoints(angle, points, normals=false) {
  let rotationMatrix = new Matrix4();
  rotationMatrix.setRotate(angle[0], 1, 0, 0);  // x rotation
  rotationMatrix.rotate(angle[1], 0, 1, 0);  // y rotation
  rotationMatrix.rotate(angle[2], 0, 0, 1);  // z rotation
  let rotMatrix = rotationMatrix.elements;

  if(false) {
    t = rotationMatrix.elements.toString();
    console.log("before", rotationMatrix);
    console.log("inverse", rotationMatrix.invert());
    rotationMatrix = rotationMatrix.transpose();
    rotationMatrix = rotationMatrix.invert();
    console.log("unchanged? ", rotationMatrix.elements.toString()==t);
    console.log("after", rotationMatrix);
  }

  let rotatedPoints = new Float32Array(points.length);
  for (let i = 0; i < points.length; i += 3) {
    newPoint = new Vector3(
    /*rotatedPoints[i] = rotMatrix[0] * points[i] + + rotMatrix[1] * points[i+1] + rotMatrix[2] * points[i+2];  // x
    rotatedPoints[i+1] = rotMatrix[4] * points[i] + rotMatrix[5] * points[i+1] + rotMatrix[6] * points[i+2];  // y
    rotatedPoints[i+2] = rotMatrix[8] * points[i] + rotMatrix[9] * points[i+1] + rotMatrix[10] * points[i+2];  // z*/
    [rotMatrix[0] * points[i] + + rotMatrix[1] * points[i+1] + rotMatrix[2] * points[i+2],  // x
    rotMatrix[4] * points[i] + rotMatrix[5] * points[i+1] + rotMatrix[6] * points[i+2],  // y
    rotMatrix[8] * points[i] + rotMatrix[9] * points[i+1] + rotMatrix[10] * points[i+2]]  // z
    );
    if(normals) {
      newPoint = newPoint.normalize();
    }
    rotatedPoints[i] = newPoint.elements[0];
    rotatedPoints[i+1] = newPoint.elements[1];
    rotatedPoints[i+2] = newPoint.elements[2];
  }
  return rotatedPoints;
}