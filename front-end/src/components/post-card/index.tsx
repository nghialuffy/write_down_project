import moment from 'moment';
import React, { useContext, useState } from 'react';
import { UserAvatar } from '..';
import { CaretUpOutlined, CaretDownOutlined, EyeOutlined, CommentOutlined } from '@ant-design/icons';
import './style.scss';
import { MiniData, PostCardType, UserPostCardType } from '../../model';
import { DataAccess, useEntityData } from '../../access';
import { UserType, CategoryType } from '../../model';
import { Link, useHistory } from 'react-router-dom';
import { ErrorText } from '../style-components';
import { HTTPCodeLabel } from '../../const';
import { LoadingFullView } from '../loading';
import { UserContext } from '../../context';

export function PostCard({ data }: { data: PostCardType }) {
    const { loading: userLoading, data: user, status: userStatus } = useEntityData<UserType>(`user/${data.created_by}`);
    const { loading: categoryLoading, data: category, status: categoryStatus } = useEntityData<CategoryType>(`categories/${data.category}`);
    const userContext = useContext(UserContext);
    const history = useHistory();
    const [status, setStatus] = useState(data.is_voted ?? 0);
    const [voteNumber, setVoteNumber] = useState(data.vote);
    const voteHandler = (action: 'up' | 'down') => {
        if (!userContext._id) {
            history.push('/login');
        } else {
            if (action === 'up') {
                if (status === 1) {
                    DataAccess.Post(`post/${data._id}/vote/unvote`).then(() => {
                        setStatus(0);
                        setVoteNumber(prev => prev - 1);
                    }).catch(e => console.log('Error >', e));
                } else {
                    DataAccess.Post(`post/${data._id}/vote/up`).then(() => {
                        setStatus(1);
                        if (status === -1) {
                            setVoteNumber(prev => prev + 2);
                        } else {
                            setVoteNumber(prev => prev + 1);
                        }
                    }).catch(e => console.log('Error >', e));
                }
            } else {
                if (status === -1) {
                    DataAccess.Post(`post/${data._id}/vote/unvote`).then(() => {
                        setStatus(0);
                        setVoteNumber(prev => prev + 1);
                    }).catch(e => console.log('Error >', e));
                } else {
                    DataAccess.Post(`post/${data._id}/vote/down`).then(() => {
                        setStatus(-1);
                        if (status === 1) {
                            setVoteNumber(prev => prev - 2);
                        } else {
                            setVoteNumber(prev => prev - 1);
                        }
                    }).catch(e => console.log('Error >', e));
                }
            }
        }
    }
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
            <Link className='post-card-content' to={`/post-detail/${data._id}`}>
                {data.url_image && <div className='card-img'>
                    <img src={data.url_image}
                        alt='post-card-img'
                    />
                </div>}
                <h3 className='content-title'>{data.title}</h3>
                <p className='content-truncate'>{data.content.slice(0, 200)}...
                </p>
            </Link>
            <div className='post-card-footer'>
                <div className='footer-content-left'>
                    <span className='vote-number'>{voteNumber}</span>
                    <CaretUpOutlined
                        className={`up-vote ${status === 1 ? 'voted' : ''}`}
                        onClick={() => voteHandler('up')}
                    />
                    <CaretDownOutlined
                        className={`down-vote ${status === -1 ? 'voted' : ''}`}
                        onClick={() => voteHandler('down')}
                    />
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

export {UserPostCard} from './user-post-card';
