import React, { useState } from 'react'
import './DecisionSender.css';

import { Avatar, Button } from '@mui/material'
import DecisionContext from './DecisionContext';
import DecisionContextMedia from './DecisionContextMedia';

import CompareIcon from '@mui/icons-material/Compare';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {useStateValue} from './StateProvider'
import db from './firebase'
import firebase from 'firebase/compat/app';
import { storage } from "./firebase";

function DecisionSender() {
    // Get the current user from the global state
    const [{ user, userProfile }, dispatch] = useStateValue();

    // Local temporary variables
    let userName = userProfile.userName.split(/[ ,]+/);

    // Local variables
    const [input, setInput] = useState('')
    const [mediaUrl, setMediaUrl] = useState('');
    const [toggleOption, setToogleOption] = useState(0);
    const [toggleOptionDisplay, setToggleOptionDisplay] = useState(false);
    const [toggleAvatarIncognito, setToggleAvatarIncognito] = useState(false);
    const [incognitoOrUserPicUrl, setIncognitoOrUserPicUrl] = useState(userProfile.userPic);
    const [incognitoOrUserName, setIncognitoOrUserName] = useState(userName[0]);
    const [incognitoOrUserNamePost, setIncognitoOrUserNamePost] = useState(userProfile.userName);
    const [isComparisonContext, setIsComparisonContext] = useState(false);

    // Set a variable to keep track of the event "laod file".
    // This will allow us to re-load the same image after the first
    // time around the media context was closed
    const [targetValueVar, setTargetValueVar] = useState(null);

    // Child comparison context media
    const [urlContextImageLeft, setUrlContextImageLeft] = useState('')
    const [urlContextImageRight, setUrlContextImageRight] = useState('')
    const [inputContexttextLeft, setInputContexttextLeft] = useState('')
    const [inputContexttextRight, setInputContexttextRight] = useState('')

    // Child toggle context and set context message
    const [toggleContext, setToogleContext] = useState(false);
    const [contextMessage, setContextMessage] = useState('');

    // Get user unique ID
    let uniqueUserId = user.uid;

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

    function updateUserDB(docId) {
        db.collection('users')
        .where("userId", "==", uniqueUserId)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length > 0)
            {
                const queryDoc = query.docs[0];
                let tmp = queryDoc.data();
                tmp.userPosts.push(docId);
                queryDoc.ref.update(tmp);
            }
            else
            {
                console.log("Error user not found: " + uniqueUserId);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    function switchOnOffOptionDisplay(onOffFlag)
    {
        // Every toggle (it happens on close), reset the content of the URLs
        setToogleOption(0);
        setUrlContextImageLeft("");
        setUrlContextImageRight("");
        setInputContexttextLeft("");
        setInputContexttextRight("");
        setMediaUrl("");
        setToggleOptionDisplay(onOffFlag);

        // Reset the target value that was triggered by the change "load-file"
        if (targetValueVar)
        {
            targetValueVar.target.value = ""
        }
    }

    const setMediaFile = (e) => {
        const file = e.target.files[0]
        const randomImagePrefix = makeRandomSeed(8);
        const randomImageName = randomImagePrefix + file.name;
        const ref = storage.ref(`/images/${uniqueUserId}/${randomImageName}`);
        const uploadTask = ref.put(file);
        uploadTask.on('stage_changed', console.log, console.error, () => {
            ref.getDownloadURL()
            .then((url) => {
                // Set media URL
                setMediaUrl(url);

                // This is a standard post with media
                setIsComparisonContext(false);
            });
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check if there is a message.
        // If not, notify the user and return
        if (input === "")
        {
            alert("Looks like this is post as no message!");
            return;
        }

        let mediaUrlOrComparisonUrl = mediaUrl;
        if (isComparisonContext)
        {
            // Replace the media URL with image left
            mediaUrlOrComparisonUrl = urlContextImageLeft;
        }

        db.collection('posts').add({
            profilePic: incognitoOrUserPicUrl,
            username: incognitoOrUserNamePost,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            context: contextMessage,
            imageLeft: mediaUrlOrComparisonUrl,
            imageRight: urlContextImageRight,
            textLeft: inputContexttextLeft,
            textRight: inputContexttextRight,
            votesLeft: 0,
            votesRight: 0,
            numLikes: 0,
            numComments: 0,
            isComparison: isComparisonContext,
            isIncognito: toggleAvatarIncognito,
            commentList: [],
            userId: uniqueUserId
        })
        .then((docRef) => {
            // For each new document added to the DB,
            // keep track of the mapping [user_id, db_entry]
            // console.log("Document written with ID: ", docRef.id);
            updateUserDB(docRef.id)
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

        setInput("");
        setContextMessage("");
        setToogleContext(false);
        setUrlContextImageLeft("");
        setUrlContextImageRight("");
        setInputContexttextLeft("");
        setInputContexttextRight("");
        setToogleOption(0);
        setMediaUrl("");
        setToggleOptionDisplay(false);
        setIsComparisonContext(false);
    }

    return (
        <div className='decisionSender'>
            <div className='decisionSender__left'>
                <Avatar src={incognitoOrUserPicUrl}/>
            </div>

            <div className='decisionSender__right'>
                <div className='decisionSender__top'>
                    <form>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='decisionSender_input'
                            placeholder={`What are you deciding, ${incognitoOrUserName}?`}
                        />
                        <button onClick={handleSubmit} type="submit">
                            Hidden submit
                        </button>
                    </form>
                </div>

                <div className='decisionSender__center'>
                    <DecisionContext
                        toggleContext={toggleContext}
                        setToogleContext={setToogleContext}
                        onChangeContextMsg={setContextMessage}
                    />
                </div>

                <div className='decisionSender__centerMedia'>
                    <DecisionContextMedia
                        toggleOption={toggleOption}
                        toggleOptionDisplay={toggleOptionDisplay}
                        mediaUrl={mediaUrl}
                        onSetDecisionImageUrlLeft={setUrlContextImageLeft}
                        onSetDecisionImageUrlRight={setUrlContextImageRight}
                        toggleOptionDisplayFcn={switchOnOffOptionDisplay}
                        onSetDecisionTextInputLeft={setInputContexttextLeft}
                        onSetDecisionTextInputRight={setInputContexttextRight}
                    />
                </div>

                <div className='decisionSender__bottom'>
                    <div className='decisionSender__bottomLeft'>
                        <input
                            type='file'
                            accept="image/*"
                            style={{display: 'none'}}
                            id="load-media"
                            onChange={(e) => {
                                // This is a standard post
                                // Store the event e in order to reset it if the user
                                // clicks on the close button
                                setTargetValueVar(e);
                                setToogleOption(1);
                                setMediaFile(e);
                                setToggleOptionDisplay(true);
                            }}    
                        />
                        <label htmlFor="load-media">
                            <div className='decisionSender__option'>
                                <ImageOutlinedIcon style={{ color: "var(--oogway-color-elements)", marginRight: "8px"}} />
                                <h3>Image</h3>
                            </div>
                        </label>
                        
                        <label>
                            <div className='decisionSender__option'
                                onClick={() => {
                                    // This is a comparison context
                                    setToogleOption(2);
                                    setIsComparisonContext(true);
                                    setToggleOptionDisplay(true);
                                }}
                            >
                                <CompareIcon style={{ color: "var(--oogway-color-elements)", marginRight: "8px"}} />
                                <h3>Compare</h3>
                            </div>
                        </label>
                        
                        <label>
                            <div className='decisionSender__option option__right'
                                onClick={() => {
                                    setToggleAvatarIncognito(!toggleAvatarIncognito);
                                    if (!toggleAvatarIncognito) {
                                        var randomName = 'Oogway_' + makeRandomSeed(5);
                                        setIncognitoOrUserName(randomName);
                                        setIncognitoOrUserNamePost(randomName);
                                        setIncognitoOrUserPicUrl(`https://avatars.dicebear.com/api/pixel-art/${makeRandomSeed(8)}.svg`);
                                    }
                                    else
                                    {
                                        setIncognitoOrUserName(userName[0]);
                                        setIncognitoOrUserNamePost(userProfile.userName);
                                        setIncognitoOrUserPicUrl(userProfile.userPic);
                                    }
                                }}
                            >
                                <AdminPanelSettingsOutlinedIcon style={{ color: "orange", marginRight: "8px"}} />
                                <h3>Incognito</h3>
                            </div>
                        </label>
                    </div>

                    <div className='decisionSender__bottomRight'>
                        <Button
                            className="decisionSender___askButton"
                            onClick={handleSubmit}
                            type="submit">
                            Ask
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DecisionSender
