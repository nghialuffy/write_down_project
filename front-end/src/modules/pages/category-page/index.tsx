import { Empty, Pagination} from 'antd';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useEntityDataList } from '../../../access';
import { CategoryImage } from '../../../assets/Images';
import { AppWrap, BaseButton, BaseList, LoadingFullView, MenuSideBar, PostCard, SideBarRight } from '../../../components';
import { Categories } from '../../../constants';
import { ListPost, PostCardType } from '../../../model';
import './style.scss';

export function CategoryPage() {
    let { category } = useParams<{ category: keyof typeof CategoryImage }>();
    let { type } = useParams<{ type: string }>();
    const history = useHistory();
    if (!type) {
        history.push(`/posts/${category}/hot`)
    }
    const [currentPage, setCurrentPage] = useState(1);
    const { loading, data } = useEntityDataList<ListPost>(`s/${category}/${type ?? 'hot'}`, currentPage);

    return (
        <AppWrap>
            <div className='category-header' style={{ backgroundImage: `url(${CategoryImage[category].default})` }}>
                <div className='category-label'>{Categories.filter(item => item.value === category)[0].label}</div>
                <BaseButton type='primary' className='btn-follow'>
                    Theo dõi
                </BaseButton>
            </div>
            <div className='layout-container'>
                <div className='left-content'>
                    <MenuSideBar />
                </div>
                <div className='main-content'>
                    {loading && <LoadingFullView size='large' className='list-loading' />}
                    {data ?
                        <>
                            <BaseList<PostCardType> data={data.data} Item={PostCard} />
                            <Pagination total={data.total_page} pageSize={20} onChange={(page) => setCurrentPage(page)} />
                        </> : <Empty description='Sorry, something went wrong!' />}
                </div>
                <div className='right-content'>
                    <SideBarRight />
                </div>
            </div>
        </AppWrap>
    )
}