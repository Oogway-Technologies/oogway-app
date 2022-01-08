import React, { useState } from 'react';
import './App.css';

import Login from './Login';
import Home from './Home';
import { useStateValue } from './StateProvider';
import { useMoralis } from "react-moralis";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [{ user, userProfile }, dispatch] = useStateValue();
  const { isAuthenticated } = useMoralis();

  // The user is not authenticated, ask for login
  if (!user && !isAuthenticated) return <Login />;

  return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Home />
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
