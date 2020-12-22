import React from 'react';
import { useEntityDataList } from '../../../access';
import { PostItemType } from '../../../model';
import { BaseList } from '../../base';
import { ComposeHeader, PostItem } from '../../index';
import { LoadingFullView } from '../../loading';

export function TopMonthPosts () {
    const {loading, data} = useEntityDataList<{data: PostItemType[]}>('postofmonth/');
    return (
        <div>
            <ComposeHeader>Bài viết của tháng</ComposeHeader>
            <div className='list-post-of-month'>
                {loading && <LoadingFullView className='tranparent'/>}
                {data && <BaseList<PostItemType> data={data.data as any} Item={PostItem}/>}
            </div>
        </div>
    );
}