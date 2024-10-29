import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS for styling
import bg from './bg.png'; // Import the first background image
import bg1 from './bg1.png'; // Import the first glitch background
import bg2 from './bg2.png'; // Import the second glitch background
import bg3 from './bg3.png'; // Import the third glitch background
import bgg from './bg-.png'; // Import the first background glitch image
import bg1g from './bg1-.png'; // Import the first glitch background
import bg2g from './bg2-.png'; // Import the second glitch background
import bg3g from './bg3-.png'; // Import the third glitch background
import blurVideo from './blur.mp4'; // Import the video
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Background sets
const backgroundSets = [
  { bg: bg, glitch: bgg },
  { bg: bg1, glitch: bg1g },
  { bg: bg2, glitch: bg2g },
  { bg: bg3, glitch: bg3g },
];

function App() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentBg, setCurrentBg] = useState(backgroundSets[0].bg);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false); // State to track sound status
  const audioRef = React.useRef(new Audio('sound.mp3')); // Ref to hold audio instance

  // Set the audio to loop
  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  const handleCopy = () => {
    const contractAddress = 'updating...';
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setCurrentBg(backgroundSets[currentSetIndex].glitch); // Set to glitch background
      setIsVideoPlaying(true); // Start video when changing backgrounds

      const videoTimeout = setTimeout(() => {
        setIsVideoPlaying(false); // Stop video after playback
      }, 300); // Video duration

      const bgTimeout = setTimeout(() => {
        setIsGlitching(false);
        setCurrentBg(backgroundSets[currentSetIndex].bg); // Change to regular background
        setIsVideoPlaying(true); // Start video when changing back to regular bg
      }, 1000); // Show glitch bg for 1 second before switching back

      const bgBackTimeout = setTimeout(() => {
        setIsVideoPlaying(false); // Stop video after it plays when switching back
      }, 300); // Match this duration with the first video playback duration

      // Cleanup timeouts
      return () => {
        clearTimeout(videoTimeout);
        clearTimeout(bgTimeout);
        clearTimeout(bgBackTimeout);
      };
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval); // Cleanup interval
  }, [currentSetIndex]); // Add currentSetIndex as a dependency

  // Function to change background set manually
  const changeBackgroundSet = (index) => {
    setCurrentSetIndex(index);
    setCurrentBg(backgroundSets[index].bg); // Change to the regular background of the selected set
  };

  // Function to toggle sound
  const toggleSound = () => {
    setIsSoundOn((prev) => {
      const newState = !prev;

      if (newState) {
        audioRef.current.play().catch((error) => console.error('Error playing audio:', error)); // Play sound when turned on
      } else {
        audioRef.current.pause(); // Pause sound when turned off
        audioRef.current.currentTime = 0; // Reset playback time
      }

      return newState;
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center relative overflow-hidden">
      {/* Video as background */}
      <video 
        src={blurVideo} // Use imported video here
        autoPlay 
        muted 
        playsInline
        loop // Loop the video
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0" 
      />
      <div className='absolute inset-0 h-full w-full bg-black opacity-20'></div>

      <div className='absolute top-5 bg-black text-white rounded-full p-0.5'>
        <button
          onClick={handleCopy}
          className='p-2 text-xs md:text-base m-1 bg-red-600 rounded-full font-mono'
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <span className='p-1 text-[10px] md:text-base font-mono'>uploading...</span>
      </div>

      <div className="w-[90%] h-[40%] md:w-[65%] md:h-[60%] bg-black rounded-md z-10">
        <div className="bg-black text-white p-2 flex justify-between items-center rounded-t-md">
          <span className="font-bold font-mono text-xl text-red-600">Paranormal Doge</span>
          <button className="bg-red-600 text-white px-2 rounded-full">X</button>
        </div>
        <div className={`relative overflow-hidden w-full h-[calc(100%-40px)] transition-all rounded-b-md ${isGlitching ? 'animate-glitch' : ''}`}>
          {isVideoPlaying ? (
            <video 
              src={blurVideo} // Use imported video here
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-fill z-10" 
              onEnded={() => setIsVideoPlaying(false)} // Stop video when it ends
              onError={(e) => console.error('Error loading video:', e)} // Log error if any
            />
          ) : (
            <img
              src={currentBg}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black p-3 rounded-full shadow-lg flex space-x-4 text-red-600">
          <button onClick={() => changeBackgroundSet((currentSetIndex - 1 + backgroundSets.length) % backgroundSets.length)} className="">
            <ChevronLeft className="size-10 md:size-12" />
          </button>
          <button onClick={() => changeBackgroundSet((currentSetIndex + 1) % backgroundSets.length)} className="">
            <ChevronRight className="size-10 md:size-12" />
          </button>
          <button onClick={toggleSound} className="">
            {isSoundOn ? <img src="off.ico" className='size-10 md:size-12' /> : <img src="sound.ico" className='size-10 md:size-12' />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;