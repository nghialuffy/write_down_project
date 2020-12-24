import React, { memo, useContext, useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { Dropdown, Input, Menu } from 'antd';
import {
    BellOutlined,
    DownOutlined,
    MenuOutlined,
    HomeOutlined,
    UserOutlined,
    LogoutOutlined,
    FormOutlined,
    ShopOutlined
} from '@ant-design/icons';
import { UserAvatar } from '../user-avatar';
import './style.scss';
import { BaseButton, BaseDropDown } from '../base';
import { Link, useHistory } from 'react-router-dom';
import { Categories } from '../../constants';
import { UserContext } from '../../context';
import { CategoryType } from '../../model';
const { SubMenu } = Menu;

type UserInfo = {
    _id: string,
    avatar: string,
    display_name: string,
    username: string,
}

export const Header = () => {
    const history = useHistory();
    const SearchHandler = (value: string) => {
        history.push(`/search/${value}`);
    }

    const userContext = useContext(UserContext);
    console.log('usercontext', userContext);

    return (
        <div className='header'>
            <div className='container'>
                <HeaderSideBar user={userContext} />
                <Link to='/'>
                    <img src={logo} alt='logo' className='logo' />
                </Link>
                <div className='header-content'>
                    <div className='header-content-top'>
                        <Input.Search
                            placeholder='Tìm kiếm...'
                            onSearch={SearchHandler}
                            allowClear
                            className='header-search'
                        />
                        {userContext._id ? <div className='header-content-top-right'>
                            <Link to='/new-post' className='link-new-post'>
                                <BaseButton type='primary'>Viết bài</BaseButton>
                            </Link>
                            <BellOutlined />
                            <div className='user-info'>
                                {userContext.avatar && <UserAvatar data={userContext} />}
                                <Dropdown
                                    trigger={['click']}
                                    overlay={
                                        <Menu className='menu-base-dropdown'>
                                            <Menu.Item>
                                                <Link to={`/profile/${userContext._id}`}>Trang cá nhân</Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Link to='/setting'>Cài đặt tài khoản</Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <span onClick={userContext.logout}>Đăng xuất</span>
                                            </Menu.Item>
                                        </Menu>
                                    }>
                                    <div className='username' onClick={e => e.preventDefault()}>{userContext.displayName ?? ''} <DownOutlined /></div>
                                </Dropdown>
                            </div>
                        </div> : <><Link to='/login'><BaseButton type='primary'>Login</BaseButton></Link>
                                <Link to='/register'><BaseButton type='primary'>Register</BaseButton></Link>
                            </>}
                    </div>
                    <div className='header-content-bottom'>
                        {userContext.followCategories.length !== 0 &&
                            <BaseDropDown
                                button='Đang theo dõi'
                                data={userContext.followCategories}
                                Item={CategoryLink}
                            />
                        }
                        <Link to='/top-writer'>Top Writers</Link>
                        {Categories.slice(0, 5).map(item => {
                            return <Link to={`/posts/${item.value}`} className='link'>{item.label}</Link>
                        })}
                        <Link to='/all-categories' className='link-all-categories'>Tất cả chủ đề</Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

function HeaderSideBar({ user }: { user: any }) {
    const [showSideBar, setShowSideBar] = useState(false);
    return (
        <div className='header-side-bar'>
            <BaseButton type='primary' onClick={(e) => {
                setShowSideBar(!showSideBar);
                e.stopPropagation();
            }}><MenuOutlined /></BaseButton>
            <Menu
                defaultSelectedKeys={['home']}
                mode="inline"
                theme="light"
                inlineCollapsed={showSideBar}
            >
                <Menu.Item key="home" icon={<HomeOutlined />}>
                    <Link to='/hot'>Trang chủ</Link>
                </Menu.Item>
                <SubMenu key="catigories" icon={<ShopOutlined />} title="Tất cả chủ đề">
                    {Categories.map(item =>
                        <Menu.Item key={item.value}>
                            <Link to={`/posts/${item.value}/hot`} className='link'>{item.label}</Link>
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

function CategoryLink({ data }: { data: CategoryType }) {
    return (
        <Link to={`/posts/${data.url}`} className='link'>{data.name_category}</Link>
    )
}