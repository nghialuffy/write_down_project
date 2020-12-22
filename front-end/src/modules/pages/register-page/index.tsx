import { Form, Input, Button, Checkbox } from 'antd';
import React, { useState } from 'react';
import { AppWrap } from '../../../components';
import './style.scss';
import AuthService from "../../../service/user/auth";
import { AxiosError, AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import logo from './../../../assets/logo.png'
export function RegisterPage() {
    const [register_form] = Form.useForm();
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    let history = useHistory();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    const onFinish = (values: any) => {
        AuthService.register(values.username, values.password).then(
            (response: AxiosResponse) => {
                setMessage(response.data);
                setSuccessful(true);
            },
            (error: AxiosError) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setSuccessful(false);
            }
        );
        console.log(message)
        history.push("/");
    };


    return (
        <AppWrap>
            <img src={logo} alt='Write Down logo' className='logo' height='300' width = '300'/>
            <Form
                form={register_form}
                {...layout}
                name="register_form"
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

        </AppWrap>
    )
}