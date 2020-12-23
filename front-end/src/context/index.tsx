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
}

export const UserContext = React.createContext<UserContextType>({
    _id: '',
    displayName: '',
    avatar: '',
    followUsers: [],
    followCategories: [],
    logout: () => undefined,
    updateUser: (newInfo: UserInfo) => undefined
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
        const token = localStorage.getItem('token');
        this.state = {
            _id: '',
            displayName: '',
            avatar: '',
            followUsers: [],
            followCategories: [],
        };
        if (token) {
            DataAccess.Get('auth').then(res => {
                this.setState({
                    _id: res.data._id,
                    avatar: res.data.avatar,
                    displayName: res.data.display_name
                })
            })
        }
        console.log(this.state);
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

    updateUser = (newInfo: UserInfo) => {
        this.setState(prev => {
            return {
                ...prev,
                ...newInfo,
            }
        });
    }
    render() {
        return (
            <UserContext.Provider value={{
                ...this.state,
                updateUser: this.updateUser,
                logout: this.logout,
            }}>
                {this.props.children}
            </UserContext.Provider >
        );
    }
}
