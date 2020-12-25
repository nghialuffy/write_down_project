import React, { useContext, useEffect, useState } from 'react';
import { CaretUpOutlined, CaretDownOutlined, EyeOutlined, CommentOutlined } from '@ant-design/icons';
import { DataAccess, useEntityData } from '../../../../access';
import { PostDetailType } from '../../../../model';
import { useHistory, useParams } from 'react-router-dom';
import './style.scss';
import { UserContext } from '../../../../context';

export function ListTool() {
    let { postId } = useParams<{ postId: string }>();
    const userContext = useContext(UserContext);
    const history = useHistory();
    const {loading, data} = useEntityData<PostDetailType>(`post/${postId}`);
    const [voteStatus, setStatus] = useState(0);
    const [voteNumber, setVoteNumber] = useState(0);
    useEffect(() => {
        if (data) {
            setStatus(data.is_voted);
            setVoteNumber(data.vote);
        }
    },[data])
    
    const voteHandler = (action: 'up' | 'down') => {
        if (!userContext._id) {
            history.push('/login');
        } else {
            if (action === 'up') {
                if (voteStatus === 1) {
                    DataAccess.Post(`post/${postId}/vote/unvote`).then(() => {
                        setStatus(0);
                        setVoteNumber(prev => prev - 1);
                    }).catch(e => console.log('Error >', e));
                } else {
                    DataAccess.Post(`post/${postId}/vote/up`).then(() => {
                        setStatus(1);
                        if (voteStatus === -1) {
                            setVoteNumber(prev => prev + 2);
                        } else {
                            setVoteNumber(prev => prev + 1);
                        }
                    }).catch(e => console.log('Error >', e));
                }
            } else {
                if (voteStatus === -1) {
                    DataAccess.Post(`post/${postId}/vote/unvote`).then(() => {
                        setStatus(0);
                        setVoteNumber(prev => prev + 1);
                    }).catch(e => console.log('Error >', e));
                } else {
                    DataAccess.Post(`post/${postId}/vote/down`).then(() => {
                        setStatus(-1);
                        if (voteStatus === 1) {
                            setVoteNumber(prev => prev - 2);
                        } else {
                            setVoteNumber(prev => prev - 1);
                        }
                    }).catch(e => console.log('Error >', e));
                }
            }
        }
    }

    return data ? (
        <div className='list-tools'>
            <div className='tool'>
                <CaretUpOutlined 
                    disabled 
                    className={`up-vote ${voteStatus === 1 ? 'voted' : ''}`}
                    onClick={() => voteHandler('up')}
                />
                {voteNumber}
                <CaretDownOutlined 
                    className={`down-vote ${voteStatus === -1 ? 'voted' : ''}`}
                    onClick={() => voteHandler('down')}
                />
            </div>
            <div className='tool'>
                <EyeOutlined />
                {data.views}
            </div>
            <div className='tool'>
                <CommentOutlined />
                {data.list_comment.length}
            </div>
        </div>
    ): null;
};