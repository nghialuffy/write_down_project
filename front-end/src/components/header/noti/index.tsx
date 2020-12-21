import { Button } from 'antd';
import React, { useState } from 'react';
import { BaseButton, BaseDropDown } from '../../base';
import { BellOutlined } from '@ant-design/icons';

export function Notification () {
    const [showNoti, setShowNoti] = useState(false);
    return (
        <div className='notification'>
            <BaseButton type='default' onClick={() => setShowNoti(!showNoti)}>
                <BellOutlined />
            </BaseButton>
            
        </div>
    ); 
}