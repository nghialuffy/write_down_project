import React from 'react';
import { BaseList, BaseTag } from './component';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BaseList data={[
          {
            _id: '1',
            content: 'Text1'
          },
          {
            _id: '2',
            content: 'Text2'
          }
        ]} Item={ItemTemp}/>
        <BaseTag type='primary' text='tag 1' link='#'/>
        <BaseTag type='normal' text='tag 2' link='#'/>
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
