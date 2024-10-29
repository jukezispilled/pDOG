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
          <button className="bg-red-600 text-white px-2 rounded-full">X</button>
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