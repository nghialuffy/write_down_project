import React from 'react';
import moment from 'moment'
import { UserAvatar } from '..';
import './style.scss';

export function PostItem () {
    return (
        <div className='post-item'>
            <UserAvatar data={{
                _id: '12333',
                avatar_url: 'https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/e0134d8000c911ebb2e9f38cb09f8367.png'
            }}/>
            <div className='post-item-content'>
                <a href='https://spiderum.com/hot?page=1' className='post-title'>
                    Ổn định không phải là làm mãi ở một nơi mà là đi đâu cũng ổn định 
                </a>
                <div className='sub-title'>
                    <span>bởi</span>
                    <a href='https://spiderum.com/hot?page=1' className='username'>Hex</a>
                    <span>{moment('2020-12-08T11:17:17.862041+00:00').fromNow()}</span>
                </div>
            </div>
        </div>
    );
}