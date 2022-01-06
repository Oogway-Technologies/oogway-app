import React, { useState }  from 'react'
import './CommentPanel.css'

import DecisionPostComment from './DecisionPostComment';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Avatar, Button } from '@mui/material'
import {useStateValue} from './StateProvider'
import db from './firebase'

function CommentPanel({commentsList, postId}) {
    const [{ user }, dispatch] = useStateValue();
    const [input, setInput] = useState('')
    const [toggleAvatarIncognito, setToggleAvatarIncognito] = useState(false);
    const [incognitoOrUserPicUrl, setIncognitoOrUserPicUrl] = useState(user.photoURL);
    const [incognitoOrUserName, setIncognitoOrUserName] = useState(user.displayName);

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
                //let timestampServer = firebase.firestore.FieldValue.serverTimestamp();
                //console.log(timestampServer)
                //let timestampStr = new Date(timestampServer?.toDate()).toUTCString();
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
                        />))
                }
            </div>
            <div className='commentPanel__input'>
                <div className='commentPanel__inputLeft'>
                    <Avatar src={incognitoOrUserPicUrl} sx={{ width: 32, height: 32 }}/>
                </div>
                <div className='commentPanel__inputRight'>
                    <form>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='commentPanel__message'
                            placeholder="Write a comment..."
                        />

                        <Button onClick={handleSubmit} type="submit">
                            Post
                        </Button>

                        <div className='commentPanel__inputRightIncognito'
                            onClick={() => {
                                setToggleAvatarIncognito(!toggleAvatarIncognito);
                                if (!toggleAvatarIncognito) {
                                    setIncognitoOrUserName('Oogway_' + makeRandomSeed(5));
                                    setIncognitoOrUserPicUrl(`https://avatars.dicebear.com/api/pixel-art/${makeRandomSeed(8)}.svg`);
                                }
                                else
                                {
                                    setIncognitoOrUserName(user.displayName);
                                    setIncognitoOrUserPicUrl(user.photoURL);
                                }
                            }}
                        >
                            <AdminPanelSettingsOutlinedIcon fontSize="small" style={{ color: "orange"}} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CommentPanel
