import React from 'react';
import { ComposeHeader, PostItem } from '../../index';

export function ForYouPosts () {
    return (
        <div>
            <ComposeHeader>Phù hợp với bạn</ComposeHeader>
            <PostItem />
            <PostItem />
            <PostItem />
        </div>
    );
}