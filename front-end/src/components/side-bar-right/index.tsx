import React from 'react';
import { FeatutedTags } from './featured-tags';
import { ForYouPosts } from './for-you-posts';
import { TopMonthPosts } from './top-month-posts';

export function SideBarRight () {
    return (
        <div className='side-bar-right'>
            <TopMonthPosts />
            <ForYouPosts />
            <FeatutedTags />
        </div>
    );
}