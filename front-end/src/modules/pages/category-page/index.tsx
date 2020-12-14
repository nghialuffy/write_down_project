import React from 'react';
import { useParams } from 'react-router-dom';
import { AppWrap } from '../../../components';

export function CategoryPage() {
    let { category } = useParams<{category: string}>();
    return (
        <AppWrap>
            <p>This is category page.</p>
            <p>{`Category: ${category}`}</p>
        </AppWrap>
    )
}