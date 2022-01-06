import React, {useState} from 'react'
import "./Widgets.css"

import DecisionReel from './DecisionReel';
import UpdateIcon from '@mui/icons-material/Update';
import IconButton from '@material-ui/core/IconButton';

function Widgets() {
    const [updateReel, setUpdateReel] = useState(true)

    return (
        <div className='widgets'>
            <div className='widgets__userDecisions'>
                <div className='widgets__userDecisionsTitle'>
                    <h2>Recent decisions</h2>
                    <IconButton size="small" onClick={() => {setUpdateReel(!updateReel)}}>
                        <UpdateIcon className='widgets__titleIcon'/>
                    </IconButton>
                    
                </div>

                <DecisionReel updateFlag={updateReel}/>
            </div>
        </div>
    )
}

export default Widgets
