#version 300 es

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 customColor;
uniform float worldSeed;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 uv;

out vec3 vNormal;
out vec2 vUv;
out vec3 vColor;

void main() {
    vNormal = normal;
    vUv = uv;
    vColor = customColor;

    // Apply transformations
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // Procedural world variation based on worldSeed
    float noiseFactor = fract(sin(dot(position.xyz ,vec3(12.9898,78.233,worldSeed))) * 43758.5453);
    gl_Position.xyz += normal * noiseFactor * 0.1;
}