"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import "../../globals.css"
import { useRouter } from 'next/navigation'
import { IoChevronBack, IoChevronForward } from "react-icons/io5"

const Page = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const games = [
    {
      title: "PICK ONE",
      link: "/games/pick-one", 
      image: "/pick1Icon.png",
      description: "Test your film knowledge with our cinematic crossword puzzles.",
      h: 100,
      w: 100,
      color: "bg-violet-400"
    },
    {
      title: "CONNECTIONS",
      link: "/games/connections",
      image: "/connections.png", 
      description: "Find the connections between different movies, actors, and directors.",
      h: 75,
      w: 75,
      color: "bg-orange-400"
    },
    {
      title: "WHEEL",
      link: "/games/wheel",
      image: "/wheel.png",
      description: "Spin the wheel and answer questions about the randomly selected film.",
      h: 100,
      w: 100,
      color: "bg-violet-700"
    }
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  const currentGame = games[currentIndex];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${currentGame.color}`}>
      <div className='pt-8 flex justify-center items-center gap-8'>
        <Button 
          variant="ghost" 
          size="icon" 
          className='h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center'
          onClick={prevSlide}
        >
          <IoChevronBack className="h-4 w-4" />
        </Button>

        <div className='w-32 h-32 relative flex items-center justify-center'>
          <Image 
            src={currentGame.image} 
            alt={currentGame.title} 
            width={currentGame.w} 
            height={currentGame.h} 
            className="rounded-lg"
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className='h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center'
          onClick={nextSlide}
        >
          <IoChevronForward className="h-4 w-4" />
        </Button>
      </div>

      <div className='flex flex-col items-center justify-center mt-64 px-4 text-center'>
        <h1 className='text-5xl font-bold mb-6'>{currentGame.title}</h1>
        <p className='text-xl max-w-lg mb-8 mx-auto'>{currentGame.description}</p>
        <Button 
          onClick={() => router.push(currentGame.link)} 
          className='bg-white/90 hover:bg-white text-black w-64 rounded-full shadow-md text-lg py-6 mx-auto'
        >
          Play
        </Button>
      </div>
    </div>
  )
}

export default Page