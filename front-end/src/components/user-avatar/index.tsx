import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

type MiniData = {
    _id: string;
    avatar?: string
}

type UserAvatarProps <T extends MiniData> = {
    data: T
    size?: 'small' | 'large'
}

export function UserAvatar<T extends MiniData> ({data, size = 'small'} : UserAvatarProps<T>) {
    return (
        <Link to={`/profile/${data._id}`}>
            {data.avatar ? <img src={data.avatar} alt='avatar' className={`user-avatar ${size}`} />:
                <div className={`user-avatar none-picture ${size}`}></div>
            }
        </Link>
    )
}