import moment from 'moment';
import React from 'react';
import { UserAvatar } from '..';
import { CaretUpOutlined, CaretDownOutlined, EyeOutlined, CommentOutlined } from '@ant-design/icons';
import './style.scss';

export function PostCard () {
    return (
        <div className='post-card'>
            <div className='post-card-info'>
                <UserAvatar data={{
                    _id: '12333',
                    avatar_url: 'https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/e0134d8000c911ebb2e9f38cb09f8367.png'
                }}/>
                <div className='info-content'>
                    <div className='info-content-top'>
                        <a href='https://spiderum.com/hot?page=1' className='username'>Shailly</a>
                        <span className='linking-word'>trong</span>
                        <a href='https://spiderum.com/hot?page=1' className='category'>Phim</a>                       
                    </div>
                    <div className='info-content-bottom'>
                        {moment('2020-12-08T11:17:17.862041+00:00').fromNow()}
                    </div>
                </div>
            </div>
            <a className='post-card-content' href='https://spiderum.com/hot?page=1'>
                <div className='card-img'>
                    <img src='https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-thumbnails/30ec2e70379d11eb9e72bd946431b3ae.jpg'
                        alt='post-card-img'
                    />
                </div>
               
                <h3 className='content-title'>"Before we go" – Trước lúc ta lên đường</h3>
                <p className='content-truncate'> Bạn đã bao giờ gặp một ai đó cho bạn cái cảm giác yên tâm kì lạ kể cả khi bạn mới gặp người đó lần đầu hay chưa? 
                    Tôi thì có rồi, đó là một người lạ...
                </p>
            </a>
            <div className='post-card-footer'>
                <div className='footer-content-left'>
                    <span className='vote-number'>3</span>
                    <CaretUpOutlined className='up-vote'/>
                    <CaretDownOutlined className='down-vote'/>
                </div>
                <div className='footer-content-right'>
                    <div className='seen-number'>
                        <EyeOutlined />
                        246
                    </div>
                    <div className='comment-number'>
                        <CommentOutlined />
                        5
                    </div>
                </div>
            </div>
        </div>
    );
}