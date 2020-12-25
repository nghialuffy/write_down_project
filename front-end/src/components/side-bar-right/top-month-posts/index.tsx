import React from 'react';
import { useEntityData } from '../../../access';
import { PostItemType } from '../../../model';
import { BaseList } from '../../base';
import { ComposeHeader, PostItem } from '../../index';
import { LoadingFullView } from '../../loading';

export function TopMonthPosts () {
    const {loading, data} = useEntityData<{data: PostItemType[]}>('/postofmonth/');
    return (
        <div>
            <ComposeHeader>Bài viết của tháng</ComposeHeader>
            <div className='list-post-of-month'>
                {data && <BaseList<PostItemType> data={data.data as any} Item={PostItem}/>}
            </div>
        </div>
    );
}