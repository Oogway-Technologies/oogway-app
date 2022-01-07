import React, { useState } from 'react';
import './App.css';

import Login from './Login';
import Home from './Home';
import UserProfileSignUp from './UserProfileSignUp';
import {useStateValue} from './StateProvider';
// import { MoralisProvider } from "react-moralis";
import {
  BrowserRouter,
} from "react-router-dom";

function App() {
  const [{ user, userProfile }, dispatch] = useStateValue();

  const appEntryPoint =
    <div className='app__body'>
      <Home />
    </div>

    {/*}
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_ID}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
  >*/}
{/*</MoralisProvider>*/}

  return (

      <div className="app">
        {!user ? (
          <Login />
        ) : (
          <>
          <BrowserRouter>
        
          {!userProfile && <UserProfileSignUp />}
          {userProfile && appEntryPoint}

          </BrowserRouter>
        </>
      )}

    </div>

    
  );
}

export default App;
