import React, { useState } from 'react'
import { Table, Button, Col, Row, TableColumnType, Space } from 'antd'
import { XueYuanXinXi } from '../../../../customtypes';
import YiShanKeJiLu from './YiShanKeJiLu';

type ShangKeJiLuTabProps = {
    xueYuanXinXi: XueYuanXinXi | undefined
}

const ShangKeJiLuTab: React.FC<ShangKeJiLuTabProps> = ({ xueYuanXinXi }) => {

    const [isDaiShangKe, setIsDaiShangKe] = useState<boolean>(false);

    // 【已上课记录】和【待上课记录】切换
    const toggleSelect = (v: boolean) => {
        setIsDaiShangKe(v);
    }

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row justify="space-between">
                    <Col>
                        <Button onClick={e => toggleSelect(false)} style={isDaiShangKe ? {} : { borderColor: '#40a9ff', color: '#40a9ff' }}>已上课记录</Button>
                        <Button onClick={e => toggleSelect(true)} style={!isDaiShangKe ? {} : { borderColor: '#40a9ff', color: '#40a9ff' }}>待上课记录</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {!isDaiShangKe ?
                            <YiShanKeJiLu xueYuanXinXi={xueYuanXinXi} />
                            :
                            "一上课"
                        }
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default ShangKeJiLuTab
