import React, { useState } from 'react'
import './SocialApp.css'

import Header from './Header';
import Sidebar from './Sidebar';
import Feed from './Feed';
import Profile from './Profile';
import Widgets from './Widgets';

import {
    Routes,
    Route
} from "react-router-dom";

function SocialApp() {
    const [selectedPage, setSelectedPage] = useState("feed");

    return (
        <div className='socialApp'>
            {/* The header sticks on each page */}
            <Header />

            <div className='socialApp__content'>
                {/* Keep sidebar fixed */}
                <Sidebar selectedPage={selectedPage}/>

                <Routes>
                    {/* Personal profile*/}
                    <Route path="/profile" element={<Profile setSelectedPage={setSelectedPage}/>}/>

                    {/* Main App feed */}
                    <Route path="/" element={<Feed setSelectedPage={setSelectedPage}/>}/> 
                </Routes>

                {/* Keep widgets fixed */}
                <Widgets />
            </div>

        </div>
    )
}

export default SocialApp
