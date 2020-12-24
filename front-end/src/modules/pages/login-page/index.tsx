import { Form, Input, Button, notification, Checkbox } from 'antd';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import logo from './../../../assets/logo.png'
import { DataAccess } from '../../../access';
import { HTTPCodeLabel } from '../../../const';
import { UserContext } from '../../../context';

export function LoginPage() {
    const userContext = useContext(UserContext)
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
        console.log('value', JSON.stringify(values));
        DataAccess.Post('login ', JSON.stringify(values)).then(res => {            
            if (res) history.push("/");
            localStorage.setItem('token', res.data?.token);
            userContext.updateUser({
                _id: res.data._id,
                avatar: res.data.avatar,
                displayName: res.data.display_name
            });
            notification.success({
                message: "Login successfully!"
            })

        })
            .catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
            });
    };


    return (
        <div className='page-no-wrap'>
            <img src={logo} alt='Write Down logo' className='logo' height='300' width='300' />
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
                    <Button type="primary" htmlType="submit">Login</Button>
                </Form.Item>
                    {/* <a className="login-form-forgot" href="">Forgot password </a> */}
                 Or <a href="\register">register now!</a>

            </Form>

        </div>
    )
}