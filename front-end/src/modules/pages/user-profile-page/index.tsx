import React from 'react';
import { useParams } from 'react-router-dom';

export function UserProfilePage () {
    let { id } = useParams<{id: string}>();
    return(
        <div>
            <p>This is user profile page.</p>
            <p>{`user id: ${id}`}</p>
        </div>
    )
}