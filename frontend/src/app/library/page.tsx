'use client';

import { useState } from 'react';
import { ChatInterface } from "@/components/ai/ChatInterface2";
import LibraryWatchlist from "../../components/component/LibraryWatchlist";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsChatDots, BsSearch } from 'react-icons/bs';
import "../globals.css"

export default function Page() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeInterface, setActiveInterface] = useState<'chat' | 'search'>('chat');

    const toggleInterface = () => {
        setActiveInterface(prev => prev === 'chat' ? 'search' : 'chat');
    };

    return (
        <>
            <div className="background">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="flex h-screen relative px-10 pt-24 pb-12 ">
                <div className={`transition-all duration-300 ease-in-out ${isChatOpen ? 'w-[50%]' : 'w-full'} h-full overflow-hidden z-20 shadow-lg`}>
                    <LibraryWatchlist />
                </div>
                <div className={`absolute top-24 right-9 h-[calc(100%-7rem)] transition-all duration-300 ease-in-out ${isChatOpen ? 'w-1/2' : 'w-0'} overflow-hidden z-10 pb-8`}>
                    <div className="h-full flex flex-col relative">
                        {isChatOpen && (
                            <button
                                onClick={toggleInterface}
                                className="absolute top-4 right-4 bg-violet-600 text-white p-2 rounded-full z-30"
                            >
                                {activeInterface === 'chat' ? <BsSearch /> : <BsChatDots />}
                            </button>
                        )}
                        <div className="flex-grow overflow-hidden">
                            {activeInterface === 'chat' ? (
                                <ChatInterface className="h-full rounded-xl bg-neutral-800" inputScale={125}/>
                            ) : (
                                <div className="h-full rounded-xl bg-neutral-800 flex items-center justify-center text-white text-2xl">
                                    SearchBar Placeholder
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="absolute top-1/2 right-9 transform -translate-y-1/2 shadow-lg bg-violet-600 text-white p-2 rounded-l-md z-30"
                >
                    {isChatOpen ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
            </div>
        </>
    );
}
