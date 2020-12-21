import { Pagination } from 'antd';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CategoryImage } from '../../../assets/Images';
import { AppWrap, BaseButton, MenuSideBar, PostCard, PostItem } from '../../../components';
import { Categories } from '../../../constants';
import './style.scss';

export function CategoryPage() {
    let { category } = useParams<{ category: keyof typeof CategoryImage }>();
    let { type } = useParams<{ type: string }>();
    const history = useHistory();
    if (!type) {
        history.push(`/posts/${category}/hot`)
    }

    const categoryItemData = {
        _id: '1',
        value: category,
        display: Categories.filter(item => item.value === category)[0].label,
        follow: true
    }
    return (
        <AppWrap>
            <div className='category-header' style={{ backgroundImage: `url(${CategoryImage[category].default})` }}>
                <div className='category-label'>{categoryItemData.display}</div>
                <BaseButton type={categoryItemData.follow ? 'primary' : 'default'} className='btn-follow'>
                    {categoryItemData.follow ? 'Huỷ theo dõi' : 'Theo dõi'}
                </BaseButton>
            </div>
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
                    <PostItem />
                    <PostItem />
                    <PostItem />
                </div>
            </div>
        </AppWrap>
    )
}