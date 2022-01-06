import React from 'react'
import './DecisionContext.css';

// import AddIcon from '@mui/icons-material/Add';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';

function DecisionContext({toggleContext, setToogleContext, onChangeContextMsg}) {
    
    return (
        <div className='decisionContext'>
            <div
                className='decisionContext__top'
                onClick={() => setToogleContext(!toggleContext)}
            >
                <FeedOutlinedIcon />
                <h2>Add context (optional)</h2>
            </div>
            <div className='decisionContext__center'>
                {!toggleContext ? (
                    null
                ) : (
                    <div className='decisionContext__centerText'>
                        <TextareaAutosize
                            minRows={4}
                            maxRows={10}
                            aria-label="maximum height"
                            style={{
                                fontFamily: "Roboto",
                                flex: "1",
                                width: "100%",
                                borderRadius: "5px"
                            }}
                            placeholder="Anything else you want to add..."
                            onChange={(e) => onChangeContextMsg(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default DecisionContext
