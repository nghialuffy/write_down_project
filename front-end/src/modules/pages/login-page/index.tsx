import { Form, Input, Button, Checkbox, notification } from 'antd';
import React, { useState } from 'react';
import { AppWrap } from '../../../components';
import { useHistory } from 'react-router-dom';
import logo from './../../../assets/logo.png'
import { DataAccess } from '../../../access';
import { HTTPCodeLabel } from '../../../const';

export function LoginPage () {
    const [login_form] = Form.useForm();
    let history = useHistory();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const onFinish = (values: any) => {
        DataAccess.Post('login ', JSON.stringify(values)).then(res => {
            if (res) history.push("/");
            localStorage.setItem('token', res.data?.token);
            notification.success({
                message: "Login successfully!"
            })
        })
        .catch(e => {
            
            notification.error({
            message: "Error",
            description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
        }); });
    };


    return (
        <AppWrap>
            <img src={logo} alt='Write Down logo' className='logo' height='300' width = '300'/>
            <Form
                form={login_form}
                {...layout}
                name="login_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        }]}
                >
                    <Input.Password />
                </Form.Item>
                


                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>

        </AppWrap>
    )
}