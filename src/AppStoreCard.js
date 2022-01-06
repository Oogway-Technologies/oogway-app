import React, {useState} from 'react'
import './AppStoreCard.css'

import { Button } from '@mui/material'
import {
    Link
} from "react-router-dom";

function AppStoreCard({title, subtitle, description, appDescription, icon, demolink}) {
    const [toggleDescription, setToggleDescription] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    let demoButton = null;
    if (demolink !== "")
    {
        demoButton =
            <Button
                className="appStoreCard__Button"
                onClick={()=> window.open(demolink, "_blank")}
                type="submit"
            >
                Try Demo
            </Button>
    }
    else
    {
        demoButton =
            <Link to="/socialApp/" style={{ textDecoration: 'none', color: "black"}}>
                <Button
                    className="appStoreCard__Button"
                >
                    Try Demo
                </Button>
            </Link>
    }

    return (
        <div className='appStoreCard'>
            <img src={icon} alt=""/>
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <div className={`appStoreCard__description ${toggleDescription && 'selected'}`}>
                <div
                    className='appStoreCard__descriptionTitle'
                    onClick={() => setToggleDescription(!toggleDescription)}>
                    <h2>More info</h2>
                </div>
                
                {toggleDescription && <p>{description}</p>}
            </div>
            
            <hr />
            
            <div className='appStoreCard__demoInfo'>
                <p>{appDescription}</p>
            </div>
            <div className='appStoreCard__demo'>

            {demoButton}

            </div>

        </div>
    )
}

export default AppStoreCard
