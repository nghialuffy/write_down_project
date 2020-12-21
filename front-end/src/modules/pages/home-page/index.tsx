import React from 'react';
import { AppWrap, PostCard, PostItem } from '../../../components';
import './style.scss';

export function HomePage () {
    return(
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content'>
                </div>
                <div className='main-content'>
                    <PostCard />
                </div>
                <div className='right-content'>
                    <PostItem/>
                </div>
            </div>

        </AppWrap>
    )
}