import { Empty, Form, Input, notification, Avatar, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { DataAccess, useEntityData } from '../../../access';
import { AppWrap, LoadingFullView, UserAvatar } from '../../../components';
import { UserType } from '../../../model';
import './style.scss';
import UserBackground from '../../../assets/user-background.jpg';
import { HTTPCodeLabel } from '../../../const';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../context';


export function SettingPage() {
    const userContext = useContext(UserContext);
    const { loading, data } = useEntityData<UserType>(`user/${userContext._id}`);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);
    const [coverImage, setCoverImage] = useState(data?.cover_img);
    const [avatar, setAvatar] = useState(data?.avatar);

    useEffect(() => {
        setCoverImage(data?.cover_img);
        setAvatar(data?.avatar);
    },[data?.cover_img, data?.avatar])

    const [setting_form] = Form.useForm();

    const onCoverChange = (e: any) => {
        setCoverLoading(true);
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append('upload_preset', "wfcqkljk");
        DataAccess.IMAGEPost(formData)
            .then(res => {
                let update_cover = {
                    "cover_img": res.data.url,
                }
                DataAccess.Put('profile', JSON.stringify(update_cover))
                    .then(() => {
                        notification.success({
                            message: "Update cover success!"
                        });
                        setCoverLoading(false);
                        setCoverImage(res.data.url);
                    })
                    .catch(e => {
                        setCoverLoading(false);
                        notification.error({
                            message: "Error",
                            description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                        });
                    });
            }).catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
                setCoverLoading(false);
            })
    };
    const onAvatarChange = (e: any) => {
        setAvatarLoading(true);
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append('upload_preset', "wfcqkljk");
        DataAccess.IMAGEPost(formData)
            .then(res => {
                let update_profile = {
                    avatar: res.data.url,
                }
                DataAccess.Put('profile', JSON.stringify(update_profile))
                    .then(res => {
                        notification.success({
                            message: "Update cover success!",
                        });
                        console.log('res.data', res.data);
                        setAvatar(update_profile.avatar);
                        userContext.updateAvatar(update_profile.avatar);
                        setAvatarLoading(false);
                    }).catch(e => {
                        setAvatarLoading(false)
                        notification.error({
                            message: "Error",
                            description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                        });
                    });;
            }).catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
                setAvatarLoading(false);
            })
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
                    {loading && <LoadingFullView />}
                    {data ? <div className='user-detail layout-container'>
                        <div className='user-profile'>
                            <div className="user-background"
                                style={{ backgroundImage: `${coverImage ? `url(${coverImage})` : '#ccc'}` }}
                            >
                                {coverLoading && <LoadingFullView />}
                                <label className='upload-cover'>
                                    <Input
                                        type="file"
                                        className="input-file"
                                        onChange={onCoverChange}
                                    />
                                    <UploadOutlined />
                                </label>
                            </div>
                            <div className='top-content'>
                                <div className='user-avatar' style={{ backgroundImage: `${avatar ? `url(${avatar})` : '#ccc'}` }}>
                                    {avatarLoading && <LoadingFullView />}
                                    <label className="cover-upload">
                                        <Input
                                            type="file"
                                            className="input-file"
                                            onChange={onAvatarChange}
                                        />
                                        <UploadOutlined />
                                    </label>
                                </div>
                                <div className='basic-info'>
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
                                        <Form.Item className='btn-submit'>
                                            <Button type="primary" htmlType="submit" >Cập nhật</Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                            <div className='bottom-content'>
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
                    </div> : <Empty description='Sorry, something went wrong!' />}
                </div>
            </div>
        </AppWrap>
    );
}