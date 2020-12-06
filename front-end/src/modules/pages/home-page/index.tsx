import React from 'react';
import { PostCard, PostItem } from '../../components';

export function HomePage () {
    return(
        <div>
            This is home page.
            <PostItem />
            <PostCard />
        </div>
    )
}