import React, { useState } from 'react'
import './PostMediaLoader.css'

import PostImageLoader from './PostImageLoader'
import IconButton from '@material-ui/core/IconButton';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

function PostMediaLoader({isOptionsOnLeft, textInputCallback, imgLoaderId, callbackImageUrl}) {
    const [isMediaImage, setIsMediaImage] = useState(true);
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setInput("");
    }

    const loaderOptions = 
        <div className='postMediaLoader__options'>
            <IconButton size="small" onClick={() =>
                {
                    // Clicking on text will reset the text
                    if (callbackImageUrl)
                    {
                        callbackImageUrl("")
                    }
                    setIsMediaImage(false);
                }}
            >
                <TextFieldsOutlinedIcon />
            </IconButton>
            <IconButton size="small" onClick={() =>
                {
                    // Clicking on image will reset the text
                    if (textInputCallback) {
                        textInputCallback("");
                    }
                    setIsMediaImage(true);
                }}
            >
                <ImageOutlinedIcon />
            </IconButton>
        </div>
    
    const previewMediaText =
        <div className='postMediaLoader__optionText'>
            <form>
                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (textInputCallback) {
                            textInputCallback(e.target.value);
                        }
                    }}
                    placeholder='Type an option...'
                />
                <button onClick={handleSubmit} type="submit">
                    Enter
                </button>
            </form>
        </div>

    return (
        <div className='postMediaLoader'>
            {isOptionsOnLeft && loaderOptions}
            <div className='postMediaLoader__data'>
                {isMediaImage && <PostImageLoader loaderId={imgLoaderId} callbackImageUrl={callbackImageUrl}/>}
                {!isMediaImage && previewMediaText}
            </div>
            {!isOptionsOnLeft && loaderOptions}
        </div>
    )
}

export default PostMediaLoader
