import React, { useContext, useEffect } from 'react';
import { Header } from '../header';
import { Footer } from '../footer';
import './style.scss';
import { UserContext } from '../../context';
import { DataAccess } from '../../access';

export function AppWrap ({children} : {children: any}) {
    return (
        <div className='app-wrap'>
            <Header />
            <div className='web-content'>{children}</div>
            <Footer />
        </div>
    );
}