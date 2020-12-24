import { Empty, Pagination } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntityDataList } from '../../../access';
import { AppWrap, BaseList, LoadingFullView, PostCard } from '../../../components';
import { ListPostType, PostCardType } from '../../../model';

export function SearchPage () {
    let { text } = useParams<{text: string}>();
    const [currentPage, setCurrentPage] = useState(1);
    const {loading, data} = useEntityDataList<ListPostType>('search',currentPage, text);
    return (
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content'></div>
                <div className='main-content'>
                {loading && <LoadingFullView size='large' className='list-loading'/>}
                    {data ? 
                    <>
                    <BaseList<PostCardType> data={data.data} Item={PostCard} /> 
                    <Pagination total={data.total_page} pageSize={20} onChange={(page) => setCurrentPage(page)}/>
                    </>: <Empty description='Sorry, something went wrong!'/>}
                </div>
                <div className='right-content'></div>
            </div>
        </AppWrap>
    )
}