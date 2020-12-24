import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'antd/dist/antd.css';
import { RootApplication } from './App';
import reportWebVitals from './reportWebVitals';
import { UserContextProvider } from './context';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <RootApplication />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
