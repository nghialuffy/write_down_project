import { Empty, Pagination } from 'antd';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { DataAccess, useEntityDataList } from '../../../access';
import { CategoryImage } from '../../../assets/Images';
import { AppWrap, BaseButton, BaseList, LoadingFullView, MenuSideBar, PostCard, SideBarRight } from '../../../components';
import { Categories } from '../../../constants';
import { UserContext } from '../../../context';
import { ListPostType, PostCardType } from '../../../model';
import './style.scss';

export function CategoryPage() {
    const userContext = useContext(UserContext);
    let { category } = useParams<{ category: keyof typeof CategoryImage }>();
    let { type } = useParams<{ type: string }>();
    const history = useHistory();
    if (!type) {
        history.push(`/posts/${category}/hot`)
    }
    const [currentPage, setCurrentPage] = useState(1);
    const { loading, data } = useEntityDataList<ListPostType>(`s/${category}/${type ?? 'hot'}`, currentPage);

    let follow = userContext.followCategories.filter(item => item.url === category).length > 0 ? true : false;
    const [status, setStatus] = useState(follow);

    const followHandler = (action: 'follow' | 'unfollow') => {
        DataAccess.Post(`categories/${category}/${action}`).then(() => {
            setStatus(!status);
            userContext.getFollowingCategories();
        }).catch(e => {
            console.log('Error > ', e);
        })
    }

    return (
        <AppWrap>
            <div className='category-header' style={{ backgroundImage: `url(${CategoryImage[category].default})` }}>
                <div className='category-label'>{Categories.filter(item => item.value === category)[0].label}</div>
                {userContext._id && (status ? <BaseButton className='btn-follow' onClick={(e) => {
                    followHandler('unfollow');
                }}>
                    Hủy theo dõi
            </BaseButton> : <BaseButton type='primary' className='btn-follow' onClick={(e) => {
                        followHandler('follow');
                    }}>
                        Theo dõi
            </BaseButton>)}
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