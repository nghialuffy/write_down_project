import { Empty, Spin, Form, Input, notification, Avatar, Button } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { DataAccess, useEntityData } from '../../../access';
import { AppWrap, UserAvatar } from '../../../components';
import { UserType } from '../../../model';
import './style.scss';
import UserBackground from '../../../assets/user-background.jpg';
import { HTTPCodeLabel } from '../../../const';
import { useHistory } from 'react-router-dom';


export function SettingPage() {
    let history = useHistory();
    let [id, setID] = useState("");
    useEffect(() => {
        DataAccess.Get('auth').then(res => {
            setID(res.data._id);
        })

    })
    const { loading, data } = useEntityData<UserType>(`user/${id}`);
    const [setting_form] = Form.useForm();


    const onCoverChange = (e: any) => {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append('upload_preset', "wfcqkljk");
        DataAccess.IMAGEPost(formData)
            .then(res => {
                console.log(res.data);
                let update_cover = {
                    "cover_img": res.data.url,
                }
                DataAccess.Put('profile', JSON.stringify(update_cover))
                    .then(res => {
                        notification.success({
                            message: "Update cover success!"
                        });
                        window.location.reload();
                    }).catch(e => {
                        notification.error({
                            message: "Error",
                            description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                        });
                    });;
            });
    };
    const onAvatarChange = (e: any) => {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append('upload_preset', "wfcqkljk");
        DataAccess.IMAGEPost(formData)
            .then(res => {
                console.log(res.data);
                let update_profile = {
                    "avatar": res.data.url,
                }
                DataAccess.Put('profile', JSON.stringify(update_profile))
                    .then(res => {
                        notification.success({
                            message: "Update cover success!"
                        });
                    }).catch(e => {
                        notification.error({
                            message: "Error",
                            description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                        });
                    });;
            });
    };
    const onPasswordChange = (values: any) => {
        let update_password = {
            'old_password': values.old_password,
            'new_password': values.new_password,
        }
        DataAccess.Put('update_password', JSON.stringify(update_password))
            .then(res => {
                notification.success({
                    message: "Update password success!"
                });
            }).catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
            });
    };
    const onInfoChange = (values: any) => {
        let update_password = {
            "display_name": values.display_name,
            "email": values.email,
        }
        DataAccess.Put('profile', JSON.stringify(update_password))
            .then(res => {
                notification.success({
                    message: "Update profile success!"
                });
            }).catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
            });
    };
    return (
        <AppWrap>
            <div className='layout-container'>
                <div className='left-content' />
                <div className='main-content'>

                    {loading && <Spin size='large' className='list-loading' />}
                    {data ? <div className='user-detail layout-container'>
                        <div className='user-profile'>
                            <label className="cover-upload">
                                {data.cover_img === "" ? <img id="cover" src={UserBackground} alt='user-background' className='user-background'></img>
                                    : <img src={data.cover_img} alt='user-background' className='user-background'></img>}
                                <Input
                                    type="file"
                                    className="hidden"
                                    onChange={onCoverChange}></Input>
                            </label>
                            <div className='user-info-slot'>

                                <label className="cover-upload">
                                    <Avatar src={data.avatar} size={90} />
                                    <Input
                                        type="file"
                                        className="hidden"
                                        onChange={onAvatarChange}></Input>
                                </label>
                                <div className='slot-content'>
                                    <div className='slot-content-top'>
                                        <Form
                                            form={setting_form}
                                            name="setting_form"
                                        onFinish={onInfoChange} 
                                        >
                                            <Form.Item
                                                label="Bio:"
                                                name="bio"
                                            >
                                                <Input defaultValue={data.bio} placeholder={data.bio} />
                                            </Form.Item>
                                            <Form.Item
                                                label="Tên hiển thị:"
                                                name="display_name"
                                                rules={[{ required: true, message: 'Please input your name!' }]}
                                            >
                                                <Input defaultValue={data.display_name} placeholder={data.display_name} />
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
                                                        required: false,
                                                        message: 'Please input your E-mail!',
                                                    },
                                                ]}>
                                                <Input placeholder='Email' defaultValue={data.display_name}></Input>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" >Cập nhật</Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                    <div className='slot-content-middle'>
                                        <Form
                                            onFinish={onPasswordChange}>
                                            <Form.Item
                                                label="Old Password"
                                                name="old_password"
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
                                                label="New Password"
                                                name="new_password"
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
                                                            if (!value || getFieldValue('new_password') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject('The two passwords that you entered do not match!');
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input.Password />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" >Đổi mật khẩu</Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <Empty description='Sorry, something went wrong!' />}


                </div>
                <div className='right-content' />
            </div>
        </AppWrap>
    );
}