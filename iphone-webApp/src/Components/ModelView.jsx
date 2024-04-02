import { Html, OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import React from 'react'
import { Suspense } from 'react'
import IPhone from  './IPhone'
import Lights from './Lights'
import * as THREE from 'three'
import Loder from './Loder'

const ModelView = ({index,groupRef,gsapType,controllRef,setRotationState,size,item}) => {
  return (
    <View 
    index={index}
    id={gsapType}
    className={`boredr-2 border-red-300 absolute w-full h-full ${index===2 ? 'right-[-100%]':''}`}
    >
      {/* ambient light */}
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0,0,4]}/>
      <Lights/>
      <OrbitControls
      makeDefault
      ref={controllRef}
      enablePan={false}
      enableZoom={false}
      rotateSpeed={0.4}
      targate={new THREE.Vector3(0,0,0)}
      onEnd={()=>setRotationState(controllRef.current.getAzimuthalAngle())}
      />
      <group ref={groupRef} name={`${index === 1 ? 'small' : 'large'}`} position={[0,0,0]}>
      <Suspense fallback={<Loder/>}>
         <IPhone scale={index===1 ? [15,15,15] : [17,17,17]} item={item} size={size}/>
      </Suspense>
      </group>

    </View>
  )
}

export default ModelView