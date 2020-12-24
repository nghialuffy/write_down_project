import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppWrap, PostEditor } from '../../../components';
import { UserContext } from '../../../context';

export function NewPostPage() {
    const userContext = useContext(UserContext);
    const history = useHistory();
    if (!userContext._id) {
        history.push('/login');
    }
    return (
        <AppWrap>
            <PostEditor />
        </AppWrap>

    );
}
