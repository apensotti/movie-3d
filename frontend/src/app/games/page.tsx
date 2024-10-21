"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import "../globals.css" // Make sure to import the global CSS

interface GameCardProps {
  title: string;
  image: string;
  description: string;
}

const GameCard = ({ title, image, description }: GameCardProps) => (
  <div className="flex flex-col items-center w-64 rounded-lg p-4">
    <Image src={image} alt={title} width={200} height={200} className="rounded-lg mb-4 shadow-md" />
    <Button className='bg-orange-600 w-11/12 rounded-xl shadow-md'>Play Now</Button>
  </div>
)

const Page = () => {
  const games = [
    {
      title: "Pick One",
      image: "/PickOne2x.png",
      description: "Test your film knowledge with our cinematic crossword puzzles."
    },
    {
      title: "Connections",
      image: "/Connections2x.png",
      description: "Find the connections between different movies, actors, and directors."
    },
    {
      title: "Movie Roulette",
      image: "/Roulette2x.png",
      description: "Spin the wheel and answer questions about the randomly selected film."
    }
  ]

  return (
    <>
      <div className="background">
        <span></span>
        <span></span>
      </div>
      <div className='pt-32 pb-10 px-4 md:px-16 min-h-screen relative z-10'>
        <div className='flex-row flex items-center justify-center gap-2'>
          {games.map((game, index) => (
            <GameCard key={index} {...game} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Page
