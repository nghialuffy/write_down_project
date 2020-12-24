import React from 'react';
import { useParams } from 'react-router-dom';

export function PostDetailPage () {
    let { id } = useParams<{ id: string }>();
    return (
        <div>This is post detail page <span>Post id: {id}</span></div>
    )
} 