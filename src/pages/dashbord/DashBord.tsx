import React, { useState } from 'react'
import { IStore } from '../../customtypes'
import { getStore } from '../../store/useStore'
import { Tabs } from 'antd'
import DaoChuJiLu from './daochujilu/DaoChuJiLu';

const { TabPane } = Tabs;

export enum DashBordTab {
    daochujilu = 'daochujilu',
    daorujilu = 'daorujilu'
}

const DashBord = () => {
    const [tab, setTab] = useState<DashBordTab>(DashBordTab.daochujilu);

    const onTabChange = (key: string) => {
        switch (key) {
            case DashBordTab.daochujilu:
                setTab(DashBordTab.daochujilu);
                break;
            case DashBordTab.daorujilu:
                setTab(DashBordTab.daorujilu);
                break;
            default:
                setTab(DashBordTab.daochujilu)
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
                <TabPane tab="导出记录" key={DashBordTab.daochujilu}>
                    {
                        tab === DashBordTab.daochujilu ?
                            <DaoChuJiLu />
                            : ""
                    }
                </TabPane>
                {/* <TabPane tab="导入记录" key={DashBordTab.daorujilu}>
                    {
                        tab === DashBordTab.daorujilu ?
                            <span>导入记录</span>
                            : ""
                    }
                </TabPane> */}

            </Tabs>
        </div>
    )
}

export default DashBord
