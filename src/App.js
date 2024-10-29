import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import bg from './bg.png';
import bg1 from './bg1.png';
import bg2 from './bg2.png';
import bg3 from './bg3.png';
import bgg from './bg-.png';
import bg1g from './bg1-.png';
import bg2g from './bg2-.png';
import bg3g from './bg3-.png';
import blurVideo from './blur.mp4';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const backgroundSets = [
  { bg: bg, glitch: bgg, label: 'Bedroom' },
  { bg: bg1, glitch: bg1g, label: 'Stairway' },
  { bg: bg2, glitch: bg2g, label: 'Bathroom' },
  { bg: bg3, glitch: bg3g, label: 'Baby\'s Room' },
];

function App() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentBg, setCurrentBg] = useState(backgroundSets[0].bg);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const audioRef = useRef(new Audio('sound.mp3'));
  const bgVideoRef = useRef(null);
  const glitchVideoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date(0, 0, 0, 3, 15));

  // Preload videos
  useEffect(() => {
    const preloadVideo = async () => {
      try {
        if (bgVideoRef.current) {
          bgVideoRef.current.load();
          await bgVideoRef.current.play();
          setVideoLoaded(true);
        }
      } catch (error) {
        console.error('Video preload error:', error);
        // Fallback for browsers that block autoplay
        const playOnInteraction = () => {
          bgVideoRef.current?.play();
          setVideoLoaded(true);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('touchstart', playOnInteraction);
      }
    };
    preloadVideo();
  }, []);

  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        changeBackgroundSet((currentSetIndex + 1) % backgroundSets.length);
      } else {
        changeBackgroundSet((currentSetIndex - 1 + backgroundSets.length) % backgroundSets.length);
      }
    }
    setTouchStart(null);
  }, [touchStart, currentSetIndex]);

  const handleCopy = async () => {
    const contractAddress = 'updating...';
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = contractAddress;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setCurrentBg(backgroundSets[currentSetIndex].glitch);
      setIsVideoPlaying(true);

      // Try to play the glitch video
      if (glitchVideoRef.current) {
        glitchVideoRef.current.currentTime = 0;
        const playPromise = glitchVideoRef.current.play();
        if (playPromise) {
          playPromise.catch(error => console.error('Glitch video play error:', error));
        }
      }

      const videoTimeout = setTimeout(() => {
        setIsVideoPlaying(false);
      }, 300);

      const bgTimeout = setTimeout(() => {
        setIsGlitching(false);
        setCurrentBg(backgroundSets[currentSetIndex].bg);
        setIsVideoPlaying(true);
        
        // Try to play the glitch video again
        if (glitchVideoRef.current) {
          glitchVideoRef.current.currentTime = 0;
          const playPromise = glitchVideoRef.current.play();
          if (playPromise) {
            playPromise.catch(error => console.error('Glitch video play error:', error));
          }
        }
      }, 1000);

      const bgBackTimeout = setTimeout(() => {
        setIsVideoPlaying(false);
      }, 300);

      return () => {
        clearTimeout(videoTimeout);
        clearTimeout(bgTimeout);
        clearTimeout(bgBackTimeout);
      };
    }, 4600);

    return () => clearInterval(interval);
  }, [currentSetIndex]);

  const changeBackgroundSet = (index) => {
    setCurrentSetIndex(index);
    setCurrentBg(backgroundSets[index].bg);
  };

  const toggleSound = async () => {
    setIsSoundOn((prev) => {
      const newState = !prev;
      if (newState) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          setIsSoundOn(false);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return newState;
    });
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center relative overflow-hidden">
      <video 
        ref={bgVideoRef}
        src={blurVideo} 
        autoPlay 
        muted 
        playsInline
        loop
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover opacity-60 z-0 ${videoLoaded ? 'block' : 'hidden'}`}
      />
      <div className='absolute inset-0 h-full w-full bg-black opacity-60'></div>

      <div className='absolute top-5 bg-black text-white rounded-full p-0.5'>
        <button
          onClick={handleCopy}
          className='p-2 text-xs md:text-base m-1 bg-red-600 rounded-full font-mono'
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <span className='p-1 text-[10px] md:text-base font-mono'>uploading...</span>
      </div>

      <div className="w-[95%] h-[40%] md:w-[65%] md:h-[60%] bg-black rounded-md z-10">
        <div className="bg-black text-white p-2 flex justify-between items-center rounded-t-md">
          <span className="font-bold font-mono text-base md:text-xl text-red-600">Paranormal Doge</span>
          <button className="bg-red-600 text-white px-2 rounded-full">X</button>
        </div>
        <div 
          className={`relative overflow-hidden w-full h-[calc(100%-40px)] transition-all rounded-b-md ${isGlitching ? 'animate-glitch' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isVideoPlaying ? (
            <video 
              ref={glitchVideoRef}
              src={blurVideo}
              autoPlay 
              muted 
              playsInline
              preload="auto"
              className="w-full h-full object-fill z-10" 
              onEnded={() => setIsVideoPlaying(false)}
            />
          ) : (
            <div className="relative w-full h-full font-mono">
              <img
                src={currentBg}
                alt="Background"
                className="w-full h-full object-cover"
                draggable="false"
              />
              <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 text-lg md:text-xl text-red-600">
                {formatTime(currentTime)}
              </div>
              <div className="absolute bottom-8 right-3 md:bottom-12 md:right-5 text-lg md:text-xl text-red-600">
                {backgroundSets[currentSetIndex].label}
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-3 md:bottom-5 left-1/2 transform -translate-x-1/2 bg-black p-2 md:p-3 rounded-full shadow-lg flex space-x-2 md:space-x-4 text-red-600">
          <button onClick={() => changeBackgroundSet((currentSetIndex - 1 + backgroundSets.length) % backgroundSets.length)} className="touch-manipulation">
            <ChevronLeft className="size-8 md:size-12" />
          </button>
          <button onClick={() => changeBackgroundSet((currentSetIndex + 1) % backgroundSets.length)} className="touch-manipulation">
            <ChevronRight className="size-8 md:size-12" />
          </button>
          <button onClick={toggleSound} className="touch-manipulation">
            {isSoundOn ? <img src="off.ico" className='size-8 md:size-12' alt="sound off" /> : <img src="sound.ico" className='size-8 md:size-12' alt="sound on" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;