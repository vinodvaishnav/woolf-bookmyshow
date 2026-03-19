import { Outlet } from "react-router-dom"
import { Layout as AntLayout, theme } from 'antd';

const { Header, Content, Footer } = AntLayout;

const Layout = () => {
    const { token } = theme.useToken();
    return <AntLayout className="site-layout">
        <Header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
        }}>
        </Header>
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
            <p>&copy; {new Date().getFullYear()} All Rights resevered</p>
        </Footer>
    </AntLayout>
}

export default Layout;