import React from 'react'
import './DecisionPostComment.css'

import { Avatar } from '@mui/material'

function DecisionPostComment({commentPic, commentName, timestamp, commentMsg}) {
    return (
        <div className='decisionPostComment'>
            <div className='decisionPostComment__left'>
                <Avatar src={commentPic} sx={{ width: 32, height: 32 }} />
            </div>

            <div className='decisionPostComment__right'>
                <h5>{commentName}</h5>
                {/*<p className='comment__timestamp'>{new Date(timestamp?.toDate()).toUTCString()}</p>*/}
                <p className='comment__timestamp'>{timestamp}</p>
                <p>{commentMsg}</p>
            </div>
        </div>
    )
}

export default DecisionPostComment
