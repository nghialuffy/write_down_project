import { Form, Input, Button, Checkbox, notification } from 'antd';
import React, { useState } from 'react';
import { AppWrap } from '../../../components';
import { useHistory } from 'react-router-dom';
import logo from './../../../assets/logo.png'
import { DataAccess } from '../../../access';
import './style.scss';
import { HTTPCodeLabel } from '../../../const';
export function RegisterPage() {
    const [register_form] = Form.useForm();

    let history = useHistory();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const onFinish = (values: any) => {
        let data = {
            'username': values.username,
            'password': values.password,
            'display_name': values.display_name,
            'email': values.email
        }
        DataAccess.Post('register', JSON.stringify(data)).then(res => {
            if (res) history.push("/login");
            notification.success({
                message: "Sign up successfully. Please login!"
            })
        }).catch(e => {
            notification.error({
                message: "Error",
                description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
            });
        });
    };


    return (
        <div className='page-no-wrap'>
            <img src={logo} alt='Write Down logo' className='logo' height='300' width = '300'/>
            <Form
                form={register_form}
                {...layout}
                name="register_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Name"
                    name="display_name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>
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
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
}