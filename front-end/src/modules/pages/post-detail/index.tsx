import React from 'react';
import {UpOutlined, DownOutlined, MessageOutlined, EyeOutlined} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useEntityData } from '../../../access';
import { PostDetailType } from '../../../model';
import { AppWrap, ListComment, LoadingFullView, UserAvatar } from '../../../components';
import moment from 'moment';
import { Empty } from 'antd';
import { Markup } from 'interweave';
import {ListTool} from './list-tools';
import './style.scss';

export function PostDetailPage() {
    let { postId } = useParams<{ postId: string }>();
    console.log('post id', postId);

    const { loading, data } = useEntityData<PostDetailType>(`post/${postId}`);
    return (
        <AppWrap>
            {loading && <LoadingFullView />}
            {data ? <div className='layout-container post-detail-layout'>
                <div className='left-content list-tools'>
                    <div className='tool'>
                        <UpOutlined />
                        {data.vote}
                        <DownOutlined />
                    </div>
                    <div className='tool'>
                        <EyeOutlined/>
                        {data.views}
                    </div>
                    <div className='tool'></div>
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
                        <div className='content'>
                            <Markup content={data.content} />
                        </div>
                    </div>
                    <div className='comment-section'>
                        <ListComment/>
                    </div>
                </div>
                <div className='right-content'></div>
            </div> : <Empty description='Sorry, something went wrong!' />}
        </AppWrap>
    )
} 