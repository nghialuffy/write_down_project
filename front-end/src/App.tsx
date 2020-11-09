import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { BaseList } from './component';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <BaseList data={[
          {
            _id: '1',
            content: 'Text1'
          },
          {
            _id: '2',
            content: 'Text2'
          }
        ]} Item={ItemTemp}></BaseList>
      </header>
    </div>
  );
}
 
type ItemData = {
  _id: string;
  content: string;
}

function ItemTemp ({data} : {data: ItemData}) {
  return (
    <div>{data.content}</div>
  )
}

export default App;
