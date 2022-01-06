import React from 'react'
import './MediaContext.css'

function MediaContext({image}) {
    return (
        <div style={{ backgroundImage: `url(${image})` }}
            className='mediaContext'>
        </div>
    )
}

export default MediaContext
