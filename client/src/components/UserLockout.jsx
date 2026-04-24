import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserLockout = ({ children }) => {
    // const { isLoggedIn } = useSelector(store => store.userState);
    // if (!isLoggedIn) {
    //     return <Navigate replace to='/login' />
    // }

    return children;
}

export default UserLockout;