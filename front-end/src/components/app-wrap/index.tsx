import React from 'react';
import { Header } from '../header';
import { Footer } from '../footer';
import './style.scss';

export function AppWrap ({children} : {children: any}) {
    return (
        <div className='app-wrap'>
            <Header />
            <div className='web-content'>{children}</div>
            <Footer />
        </div>
    )
}