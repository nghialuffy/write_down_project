import React from 'react';
import { UserAvatar } from '../../../components';

export function HomePage () {
    return(
        <div>
            This is home page.
            <UserAvatar data={{
                _id: '1230',
                avatar_url: 'https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/4db955d02a8911ebacbfc9142b6c25a5.jpg'
            }}/>
        </div>
    )
}