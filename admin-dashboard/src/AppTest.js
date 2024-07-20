import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserCalendar from './components/UserCalendar';
import 'antd/dist/antd.css';

const { Header, Content, Sider } = Layout;

function AppTest() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={{ paddingTop: '16px' }}>
          <div className="logo" />
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<CalendarOutlined />}>
              <Link to="/user-calendar">User Calendar</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-calendar" element={<UserCalendar />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default AppTest;
