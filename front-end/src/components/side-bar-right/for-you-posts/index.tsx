import React, { memo } from 'react';
import { useEntityDataList } from '../../../access';
import { ListPostForYou, PostForYou } from '../../../model';
import { BaseList, ComposeHeader } from '../../index';
import { PostItemForYou } from '../../post-item';

export const ForYouPosts = memo(() => {
    const {loading, data} = useEntityDataList<ListPostForYou>('foryou');
    return (
        <div>
            <ComposeHeader>Phù hợp với bạn</ComposeHeader>
            <div className='list-post-of-month'>
                {data && <BaseList<PostForYou> data={data.for_you as any} Item={PostItemForYou}/>}
            </div>
        </div>
    );
});