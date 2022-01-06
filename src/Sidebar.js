import React from 'react'
import './Sidebar.css';

import SidebarRow from './SidebarRow';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
//import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import {useStateValue} from './StateProvider'
import {
    Link
} from "react-router-dom";
  
function Sidebar({selectedPage}) {
    const [{ user, userProfile }, dispatch] = useStateValue();

    let selectedProfile = (selectedPage === "profile");
    let selectedFeed = (selectedPage === "feed");

    return (
        <div className='sidebar'>
            <div className='sidebar__top'>
                <Link to="/socialApp/profile" style={{ textDecoration: 'none', color: "black" }}>
                    <SidebarRow
                        src={userProfile.userPic}
                        title={userProfile.userName}
                        selected={selectedProfile}/>
                </Link>
                <Link to="/socialApp/" style={{ textDecoration: 'none', color: "black"}}>
                    <SidebarRow
                        Icon={HomeOutlinedIcon}
                        IconSelected={HomeIcon}
                        title="Home"
                        selected={selectedFeed}/>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar
