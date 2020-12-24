import React, { useContext, useState } from 'react';
import { CaretUpOutlined, CaretDownOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useEntityData } from '../../../access';
import { PostDetailType } from '../../../model';
import { AppWrap, BaseButton, ListComment, LoadingFullView, PostEditor, UserAvatar } from '../../../components';
import moment from 'moment';
import { Empty } from 'antd';
import { Markup } from 'interweave';
import { ListTool } from './list-tools';
import './style.scss';
import { UserContext } from '../../../context';

export function PostDetailPage() {
    let { postId } = useParams<{ postId: string }>();
    const userContext = useContext(UserContext);
    const [editMode, setEditMode] = useState(false);
    console.log('post id', postId);

    const { loading, data } = useEntityData<PostDetailType>(`post/${postId}`);
    return (
        <AppWrap>
            {loading && <LoadingFullView />}
            {data ? <div className='layout-container post-detail-layout'>
                {!editMode && <div className='left-content'>
                    <ListTool />
                </div>}
                <div className='main-content post-detail'>
                    <div className='post-info'>
                        <div className='content-left'>
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

                        {userContext._id === data.created_by._id && !editMode &&
                            <BaseButton type='primary' onClick={() => setEditMode(true)}>Edit</BaseButton>
                        }
                    </div>
                    <div className='post-content'>
                        {!editMode ? <> <div className='post-title'>{data.title}</div>
                            <div className='content'>
                                <Markup content={data.content} />
                            </div>
                            <div className='comment-section'>
                                <ListComment />
                            </div>
                        </> :
                            <PostEditor
                                title={data.title}
                                oldContent={data.content}
                                category={data.category.url}
                                postId={postId}
                            />}
                    </div>

                </div>
                {!editMode && <div className='right-content'></div>}
            </div> : <Empty description='Sorry, something went wrong!' />}
        </AppWrap>
    )
} 