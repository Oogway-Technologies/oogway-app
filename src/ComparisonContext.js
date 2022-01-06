import React from 'react'
import './ComparisonContext.css'
import vsIcon from './icons/contrast-vs-48.png'
import PostMediaLoader from './PostMediaLoader'

function ComparisonContext({setLeftImageUrl, setRightImageUrl, setLeftTextInput, setRightTextInput}) {
    return (
        <div className='comparisonContext'>

            {/* Left preview */}
            <div className='comparisonContext__left'>
                <PostMediaLoader
                    isOptionsOnLeft={true}
                    imgLoaderId={'img_loader_left'}
                    callbackImageUrl={setLeftImageUrl}
                    textInputCallback={setLeftTextInput}/>
            </div>

            {/* VS image */}
            <div className='comparisonContext__center'>
                <img src={vsIcon} alt=""/>
            </div>

            {/* Right preview */}
            <div className='comparisonContext__right'>
                <PostMediaLoader
                    isOptionsOnLeft={false}
                    imgLoaderId={'img_loader_right'}
                    callbackImageUrl={setRightImageUrl}
                    textInputCallback={setRightTextInput}/>
            </div>
        </div>
    )
}

export default ComparisonContext
