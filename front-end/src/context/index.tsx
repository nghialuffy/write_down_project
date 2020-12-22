import React from 'react';
import {DataAccess} from '../access';

type UserContextType = {
    _id: string
    displayName: string,
    avatar: string
    logout: () => void
    updateUser: (newInfo: StateType) => void
}

export const UserContext = React.createContext<UserContextType>({
    _id: '',
    displayName: '',
    avatar: '',
    logout: () => undefined,
    updateUser: (newInfo: StateType) => undefined
});

type StateType = {
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
            avatar: ''
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
        this.setState({
            _id: '',
            displayName: '',
            avatar: ''
        });
        localStorage.removeItem('item');
    }

    updateUser = (newInfo: StateType) => {
        this.setState(newInfo, () => {
            console.log(this.state);
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
