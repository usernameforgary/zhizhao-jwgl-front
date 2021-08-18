import React, { useState } from 'react'

import { Tabs } from 'antd'
import DianMingJiLuTab from './DianMingJiLuTab';

const { TabPane } = Tabs;

export enum TabNamesShanKeJiLuLieBiao {
    dianmingjilu = "dianmingjilu",
    buke = "buke"
}

const ShangKeJiLuLieBiao = () => {
    const [tab, setTab] = useState<TabNamesShanKeJiLuLieBiao>(TabNamesShanKeJiLuLieBiao.dianmingjilu);

    const onTabChange = (key: string) => {
        switch (key) {
            case TabNamesShanKeJiLuLieBiao.dianmingjilu:
                setTab(TabNamesShanKeJiLuLieBiao.dianmingjilu);
                break;
            case TabNamesShanKeJiLuLieBiao.buke:
                setTab(TabNamesShanKeJiLuLieBiao.buke);
                break;
            default:
                setTab(TabNamesShanKeJiLuLieBiao.dianmingjilu)
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
                <TabPane tab="点名记录" key={TabNamesShanKeJiLuLieBiao.dianmingjilu}>
                    {
                        tab === TabNamesShanKeJiLuLieBiao.dianmingjilu ?
                            <DianMingJiLuTab />
                            : ""
                    }
                </TabPane>
                <TabPane tab="缺课补课" key={TabNamesShanKeJiLuLieBiao.buke}>
                    {
                        tab === TabNamesShanKeJiLuLieBiao.buke ?
                            <span>补课记录</span>
                            : ""
                    }
                </TabPane>

            </Tabs>
        </div>
    )
}

export default ShangKeJiLuLieBiao
