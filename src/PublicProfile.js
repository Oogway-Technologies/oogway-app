import React, {useState, useEffect} from 'react'
import './PublicProfile.css'

import ProfileInfo from './ProfileInfo';
import Post from './Post';
import { useParams } from "react-router-dom";
import db from "./firebase"
import firebase from 'firebase/compat/app';

function PublicProfile() {
    const [posts, setPosts] = useState([])
    const [userProfileData, setUserProfileData] = useState(null);
    let params = useParams();

    function setUserPosts(postIdList)
    {
        db.collection('posts')
        .where(firebase.firestore.FieldPath.documentId(), 'in', postIdList)
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) =>
            setPosts(snapshot.docs.map(doc => (
                { id: doc.id, data: doc.data() })))
        );
    }


    // On page load, get user profile data
    useEffect(() => {
        db.collection('users')
            .where("userProfile.userName", "==", params.profileName)
            .limit(1)
            .onSnapshot((snapshot) =>
            {
                if (snapshot.docs.length > 0)
                {
                    // Set user's profile
                    setUserProfileData(snapshot.docs[0].data().userProfile);

                    // Set user's public posts
                    setUserPosts(snapshot.docs[0].data().userPosts.slice(-10));
                }
            }
        );
    }, []);

    return (
        <div className='publicProfile'>
            <div className='publicProfile__info'> 
                <ProfileInfo
                    profilePic={userProfileData ? userProfileData.userPic : ""}
                    profileName={params.profileName}
                    profileBio={userProfileData ? userProfileData.userBio : ""}
                />
            </div>

            <div className='publicProfile__feed'>
            
            {posts.map((post) => (
                <>
                {!post.data.isIncognito &&
                <Post
                    key={post.id}
                    profilePic={post.data.profilePic}
                    username={post.data.username}
                    timestamp={post.data.timestamp}
                    message={post.data.message}
                    context={post.data.context}
                    imageLeft={post.data.imageLeft}
                    imageRight={post.data.imageRight}
                    textLeft={post.data.textLeft}
                    textRight={post.data.textRight}
                    votesLeft={post.data.votesLeft}
                    votesRight={post.data.votesRight}
                    numLikes={post.data.numLikes}
                    comments={post.data.commentList}
                    isComparison={post.data.isComparison}
                    postId={post.id}
                />}
                </>
            ))}

            </div>
        </div>
    )
}

export default PublicProfile
