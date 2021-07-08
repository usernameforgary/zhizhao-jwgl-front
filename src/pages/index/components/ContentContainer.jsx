import React, { Component } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;
class ContentContainer extends Component {
    render() {
        return (
            <>
                <Content
                    style={{ minHeight: "85vh" }}
                >
                    {this.props.children}
                </Content>
            </>
        )
    }
}

export default (ContentContainer)
