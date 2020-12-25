import moment from 'moment';
import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserAvatar } from '../..';
import { DataAccess } from '../../../access';
import { UserContext } from '../../../context';
import { MiniData, UserPostCardType } from '../../../model';
import { CaretUpOutlined, CaretDownOutlined, CommentOutlined, DeleteOutlined} from '@ant-design/icons';
import { notification, Tooltip } from 'antd';
import { HTTPCodeLabel } from '../../../const';

export function UserPostCard({ data }: { data: UserPostCardType & { user: MiniData } }) {
    const userContext = useContext(UserContext);
    const history = useHistory();
    const [status, setStatus] = useState(data.voted_user ?? 0);
    const [voteNumber, setVoteNumber] = useState(data.vote);
    const [deleted, setDeleted] = useState(false);

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
    const deleteHandler = () => {
        DataAccess.Delete(`post/${data._id}`).then(() => {
            notification.success({
                message: "Xóa bài thành công!"
            });
            setDeleted(true);
        }).catch((e) => {
            notification.error({
                message: "Error",
                description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
            })
        });
    }
    return !deleted ? (
        <div className='post-card'>
            <div className='post-card-info'>
                <UserAvatar data={data.user} />
                <div className='info-content'>
                    <div className='info-content-top'>
                        <span className='linking-word'>trong</span>
                        <Link to={`/posts/${data.category?.url}`} className='category'>
                            {data.category?.name_category}
                        </Link>
                    </div>
                    <div className='info-content-bottom'>
                        {moment(data.created_date).fromNow()}
                        <span>{`${data.time_to_read} phút đọc`}</span>
                    </div>
                </div>
            </div>
            <Link className='post-card-content' to={`/post-detail/${data._id}`}>
                {data.image && <div className='card-img'>
                    <img src={data.image}
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
                    <div className='comment-number'>
                        <CommentOutlined />
                        {data.comment}
                    </div>
                </div>
            </div>
            {userContext._id === data.user._id && 
                <Tooltip title='Xóa bài'>
                    <DeleteOutlined className='btn-delete' onClick={deleteHandler}/>
                </Tooltip>
            }
        </div>
    ): null;
}