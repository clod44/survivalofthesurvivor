#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 offsets;
uniform float zoom;
uniform vec4 ballDatas[50];
uniform float ballSize;

void drawBall(float d){
    if (d < ballSize) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}

void drawHollowCircle(float d, vec2 circleCenter, float circleRadius, vec4 circleColor) {
  // Calculate the thickness range of the circle's edges
  float edgeThickness = 1.0;
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
  for (int i = 0; i < 50; i++) {
    // Get the position for the current ball
    vec2 position = ballDatas[i].xy;
    float eyesight = ballDatas[i].z;
    float killSight = ballDatas[i].w;
    
    // Calculate the distance from the current fragment to the ball position
        //translate(-this.x * this.scale,-this.y * this.scale);
    vec2 coords = (invertedFragCoord.xy + offsets.xy / (1.0/zoom));
    vec2 translatedCoords = coords - (resolution * 0.5);
    vec2 zoomedCoords = translatedCoords * (1.0/zoom);
    vec2 finalCoords = zoomedCoords + (resolution * 0.5);
    float d = distance(finalCoords, position);
    
    //ball
    drawBall(d);
    //eyesight
    drawHollowCircle(d, position, eyesight, vec4(0.0, 1.0, 0.0, 1.0));
    //killSight
    drawHollowCircle(d, position, killSight, vec4(1.0, 0.0, 0.0, 1.0));

  }
}
