import React, {useContext} from 'react';
import { UserContext } from '../../context';

type MiniData = {
    _id: string;
}

type UserAvatarProps <T extends MiniData> = {
    data: T
}

export function UserAvatar<T extends MiniData> ({data} : UserAvatarProps<T>) {
    const userContext = useContext(UserContext);
    if (data._id === userContext.userId)
    return (
        <div>
            
        </div>
    )
}