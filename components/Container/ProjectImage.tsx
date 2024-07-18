import React, { useState } from 'react';
import Image from 'next/image'; // Import the Image component from next/image



type Props = {
  contract: string,
};


const ProjectImageComponent = ({contract}:Props) => {

  

  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };

  const handleMouseOut = () => {
    setIsMouseOver(false);
  };

  return (
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            transition: 'box-shadow 0.3s ease', // Add a smooth transition for the glow effect
          }}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        > 
        {contract && (
        <Image 
            src={`/projectImages/${contract}.png`}
            alt="ETCALPHA Project Image"
            style={{
              width: '145px',
              height: 'auto',
              border: '4px solid #fff',
              borderRadius: '10px',
              boxShadow: isMouseOver ? '0 0 20px rgba(255, 255, 255, 0.7)' : '0 0 10px rgba(255, 255, 255, 0.7)',
              gap: "1em",
              margin: ".25em",
              background: "#000",
            }}
        />
          
        )}
        </div>
  );
};

export default ProjectImageComponent;
