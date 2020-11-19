import React from 'react';

type MiniData = {
    _id: string;
}

type UserAvatarProps <T extends MiniData> = {
    data: T
    url?: string,
}

export function UserAvatar<T extends MiniData> ({data} : UserAvatarProps<T>) {
    return (
        <div>
            
        </div>
    )
}