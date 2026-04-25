import { Outlet } from "react-router-dom"
import { Layout as AntLayout, theme } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "../../redux/userSlice";

import Header from './Header';
import { useEffect } from "react";

const { Content, Footer } = AntLayout;

const Layout = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, data: userData } = useSelector(state => state.userState);

    useEffect(() => {
        dispatch(getUserProfile());
    }, [userData]);

    const { token } = theme.useToken();

    return <AntLayout className="site-layout">
        <Header />
        <Content style={{
            paddingBottom: '48px',
            background: token.colorBgContainer,
        }}>
            <div
                style={{
                    minHeight: 380,
                }}
            >
                <Outlet />
            </div>
        </Content>
        <Footer style={{
            textAlign: 'center',
        }}>
            <p>&copy; {new Date().getFullYear()} All Rights reserved</p>
        </Footer>
    </AntLayout>
}

export default Layout;