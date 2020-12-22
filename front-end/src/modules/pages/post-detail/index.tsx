import React from 'react';
import { useParams } from 'react-router-dom';
import { AppWrap } from '../../../components';

export function PostDetailPage () {
    let { id } = useParams<{ id: string }>();
    return (
        <AppWrap>
            
        </AppWrap>
    )
} 