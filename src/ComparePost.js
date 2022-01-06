import React from 'react'
import './ComparePost.css'

import vsIcon from './icons/contrast-vs-48.png'
import {useStateValue} from './StateProvider'
import db from './firebase'

function ComparePost({imageLeft, imageRight, textLeft, textRight, votesLeft, votesRight, postId}) {
    const [{ user }, dispatch] = useStateValue();

    // Get user unique ID
    let uniqueUserId = user.uid;

    function handleVote(postUID, moveVote, voteVal) {
        db.collection('posts')
        .doc(postUID)
        .get()
        .then((doc) => {
            if (doc.exists)
            {
                let tmp = doc.data();
                if (voteVal === 0)
                {
                    // Add to left vote
                    tmp.votesLeft = tmp.votesLeft + 1;
                    
                    if (moveVote)
                    {
                        // Remove a vote from right
                        tmp.votesRight = Math.max(tmp.votesRight - 1, 0);
                    }
                }
                else
                {
                    // Add to right vote
                    tmp.votesRight = tmp.votesRight + 1;

                    if (moveVote)
                    {
                        // Remove a vote from left
                        tmp.votesLeft = Math.max(tmp.votesLeft - 1, 0);
                    }
                }

                // Update the data
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

    const handleComparisonVote = (postUID, isLeft) => {
        // A user can only add a vote once.
        // Steps:
        // 1 - Check if the user touched this post before: if not, add vote
        // 2 - If the user touched this post before: no-op or move the vote
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

                // Vote:
                // 0 ==> left
                // 1 ==> right
                let voteImg = isLeft ? 0 : 1;
                if (postUID in tmp.touchedPosts)
                {
                    // Post has been touched by the user before: check if there is a vote
                    if ('vote' in tmp.touchedPosts[postUID])
                    {
                        // This user already voted once
                        if (tmp.touchedPosts[postUID]['vote'] === voteImg)
                        {
                            // Nothing to do, the user already voted the same before
                            return;
                        }

                        // The user wants to vote differently now
                        tmp.touchedPosts[postUID]['vote'] = voteImg;

                        // Handle vote:
                        // postUID -> id of the post to modify
                        // true -> change the vote with subtraction
                        // voteImg -> if 0, move 1 from right to left
                        //            if 1, move 1 from left to right
                        handleVote(postUID, true, voteImg);
                    }
                    else
                    {
                        // This user never voted before, add vote
                        tmp.touchedPosts[postUID] = {'vote': voteImg};

                        // Handle vote:
                        // postUID -> id of the post to modify
                        // true -> change the vote with subtraction
                        // voteImg -> if 0, add 1 to left
                        //            if 1, add 1 to right
                        handleVote(postUID, false, voteImg);
                    }
                }
                else
                {
                    // Post has never been touched by the user before
                    tmp.touchedPosts[postUID] = {'vote': voteImg};

                    // Handle vote:
                    // postUID -> id of the post to modify
                    // true -> change the vote with subtraction
                    // voteImg -> if 0, add 1 to left
                    //            if 1, add 1 to right
                    handleVote(postUID, false, voteImg);
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
        <div className='comparePost'>
            <div className='comparePost__imageWrapper'>
                <div className='comparePost__image image__left' onClick={() => handleComparisonVote(postId, true)}>
                    {imageLeft !== "" && <img src={imageLeft} alt=""/>}
                    {textLeft !== "" && <p>{textLeft}</p>}
                </div>
                <div className='comparePost__vote vote__left'>
                    <p>{votesLeft}</p>
                </div>
            </div>

            <div className='comparePost__vs'>
                <img src={vsIcon} alt=""/>
            </div>

            <div className='comparePost__imageWrapper'>
                <div className='comparePost__image image__right' onClick={() => handleComparisonVote(postId, false)}>
                    {imageRight !== "" && <img src={imageRight} alt=""/>}
                    {textRight !== "" && <p>{textRight}</p>}
                </div>
                <div className='comparePost__vote vote__right'>
                    <p>{votesRight}</p>
                </div>
            </div>

        </div>
    )
}

export default ComparePost
