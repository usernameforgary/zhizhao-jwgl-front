import { Col, Radio, RadioChangeEvent, Row, Space } from 'antd'
import React, { useState } from 'react'
import BanJiDianMingJiLu from './banjidianmingjilu/BanJiDianMingJiLu';
import XueYuanDianMingJiLu from './xueyuandianmingjilu/XueYuanDianMingJiLu';

enum DianMingJiLuTabFenLei {
    byBanji = 'byBanJi',
    byXueYuan = 'byXueYuan'
}

// 上课记录 - 点名记录页面
const DianMingJiLuTab = () => {
    const [fenLei, setFenLei] = useState<DianMingJiLuTabFenLei>(DianMingJiLuTabFenLei.byBanji);

    // 分类改变
    const handleFenLeiChange = (e: RadioChangeEvent) => {
        const fenLei: DianMingJiLuTabFenLei = e.target.value;
        setFenLei(fenLei);
    }

    return (
        <>
            <Space size={50} direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-around">
                    <Col>
                        <Radio.Group defaultValue={fenLei} onChange={handleFenLeiChange}>
                            <Space>
                                <Radio.Button value={DianMingJiLuTabFenLei.byBanji} >
                                    按班级
                                </Radio.Button>
                                <Radio.Button value={DianMingJiLuTabFenLei.byXueYuan}>
                                    按学员
                                </Radio.Button>
                            </Space>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {(fenLei === DianMingJiLuTabFenLei.byBanji) ? <BanJiDianMingJiLu /> : <XueYuanDianMingJiLu />}
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default DianMingJiLuTab
