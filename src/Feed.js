import React, { useState, useEffect } from 'react'
import './Feed.css'

import DecisionSender from './DecisionSender';
import Post from './Post';
import db from "./firebase"

function Feed({setSelectedPage}) {
    const [posts, setPosts] = useState([])

    // Set selected page
    setSelectedPage("feed");

    // Only run once when the feed loads
    useEffect(() => {
        db.collection('posts')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) =>
            setPosts(snapshot.docs.map(doc => (
                { id: doc.id, data: doc.data() })))
        );
    }, []);

    return (
        <div className='feed'>
            <DecisionSender />

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
    )
}

export default Feed
