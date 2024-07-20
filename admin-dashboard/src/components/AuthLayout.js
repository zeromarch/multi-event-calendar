import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

const AuthLayout = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Content style={{ margin: '16px' }}>
      <Outlet />  {/* This allows nested routes to render */}
    </Content>
  </Layout>
);

export default AuthLayout;
