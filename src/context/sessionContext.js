import React from "react";

class UserInfo {
    userId
    userPassword
    userName

    constructor(userId, userPassword, userName) {
        this.userId = userId;
        this.userPassword = userPassword;
        this.userName = userName;
    };

    setUserId(userId) {
        this.userId = userId
    };
    setUserPassword(userPassword) {
        this.userPassword = userPassword
    };
    setUserName(userName) {
        this.userName = userName
    };
}

export const UserContext = React.createContext(new UserInfo(null, null, null));
