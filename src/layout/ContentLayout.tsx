import React, { ReactNode } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

export interface LayoutProps {
    children: React.ReactNode
}

const ContentLayout = (props: LayoutProps) => {
    return (
        <Content style={{ margin: '24px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                {props.children}
            </div>
        </Content>
    );
}

export default ContentLayout;