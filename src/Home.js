import React from 'react'
import './Home.css'

import AppStore from './AppStore';
import SocialApp from './SocialApp';
import {useStateValue} from './StateProvider'
import {
    Routes,
    Route
} from "react-router-dom";

function Home() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className='home'>
            {/*<Sidebar />*/}

            <Routes>
                {/* Personal profile*/}
                {/*<Route path="/profile" element={<Profile />}/>*/}

                {/* Main App feed */}
                {/*<Route path="/feed" element={<Feed />}/>*/}

                {/* Main App feed */}
                <Route path="/socialApp/*" element={<SocialApp />}/> 

                {/* Main App entry point */}
                <Route path="/" element={<AppStore />}/> 
            </Routes>
            
            {/*<Widgets />*/}
        </div>
    )
}

export default Home
