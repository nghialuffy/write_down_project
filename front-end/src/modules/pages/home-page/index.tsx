import { Pagination, Empty } from 'antd';
import React, { useState } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { AppWrap, BaseList, LoadingFullView, PostCard, SideBarRight } from '../../../components';
import { MenuSideBar } from '../../../components/menu-side-bar';
import { useEntityDataList} from '../../../access';
import './style.scss';
import { ListPostType, PostCardType } from '../../../model';

export function HomePage () {
    let { type } = useParams<{type: string}>();
    let history = useHistory();
    if (!type) {
        history.push('/all/hot');
    }
    const [currentPage, setCurrentPage] = useState(1);
    const {loading, data } = useEntityDataList<ListPostType>(`s/all/${type ?? 'hot'}`, currentPage)
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