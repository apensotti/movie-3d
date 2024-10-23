"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import "../globals.css"
import { useRouter } from 'next/navigation'

interface GameCardProps {
  title: string;
  image: string;
  description: string;
  h: number;
  w: number;
  color: string;
  link: string;
  router: any;
}

const GameCard: React.FC<GameCardProps> = ({ title, router, image, link, h, w, color, description }) => (
  <div className="flex flex-col items-center w-64 rounded-lg bg-neutral-850 shadow-md rounded-b-2xl">
    <div className='w-full flex flex-col justify-center items-center'>
      <div className={`${color} rounded-t-lg w-full h-44 flex justify-center items-center`}>
        <div className={`relative flex justify-center items-center ${title === "CONNECTIONS" ? 'w-3/4 h-3/4' : 'w-full h-full'}`}>
          <Image src={image} alt={title} width={w} height={h} objectFit="contain" className="rounded-lg" />
        </div>
      </div>
      <p className='font-bold text-lg pt-6 pb-1'>{title}</p>
      <div className='px-2 h-24'>
        <p className='font-light text-sm text-center pb-8'>{description}</p>
      </div>
      <Button onClick={() => router.push(link)} className='bg-orange-600 w-full rounded-full shadow-md'>Play</Button>
    </div>
  </div>
)

const Page = () => {
  const router = useRouter();
  const games = [
    {
      title: "PICK ONE",
      link: "/games/pick-one",
      image: "/pick1Icon.png",
      description: "Test your film knowledge with our cinematic crossword puzzles.",
      h: 100,
      w: 100,
      color: "bg-blue-300"
    },
    {
      title: "CONNECTIONS",
      link: "/games/connections",
      image: "/connections.png",
      description: "Find the connections between different movies, actors, and directors.",
      h: 75,
      w: 75,
      color: "bg-orange-300"
    },
    {
      title: "WHEEL",
      link: "/games/wheel",
      image: "/wheel.png",
      description: "Spin the wheel and answer questions about the randomly selected film.",
      h: 100,
      w: 100,
      color: "bg-violet-300"
    },
    {
      title: "CONNECTIONS",
      link: "/games/connections",
      image: "/connections.png",
      description: "Find the connections between different movies, actors, and directors.",
      h: 75,
      w: 75,
      color: "bg-red-300"
    },
    {
      title: "WHEEL",
      link: "/games/wheel",
      image: "/wheel.png",
      description: "Spin the wheel and answer questions about the randomly selected film.",
      h: 100,
      w: 100,
      color: "bg-green-300"
    },
    {
      title: "PICK ONE",
      link: "/games/pick-one",
      image: "/pick1Icon.png",
      description: "Test your film knowledge with our cinematic crossword puzzles.",
      h: 100,
      w: 100,
      color: "bg-yellow-200"
    },
    {
      title: "PICK ONE",
      link: "/games/pick-one",
      image: "/pick1Icon.png",
      description: "Test your film knowledge with our cinematic crossword puzzles.",
      h: 100,
      w: 100,
      color: "bg-orange-200"
    },
    {
      title: "WHEEL",
      link: "/games/wheel",
      image: "/wheel.png",
      description: "Spin the wheel and answer questions about the randomly selected film.",
      h: 100,
      w: 100,
      color: "bg-blue-300"
    },
  ]

  return (
    <div className='h-screen pt-28 bg-neutral-900'>
      <div className='w-full h-[calc(100vh-7rem)] overflow-y-auto'>
        <div className='flex justify-center items-start'>
          <div className='grid grid-cols-3 auto-rows-max gap-10 max-w-5xl mx-auto'>
            {games.map((game, index) => (
              <GameCard key={index} {...game} router={router} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page