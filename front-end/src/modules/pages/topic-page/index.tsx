import { Empty, Pagination } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntityDataList } from '../../../access';
import { AppWrap, BaseList, LoadingFullView, MenuSideBar, PostCard, SideBarRight } from '../../../components';
import { ListPost, PostCardType } from '../../../model';

export function TopicPage () {
    let { topic } = useParams<{ topic: string }>();

    const [currentPage, setCurrentPage] = useState(1);
    const {loading, data } = useEntityDataList<ListPost>(`s/categories/${topic}`, currentPage)

    return(
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content'>
                    <MenuSideBar />
                </div>
                <div className='main-content'>
                    {loading && <LoadingFullView size='large' className='list-loading'/>}
                    {data ? 
                    <>
                    <BaseList<PostCardType> data={data.data} Item={PostCard} /> 
                    <Pagination total={data.total_page} pageSize={20} onChange={(page) => setCurrentPage(page)}/>
                    </>: <Empty description='Sorry, something went wrong!'/>}
                </div>
                <div className='right-content'>
                    <SideBarRight />
                </div>
            </div>
        </AppWrap>
    );
}