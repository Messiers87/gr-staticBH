import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export default function ShaderPlane({ texture }) {
  const meshRef = useRef();
  const { size } = useThree();
  const isMobile = size.width < 768; 

  const uniforms = useMemo(() => {
    return {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      iTexture: { value: texture },
      hfov: { value: isMobile ? 1.4 : 2.3 },
      dist: { value: isMobile ? 5.0 : 5.0},
      aspect: { value: isMobile ? size.width / size.height : 1.78 },
    };
  }, [texture, size, isMobile]);

  useEffect(() => {
    uniforms.iResolution.value.set(size.width, size.height);
    uniforms.aspect.value = isMobile ? size.width / size.height : 1.78;
    uniforms.hfov.value = isMobile ? 1.4 : 2.3;
    uniforms.dist.value = isMobile ? 3.0 : 5.0;
  }, [size, uniforms, isMobile]);

  useMemo(() => {
    new THREE.TextureLoader().load('/deep1.png', (loadedTexture) => {
      loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
      loadedTexture.flipY = false;
      uniforms.iTexture.value = loadedTexture;
      console.log('Texture loaded');
    });
  }, [uniforms]);

  useFrame((state) => {
    uniforms.iTime.value = state.clock.getElapsedTime();
    if (texture) {
      uniforms.iTexture.value = texture;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size.width, size.height]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

const fragmentShader = `
#define PI 3.1415926

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iTexture;
uniform float hfov;
uniform float dist;
uniform float aspect;
varying vec2 vUv;

float checkerAA(vec2 p){
  vec2 q = sin(PI * p * vec2(20., 10.));
  float m = q.x * q.y;
  return 0.5 - m / fwidth(m);
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = (aspect * fragCoord - iResolution.xy) / iResolution.x;

  vec3 vel = normalize(vec3(1.0, -uv * tan(hfov / 2.0)));
  vec3 pos = vec3(-dist, 0.0, 0.0);

  float r = length(pos);
  float dtau = 0.2;

  while (r < dist * 2.0 && r > 1.0) {
    float ddtau = dtau * r;
    pos += vel * ddtau;
    r = length(pos);
    vec3 er = pos / r;
    vec3 c = cross(vel, er);
    vel -= ddtau * dot(c, c) * er / (r * r);
  }

  float phi1 = 1.0 - atan(vel.y, vel.x) / (2.0 * PI);
  float theta1 = 1.0 - atan(length(vel.xy), vel.z) / PI;
  vec2 UV = vec2(phi1, theta1) + vec2(iTime * 0.005, 0.0);

  vec2 texUV = fract(UV);
  texUV.y = 1.0 - texUV.y;

  vec3 textColor = texture2D(iTexture, texUV).rgb;

  float checker = checkerAA(UV * 180.0 / PI / 30.0);
  vec3 rgb = mix(textColor, vec3(checker), 0.0);
  rgb *= float(r > 1.0);

  gl_FragColor = vec4(rgb, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
