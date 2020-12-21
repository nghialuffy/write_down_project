import React from 'react';
import { useParams } from 'react-router-dom';
import { AppWrap } from '../../../components';

export function UserProfilePage () {
    let { id } = useParams<{id: string}>();
    return(
        <AppWrap>
            <p>This is user profile page.</p>
            <p>{`user id: ${id}`}</p>
        </AppWrap>
    )
}