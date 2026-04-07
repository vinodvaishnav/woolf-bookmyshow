import { Outlet } from "react-router-dom"
import { Layout as AntLayout, theme } from 'antd';
import Header from './Header';

const { Content, Footer } = AntLayout;

const Layout = () => {
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