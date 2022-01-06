import React, { useState } from 'react'
import './Post.css'

import { Avatar } from '@mui/material'
import ComparePost from './ComparePost';
import CommentPanel from './CommentPanel';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import {useStateValue} from './StateProvider'
import db from './firebase'

function Post({
    profilePic,
    username,
    timestamp,
    message,
    context,
    imageLeft,
    imageRight,
    textLeft,
    textRight,
    votesLeft,
    votesRight,
    numLikes,
    comments,
    isComparison,
    postId,
    className}) {
    const [{ user }, dispatch] = useStateValue();
    const [toggleComment, setToogleComment] = useState(false);

    // Get user unique ID
    let uniqueUserId = user.uid;

    let classNamePost = null;
    if (className == null)
    {
        classNamePost = 'defaultPost';
    }
    else
    {
        classNamePost = className
    }

    let numComments = comments.length;
    let commentPanel = <CommentPanel commentsList={comments} postId={postId}/>

    function addLikeToPost(postId, addLike) {
        db.collection('posts')
        .doc(postId)
        .get()
        .then((doc) => {
            if (doc.exists)
            {
                let tmp = doc.data();
                if (addLike)
                {
                    tmp.numLikes = tmp.numLikes + 1;
                }
                else
                {
                    tmp.numLikes = Math.max(tmp.numLikes - 1, 0);
                }
                doc.ref.update(tmp);
            }
            else
            {
                console.log("Error post not found: " + postId);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    const handleLikePost = () => {
        // A user can only like/dislike a post, 
        // i.e., a user can only like a post once.
        // Steps:
        // 1 - Check if the user touched this post before: if not, add like
        // 2 - If the user touched this post before: negate like/dislike
        // 3 - Update user touched posts and post itself
        db.collection('users')
        .where("userId", "==", uniqueUserId)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length > 0)
            {
                const queryDoc = query.docs[0];
                let tmp = queryDoc.data();

                if (postId in tmp.touchedPosts)
                {
                    // Post has been touched by the user before: negate the like
                    let notPrevLike = !tmp.touchedPosts[postId]['like'];
                    tmp.touchedPosts[postId]['like'] = notPrevLike;
                    addLikeToPost(postId, notPrevLike);
                }
                else
                {
                    // Post has never been touched by the user before
                    tmp.touchedPosts[postId] = {'like': true};
                    addLikeToPost(postId, true);
                }

                // Update user touched posts
                queryDoc.ref.update(tmp);
            }
            else
            {
                // User does not exist
                console.log('Error user not found: ' + uniqueUserId);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    };

    return (
        <div className={classNamePost}>
            <div className='post__left'>
                <Avatar src={profilePic} className="post__avatar" />
            </div>

            <div className='post__right'>
                <div className='post__top'>
                    <div className='post__topInfo'>
                        <h4>{username}</h4>
                        <p>{new Date(timestamp?.toDate()).toUTCString()}</p>
                    </div>
                </div>

                <div className='post_bottom'>
                    <h4>{message}</h4>
                    <p>{context}</p>
                </div>

                <div className='post__image'>
                    {isComparison ? (
                        <ComparePost
                        imageLeft={imageLeft}
                        imageRight={imageRight}
                        textLeft={textLeft}
                        textRight={textRight}
                        votesLeft={votesLeft}
                        votesRight={votesRight}
                        postId={postId}
                        />
                    ) : (
                        <img src={imageLeft} alt=""/>
                    )}
                </div>

                <div className='post__options'>
                    <div className='post__option'>
                        <IconButton onClick={() => {
                                setToogleComment(!toggleComment)
                        }}> 
                            <ChatBubbleOutlineOutlinedIcon />
                        </IconButton>
                        <p>{numComments > 0 ? numComments : ''}</p>
                    </div>
                    <div className='post__option like__option'>
                        <IconButton onClick={() => handleLikePost()}>
                            <FavoriteBorderIcon />
                        </IconButton>
                        <p>{numLikes > 0 ? numLikes : ''}</p>
                    </div>
                    <div className='post__option'>
                        {/*<IconButton>
                            <IosShareOutlinedIcon />
                        </IconButton>*/}
                        <IosShareOutlinedIcon style={{color: "lightgray"}}/>
                    </div>
                </div>

                {toggleComment && commentPanel}

            </div>


        </div>
    )
}

export default Post
