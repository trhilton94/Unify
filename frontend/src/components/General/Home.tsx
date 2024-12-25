import React from "react";

import WeatherWidget from "../Weather/WeatherWidget";
import Navbar from "./NavBar";

export default function Home() {
    return (
        <div>
            <Navbar />
            <WeatherWidget />
        </div>
    );
}