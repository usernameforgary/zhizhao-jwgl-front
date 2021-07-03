import React, { Component } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

export class ContentContainer extends Component {
    render() {
        return (
            <>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 480,
                        backgroundColor: 'white'
                    }}
                >
                    {this.props.children}
                </Content>
            </>
        )
    }
}

export default ContentContainer
