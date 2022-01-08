import React from 'react'
import './Login.css'

import { auth, provider } from "./firebase"
import {actionTypes} from './reducer'
import {useStateValue} from './StateProvider'
import LogoLogin from './LogoLogin'
import discordIcon from './icons/discord.png'
import githubIcon from './icons/github.png'
// import metamaskIcon from './icons/metamask_logo.png'
import db from './firebase'

function Login() {
    const [state, dispatch] = useStateValue();

    function addNewUserMapping(userUniqueId) {
        db.collection('users').add({
            userId: userUniqueId,
            userPosts: [],
            touchedPosts: {},
            userProfile: {
                userId: userUniqueId
            }
        });
    }

    function handleSetUserProfile(user, userUniqueId) {
        db.collection('users')
        .where("userId", "==", userUniqueId)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length === 1)
            {
                let tmp = query.docs[0].data();

                // A valid profile has the userId + other info
                // Object.keys(tmp.userProfile).length !== 0
                if ('userName' in tmp.userProfile)
                {
                    // Good to go, the profile is setup.
                    if (!('userId' in tmp.userProfile))
                    {
                        // Add this info for the future
                        tmp.userProfile['userId'] = userUniqueId;
                        query.docs[0].ref.update(tmp);
                    }

                    // Dispatch active profile
                    dispatch({
                        type: actionTypes.SET_PROFILE,
                        user: user,
                        userProfile: tmp.userProfile
                    })
                }
                else
                {
                    // Dispatch the login to actually enable login
                    dispatch({
                        type: actionTypes.SET_USER,
                        user: user
                    })
                }
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    function handleFirstTimeLogin(userUniqueId) {
        db.collection('users')
        .where("userId", "==", userUniqueId)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length === 0)
            {
                // User does not exist: add a new entry to the DB
                addNewUserMapping(userUniqueId);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    const signInWithGoogle = () => {
        // Sign In
        auth.signInWithPopup(provider)
        .then(result => {

            // Handle first time login
            handleFirstTimeLogin(result.user.uid);

            // Set user profile, if present
            handleSetUserProfile(result.user, result.user.uid)

        }).catch(error => alert(error.message));
    };

    const googleLogo = "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";

    return (
        <div className='login'>
            <LogoLogin />

            <div className='login__info'>
                <div className='login__infoText'>
                    <h2>A note...</h2>
                    <p>
                        This is a demo of Oogway's AI and social features. This demo is best experienced on a desktop. Note, it is research in progress so expect some downtimes
                        and malfunctions.<br/><br/>
                        If you'd like to contribute to Oogway, join our Discord or checkout our GitHub 
                        repositories! 
                    </p>
                </div>
                <div className='login__icons'>
                    <div className='login__icon'>
                        <img
                            src={discordIcon}
                            onClick={()=> window.open("https://discord.gg/uwRYDcsxXy", "_blank")}
                            alt=""
                        />
                    </div>
                    <div className='login__icon'>
                        <img
                            src={githubIcon}
                            onClick={()=> window.open("https://github.com/Oogway-Technologies", "_blank")}
                            alt=""
                        />
                    </div>
                </div>
            </div>
            
            <div className='loggin_footer'>
                <div className='login__button login__google' onClick={signInWithGoogle}>
                    <img
                        src={googleLogo}
                        alt=""
                    />
                    <div className='login__buttonText'>
                        <p>Sign in with Google</p>
                    </div>
                </div>
                {/*
                // Cool stuff here...
                <div className='login__button login__metamask' onClick={signInWithMetaMask}>
                    <img
                        src={metamaskIcon}
                        alt=""
                    />
                    <div className='login__buttonText'>
                        <p>Sign in with MetaMask</p>
                    </div>
                </div>
                */}
            </div>
        </div>
    )
}

export default Login
