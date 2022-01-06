import React, { useState, useEffect } from 'react'
import './DecisionReel.css'

import DecisionStory from './DecisionStory';
import {useStateValue} from './StateProvider'
import db from './firebase'
import firebase from 'firebase/compat/app';

function DecisionReel({updateFlag}) {
    const [posts, setPosts] = useState([])
    const [{ user }, dispatch] = useStateValue();
    
    // Get user unique ID
    let uniqueUserId = user.uid;

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
                handlePostIdReelGeneration(tmp.userPosts.slice(-5));
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
    }, [updateFlag, uniqueUserId]);

    /*
    This updates regardless BUT it requires a double index
    useEffect(() => {
        db.collection('posts')
            .where("userId", "==", uniqueUserId)
            .orderBy('timestamp', 'desc')
            .limit(5)
            .onSnapshot((snapshot) =>
            setPosts(snapshot.docs.map(doc => (
                { id: doc.id, data: doc.data() })))
        );
    }, []);
    */

    return (
        <div className="decisionReel">
            {posts.map((post) => (
                <DecisionStory
                    key={post.id}
                    message={post.data.message}
                    timestamp={post.data.timestamp}
                    imageLeft={post.data.imageLeft}
                    imageRight={post.data.imageRight}
                    textLeft={post.data.textLeft}
                    textRight={post.data.textRight}
                    incognito={post.data.isIncognito}
                    numReplies={post.data.commentList.length}
                    numLikes={post.data.numLikes}
                    votesLeft={post.data.votesLeft}
                    votesRight={post.data.votesRight}
                    isComparison={post.data.isComparison}
                />
            ))}
        </div>
    )
}

export default DecisionReel
