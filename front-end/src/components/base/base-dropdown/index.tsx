import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './style.scss'

type DropdownDataItem = {
    text: string,
    link: string
}

type BaseDropDownProps = {
    buttonText: string,
    schema: Array<DropdownDataItem>
    className?: string
}

export function BaseDropDown({
    buttonText,
    schema,
    className,
}: BaseDropDownProps) {
    const menu = (
        <Menu>
            {schema.map(item => {
                return (
                    <Menu.Item key={item.text}>
                        <a href={item.link}>
                            {item.text}
                        </a>
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    return (
        <Dropdown 
            overlay={menu} 
            className={['base-dropdown', className].filter(Boolean).join(' ')}
            >
            <Button>
                {buttonText} <DownOutlined />
            </Button>
        </Dropdown>
    );
}