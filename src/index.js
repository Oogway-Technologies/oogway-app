import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StateProvider } from './StateProvider';
import { MoralisProvider } from "react-moralis";
import reducer, {initialState} from './reducer';

ReactDOM.render(
    <React.StrictMode>
      <MoralisProvider
        appId={process.env.REACT_APP_MORALIS_ID}
        serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
      >
        <StateProvider initialState={initialState} reducer={reducer}>
          <App />
        </StateProvider>
      </MoralisProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
