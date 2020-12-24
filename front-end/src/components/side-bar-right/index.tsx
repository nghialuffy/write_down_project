import React, { useContext } from 'react';
import { UserContext } from '../../context';
import { FeatutedTags } from './featured-tags';
import { ForYouPosts } from './for-you-posts';
import { TopMonthPosts } from './top-month-posts';

export function SideBarRight () {
    const userContext = useContext(UserContext);
    return (
        <div className='side-bar-right'>
            <TopMonthPosts />
            {userContext._id && <ForYouPosts />}
        </div>
    );
}