import React from 'react';
import { AppWrap, PostCard, PostItem } from '../../../components';

export function HomePage () {
    return(
        <AppWrap>
            This is home page.
            <PostItem />
            <PostItem />

            <PostCard />
            <PostCard />
        </AppWrap>
    )
}