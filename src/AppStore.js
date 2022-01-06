import React, {useState} from 'react'
import './AppStore.css'

import Logo from './Logo'
import AppStoreCard from './AppStoreCard';
import searchIcon from './icons/magic-trick-dynamic-color.png'
import filterIcon from './icons/fire-dynamic-color.png'
import evaluateIcon from './icons/tool-dynamic-color.png'
import socialIcon from './icons/notify-heart-dynamic-color.png'
import oogwayIcon from './icons/oogway.jpeg'
import { Avatar } from '@mui/material';
import {useStateValue} from './StateProvider'

function AppStore() {
    const [{ user, userProfile }, dispatch] = useStateValue();

    const subtitleSearch = "Pertinent information, better decisions"
    const subtitleFilter = "Identifying the right options"
    const subtitleEvaluate = "What the future would look like"
    const subtitleCommunity = "Feedback from other decision makers"

    const textSearch = "Where you can describe what you are looking for in natural language. AI will search the web, summarize the results, and categorize them based on the context of your query."
    const textFilter = "Where you can interact with the AI assistant to iteratively narrow down the alternatives generated with search. You can also search for more options or dive deep in what seems the right choice in your decision."
    const textEvaluate = "Where you can compare options that are most promising to make a decision. AI can help you compare between similar options or even forecast possible outcomes."
    const textSocial = "Where you can ask other users to vote for the best option or to help you make a decision by asking for feedback. Oogway is a collaborative network of decision makers like you, helping each other to accomplish more."
    
    const appSearch = "Here you can try a demo for the search component. This semantic search engine is built using a large language model trained on articles from Towards Data Science."
    const appFilter = "Here you can try a demo for the filtering component. The Oogway assistant is an interactive chabot trained on Yelp data to help you filter down the options you have when looking for a place to eat."
    const appEvaluate = "Here you can try a demo for the evaluate component. This demo helps you compare products on Amazon by extracting pros and cons for each pair of product you select."
    const appSocial = "Here you can enter the Oogway social app (alpha). This app enables you to share your decisions with the community and get feedback."
    
    const linkDemoSearch = "http://oogwaysearch.herokuapp.com/"
    const linkDemoFilter = "http://18.220.118.132/guest/conversations/production/a294888507fa4c5ea6422347fe359a9c"
    const linkDemoEvaluate = "https://oogwayevaluate.herokuapp.com/"
    const linkDemoSocial = ""

    const oogwayQuestion = "What is this all about?"
    const oogwayAnswer_p1 = "The demos below showcase the building blocks for the Oogway decision assistant."
    const oogwayAnswer_p2 = "The Oogway team is working on a cohesive larger vision"
    const oogwayAnswer_p3 = "that will enable users to make better decisions using their personalized assistant."
    const oogwayAnswer = oogwayAnswer_p1 + " " + oogwayAnswer_p2 + " " + oogwayAnswer_p3

    return (
        <div className='appStore'>
            <div className='appStore__header'>
                <div className='appStore__headerLogo'>
                    <Logo />
                </div>
                <div className='appStore__headerUser'>
                    <Avatar src={userProfile.userPic}/>
                    <h4>{userProfile.userName}</h4>
                </div>
            </div>
            <div className='appStore__body'>
                <div className='appStore__bodyInfo'>
                    <div className='appStore__bodyInfoLeft'>
                        <Avatar src={oogwayIcon}/>
                    </div>
                    <div className='appStore__bodyInfoRight'>
                        <div className='appStore__bodyInfoRightQuestion'>
                            <h2>{oogwayQuestion}</h2>
                        </div>

                        <div className='appStore__bodyInfoRightAnswer'>
                            <p>{oogwayAnswer}</p>
                        </div>
                    </div>
                </div>
                
                <div className='appStore_cards'>
                    <AppStoreCard
                        title={"Search"}
                        subtitle={subtitleSearch}
                        description={textSearch}
                        appDescription={appSearch}
                        icon={searchIcon}
                        demolink={linkDemoSearch}
                    />
                    <AppStoreCard
                        title={"Filter"}
                        subtitle={subtitleFilter}
                        description={textFilter}
                        appDescription={appFilter}
                        icon={filterIcon}
                        demolink={linkDemoFilter}
                    />
                    <AppStoreCard
                        title={"Evaluate"}
                        subtitle={subtitleEvaluate}
                        description={textEvaluate}
                        appDescription={appEvaluate}
                        icon={evaluateIcon}
                        demolink={linkDemoEvaluate}
                    />
                    <AppStoreCard
                        title={"Social feedback"}
                        subtitle={subtitleCommunity}
                        description={textSocial}
                        appDescription={appSocial}
                        icon={socialIcon}
                        demolink={linkDemoSocial}
                    />
                </div>
            </div>
        </div>
    )
}

export default AppStore
