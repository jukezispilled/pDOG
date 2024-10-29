import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Big from './Big';
import Small from './Small'; // Import your Small component

function App() {
  // Check if the screen size is medium or larger
  const isMediumOrLarger = useMediaQuery({ query: '(min-width: 768px)' });
  const [copied, setCopied] = useState(false);
  const ca = '8Tw9xibMgHGfUJHwfXdSbDUQijKs7yUFJ2Z7m1rfpump';

  const handleCopy = () => {
    const contractAddress = '8Tw9xibMgHGfUJHwfXdSbDUQijKs7yUFJ2Z7m1rfpump';
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  return (
    <div>
      {isMediumOrLarger ? <Big handleCopy={handleCopy} copied={copied} ca={ca} /> : <Small handleCopy={handleCopy} copied={copied} ca={ca}/>}
    </div>
  );
}

export default App;