import { Pagination } from 'antd';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppWrap, MenuSideBar, PostCard, SideBarRight } from '../../../components';

export function TopicPage () {
    let { topic } = useParams<{ topic: string }>();

    useEffect(() => {
        //get data

    },[]);

    return (
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content'>
                    <MenuSideBar />
                </div>
                <div className='main-content'>
                    <PostCard />
                    <PostCard />
                    <PostCard />
                    <PostCard />
                    <Pagination total={200} pageSize={20} />
                </div>
                <div className='right-content'>
                    <SideBarRight />
                </div>
            </div>
        </AppWrap>
    )
}