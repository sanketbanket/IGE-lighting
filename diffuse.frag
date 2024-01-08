#version 330 core



//uniform vec3 mycolor;
uniform vec3 ambience;

in vec3 normal;
in vec3 FragPos;
in vec2 texCoords;

out vec4 FragColor;

uniform vec3 cameraPos;
uniform vec3 lightpos;
uniform vec3 lightColor;


struct Light {
vec3 diffuse;
vec3 specular;

vec3 position;

};

struct Material {
 
vec3 diffuse;	//reflected under diffuse light
vec3 specular;	//specular highlight color
float shine;  //should be a power of two : higher the value more "shinier" the material.

};


struct tMaterial {
sampler2D diffuse;
sampler2D specular;
float shine;
};

uniform Material material;
uniform Light light;
uniform tMaterial tmaterial;

uniform int textured;

void main(){ 
if(textured == 0){                         //if not using textures
 //diffuse : 
vec3 light_direction = normalize(lightpos - FragPos);
vec3 norm = normalize(normal);

float diff = max(0.0, dot(light_direction, norm));
vec3 diffuse = light.diffuse * (diff * material.diffuse);

//specular :
vec3 reflected = reflect(-light_direction, norm);
vec3 viewDir = normalize(cameraPos - FragPos);
float spec = pow(max(dot(viewDir, reflected), 0.0), material.shine);   //shininess
vec3 specular = light.specular  * (spec * material.specular);

vec3 ambient = ambience * material.diffuse;


FragColor = vec4((ambient + diffuse + specular), 1.0f);
}

//////---------------------------------------------------------------//////////
if(textured == 1){                         //if using using textures
 //diffuse : 
vec3 light_direction = normalize(lightpos - FragPos);
vec3 norm = normalize(normal);

float diff = max(0.0, dot(light_direction, norm));
vec4 diffuse_color = texture(tmaterial.diffuse, texCoords);

vec3 diffuse = light.diffuse * (diff * vec3(diffuse_color.x, diffuse_color.y, diffuse_color.z));

//specular :
vec3 reflected = reflect(-light_direction, norm);
vec3 viewDir = normalize(cameraPos - FragPos);
float spec = pow(max(dot(viewDir, reflected), 0.0), tmaterial.shine);   //shininess

vec4 specular_color = texture(tmaterial.specular, texCoords);

vec3 specular = light.specular  * (spec * vec3(specular_color.x, specular_color.y, specular_color.z));

vec3 ambient = ambience * vec3(diffuse_color.x, diffuse_color.y, diffuse_color.z);

FragColor = vec4((ambient + diffuse + specular), 1.0f);
}



}