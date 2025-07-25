import * as THREE from 'three';
import { Canvas, useThree} from '@react-three/fiber'
import { useEffect } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// components
import ShaderPlane from './components/ShaderPlane';
import MusicPlayer from './components/MusicPlayer';
import ViewCounter from './components/Counter';



function ResponsivePerspectiveCamera({ hfov = 2.3, distance = 5 }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;

    // Convert HFOV to VFOV using aspect ratio
    const hfovRad = hfov;
    const vfovRad = 2 * Math.atan(Math.tan(hfovRad / 2) / aspect);
    const vfovDeg = THREE.MathUtils.radToDeg(vfovRad);

    camera.fov = vfovDeg;
    camera.aspect = aspect;
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();
  }, [camera, size, hfov, distance]);

  return null;
}
function App() {

  return (
    <>

      <div className='title' style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        color: 'white',
        fontSize: '1.2rem',
        opacity: 0.8,
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        Static Schwarzschild Blackhole -
        Gravitational Lensing 
      </div>

      <MusicPlayer />
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        zIndex: 1000,
      }}>
        Music : by MelodySheep · <a href="https://www.youtube.com/watch?v=RdYf0oduteM&list=RDRdYf0oduteM&index=2" target="_blank" rel="noreferrer" style={{ color: '#aad' }}>Source</a>
      </div>

      <Canvas style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* <OrbitControls /> */}

        <ResponsivePerspectiveCamera hfov={2.3} distance={5} />
        {/* <PerspectiveCamera
          makeDefault
          position={[-1.62, 5, 8.9]}
          rotation={[1.54, 0.02, -0.2921]} 
          fov={35}
          near={0.1}
          far={1000}
        /> */}
        <ShaderPlane />

      </Canvas>
      <ViewCounter slug="blackhole-visualization" />


    </>
  )
}

export default App
