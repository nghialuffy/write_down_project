import moment from 'moment';
import React from 'react';
import { UserAvatar } from '..';
import { CaretUpOutlined, CaretDownOutlined, EyeOutlined, CommentOutlined } from '@ant-design/icons';
import './style.scss';
import { PostCardType } from '../../model';
import { useEntityData } from '../../access';
import { UserType, CategoryType } from '../../model';
import { Link } from 'react-router-dom';
import { ErrorText } from '../style-components';
import { HTTPCodeLabel } from '../../const';
import { LoadingFullView } from '../loading';

export function PostCard({ data }: { data: PostCardType }) {
    const { loading: userLoading, data: user, status: userStatus } = useEntityData<UserType>(`user/${data.created_by}`);
    const { loading: categoryLoading, data: category, status: categoryStatus } = useEntityData<CategoryType>(`categories/${data.category}`)
    return (
        <div className='post-card'>
            <div className='post-card-info'>
                {(userLoading || categoryLoading) && <LoadingFullView className='item-loading' />}
                {user && <UserAvatar data={user} />}
                <div className='info-content'>
                    <div className='info-content-top'>
                        <Link
                            to={`/profile/${user?._id}`}
                            className='username'
                        >
                            {userStatus === "200" ? user?.username : <ErrorText>{`[${userStatus}] ${HTTPCodeLabel(userStatus)}`}</ErrorText>}
                        </Link>
                        <span className='linking-word'>trong</span>
                        <Link to={`/posts/${category?.url}`} className='category'>
                            {categoryStatus === "200" ? category?.name_category :
                                <ErrorText>{`[${categoryStatus}] ${HTTPCodeLabel(categoryStatus)}`}</ErrorText>}
                        </Link>
                    </div>
                    <div className='info-content-bottom'>
                        {moment(data.created_date).fromNow()}
                        <span>{`${data.time_to_read} phút đọc`}</span>
                    </div>
                </div>
            </div>
            <Link className='post-card-content' to={`/post/detail/${data._id}`}>
                {data.url_image && <div className='card-img'>
                    <img src='https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-thumbnails/30ec2e70379d11eb9e72bd946431b3ae.jpg'
                        alt='post-card-img'
                    />
                </div>}
                <h3 className='content-title'>{data.title}</h3>
                <p className='content-truncate'>{data.content}
                </p>
            </Link>
            <div className='post-card-footer'>
                <div className='footer-content-left'>
                    <span className='vote-number'>{data.vote}</span>
                    <CaretUpOutlined className='up-vote' />
                    <CaretDownOutlined className='down-vote' />
                </div>
                <div className='footer-content-right'>
                    <div className='seen-number'>
                        <EyeOutlined />
                        {data.views}
                    </div>
                    <div className='comment-number'>
                        <CommentOutlined />
                        {data.comments}
                    </div>
                </div>
            </div>
        </div>
    );
}