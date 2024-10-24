"use client";

import React, { useState, useEffect } from 'react';

interface LoadingStateProps {
  logging?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ logging }) => {
  const [dots, setDots] = useState('');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return '.';
        return prevDots + '.';
      });
    }, 250);

    const scaleInterval = setInterval(() => {
      setScale((prevScale) => prevScale === 1 ? 1.1 : 1);
    }, 500);

    return () => {
      clearInterval(dotInterval);
      clearInterval(scaleInterval);
    };
  }, []);

  return (
    <div className="flex items-center">
      <img
        src="/wizardlogo2xwhite.png"
        alt="logo"
        className="w-3 h-3 mr-2 transition-all duration-500 ease-in-out"
        style={{ transform: `scale(${scale})` }}
      />
      <span className='font-extralight text-sm text-neutral-400'>{logging}</span>
      <span className="w-6 text-left font-extralight text-neutral-400">{dots}</span>
    </div>
  );
};
