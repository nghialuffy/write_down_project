import React from 'react';
import { useParams } from 'react-router-dom';

export function CategoryPage() {
    let { category } = useParams<{category: string}>();
    return (
        <div>
            <p>This is category page.</p>
            <p>{`Category: ${category}`}</p>
        </div>
    )
}