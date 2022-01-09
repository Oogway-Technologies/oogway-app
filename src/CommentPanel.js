import React, { useState }  from 'react'
import './CommentPanel.css'

import DecisionPostComment from './DecisionPostComment';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Avatar, Button } from '@mui/material'
import {useStateValue} from './StateProvider'
import { storage } from "./firebase";
import db from './firebase'

function CommentPanel({commentsList, postId}) {
    const [{ user, userProfile }, dispatch] = useStateValue();
    const [input, setInput] = useState('')
    const [toggleAvatarIncognito, setToggleAvatarIncognito] = useState(false);
    const [incognitoOrUserPicUrl, setIncognitoOrUserPicUrl] = useState(userProfile.userPic);
    const [incognitoOrUserName, setIncognitoOrUserName] = useState(userProfile.userName);
    const [targetValueVar, setTargetValueVar] = useState(null);

    // Create a random seed
    function makeRandomSeed(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        db.collection('posts')
        .doc(postId)
        .get()
        .then((doc) => {
            if (doc.exists)
            {
                var date = new Date();
                let timestampStr = date.toUTCString();
                let tmp = doc.data();
                tmp.commentList.push({
                    message: input,
                    profilePic: incognitoOrUserPicUrl,
                    timestamp: timestampStr,
                    username: incognitoOrUserName
                });
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

        // Reset the input
        setInput("");
    }

    const setMediaFile = (e) => {
        const file = e.target.files[0]
        const randomImagePrefix = makeRandomSeed(8);
        const randomImageName = randomImagePrefix + file.name;
        const ref = storage.ref(`/images/${userProfile.userId}/${randomImageName}`);
        const uploadTask = ref.put(file);

        uploadTask.on('stage_changed', console.log, console.error, () => {
            ref.getDownloadURL()
            .then((url) => {
                // Display media
                db.collection('posts')
                .doc(postId)
                .get()
                .then((doc) => {
                    if (doc.exists)
                    {
                        // Push new post
                        var date = new Date();
                        let timestampStr = date.toUTCString();
                        let tmp = doc.data();
                        tmp.commentList.push({
                            message: input,
                            profilePic: incognitoOrUserPicUrl,
                            timestamp: timestampStr,
                            username: incognitoOrUserName,
                            image: url
                        });
                        doc.ref.update(tmp);
                    }
                    
                    if (targetValueVar)
                    {
                        targetValueVar.target.value = ""
                    }
                });
            });
        });
    }


    return (
        <div className='commentPanel'>
            <div className='commentPanel__feed'>
                {
                    commentsList.map((comment, index) => (
                        <DecisionPostComment 
                            key={index}
                            commentPic={comment.profilePic}
                            commentName={comment.username}
                            timestamp={comment.timestamp}
                            commentMsg={comment.message}
                            image={comment.image}
                            postId={postId}
                        />))
                }
            </div>
            <div className='commentPanel__input'>
                <div className='commentPanel__inputLeft'>
                    <Avatar src={incognitoOrUserPicUrl} sx={{ width: 32, height: 32 }}/>
                </div>
                <div className='commentPanel__inputRight'>
                    <form>
                        <div className='commentPanel__inputText'>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className='commentPanel__message'
                                placeholder="Write a comment..."
                            />
                            
                            <div className='commentPanel__options'>
                                <input
                                    type='file'
                                    accept="image/*"
                                    style={{display: 'none'}}
                                    id="load_comment_media"
                                    onChange={(e) => {
                                        //e.preventDefault();
                                        setTargetValueVar(e);
                                        setMediaFile(e);
                                    }}
                                    onClick={(event)=> { 
                                        event.target.value = null
                                   }}
                                >
                                </input>
                                <label htmlFor="load_comment_media">
                                    <ImageOutlinedIcon
                                        fontSize="small"
                                        className='commentPanel__optionImg'
                                        onClick={() => {
                                            // handlePostImage();
                                        }}
                                    />
                                </label>

                                <AdminPanelSettingsOutlinedIcon
                                    fontSize="small"
                                    className='commentPanel__optionIncognito'
                                    onClick={() => {
                                        setToggleAvatarIncognito(!toggleAvatarIncognito);
                                        if (!toggleAvatarIncognito) {
                                            setIncognitoOrUserName('Oogway_' + makeRandomSeed(5));
                                            setIncognitoOrUserPicUrl(`https://avatars.dicebear.com/api/pixel-art/${makeRandomSeed(8)}.svg`);
                                        }
                                        else
                                        {
                                            setIncognitoOrUserName(userProfile.userName);
                                            setIncognitoOrUserPicUrl(userProfile.userPic);
                                        }
                                    }}
                                />
                                <SendOutlinedIcon
                                    fontSize="small"
                                    className='commentPanel__optionPost'
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                        <Button onClick={handleSubmit} type="submit" style={{display: "none"}}>
                            Post
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CommentPanel
