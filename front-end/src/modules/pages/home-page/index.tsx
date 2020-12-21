import { Pagination, Spin, Empty } from 'antd';
import React, { useState } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { AppWrap, BaseList, PostCard, SideBarRight } from '../../../components';
import { MenuSideBar } from '../../../components/menu-side-bar';
import {DataAccess, useEntityDataList} from '../../../access';
import './style.scss';
import { ListPost, PostCardType } from '../../../model';

export function HomePage () {
    let { type } = useParams<{type: string}>();
    let history = useHistory();
    if (!type) {
        history.push('/hot');
    }
    const [currentPage, setCurrentPage] = useState(1);
    const {loading, data } = useEntityDataList<ListPost>(`s/all/${type}`, currentPage)

    return(
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content'>
                    <MenuSideBar />
                </div>
                <div className='main-content'>
                    {loading && <Spin size='large' className='list-loading'/>}
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