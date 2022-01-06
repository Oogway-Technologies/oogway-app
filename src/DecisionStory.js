import React from 'react'
import './DecisionStory.css'

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';

function DecisionStory({
    message,
    timestamp,
    numReplies,
    imageLeft,
    imageRight,
    textLeft,
    textRight,
    numLikes,
    incognito,
    votesLeft,
    votesRight,
    isComparison}) {

    let imageThumbnailLeft =
        <img
            src={imageLeft}
            style={{marginRight: "2px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0"}}
            alt=""
        />

    let imageThumbnailRight =
        <img
            src={imageRight}
            style={{marginRight: "0px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0"}}
            alt=""
        />

    let imageAndVoteLeft =
        <div className='decisionStory__mediaVote'>
            {imageThumbnailLeft}
            <p>{votesLeft}</p>
        </div>
    
    let imageAndVoteRight =
        <div className='decisionStory__mediaVote'>
            {imageThumbnailRight}
            <p>{votesRight}</p>
        </div>

    let textAndVoteLeft =
        <div className='decisionStory__mediaVote'>
            <TextFieldsOutlinedIcon sx={{ fontSize: 22 }}/>
            <p>{votesLeft}</p>
        </div>
    
    let textAndVoteRight =
        <div className='decisionStory__mediaVote'>
            <TextFieldsOutlinedIcon sx={{ fontSize: 22 }}/>
            <p>{votesRight}</p>
        </div>

    let singleMediaThumbnail = null;
    if (textLeft === "" && imageRight === "" && textRight === "")
    {
        if (imageLeft === "")
        {
            // Posts with no images get a default icon - text only
            singleMediaThumbnail = <QuestionAnswerOutlinedIcon className='thumbnail__icon'/>
        }
        else
        {
            // For simple posts there is only an image
            singleMediaThumbnail = <img src={imageLeft} alt=""/>;
        }
    }

    return (
        <div className='decisionStory'>
            <div className='decisionStory__left'>
                <div className='decisionStory__thumbnail'>
                    {/* The following should be mutually exclusive */}
                    {isComparison && imageLeft !== "" && imageAndVoteLeft}
                    {isComparison && textLeft !== "" && textAndVoteLeft}
                    {/* The following should be mutually exclusive */}
                    {isComparison && imageRight !== "" && imageAndVoteRight}
                    {isComparison && textRight !== "" && textAndVoteRight}
                    {/* The following should be mutually exclusive */}
                    {!isComparison && singleMediaThumbnail}
                </div>
            </div>
            <div className='decisionStory__right'>
                <div className='decisionStory__info'>
                    <div className='decisionStory_info incognito__message'>
                        <h4>{message}</h4>
                        {incognito ? (
                            <AdminPanelSettingsOutlinedIcon fontSize="small" style={{ color: "orange", marginLeft: "2px"}}/>
                        ) : (
                            null
                        )}
                    </div>
                    <p>{new Date(timestamp?.toDate()).toUTCString()}</p>
                </div>

                <div className='decisionStory__data'>
                    <div className='decisionStory__dataInfo'>
                        {numReplies > 0 ? (
                            <>
                                <ChatBubbleOutlineOutlinedIcon />
                                <p>{numReplies}</p>
                            </>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='decisionStory__dataInfo'>
                        {numLikes > 0 ? (
                            <>
                                <FavoriteBorderIcon />
                                <p>{numLikes}</p>
                            </>
                        ) : (
                            null
                        )}
                    </div>
                </div>
            </div>




        </div>
    )
}

export default DecisionStory
