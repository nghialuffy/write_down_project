import { Module } from '../core';
import { 
    HomePage, 
    CategoryPage, 
    ProfilePage, 
    UserProfilePage, 
    NewPostPage, 
    LoginPage, 
    RegisterPage, 
    SettingPage, 
    TopicPage 
} from './pages';

export function setup(module: Module) {
    console.log('Setup chat room');
    module.route({
        path: '/',
        exact: true,
        component: HomePage,
    });
    module.route({
        path: '/posts/:category',
        exact: true,
        component: CategoryPage,
    });
    module.route({
        path: '/posts/:topic',
        exact: true,
        component: TopicPage,
    });
    module.route({
        path: '/login',
        exact: true,
        component: LoginPage,
    });
    module.route({
        path: '/register',
        exact: true,
        component: RegisterPage,
    });
    module.route({
        path: '/profile',
        exact: false,
        component: ProfilePage,
    });
    module.route({
        path: '/profile/:id',
        exact: false,
        component: UserProfilePage,
    });
    module.route({
        path: '/new-post',
        exact: false,
        component: NewPostPage,
    });
    module.route({
        path: '/setting',
        exact: false,
        component: SettingPage,
    });
}
