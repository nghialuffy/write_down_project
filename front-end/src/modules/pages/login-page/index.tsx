import { Form, Input, Button, Checkbox } from 'antd';
import React, { useState } from 'react';
import { AppWrap } from '../../../components';
import AuthService from "../../../service/user/auth";
import { AxiosError, AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import logo from './../../../assets/logo.png'

export function LoginPage () {
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
        AuthService.login(values.username, values.password)
        setMessage(localStorage.getItem('user')+"");
        
        history.push("/");
        console.log(message)
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
                


                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>

        </AppWrap>
    )
}