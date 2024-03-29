import React, { useEffect, useRef,useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { pauseImg, playImg, replayImg } from '../utils';


const VideoCarousel = () => {
    const videoRef = useRef([])
    const videoDivRef = useRef([])
    const videoSpanRef = useRef([])

    const [video, setVideo] = useState({
        'videoID' : 0,
        'isPlaying': false,
        'isLastVideo':false,
        'isEnd':false,
        'startPlay':false,
    })
    const [lodedData, setLodedData] = useState([])

    const {videoID,isPlaying,isLastVideo,isEnd,startPlay} = video;

    useGSAP(()=>{
        gsap.to('#slider',{
            transform: `translateX(${-100*videoID}%)`,
            duration:2  ,
            ease: "power2.inOut",
        })
        gsap.to('#video',{
            scrollTrigger:{
                trigger: '#video',
                toggleActions:'restart none none none'
            },
            onComplete:()=>{
                setVideo((pre)=>({
                    ...pre,
                    startPlay:true,
                    isPlaying:true,
                }))
            }
        })
    },[isEnd,videoID])
    useEffect(()=>{
        if(lodedData.length > 3){
            if(!isPlaying){
                videoRef.current[videoID].pause()
            }else{
                startPlay && videoRef.current[videoID].play();
            }
        }
         
    },[isPlaying,startPlay,videoID,lodedData])

    const handleLodedMetaData = (i,e)=>setLodedData((pre)=>[...pre,e])

    useEffect(()=>{
        let currentProgress = 0;
        let span = videoSpanRef.current;
        if(span[videoID]){
            // animate the progress
            let anim = gsap.to(span[videoID],{
                onUpdate:()=>{
                    let progress = Math.ceil(anim.progress()*100);
                    if(currentProgress != progress){
                        currentProgress = progress;
                        gsap.to(videoDivRef.current[videoID],{
                            width:window.innerWidth < 1200 ? '10vw':'4vw',
                        })
                        gsap.to(span[videoID],{
                            width:`${currentProgress}%`,
                            backgroundColor: 'white'
                        })
                    }

                },
                onComplete:()=>{
                    if(isPlaying){
                        gsap.to(videoDivRef.current[videoID],{
                            width:'12px'
                        })
                        gsap.to(span[videoID],{
                            backgroundColor:'#afafaf'
                        })
                    }
                }
            })
            if(videoID===0){
                anim.restart()
            }
            const animUpdate = ()=>{
                anim.progress(videoRef.current[videoID].currentTime/hightlightsSlides[videoID].videoDuration);
            }
            if(isPlaying){
                gsap.ticker.add(animUpdate);
            }else{
                gsap.ticker.remove(animUpdate);
            }
        }
      
    },[videoID,startPlay])

    const handelProcess = (type,i)=>{
        switch (type) {
            case 'video-end':
                setVideo((pre)=>({...pre , videoID:i+1}))
                break;
            case 'video-last':
                setVideo((pre)=>({...pre,isLastVideo:true}))
                break;
            case 'video-reset':
                setVideo((pre)=>({...pre,videoID:0,isLastVideo:false}))
                break;
            case 'play':
                setVideo((pre)=>({...pre,isPlaying:!pre.isPlaying}))
                break;        
            case 'pause':
                setVideo((pre)=>({...pre,isPlaying:!pre.isPlaying}))
                break;        
            default:
                return video;
        }

    }
  return (
    <>
       <div className='flex items-center bg'>
        {hightlightsSlides.map((list,index)=>(
            <div id='slider' key={list.id} className='sm:pr-20 pr-10'>
                <div className='video-carousel_container '>
                    <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                        <video
                        id='video' playsInline={true} preload='auto' muted src={list.video}
                        ref={(el)=>(videoRef.current[index] = el)} 
                        onEnded={()=>index !== 3 ? handelProcess('video-end',index):handelProcess('video-last')}  
                        onPlay ={()=>{
                            setVideo((prevVideo)=>({
                                ...prevVideo,
                                isPlaying : true
                            }))
                        }}
                        onLoadedMetadata={(e)=>handleLodedMetaData(e,index)}
                        ></video>
                        
                    </div>
                    <div className='absolute top-12 left-[5%] z-10'>
                        {list.textLists.map((text)=>(
                            <p key={text} className='md:text-2xl text-xl font-medium'>{text}</p>
                        ))}
                    </div>

                </div>

            </div>
        ))}
       </div>
       <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
            {videoRef.current.map((_,i)=>(
                <span key={i}
                ref={(el)=>(videoDivRef.current[i] = el)}
                className='mx-2 w-3 h-3 bg-gray-200 rounded-full overflow-hidden relative cursor-pointer'
                >
                <span
                className='h-full w-full absolute rounded-full'  
                ref={(el)=>(videoSpanRef.current[i] = el)}
                >
                </span>
                </span>
            ))}
        </div>
        <button className='control-btn'>
            <img 
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} 
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick = {
                isLastVideo ? ()=>handelProcess('video-reset') : !isPlaying ? ()=>handelProcess('play') : ()=>handelProcess('pause')
            }
            />
            
        </button>
       </div>
    </>
  )
}

export default VideoCarousel