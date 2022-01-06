import React, { useState, useEffect } from 'react'
import './Profile.css'

import ProfileInfo from './ProfileInfo';
import Post from './Post';
import {useStateValue} from './StateProvider'
import db from "./firebase"
import firebase from 'firebase/compat/app';

function Profile({setSelectedPage}) {
    const [posts, setPosts] = useState([])
    const [{ user, userProfile }, dispatch] = useStateValue();

    // Get user unique ID
    let uniqueUserId = user.uid;

    // Set selected page
    setSelectedPage("profile");
    
    function handlePostIdReelGeneration(postIdList)
    {
        var postsRef = db.collection('posts');
        postsRef
        .where(firebase.firestore.FieldPath.documentId(), 'in', postIdList)
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) =>
            setPosts(snapshot.docs.map(doc => (
                { id: doc.id, data: doc.data() })))
        );
    }

    // Only run once when the feed loads
    useEffect(() => {
        // Get the posts from the user
        db.collection('users')
        .where("userId", "==", uniqueUserId)
        .limit(1)
        .get()
        .then(query => {
            if (query.docs.length > 0)
            {
                const queryDoc = query.docs[0];
                let tmp = queryDoc.data();
                handlePostIdReelGeneration(tmp.userPosts.slice(-10));
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
    }, [uniqueUserId]);

    return (
        <div className='profile'>
            <div className='profile__info'>
                <ProfileInfo
                    profilePic={userProfile.userPic}
                    profileName={userProfile.userName}
                />
            </div>

            <div className='profile__feed'>
            
            {posts.map((post) => (
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
                />
            ))}

            </div>
        </div>
    )
}

export default Profile
