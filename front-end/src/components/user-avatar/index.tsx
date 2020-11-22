import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

type MiniData = {
    _id: string;
    avatar_url: string
}

type UserAvatarProps <T extends MiniData> = {
    data: T
    size?: 'small' | 'large'
}

export function UserAvatar<T extends MiniData> ({data, size = 'small'} : UserAvatarProps<T>) {
    return (
        <Link to={`/profile/${data._id}`}>
            <img src={data.avatar_url} alt='avatar' className={`user-avatar ${size}`} />
        </Link>
    )
}