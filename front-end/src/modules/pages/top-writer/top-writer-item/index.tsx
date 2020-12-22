import React from 'react';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../../../components';
import { TopUserType } from '../../../../model';
import './style.scss';

export function TopWriterItem({data} : {data: TopUserType}) {
    return (
        <Link className='top-writer-item' to={`profile/${data._id}`}>
            <UserAvatar data={data} />
            <div className='display-name'>{data.display_name}</div>
        </Link>
    )
}