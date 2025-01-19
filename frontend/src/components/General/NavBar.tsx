import React, { useState } from 'react';

import menu from '@material-design-icons/svg/round/menu.svg';
import settings from '@material-design-icons/svg/round/settings.svg';
import light from '@material-design-icons/svg/round/light_mode.svg';
import dark from '@material-design-icons/svg/round/dark_mode.svg';

import { useGeneral } from 'contexts/GeneralProvider';

export default function Navbar() {
    const { general, setGeneral } = useGeneral();

    const toggleCategoriesDropdown = () => {
        setGeneral((prevState) => ({
            ...prevState,
            categoryDropdownState: !prevState.categoryDropdownState,
            settingsIconVisibilityState: !prevState.settingsIconVisibilityState,
            settingsDropdownState: false,
        }));
    };

    const toggleSettingsDropdown = () => {
        setGeneral((prevState) => ({
            ...prevState,
            settingsDropdownState: !prevState.settingsDropdownState,
        }));
    };

    const toggleDarkMode = () => {
        const newState = !general.darkModeState;

        if (newState) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        setGeneral((prevState) => ({
            ...prevState,
            darkModeState: newState,
        }));
    };

    return (
        <nav
            className={`relative transition-colors shadow-lg duration-300 ${general.darkModeState ? 'bg-[#212121] text-white border-b border-t border-[white]' : 'bg-[#F5F5F5] text-black border-b border-t border-[black]'}`}
        >
            <div className="w-full flex items-center justify-between p-2">
                <a
                    href="/"
                    className="font-bold flex items-center space-x-1 pl-4"
                >
                    <img
                        src={
                            general.darkModeState
                                ? '/navbarlogo_dark.svg'
                                : '/navbarlogo_light.svg'
                        }
                        alt="Unify Logo"
                        className="h-8 w-auto relative -translate-y-0.25"
                    />
                    <span
                        className={`text-[26px] transition-colors duration-300 ${general.darkModeState ? 'text-white' : 'text-black'}`}
                    >
                        UNiFY
                    </span>
                </a>

                <div className="hidden 2xl:flex justify-center w-full space-x-6 pr-4 text-[17px] font-semibold">
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
                    className="2xl:hidden focus:outline-none absolute left-1/2 transform -translate-x-3.5"
                    onClick={toggleCategoriesDropdown}
                >
                    <img
                        src={menu}
                        alt="Hamburger Icon"
                        className={`h-8 transition-colors duration-300 ${general.darkModeState ? 'invert' : ''}`}
                    />
                </button>

                {general.settingsIconVisibilityState && (
                    <button
                        className="focus:outline-none ml-4"
                        onClick={toggleSettingsDropdown}
                    >
                        <img
                            src={settings}
                            alt="Settings Icon"
                            className={`h-7 transition-colors duration-300 ${general.darkModeState ? 'invert' : ''}`}
                        />
                    </button>
                )}
            </div>

            {general.settingsDropdownState && (
                <div
                    className={`absolute right-0 p-2 flex flex-col items-center shadow-lg w-64 z-50 transition-colors duration-300 ${
                        general.darkModeState
                            ? 'bg-[#212121] text-white border-b border-l border-[white]'
                            : 'bg-[#F5F5F5] text-black border-b border-l border-[black]'
                    }`}
                >
                    <div className="p-1">
                        <h2 className="text-lg font-bold mb-2">Settings</h2>
                    </div>
                    <div className="flex items-center justify-between w-full px-4 py-2">
                        <span className="text-sm font-medium">
                            {general.darkModeState ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center rounded-full p-1 w-14 h-8 relative transition-colors duration-300 ${
                                general.darkModeState
                                    ? 'bg-[white]'
                                    : 'bg-[black]'
                            }`}
                        >
                            <div
                                className={`absolute top-0.5 transition-transform duration-300 ${
                                    general.darkModeState
                                        ? 'translate-x-6 translate-y-0.5'
                                        : 'translate-x-0 translate-y-0.5'
                                }`}
                            >
                                <img
                                    src={general.darkModeState ? dark : light}
                                    alt={
                                        general.darkModeState
                                            ? 'Dark Mode'
                                            : 'Light Mode'
                                    }
                                    className={`h-6 w-6 transition-colors duration-300 ${general.darkModeState ? '' : 'invert'}`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {general.categoryDropdownState && (
                <div
                    className={`2xl:hidden p-2 flex flex-col items-center shadow-lg font-semibold transition-colors duration-300 ${
                        general.darkModeState
                            ? 'bg-[#212121] text-white'
                            : 'bg-[#F5F5F5] text-black'
                    }`}
                >
                    <a href="/" className="block hover:text-blue-300 p-1">
                        Home
                    </a>
                    <a href="/amazon" className="block hover:text-blue-300 p-1">
                        Amazon
                    </a>
                    <a
                        href="/calendar"
                        className="block hover:text-blue-300 p-1"
                    >
                        Calendar
                    </a>
                    <a
                        href="/college-football"
                        className="block hover:text-blue-300 p-1"
                    >
                        College Football
                    </a>
                    <a
                        href="/epic-games"
                        className="block hover:text-blue-300 p-1"
                    >
                        Epic Games
                    </a>
                    <a href="/gmail" className="block hover:text-blue-300 p-1">
                        Gmail
                    </a>
                    <a href="/hulu" className="block hover:text-blue-300 p-1">
                        Hulu
                    </a>
                    <a
                        href="/netflix"
                        className="block hover:text-blue-300 p-1"
                    >
                        Netflix
                    </a>
                    <a href="/news" className="block hover:text-blue-300 p-1">
                        News
                    </a>
                    <a href="/nfl" className="block hover:text-blue-300 p-1">
                        NFL
                    </a>
                    <a
                        href="/rocket-league"
                        className="block hover:text-blue-300 p-1"
                    >
                        Rocket League
                    </a>
                    <a
                        href="/smart-home"
                        className="block hover:text-blue-300 p-1"
                    >
                        Smart Home
                    </a>
                    <a href="/steam" className="block hover:text-blue-300 p-1">
                        Steam
                    </a>
                    <a href="/twitch" className="block hover:text-blue-300 p-1">
                        Twitch
                    </a>
                    <a
                        href="/weather"
                        className="block hover:text-blue-300 p-1"
                    >
                        Weather
                    </a>
                    <a
                        href="/youtube"
                        className="block hover:text-blue-300 p-1"
                    >
                        YouTube
                    </a>
                </div>
            )}
        </nav>
    );
}
