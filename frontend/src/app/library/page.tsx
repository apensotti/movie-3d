'use client';

import { useState } from 'react';
import { ChatInterface } from "@/components/ai/ChatInterface";
import LibraryWatchlist from "../../components/component/LibraryWatchlist";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Page() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="flex h-screen relative px-16 pt-28 pb-12">
            <div className={`transition-all duration-300 ease-in-out ${isChatOpen ? 'w-[50%]' : 'w-full'} h-full overflow-hidden z-20`}>
                <LibraryWatchlist />
            </div>
            <div className={`absolute top-28 right-16 h-[calc(100%-7rem)] transition-all duration-300 ease-in-out ${isChatOpen ? 'w-1/2' : 'w-0'} overflow-hidden z-10 pb-12`}>
                <div className="h-full flex flex-col">
                    <div className="flex-grow overflow-hidden">
                        <ChatInterface className="h-full rounded-xl bg-neutral-800" inputScale={125}/>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="absolute top-1/2 right-16 transform -translate-y-1/2 bg-violet-600 text-white p-2 rounded-l-md z-30"
            >
                {isChatOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
        </div>
    );
}
