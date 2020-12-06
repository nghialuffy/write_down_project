import React from 'react';
import { UserAvatar } from '../../../components';

export function PostCard () {
    return (
        <div className='post-card'>
            <div className='post-card-info'>
                <UserAvatar data={{
                    _id: '12333',
                    avatar_url: 'https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/e0134d8000c911ebb2e9f38cb09f8367.png'
                }}/>
                <span className='username'>Shailly</span>
                <span>trong</span>
                <a href='https://spiderum.com/hot?page=1'>Phim</a>
            </div>
            <a className='post-card-content' href='https://spiderum.com/hot?page=1'>
                <img src='https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-thumbnails/30ec2e70379d11eb9e72bd946431b3ae.jpg'
                    alt='post-card-img'
                />
                <h3 className='content-title'>"Before we go" – Trước lúc ta lên đường</h3>
                <p> Bạn đã bao giờ gặp một ai đó cho bạn cái cảm giác yên tâm kì lạ kể cả khi bạn mới gặp người đó lần đầu hay chưa? 
                    Tôi thì có rồi, đó là một người lạ...
                </p>
            </a>
            <div className='post-card-footer'>
                <span className='vote-number'>3</span>
            </div>
        </div>
    );
}