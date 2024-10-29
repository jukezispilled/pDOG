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
import blurImage from './blur.png'; // Import the static blur image
import { ChevronLeft, ChevronRight } from 'lucide-react';

const backgroundSets = [
  { bg: bg, glitch: bgg, label: 'Bedroom' },
  { bg: bg1, glitch: bg1g, label: 'Stairway' },
  { bg: bg2, glitch: bg2g, label: 'Bathroom' },
  { bg: bg3, glitch: bg3g, label: 'Baby\'s Room' },
];

function Small({ handleCopy, copied, ca }) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentBg, setCurrentBg] = useState(backgroundSets[0].glitch); // Start with the glitched backgroung
  const [isSoundOn, setIsSoundOn] = useState(false); // State to track sound status
  const audioRef = React.useRef(new Audio('sound.mp3')); // Ref to hold audio instance

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date(0, 0, 0, 3, 15)); // Start time at 3:15 AM

  // Set the audio to loop
  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 1000)); // Increment time by 1 second
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to change background set manually
  const changeBackgroundSet = (index) => {
    setCurrentSetIndex(index);
    setCurrentBg(backgroundSets[index].glitch); // Change to the glitched background of the selected set
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

  // Format time to HH:MM:SS
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="h-[100dvh] w-screen flex justify-center items-center relative overflow-hidden">
      {/* Static blur image as background */}
      <img
        src={blurImage}
        alt="Blur Background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className='absolute inset-0 h-full w-full bg-black opacity-60'></div>

      <div className='absolute top-5 bg-black text-white rounded-full p-0.5'>
        <button
          onClick={handleCopy}
          className='p-2 text-xs md:text-base m-1 bg-red-600 rounded-full font-mono'
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <span className='p-1 text-[10px] md:text-base font-mono'>{ca}</span>
      </div>

      <div className="w-[90%] h-[40%] md:w-[65%] md:h-[60%] bg-black rounded-md z-10">
        <div className="bg-black text-white p-2 flex justify-between items-center rounded-t-md">
          <span className="font-bold font-mono text-xl text-red-600">Paranormal Doge</span>
          <div className='flex justify-center items-center z-10'>
            <a href="https://x.com/" className=''>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className='size-8 md:size-10 md:hover:scale-105 transition ease-in-out duration-150'
                fill="#dc2626"
                viewBox="0 0 50 50"
              >
                <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
              </svg>
            </a>
            <a href="https://t.me/" className=''>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className='size-8 md:size-10 md:hover:scale-105 transition ease-in-out duration-150'
                fill="#dc2626"
                viewBox="0 0 50 50"
              >
                <path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden w-full h-[calc(100%-40px)] rounded-b-md">
          <div className="relative w-full h-full font-mono">
            <img
              src={currentBg}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 right-5 text-xl text-red-600">
              {formatTime(currentTime)}
            </div>
            {/* View location right above the time */}
            <div className="absolute bottom-12 right-5 text-xl text-red-600">
              {backgroundSets[currentSetIndex].label}
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black p-3 rounded-full shadow-lg flex space-x-4 text-red-600 z-20">
          <button onClick={() => changeBackgroundSet((currentSetIndex - 1 + backgroundSets.length) % backgroundSets.length)}>
            <ChevronLeft className="size-10 md:size-12" />
          </button>
          <button onClick={() => changeBackgroundSet((currentSetIndex + 1) % backgroundSets.length)}>
            <ChevronRight className="size-10 md:size-12" />
          </button>
          <button onClick={toggleSound}>
            {isSoundOn ? <img src="off.ico" className='size-10 md:size-12' /> : <img src="sound.ico" className='size-10 md:size-12' />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Small;