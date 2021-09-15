import React, {useState} from "react";

const AuthContext = React.createContext({
    user: '',
});

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);

    const loginHandler = (user) => {
        setUser(user);
    }

    const contextValue = {
        user,
        setUser,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvider;