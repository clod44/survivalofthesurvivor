precision mediump float;

attribute vec3 aPosition;

uniform mat4 uModelViewProjectionMatrix;

varying float t;

void main() {
  // Pass the position through to the fragment shader
  gl_Position = uModelViewProjectionMatrix * vec4(aPosition, 1.0);
  
  // Calculate the distance from the center of the ball
  t = length(aPosition.xy);
}
