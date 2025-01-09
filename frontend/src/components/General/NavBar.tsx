import React, { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-[#242426] text-white">
            <div className="w-full flex items-center justify-between p-2">
                <a
                    href="/"
                    className="font-bold flex items-center space-x-1 pl-4"
                >
                    <span className="flex items-center mb-1.5">
                        <span className="text-3xl">&lt;</span>
                        <span className="text-xl font-xl">∑</span>
                        <span className="text-3xl">&gt;</span>
                    </span>
                    <span className="text-white text-[26px]">UNiFY</span>
                </a>

                <div className="hidden md:flex space-x-6 ml-auto pr-4 text-[17px] font-semibold">
                    <a href="/amazon" className="hover:text-blue-300">
                        Amazon
                    </a>
                    <a href="/calendar" className="hover:text-blue-300">
                        Calendar
                    </a>
                    <a href="/college-football" className="hover:text-blue-300">
                        College Football
                    </a>
                    <a href="/epic-games" className="hover:text-blue-300">
                        Epic Games
                    </a>
                    <a href="/f1" className="hover:text-blue-300">
                        F1
                    </a>
                    <a href="/gmail" className="hover:text-blue-300">
                        Gmail
                    </a>
                    <a href="/hulu" className="hover:text-blue-300">
                        Hulu
                    </a>
                    <a href="/nascar" className="hover:text-blue-300">
                        Nascar
                    </a>
                    <a href="/netflix" className="hover:text-blue-300">
                        Netflix
                    </a>
                    <a href="/news" className="hover:text-blue-300">
                        News
                    </a>
                    <a href="/nfl" className="hover:text-blue-300">
                        NFL
                    </a>
                    <a href="/rocket-league" className="hover:text-blue-300">
                        Rocket League
                    </a>
                    <a href="/smart-home" className="hover:text-blue-300">
                        Smart Home
                    </a>
                    <a href="/steam" className="hover:text-blue-300">
                        Steam
                    </a>
                    <a href="/twitch" className="hover:text-blue-300">
                        Twitch
                    </a>
                    <a href="/weather" className="hover:text-blue-300">
                        Weather
                    </a>
                    <a href="/youtube" className="hover:text-blue-300">
                        YouTube
                    </a>
                </div>

                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                                isOpen
                                    ? 'M6 18L18 6M6 6l12 12'
                                    : 'M4 6h16M4 12h16M4 18h16'
                            }
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden bg-[#242426] space-y-2 p-4">
                    <a href="/home" className="block hover:text-blue-300">
                        Home
                    </a>
                    <a href="/amazon" className="block hover:text-blue-300">
                        Amazon
                    </a>
                    <a href="/calendar" className="block hover:text-blue-300">
                        Calendar
                    </a>
                    <a
                        href="/college-football"
                        className="block hover:text-blue-300"
                    >
                        College Football
                    </a>
                    <a href="/epic-games" className="block hover:text-blue-300">
                        Epic Games
                    </a>
                    <a href="/gmail" className="block hover:text-blue-300">
                        Gmail
                    </a>
                    <a href="/hulu" className="block hover:text-blue-300">
                        Hulu
                    </a>
                    <a href="/netflix" className="block hover:text-blue-300">
                        Netflix
                    </a>
                    <a href="/news" className="block hover:text-blue-300">
                        News
                    </a>
                    <a href="/nfl" className="block hover:text-blue-300">
                        NFL
                    </a>
                    <a
                        href="/rocket-league"
                        className="block hover:text-blue-300"
                    >
                        Rocket League
                    </a>
                    <a href="/smart-home" className="block hover:text-blue-300">
                        Smart Home
                    </a>
                    <a href="/steam" className="block hover:text-blue-300">
                        Steam
                    </a>
                    <a href="/twitch" className="block hover:text-blue-300">
                        Twitch
                    </a>
                    <a href="/weather" className="block hover:text-blue-300">
                        Weather
                    </a>
                    <a href="/youtube" className="block hover:text-blue-300">
                        YouTube
                    </a>
                </div>
            )}
        </nav>
    );
}