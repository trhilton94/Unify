import React from 'react';

import Navbar from './NavBar';
import AmazonWidget from 'components/Amazon/AmazonWidget';
import CalendarWidget from 'components/Calendar/CalendarWidget';
import CollegeFootballWidget from 'components/College Football/CollegeFootballWidget';
import EpicGamesWidget from 'components/Epic Games/EpicGamesWidget';
import F1Widget from 'components/F1/F1Widget';
import GmailWidget from 'components/Gmail/GmailWidget';
import HuluWidget from 'components/Hulu/HuluWidget';
import NascarWidget from 'components/NASCAR/NascarWidget';
import NetflixWidget from 'components/Netflix/NetflixWidget';
import NewsWidget from 'components/News/NewsWidget';
import NFLWidget from 'components/NFL/NFLWidget';
import RocketLeagueWidget from 'components/Rocket League/RocketLeagueWidget';
import SmartHomeWidget from 'components/Smart Home/SmartHomeWidget';
import SteamWidget from 'components/Steam/SteamWidget';
import TwitchWidget from 'components/Twitch/TwitchWidget';
import WeatherWidget from '../Weather/WeatherWidget';
import YoutubeWidget from 'components/Youtube/YoutubeWidget';

export default function Home() {
    return (
        <div>
            <Navbar />
            <WeatherWidget />
        </div>
    );
}