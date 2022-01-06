import { Avatar } from '@mui/material'
import React from 'react'
import "./Header.css"

import Logo from './Logo'
import {useStateValue} from './StateProvider'
import {
    Link
} from "react-router-dom";

export default function Header() {
    const [{ user, userProfile }, dispatch] = useStateValue();

    return (
        <div className='header'>
            <Link to="/" style={{ textDecoration: 'none', color: "black"}}>
                <div className='header__left'>
                    <Logo />
                </div>
            </Link>

            <div className='header__center'>
                {/* Empty for now... */}
            </div>

            <div className='header__right'>
                <Link to="/socialApp/profile" style={{ textDecoration: 'none', color: "black"}}>
                    <div className='header__info'>
                        <Avatar src={userProfile.userPic}/>
                        <h4>{userProfile.userName}</h4>
                    </div>
                </Link>
            </div>
        </div>
    )
}
