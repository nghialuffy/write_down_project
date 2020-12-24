import React from 'react';
import { DataAccess } from '../access';
import { CategoryType, UserType } from '../model';

type UserContextType = {
    _id: string
    displayName: string,
    avatar: string,
    followUsers: UserType[],
    followCategories: CategoryType[],
    logout: () => void
    updateUser: (newInfo: UserInfo) => void
    getFollowingCategories: () => void
}

export const UserContext = React.createContext<UserContextType>({
    _id: '',
    displayName: '',
    avatar: '',
    followUsers: [],
    followCategories: [],
    logout: () => undefined,
    updateUser: (newInfo: UserInfo) => undefined,
    getFollowingCategories: () => undefined,
});

type StateType = {
    _id: string
    displayName: string
    avatar: string
    followUsers: UserType[],
    followCategories: CategoryType[],
}

type UserInfo = {
    _id: string
    displayName: string
    avatar: string
}
export class UserContextProvider extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            _id: '',
            displayName: '',
            avatar: '',
            followUsers: [],
            followCategories: [],
        };
    }

    logout = () => {
        DataAccess.Delete('logout');
        this.setState(prev => {
            return {
                ...prev,
                _id: '',
                displayName: '',
                avatar: ''
            }
        });
        localStorage.removeItem('item');
    }

    updateUser = (newInfo: UserInfo, cb?: () => void) => {
        this.setState(prev => {
            return {
                ...prev,
                ...newInfo,
            }
        }, () => {
            this.getFollowingCategories(cb);
        });
    }
    getFollowingCategories = (cb?: () => void) => {
        DataAccess.Get(`categories/user/${this.state._id}`).then(res => {
            this.setState(prev => {
                return {
                    ...prev,
                    followCategories: res.data.data
                }
            }, cb)
        }).catch (e => {
            console.log('Fetch following categories failed > ', e);
            if (cb) cb();
        });
    }
    render() {
        return (
            <UserContext.Provider value={{
                ...this.state,
                updateUser: this.updateUser,
                logout: this.logout,
                getFollowingCategories: this.getFollowingCategories,
            }}>
                {this.props.children}
            </UserContext.Provider >
        );
    }
}
