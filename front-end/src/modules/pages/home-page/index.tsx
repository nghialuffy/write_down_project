import { Pagination } from 'antd';
import React from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { AppWrap, PostCard, PostItem, SideBarRight } from '../../../components';
import { MenuSideBar } from '../../../components/menu-side-bar';
import './style.scss';

export function HomePage () {
    let { type } = useParams<{type: string}>();
    let history = useHistory();
    if (!type) {
        history.push('/hot');
    }
    return(
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
                    <SideBarRight />
                </div>
            </div>
        </AppWrap>
    )
}