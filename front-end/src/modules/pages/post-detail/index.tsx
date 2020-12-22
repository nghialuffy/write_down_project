import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEntityData } from '../../../access';
import { PostDetailType } from '../../../model';
import { AppWrap, LoadingFullView, UserAvatar } from '../../../components';
import moment from 'moment';
import { Empty } from 'antd';
import { Markup } from 'interweave';
import './style.scss';

export function PostDetailPage() {
    let { postId } = useParams<{ postId: string }>();
    console.log('post id', postId);

    const { loading, data } = useEntityData<PostDetailType>(`post/${postId}`);
    return (
        <AppWrap>
            {loading && <LoadingFullView />}
            {data ? <div className='layout-container post-detail-layout'>
                <div className='left-content'>

                </div>
                <div className='main-content post-detail'>
                    <div className='post-info'>
                        <UserAvatar data={data?.created_by as any} />
                        <div className='info-content'>
                            <div className='info-content-top'>
                                <Link
                                    to={`/profile/${data?.created_by?._id}`}
                                    className='username'
                                >
                                    {data?.created_by.display_name}
                                </Link>
                                <span className='linking-word'>trong</span>
                                <Link to={`/posts/${data?.category?.url}`} className='category'>
                                    {data?.category.name_category}
                                </Link>
                            </div>
                            <div className='info-content-bottom'>
                                {moment(data?.created_date).fromNow()}
                            </div>
                        </div>
                    </div>
                    <div className='post-content'>
                        <div className='post-title'>{data.title}</div>
                        <Markup content={data.content} />
                    </div>
                </div>
                <div className='right-content'></div>
            </div> : <Empty description='Sorry, something went wrong!' />}
        </AppWrap>
    )
} 