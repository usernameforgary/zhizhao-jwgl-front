import React, { useState } from 'react'
import { Tabs } from 'antd'
import QianZaiXueYuanTab from './QianZaiXueYuanTab';
import ZaiDuXueYuanTab from './ZaiDuXueYuanTab';
import LiShiXueYuanTab from './LiShiXueYuanTab';

const { TabPane } = Tabs;

export enum TabNameXueYuanDangAn {
    qianzai = 'qianzai',
    lishi = 'lishi',
    zaidu = 'zaidu'
}

const XueYuanDangAn = () => {
    const [tab, setTab] = useState<TabNameXueYuanDangAn>(TabNameXueYuanDangAn.qianzai);
    const onTabChange = (key: string) => {
        switch (key) {
            case TabNameXueYuanDangAn.zaidu:
                setTab(TabNameXueYuanDangAn.zaidu);
                break;
            case TabNameXueYuanDangAn.lishi:
                setTab(TabNameXueYuanDangAn.lishi);
                break;
            default:
                setTab(TabNameXueYuanDangAn.qianzai)
        }
    }

    return (
        <div
            className={"content-background"}
            style={{
                padding: 24,
                margin: 0,
                minHeight: "85vh"
            }}
        >
            <Tabs defaultActiveKey={tab} onChange={onTabChange}>
                <TabPane tab="潜在学员" key={TabNameXueYuanDangAn.qianzai}>
                    {
                        tab === TabNameXueYuanDangAn.qianzai ?
                            <QianZaiXueYuanTab />
                            : ""
                    }
                </TabPane>
                <TabPane tab="在读学员" key={TabNameXueYuanDangAn.zaidu}>
                    {
                        tab === TabNameXueYuanDangAn.zaidu ?
                            <ZaiDuXueYuanTab />
                            : ""
                    }
                </TabPane>
                <TabPane tab="历史学员" key={TabNameXueYuanDangAn.lishi}>
                    {
                        tab === TabNameXueYuanDangAn.lishi ?
                            <LiShiXueYuanTab />
                            : ""
                    }
                </TabPane>
            </Tabs>
        </div>
    )
}

export default XueYuanDangAn
