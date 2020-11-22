import React from 'react';
import { BaseDropDown, BaseList, BaseTag, Footer } from './component';
import './App.scss';

function App() {
  const dropDownSchema = [
    {
      text: 'item 1',
      link: 'https://ant.design/components/dropdown/'
    },
    {
      text: 'item 2',
      link: 'https://ant.design/components/dropdown/'
    },
    {
      text: 'item 3',
      link: 'https://ant.design/components/dropdown/'
    }
  ]

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
        <BaseDropDown buttonText='Dropdown' schema={dropDownSchema}/>
      </header>
      <footer>
        <Footer/>
      </footer>
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
