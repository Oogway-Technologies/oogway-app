import React from 'react'
import './Home.css'

import AppStore from './AppStore';
import SocialApp from './SocialApp';
import UserProfileSignUp from './UserProfileSignUp';
import {useStateValue} from './StateProvider'
import {
    Routes,
    Route
} from "react-router-dom";

function Home() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className='home'>
            <Routes>
                {/* Signup */}
                <Route path="/signup" element={<UserProfileSignUp />}/>

                {/* Main App feed */}
                <Route path="/socialApp/*" element={<SocialApp />}/> 

                {/* Main App entry point */}
                <Route path="/" element={<AppStore />}/> 
            </Routes>
        </div>
    )
}

export default Home
