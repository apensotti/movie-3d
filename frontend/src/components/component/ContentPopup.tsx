"use client";

import { omdb } from '../../data/types';
import React, { RefAttributes, useState } from 'react';
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // Arrow icons for toggling

interface ContentPopupProps {
  movies?: omdb[]; 
  messages?: {
    type: string;
    content : string;
  }[];
}


interface ContentPopupProps {
  children: React.ReactNode;
}

const ContentPopup: React.FC<ContentPopupProps> = ({ children }) => {
  const [menuToggle, setMenuToggle] = useState(false);
  const toggleMovieMenu = () => {
    setMenuToggle(!menuToggle);
  };

  return (
    <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 w-110 scale-110 z-40 overflow-hidden transition-all duration-1 ${menuToggle ? 'h-100' : 'h-9'}`}>
      <div className={`absolute bottom-5 left-1/2 transform -translate-x-64 w-110 h-96 transition-transform duration-400 ease-in-out ${menuToggle ? '-translate-y-0' : 'translate-y-full'}`}>
        <button 
          onClick={toggleMovieMenu} 
          className="absolute left-1/2 transform translate-x-40 -top-5 z-30 text-white p-2 rounded-full"
        >
          {menuToggle ? <FiChevronDown size={24} className='-translate-y-3'/> : <FiChevronUp size={24} className='-translate-y-3'/>}
        </button>
        <div className={`absolute left-1/2 transform -translate-x-60 w-102 h-96 bg-neutral-800 overflow-hidden rounded-2xl no-scrollbar`}>
          <div className='overflow-y-scroll w-full h-full no-scrollbar z-30'>
            {menuToggle && children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPopup;
