import React from 'react';
import moment from 'moment'
import { UserAvatar } from '..';
import './style.scss';
import { PostItemType, UserType } from '../../model';
import { useEntityData } from '../../access';
import { Link } from 'react-router-dom';
import { LoadingFullView } from '../loading';
import { ErrorText } from '../style-components';
import { HTTPCodeLabel } from '../../const';

export function PostItem ({data} : {data: PostItemType}) {
    const {loading, data: user, status} = useEntityData<UserType>(`user/${data.created_by}`);
    return (
        <div className='post-item'>
            {loading && <LoadingFullView className='loading-item'/>}
            {user && <UserAvatar data={user}/>}
            <div className='post-item-content'>
                <Link to={`/post-detail/${data._id}`} className='post-title'>
                    {data.title} 
                </Link>
                <div className='sub-title'>
                    <span>bởi</span>
                    <Link to={`/profile/${user?._id}`} className='username'>
                        {status === '200' ? user?.display_name : <ErrorText>{`[${status}] ${HTTPCodeLabel(status)}`}</ErrorText>}
                    </Link>
                    <span>{moment(data.created_date).fromNow()}</span>
                </div>
            </div>
        </div>
    );
}