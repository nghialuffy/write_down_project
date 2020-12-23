import React, { memo } from 'react';
import { useEntityDataList } from '../../../access';
import { PostItemType } from '../../../model';
import { BaseList, ComposeHeader, PostItem } from '../../index';

export const ForYouPosts = memo(() => {
    const {loading, data} = useEntityDataList<PostItemType>('/foryou');
    return (
        <div>
            <ComposeHeader>Phù hợp với bạn</ComposeHeader>
            <div className='list-post-of-month'>
                {data && <BaseList<PostItemType> data={data as any} Item={PostItem}/>}
            </div>
        </div>
    );
});