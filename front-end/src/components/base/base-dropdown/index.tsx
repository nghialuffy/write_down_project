import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './style.scss'

type BaseDropDownProps = {
    button: React.ReactNode,
    data: Array<any>
    className?: string
    Item: React.ComponentType<{data: any}>
}

export function BaseDropDown({
    button,
    data,
    className,
    Item
}: BaseDropDownProps) {
    const menu = (
        <Menu className='menu-base-dropdown'>
            {data.map((item, index) => {
                return (
                    <Menu.Item key={index}>
                        <Item data={item} />
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    return (
        <Dropdown 
            overlay={menu} 
            className={['base-dropdown', className].filter(Boolean).join(' ')}
            trigger={['click']}
            >
            <Button onClick={e => e.preventDefault()}>
                {button} <DownOutlined />
            </Button>
        </Dropdown>
    );
}