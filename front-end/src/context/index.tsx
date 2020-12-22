import React from 'react';
import {DataAccess} from '../access';

type UserContextType = {
    auth: boolean
    _id: string
    displayName: string,
    avatar_url: string
    authenticated: () => void
    logout: () => void
    updateUser: (newInfo: StateType) => void
}

export const UserContext = React.createContext<UserContextType>({
    auth: false,
    _id: '',
    displayName: '',
    avatar_url: '',
    authenticated: () => undefined,
    logout: () => undefined,
    updateUser: (newInfo: StateType) => undefined
});

type StateType = {
    auth: boolean
    _id: string
    displayName: string
    avatar_url: string
}

export class UserContextProvider extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            auth: false,
            _id: '',
            displayName: '',
            avatar_url: ''
        };
        console.log(this.state);
    }

    authenticated = () => {
        this.setState({ auth: true });
    }

    logout = () => {
        this.setState({ auth: false });
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
                authenticated: this.authenticated,
                updateUser: this.updateUser,
                logout: this.logout,
            }}>
                {this.props.children}
            </UserContext.Provider >
        );
    }
}
