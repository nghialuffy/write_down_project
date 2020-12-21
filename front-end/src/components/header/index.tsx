import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { Button, Dropdown, Input, Menu } from 'antd';
import {
    BellOutlined,
    DownOutlined,
    MenuOutlined,
    HomeOutlined,
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    FormOutlined,
    ShopOutlined
} from '@ant-design/icons';
import { UserAvatar } from '../user-avatar';
import './style.scss';
import { BaseButton, BaseDropDown } from '../base';
import { Link } from 'react-router-dom';
import { Categories } from '../../constants';
const { SubMenu } = Menu;

export function Header() {
    const [user, setUser] = useState<any>({
        _id: '1343444',
        avatar_url: 'https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/4db955d02a8911ebacbfc9142b6c25a5.jpg',
        displayName: 'Username'
    })
    const SearchHandler = (value: string) => {
        console.log('text search', value);
    }
    return (
        <div className='header'>
            <Link to='/'>
                <img src={logo} alt='logo' className='logo' />
            </Link>
            <HeaderSideBar user={user}/>
            <div className='header-content'>
                <div className='header-content-top'>
                    <Input.Search
                        placeholder='Tìm kiếm...'
                        onSearch={SearchHandler}
                        allowClear
                        className='header-search'
                    />
                    <Link to='/new-post' className='link-new-post'>
                        <BaseButton type='primary'>Viết bài</BaseButton>
                    </Link>
                    <BellOutlined />
                    <div className='user-info'>
                        {user.avatar_url && <UserAvatar data={user} />}
                        <Dropdown
                            trigger={['click']}
                            overlay={
                                <Menu className='menu-base-dropdown'>
                                    <Menu.Item>
                                        <Link to={`/profile/${user._id}`}>Trang cá nhân</Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Link to='/setting'>Cài đặt tài khoản</Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <span onClick={() => console.log('Log out')}>Đăng xuất</span>
                                    </Menu.Item>
                                </Menu>
                            }>
                            <div className='username' onClick={e => e.preventDefault()}>{user.displayName ?? ''} <DownOutlined /></div>
                        </Dropdown>
                    </div>
                </div>
                <div className='header-content-bottom'>
                    <BaseDropDown
                        button='Đang theo dõi'
                        data={Categories}
                        Item={CategoryLink}
                    />
                    <Link to='/top-writer'>Top Writers</Link>
                    {Categories.slice(0, 5).map(item => {
                        return <Link to={`/posts/${item.value}`} className='link'>{item.label}</Link>
                    })}
                    <Link to='/all-categories' className='link-all-categories'>Tất cả chủ đề</Link>
                </div>
            </div>
        </div>
    )
}

function HeaderSideBar({ user }: { user: any }) {
    const [showSideBar, setShowSideBar] = useState(false);
    return (
        <div className='header-side-bar'>
            <BaseButton type='primary' onClick={() => setShowSideBar(!showSideBar)}><MenuOutlined /></BaseButton>
            <Menu
                defaultSelectedKeys={['home']}
                defaultOpenKeys={['catigories']}
                mode="inline"
                theme="light"
                inlineCollapsed={showSideBar}
            >
                <Menu.Item key="home" icon={<HomeOutlined />}>
                    <Link to='/'>Trang chủ</Link>
                </Menu.Item>
                <SubMenu key="catigories" icon={<ShopOutlined />} title="Tất cả chủ đề">
                    {Categories.map(item =>
                        <Menu.Item key={item.value}>
                            <Link to={`/posts/${item.value}`} className='link'>{item.label}</Link>
                        </Menu.Item>
                    )}
                </SubMenu>
                {user ? <>
                    <Menu.Item key="profile" icon={<UserOutlined />}>
                        <Link to={`/profile/${user._id}`}>Trang cá nhân</Link>
                    </Menu.Item>
                    <Menu.Item key="log-out" icon={<LogoutOutlined />}>
                        Đăng xuất
                </Menu.Item>
                </> :
                    <>
                        <Menu.Item key="profile" icon={<LogoutOutlined />}>
                            <Link to='/login'>Đăng nhập</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<FormOutlined />}>
                            <Link to='/register'>Đăng ký</Link>
                        </Menu.Item>
                    </>}
            </Menu>
        </div>
    )
}

function CategoryLink({ data }: { data: typeof Categories[0] }) {
    return (
        <Link to={`/posts/${data.value}`} className='link'>{data.label}</Link>
    )
}