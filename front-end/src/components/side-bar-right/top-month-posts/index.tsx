import React from 'react';
import { ComposeHeader, PostItem } from '../../index';

export function TopMonthPosts () {
    return (
        <div>
            <ComposeHeader>Bài viết của tháng</ComposeHeader>
            <PostItem />
            <PostItem />
            <PostItem />
            <PostItem />
        </div>
    );
}