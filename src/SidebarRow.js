import React from 'react'
import './SidebarRow.css'

import { Avatar } from '@mui/material'

function SidebarRow({src, Icon, IconSelected, title, selected}) {
    return (
        <div className={`sidebarRow ${selected && 'selected'}`}>
            {/* If we pass a not null src -> render the Avatar */}
            {src && <Avatar src = {src} style={{marginRight: "8px"}} />}
            
            {/* If we pass an icon -> render the Icon */}
            {!selected && Icon && <Icon />}
            {selected && IconSelected && <IconSelected />}
            
            {/* Render the title */}
            <h4>{title}</h4>
        </div>
    )
}

export default SidebarRow
