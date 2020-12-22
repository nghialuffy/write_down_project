import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppWrap, BaseButton, BaseList, LoadingFullView, PostCard, UserAvatar } from '../../../components';
import UserBackground from '../../../assets/user-background.jpg';
import { useEntityData } from '../../../access';
import { PostCardType, UserType } from '../../../model';
import { Empty } from 'antd';
import './style.scss';

export function UserProfilePage() {
    let { id } = useParams<{ id: string }>();
    const { loading, data: user } = useEntityData<UserType>(`user/${id}`);
    return (
        <AppWrap>
            {loading && <LoadingFullView />}
            {user ? <div className='user-detail layout-container'>
                <div className='user-profile'>
                    <img src={UserBackground} alt='user-background' className='user-background' />
                    <div className='user-info-slot'>
                        <UserAvatar data={user} size='large' />
                        <div className='slot-content'>
                            <div className='slot-content-top'>
                                {user.display_name && `${user.display_name} - `} <span className='username'>@{user.username}</span>
                            </div>
                            <div className='slot-content-middle'>{user.bio}</div>
                            <div className='slot-content-bottom'>
                                <span>{user.followers} Follower</span>
                                <span>{user.followings} Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                {user.list_post.length > 0 && 
                    <BaseList<PostCardType> data={user.list_post as any} Item={PostCard} className='list-post'/>
                }
            </div> : <Empty description='Sorry, something went wrong!' />}
        </AppWrap>
    );
}