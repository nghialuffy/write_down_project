import { Pagination } from 'antd';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppWrap, MenuSideBar, PostCard, PostItem } from '../../../components';

export function CategoryPage() {
    let { category } = useParams<{category: string}>();
    let { type } = useParams<{type: string}>();
    const history = useHistory();
    if (!type) {
        history.push(`/posts/${category}/hot`)
    }

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
                <Pagination total={200} pageSize={20}/>
            </div>
            <div className='right-content'>
                <PostItem/>
                <PostItem/>
                <PostItem/>
            </div>
        </div>
    </AppWrap>
    )
}