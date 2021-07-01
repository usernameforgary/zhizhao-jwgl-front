import { Spin } from 'antd';
import React from 'react';

import './loading.css';

export type LoadingProps = {
    loadingSpinTip?: string
    loadingSpinSize?: "default" | "large" | "small"
}

const Loading: React.FC<LoadingProps> = ({ loadingSpinTip, loadingSpinSize }) => {
    return (
        <div className="loading-container">
            <Spin tip={loadingSpinTip ?? "加载中..."} size={loadingSpinSize ?? "default"}></Spin>
        </div>
    )
}

export default Loading
