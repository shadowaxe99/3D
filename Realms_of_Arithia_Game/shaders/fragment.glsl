#version 300 es

precision highp float;

// Uniforms provided by the main program
uniform vec3 u_CameraPosition;
uniform vec3 u_LightPosition;
uniform vec3 u_LightColor;
uniform float u_Time;
uniform sampler2D u_Texture;

// Varyings received from the vertex shader
in vec3 v_Normal;
in vec3 v_FragmentPosition;
in vec2 v_UV;

// Fragment shader output
out vec4 FragColor;

void main() {
    // Normalize vectors for lighting calculations
    vec3 normal = normalize(v_Normal);
    vec3 lightDir = normalize(u_LightPosition - v_FragmentPosition);
    vec3 viewDir = normalize(u_CameraPosition - v_FragmentPosition);

    // Calculate diffuse lighting
    float diff = max(dot(normal, lightDir), 0.0);

    // Calculate specular lighting
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

    // Combine results
    vec3 ambient = 0.1 * u_LightColor;
    vec3 diffuse = diff * u_LightColor;
    vec3 specular = spec * u_LightColor;

    // Sample the texture
    vec4 textureColor = texture(u_Texture, v_UV);

    // Apply lighting to the texture color
    vec3 result = (ambient + diffuse + specular) * textureColor.rgb;

    // Set the fragment color
    FragColor = vec4(result, textureColor.a);
}