
import React from 'react';
import './style.scss';

type BaseListProps<T extends {_id: string}> = {
    data: Array<T>;
    Item: React.ComponentType<{ data: T }>;
    className?: string;
    showPagination?: boolean
    pageSize?: number
};

export function BaseList<T extends {_id: string}>({
    data,
    Item,
    className,
    showPagination = true,
    pageSize = 25
}: BaseListProps<T>) {
    function renderItem() {
        return data.map((item) => <Item data={item} key={item._id} />);
    }
    return (
        <>
            <div className={['base-list', className].filter(Boolean).join(' ')}>{renderItem()}</div>
            <div></div>
        </>
    );
}