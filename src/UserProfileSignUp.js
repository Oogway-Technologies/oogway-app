import React, {useState, useRef} from 'react'
import './UserProfileSignUp.css'

import ProfileNameInput from './ProfileNameInput'
import {useStateValue} from './StateProvider'
import { storage } from "./firebase";
import db from './firebase'
import { useNavigate } from 'react-router-dom';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
    Link
} from "react-router-dom";

function UserProfileSignUp() {
    const [{ user, userProfile }, dispatch] = useStateValue();
    const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
    const [targetValueVar, setTargetValueVar] = useState(null);
    const [toggleSuccessMsg, setToggleSuccessMsg] = useState(null);
    const [toggleFailMsg, setToggleFailMsg] = useState("");

    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    console.log(userProfile);
    console.log("here");
    const userProfilePic =
        (
            userProfile && 'userPic' in userProfile
        ) ? (
            userProfile['userPic']
        ) : (
            user.photoURL
        );

    const userRndName =
        (
            userProfile && 'userName' in userProfile
        ) ? (
            userProfile['userName']
        ) : (
            randomName
        );

    const userFirstName =
        (
            userProfile && 'userFirstName' in userProfile
        ) ? (
            userProfile['userFirstName']
        ) : (
            user.displayName.split(/[ ,]+/)[0]
        );

    const userLastName = 
        (
            userProfile && 'userLastName' in userProfile
        ) ? (
            userProfile['userLastName']
        ) : (
            user.displayName.split(/[ ,]+/)[1]
        );
         
    const userBioInfo = 
        (
            userProfile && 'userBio' in userProfile
        ) ? (
            userProfile['userBio']
        ) : (
            ""
        );

    // Default values
    const [urlImage, setUrlImage] = useState(userProfilePic);
    const [usernameInfo, setUsernamInfo] = useState(userRndName);
    const [nameInfo, setNameInfo] = useState(userFirstName);
    const [lastNameInfo, setLastNameInfo] = useState(userLastName);
    const [bioInfo, setBioInfo] = useState(userBioInfo);

    const inputFile = useRef(null);
    const navigate = useNavigate();
    function makeRandomIdPrefix(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result + '_';
    }
    
    function setupProfile() {
        db.collection('users')
        .where("userId", "==", user.uid)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length === 1)
            {
                let tmp = query.docs[0].data();

                tmp.userProfile['userPic'] = urlImage;
                tmp.userProfile['userName'] = usernameInfo;
                tmp.userProfile['userFirstName'] = nameInfo;
                tmp.userProfile['userLastName'] = lastNameInfo;
                tmp.userProfile['userBio'] = bioInfo;
                tmp.userProfile['userUID'] = user.uid;
                
                const userProfile = {};
                userProfile['userPic'] = urlImage;
                userProfile['userName'] = usernameInfo;
                userProfile['userFirstName'] = nameInfo;
                userProfile['userLastName'] = lastNameInfo;
                userProfile['userBio'] = bioInfo;
                userProfile['userUID'] = user.uid;
                
                setToggleSuccessMsg(userProfile);
                setToggleFailMsg("");

                // Update the data
                query.docs[0].ref.update(tmp);
                
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    function handleSetProfile() {
        // First check if the name has been taken, if so, notify the user
        db.collection('users')
        .where("userProfile.userName", "==", usernameInfo)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length === 1)
            {
                setToggleSuccessMsg(null);
                setToggleFailMsg(usernameInfo);
            }
            else
            {
                setupProfile();
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
    
    const setImage = (e) => {
        const file = e.target.files[0];
        const randomImagePrefix = makeRandomIdPrefix(8);
        const randomImageName = randomImagePrefix + file.name;
        const ref = storage.ref(`/images/${user.uid}/${randomImageName}`);
        const uploadTask = ref.put(file);

        uploadTask.on('stage_changed', console.log, console.error, () => {
            ref.getDownloadURL()
            .then((url) => {
                // Set URL locally
                setUrlImage(url);

                // Reset the target value that was triggered by the change "load-file"
                if (targetValueVar)
                {
                    targetValueVar.target.value = ""
                }
            });
        });
    };

    return (
        <div className='userProfileSignUp'>
            <div className='userProfileSignUp__card'>
                <div className='userProfileSignUp__cardContent'>
                    {/* Sign up description */}
                    <div className='profileSignUp__info'>
                        <h2>Alright, almost there...</h2>
                        <div className='profileSignUp__infoDescription'>
                            <p>
                                We have generated your profile data for you. You can edit your details if 
                                you want and click 'Save Changes' to continue!
                            </p>
                            <span></span>
                            <p>
                                Note, this is a <strong>one-time</strong> step and you can always change your profile information later.
                            </p>
                            <span></span>
                            {toggleSuccessMsg ? (
                                    <>
                                    <h4>Well done {toggleSuccessMsg.userName}!</h4>
                                    <h4>Looks that you are ready to go.</h4>
                                    <img src={"https://c.tenor.com/xHg7HK_ziuoAAAAM/clapping-leonardo-dicaprio.gif"} alt=""/>
                                    </>
                                    
                                ) : (
                                    <>
                                    {toggleFailMsg !== "" && 
                                        <>
                                            <h4>Uh oh, looks like {toggleFailMsg} is already taken...</h4>
                                            <img src={"https://c.tenor.com/gaEpIfzxzPEAAAAM/pedro-monkey-puppet.gif"} alt=""/>
                                        </>
                                    }
                                    </>
                                )}
                        </div>
                    </div>

                    {/* User data onSubmit={handleSetProfile()} */}
                    <form
                        className='profileSignUp__data'
                    >

                        {/* User profile picture */}
                        <div className='signup__profilePicture'>
                            <img
                                className='signup__profilePictureImg'
                                src={urlImage}
                                alt=""
                            />
                            <div className='signup__profilePictureImgLoader'>
                                <label>Profile Picture</label>
                                <input
                                    type='file'
                                    accept="image/*"
                                    style={{display: 'none'}}
                                    id="profilePicLoaderId"
                                    ref={inputFile}
                                    onChange={(e) => {
                                        setTargetValueVar(e);
                                        setImage(e);
                                    }}
                                />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            inputFile.current.click();
                                        }}
                                    >
                                        Upload new image...
                                    </button>
                            </div>

                            <Link to="/" style={{ textDecoration: 'none', color: "black"}}>
                                <div className='signup__cancel'>
                                    <CancelOutlinedIcon sx={{ fontSize: 40 }}/>
                                </div>
                            </Link>
                        </div>

                        {/* Username */}
                        <div className='signup__profileData'>
                            <ProfileNameInput labelText="Username"
                                placeholder={userRndName}
                                callbackSetter={setUsernamInfo}
                            />
                        </div>

                        {/* First and last name */}
                        <div className='signup__profileData firstLastName'>
                            <div className='signup__profileDataFirstName'>
                                <ProfileNameInput labelText="First Name"
                                    placeholder={userFirstName}
                                    callbackSetter={setNameInfo}
                                />
                            </div>
                            <div className='signup__profileDataLastName'>
                                <ProfileNameInput
                                    labelText="Last Name"
                                    placeholder={userLastName}
                                    callbackSetter={setLastNameInfo}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className='signup__profileData bioInfo'>
                            <span>Bio</span>
                            <textarea
                                rows={4}
                                className='signup__profileDataTextArea'
                                placeholder={userBioInfo ? userBioInfo : 'Write something about yourself, if you like...'}
                                onChange={(e) => {
                                    setBioInfo(e.target.value);
                                }}
                            />
                        </div>

                        <div className='signup__profileDataSubmit'>
                            <button
                                className='signup__profileDataSubmitSave'
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSetProfile();
                                    navigate("/");
                                }}
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
                
            </div>
        </div>
    )
}

export default UserProfileSignUp
