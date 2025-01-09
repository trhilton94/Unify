import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';

import Home from './components/General/Home';
import ErrorPage from './components/General/ErrorPage';

import AmazonPage from 'components/Amazon/AmazonPage';
import CalendarPage from 'components/Calendar/CalendarPage';
import CollegeFootballPage from 'components/College Football/CollegeFootballPage';
import EpicGamesPage from 'components/Epic Games/EpicGamesPage';
import F1Page from 'components/F1/F1Page';
import GmailPage from 'components/Gmail/GmailPage';
import HuluPage from 'components/Hulu/HuluPage';
import NascarPage from 'components/NASCAR/NascarPage';
import NetflixPage from 'components/Netflix/NetflixPage';
import NewsPage from 'components/News/NewsPage';
import NFLPage from 'components/NFL/NFLPage';
import RocketLeaguePage from 'components/Rocket League/RocketLeaguePage';
import SmartHomePage from 'components/Smart Home/SmartHomePage';
import SteamPage from 'components/Steam/SteamPage';
import TwitchPage from 'components/Twitch/TwitchPage';
import WeatherPage from 'components/Weather/WeatherPage';
import YoutubePage from 'components/Youtube/YoutubePage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/amazon" element={<AmazonPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/college-football" element={<CollegeFootballPage />} />
            <Route path="/epic-games" element={<EpicGamesPage />} />
            <Route path="/f1" element={<F1Page />} />
            <Route path="/gmail" element={<GmailPage />} />
            <Route path="/hulu" element={<HuluPage />} />
            <Route path="/nascar" element={<NascarPage />} />
            <Route path="/netflix" element={<NetflixPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/nfl" element={<NFLPage />} />
            <Route path="/rocket-league" element={<RocketLeaguePage />} />
            <Route path="/smart-home" element={<SmartHomePage />} />
            <Route path="/steam" element={<SteamPage />} />
            <Route path="/twitch" element={<TwitchPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/youtube" element={<YoutubePage />} />

            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
}