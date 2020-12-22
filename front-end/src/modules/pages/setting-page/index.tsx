import { Empty, Spin, Form, Upload, Input, DatePicker, Radio, Button } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEntityData } from '../../../access';
import { AppWrap } from '../../../components';
import { UserType } from '../../../model';
function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function onChange(date: any, dateString: String) {
    console.log(date, dateString);
}
export function SettingPage() {
    let [gender, setGender] = useState('Male');
    const { loading, data } = useEntityData<UserType>(`user/5fd2f7299790847c4e1258bb`);
    const [setting_form] = Form.useForm();
    const onGenderChange = (e: any) => {
        console.log('radio checked', e.target.value);
        setGender(e.target.value);
    };
    return (
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content' />
                <div className='main-content'>
                    {loading && <Spin size='large' className='list-loading' />}
                    {data ?
                        <>

                        </> : <Empty description='Sorry, something went wrong!' />}
                    <Form
                        form={setting_form}
                        name="setting_form"
                    // onFinish={onFinish} 
                    >
                        <Form.Item
                            label="Bio:"
                            name="bio"
                            rules={[{ required: false, message: 'Please input your username!' }]}
                        >
                            <Input value={data?.bio} placeholder="Bio" />
                        </Form.Item>
                        <Form.Item
                            label="Tên hiển thị:"
                            name="display_name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input value={data?.display_name} placeholder="Tên hiển thị" />
                        </Form.Item>
                        <Form.Item
                            label="Ngày sinh:"
                            name="birthday"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <DatePicker onChange={onChange} />
                        </Form.Item>
                        <Form.Item
                            label="Giới tính:"
                            name="gender">
                            <Radio.Group onChange={onGenderChange} value={gender}>
                                <Radio value={"Male"}>Nam</Radio>
                                <Radio value={'Female'}>Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="Email:"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}>
                            <Input placeholder="email" value={data?.username}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" >Submit</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='right-content' />
            </div>
        </AppWrap>
    );
}