import React, { useContext } from 'react';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { AppWrap, BaseButton, BaseList, LoadingFullView, PostCard, UserAvatar, UserPostCard } from '../../../components';
import UserBackground from '../../../assets/user-background.jpg';
import { useEntityData } from '../../../access';
import { MiniData, PostCardType, UserPostCardType, UserType } from '../../../model';
import { Empty } from 'antd';
import './style.scss';
import { UserContext } from '../../../context';
import Item from 'antd/lib/list/Item';

export function UserProfilePage() {
    let { id } = useParams<{ id: string }>();
    const { loading, data: user } = useEntityData<UserType>(`user/${id}`);
    const userContext = useContext(UserContext);
    return (
        <AppWrap>
            {loading && <LoadingFullView />}
            {user ? <div className='user-detail layout-container'>
                <div className='user-profile'>
                    <div style={{ backgroundImage: `${user.cover_img ? `url(${user.cover_img})` : '#ccc'}` }} className='user-background' />
                    <div className='user-info-slot'>
                        {user._id === userContext._id &&
                            <Link to='/setting'>
                                <BaseButton type='primary' className='right-btn'>Edit</BaseButton>
                            </Link>}
                        <UserAvatar data={user} size='large' />
                        <div className='slot-content'>
                            <div className='slot-content-top'>
                                {user.display_name && `${user.display_name} - `} <span className='username'>@{user.username}</span>
                            </div>
                            <div className='slot-content-middle'>{user.bio}</div>
                            {/* <div className='slot-content-bottom'>
                                <span>{user.followers} Follower</span>
                                <span>{user.followings} Following</span>
                            </div> */}
                        </div>
                    </div>
                    <div className='user-profile-router'>
                        
                    </div>
                </div>
                {user.list_post.length > 0 &&
                    <BaseList<UserPostCardType & {user: MiniData}> 
                        data={user.list_post.map(item => { return {...item, user: {_id: user._id, avatar: user.avatar}}}) as any} 
                        Item={UserPostCard} 
                        className='list-post' />
                }
            </div> : <Empty description='Sorry, something went wrong!' />}
        </AppWrap>
    );
}