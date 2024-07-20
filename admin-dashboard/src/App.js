import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { CalendarOutlined, LogoutOutlined } from '@ant-design/icons';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserCalendar from './components/UserCalendar';
import AuthLayout from './components/AuthLayout';
import 'antd/dist/reset.css';

const { Header, Content, Sider } = Layout;

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Menu.Item key="4" icon={<LogoutOutlined />}
    onClick={handleLogout}
    style={{width: '100%', paddingLeft: '25px'}}>
      Logout
    </Menu.Item>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route
          path="/"
          element={
            <Layout style={{ minHeight: '100vh' }}>
              <Sider style={{ paddingTop: '75px' }}>
                <div className="logo" />
                <Menu theme="dark" mode="inline">
                  <Menu.Item key="2" icon={<CalendarOutlined />}>
                    <a href="/dashboard">Dashboard</a>
                  </Menu.Item>
                  <Menu.Item key="3" icon={<CalendarOutlined />}>
                    <a href="/user-calendar" target="_blank">User Calendar</a>
                  </Menu.Item>
                  <Logout />
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '16px' }}>
                  <Outlet />  {/* This is crucial for nested routes */}
                </Content>
              </Layout>
            </Layout>
          }
        >
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        </Route>
        <Route path="/user-calendar" element={<UserCalendar />} />  {/* Publicly accessible route */}
      </Routes>
    </Router>
  );
}

export default App;
