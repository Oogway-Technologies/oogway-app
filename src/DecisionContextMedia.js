import React from 'react'
import './DecisionContextMedia.css'

import MediaContext from './MediaContext';
import ComparisonContext from './ComparisonContext';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';


function DecisionContextMedia({
    toggleOption,
    toggleOptionDisplay,
    mediaUrl,
    onSetDecisionImageUrlLeft,
    onSetDecisionImageUrlRight,
    toggleOptionDisplayFcn,
    onSetDecisionTextInputLeft,
    onSetDecisionTextInputRight
}) {

    let cancelPanel =
        <div className='decisionContextMedia__top'>
            <IconButton size="small" onClick={() => toggleOptionDisplayFcn(!toggleOption)}>
                <CancelIcon />
            </IconButton>
        </div>

    let mediaOptionPanel = null;
    if (toggleOption === 1 && !mediaOptionPanel)
    {
        // Option is 1 -> show image
        mediaOptionPanel =
            <div className='decisionContextMedia__wrapper'>
                {cancelPanel}
                <div className='decisionContextMedia__bottom'>
                    <MediaContext
                        image={mediaUrl}
                    />
                </div>
            </div>


    }
    else if (toggleOption === 2 && !mediaOptionPanel)
    {
        // Option is 2 -> show comparison panel
        mediaOptionPanel =
            <div className='decisionContextMedia__wrapper'>
                {cancelPanel}
                <div className='decisionContextMedia__bottom'>
                    <ComparisonContext
                        setLeftImageUrl={onSetDecisionImageUrlLeft}
                        setRightImageUrl={onSetDecisionImageUrlRight}
                        setLeftTextInput={onSetDecisionTextInputLeft}
                        setRightTextInput={onSetDecisionTextInputRight}
                    />
                </div>
            </div>
    }
    else
    {
        // No other option, show nothing
        mediaOptionPanel = null;
    }

    // Enable/Disable view w.r.t. what was shown before
    if (!toggleOptionDisplay)
    {
        mediaOptionPanel = null;
    }

    return (
        <div className='decisionContextMedia'>
            {mediaOptionPanel}
        </div>
    )
}

export default DecisionContextMedia
