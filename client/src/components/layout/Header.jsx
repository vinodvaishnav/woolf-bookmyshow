import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { SketchOutlined, UserOutlined, LogoutOutlined, LoginOutlined, ScheduleOutlined } from '@ant-design/icons';
import { logout } from '../../redux/userSlice';

const { Header: AntHeader } = Layout;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, userData } = useSelector(state => state.userState);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const menuItems = [
        // {
        //     key: 'home',
        //     label: <Link to="/">Movies</Link>,
        // },
    ];

    const userMenuItems = [
        {
            key: 'bookings',
            label: 'My Bookings',
            icon: <ScheduleOutlined />,
            onClick: () => navigate('/bookings'),
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile'),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <AntHeader
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: '#001529',
            }}
        >
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
                <SketchOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                <Link to="/" style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                    My Movie Ticket
                </Link>
            </div>

            {/* Navigation Bar */}
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[]}
                items={menuItems}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    background: 'transparent',
                    borderBottom: 'none',
                }}
            />

            {/* Login Section */}
            <div>
                {userData ? (
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        arrow
                    >
                        <Button
                            type="text"
                            style={{ color: '#fff', display: 'flex', alignItems: 'center' }}
                        >
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                style={{ marginRight: '8px' }}
                            />
                            {userData?.firstName || 'User'}
                        </Button>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                )}
            </div>
        </AntHeader>
    );
};

export default Header;
