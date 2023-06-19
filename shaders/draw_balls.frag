#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 worldSize;
uniform vec2 offsets;
uniform float zoom;
const int NUM_BALLS = 200;
uniform vec4 ballDatas[NUM_BALLS];
uniform float ballSize;

void drawBall(float d){
    if (d < ballSize) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}

void drawHollowCircle(float d, vec2 circleCenter, float circleRadius, vec4 circleColor) {
  // Calculate the thickness range of the circle's edges
  float edgeThickness = 0.5;
  float innerRadius = circleRadius - edgeThickness;
  float outerRadius = circleRadius + edgeThickness;

  // Check if the distance falls within the edge thickness range
  if (d > innerRadius && d < outerRadius) {
    // Set the fragment color to your desired color for the circle's edges
    gl_FragColor = circleColor; // White color for edges
  }
}


void main() {
  //invert y axis
  vec2 invertedFragCoord = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);

  // Loop through the ballPositions array
  for (int i = 0; i < NUM_BALLS; i++) {
    // Get the position for the current ball
    vec2 position = ballDatas[i].xy;
    float eyesight = ballDatas[i].z;
    float killSight = ballDatas[i].w;
    
    // Calculate the distance from the current fragment to the ball position
    vec2 normalizedCoords = (invertedFragCoord.xy + offsets.xy * zoom) / resolution;
    //at this point this looks random as my gf's scrambled ass
    vec2 translatedCoords = (normalizedCoords - vec2(0.5)) * (1.0/zoom)*0.5 + vec2(0.25);
    vec2 scaledCoords = translatedCoords * worldSize;
    
    float d = distance(scaledCoords, position);
    
    //ball
    drawBall(d);
    //eyesight
    drawHollowCircle(d, position, eyesight, vec4(0.0, 1.0, 0.0, 1.0));
    //killSight
    drawHollowCircle(d, position, killSight, vec4(1.0, 0.0, 0.0, 1.0));

  }
}
