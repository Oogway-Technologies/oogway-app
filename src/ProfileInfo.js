import React from 'react'
import './ProfileInfo.css'

import { Avatar } from '@mui/material'

function ProfileInfo({profilePic, profileName, profileBio}) {
    return (
        <div className='profileInfo'>
            <div className='profileInfo__top'>
                <div className='profileInfo__pic'>
                    <Avatar src={profilePic}/>
                </div>
                <h1>{profileName}</h1>
            </div>

            <hr />

            <div className='profileInfo__center'>
                <p>{profileBio}</p>
            </div>

            <div className='profile__sep'>
            </div>
        </div>
    )
}

export default ProfileInfo
