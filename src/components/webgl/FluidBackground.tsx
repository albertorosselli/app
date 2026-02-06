import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment Shader - Fluid Smoke Simulation
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uIntensity;
  
  varying vec2 vUv;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float dist = distance(uv, vec2(0.5));
    float radial = smoothstep(0.6, 0.0, dist);
    
    // Mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.3;

    // Subtle grid overlay
    vec2 gridUv = uv * 6.0;
    vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
    float gridLine = 1.0 - min(min(grid.x, grid.y), 1.0);
    gridLine = smoothstep(0.95, 1.0, gridLine);
    
    // Create flowing noise
    float t = uTime * 0.15;
    vec2 q = vec2(0.0);
    q.x = fbm(uv * 2.0 + t * 0.5);
    q.y = fbm(uv * 2.0 + vec2(1.0) + t * 0.3);
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv * 2.0 + q + vec2(1.7, 9.2) + t * 0.4 + mouseInfluence);
    r.y = fbm(uv * 2.0 + q + vec2(8.3, 2.8) + t * 0.3 + mouseInfluence);
    
    float f = fbm(uv * 2.0 + r + t * 0.2);
    
    // Color palette - calm blue/teal tones
    vec3 color1 = vec3(0.02, 0.03, 0.04); // near-black blue
    vec3 color2 = vec3(0.04, 0.07, 0.09); // deep blue
    vec3 color3 = vec3(0.06, 0.12, 0.10); // muted teal
    vec3 color4 = vec3(0.03, 0.10, 0.06); // subtle green
    
    // Mix colors based on noise
    vec3 color = mix(color1, color2, clamp(f * 2.0, 0.0, 1.0));
    color = mix(color, color3, clamp(length(q) * 0.5, 0.0, 1.0));
    color = mix(color, color4, clamp(length(r.x) * 0.3, 0.0, 1.0));

    // Light data/grid signal
    vec3 signalColor = vec3(0.10, 0.35, 0.25);
    color = mix(color, signalColor, gridLine * 0.18);
    
    // Radial signal glow
    vec3 radialColor = vec3(0.08, 0.20, 0.30);
    color += radial * radialColor * 0.25;
    
    // Add subtle glow near mouse
    float mouseDist = length(uv - uMouse);
    float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.1;
    color += vec3(mouseGlow * 0.3, mouseGlow * 0.1, mouseGlow * 0.2);
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
    color *= vignette * 0.7 + 0.3;

    // Soften contrast
    color *= 0.75;
    color = pow(color, vec3(1.2));
    
    gl_FragColor = vec4(color * uIntensity, 1.0);
  }
`

interface FluidPlaneProps {
  intensity?: number
}

function FluidPlane({ intensity = 1 }: FluidPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const { viewport, size } = useThree()
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uIntensity: { value: intensity },
    }),
    [size.width, size.height, intensity]
  )
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      
      // Smooth mouse follow
      const targetX = mouseRef.current.x
      const targetY = mouseRef.current.y
      material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.05
      material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.05
    }
  })
  
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

interface FluidBackgroundProps {
  className?: string
  intensity?: number
}

export default function FluidBackground({ className = '', intensity = 1 }: FluidBackgroundProps) {
  return (
    <div className={`fixed inset-0 ${className}`} style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ 
          antialias: false, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <FluidPlane intensity={intensity} />
      </Canvas>
    </div>
  )
}
