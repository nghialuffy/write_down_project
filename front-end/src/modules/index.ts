import { Module } from '../core';
import { 
    HomePage, 
    CategoryPage, 
    UserProfilePage, 
    NewPostPage, 
    LoginPage, 
    RegisterPage, 
    SettingPage, 
    TopicPage, 
    TopWriterPage,
    ListCategoriesPage,
    PostDetailPage,
    SearchPage
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
        path: '/posts-tags/:topic',
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
    module.route({
        path: '/top-writer',
        exact: false,
        component: TopWriterPage,
    });
    module.route({
        path: '/all-categories',
        exact: false,
        component: ListCategoriesPage,
    });
    module.route({
        path: '/posts/:category/:type',
        exact: false,
        component: CategoryPage,
    });
    module.route({
        path: '/all/:type',
        exact: false,
        component: HomePage,
    });
    module.route({
        path: '/post-detail/:postId',
        exact: false,
        component: PostDetailPage,
    });
    module.route({
        path: '/search/:text',
        exact: false,
        component: SearchPage,
    });
}
