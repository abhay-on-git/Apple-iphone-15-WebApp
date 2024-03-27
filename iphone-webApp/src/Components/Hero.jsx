import {React,useEffect,useState} from 'react'
// gsap imports
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
// utils imports
import { heroVideo, smallHeroVideo } from '../utils'

const Hero = () => {
  const [videosrc, setvideosrc] = useState(window.innerWidth < 760 ? smallHeroVideo :heroVideo)
  const handleVideoSrcSet = ()=>{
    window.innerWidth < 760 ? setvideosrc(smallHeroVideo) : setvideosrc(heroVideo);
  }

  useEffect(()=>{
    window.addEventListener('resize',handleVideoSrcSet);
    return ()=>{
      window.removeEventListener('resize',handleVideoSrcSet);
    }
  },[])
  
  useGSAP(()=>{
     gsap.to("#hero",{opacity:1,delay:1.5})
  },[])
  return (
    <section className='w-full nav-height relative'>
      <div className='w-full h-5/6 flex-center flex-col'>
        <p id='hero' className='hero-title'>iPhone 15</p>
        <div className='md:w-10/12 w-9/12 '>
          <video className='pointer-events-none' autoPlay muted playsInline={true} key={videosrc} src={videosrc}></video>
        </div>
      </div>
      
    </section>
  )
}

export default Hero