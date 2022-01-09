import React from 'react'
import './DecisionPostComment.css'

import { Avatar } from '@mui/material'
import {useStateValue} from './StateProvider'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import db from './firebase'

function DecisionPostComment({commentPic, commentName, timestamp, commentMsg, image, postId}) {
    const [{ user, userProfile }, dispatch] = useStateValue();

    function handleRemoveComment() {
        db.collection('posts')
        .doc(postId)
        .get()
        .then((doc) => {
            // Get the post this comment belong to
            if (doc.exists) {
                // Remove the comment from the list of comments
                let tmp = doc.data();

                let idx = -1;
                for (let i = 0; i < tmp.commentList.length; i++) {
                    if (tmp.commentList[i]["username"] === commentName && tmp.commentList[i]["timestamp"] === timestamp)
                    {
                        idx = i;
                        break;
                    }
                }
                if (idx >= 0)
                {
                    // Remove the comment
                    tmp.commentList.splice(idx, 1);

                    // Update the document
                    doc.ref.update(tmp);
                }
            }
            else {
                console.log("Error post not found: " + postId);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

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
                <div className='comment__image'>
                    {image && <img src={image} alt=""/>}
                </div>
            </div>

            {/* Add cancel button only for comments written by the current user */}
            {userProfile.userName === commentName ? (
                <div className='decisionPostComment__cancel'>
                    <CancelOutlinedIcon onClick={handleRemoveComment}/>
                </div>
            ) : (
                null
            )}
        </div>
    )
}

export default DecisionPostComment
