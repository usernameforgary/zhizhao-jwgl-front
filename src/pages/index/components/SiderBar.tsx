import React from 'react'
import { Layout, Menu } from 'antd';

const { SubMenu } = Menu;
const { Sider } = Layout;

const SiderBar = () => {
    return (
        <div>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['shouye']}>
                    <Menu.Item key="shouye" icon>
                        首页
                    </Menu.Item>
                    <SubMenu key="jiaowuzhongxin" icon title="教务中心">
                        <Menu.Item key="xueyuangaunli">学员管理</Menu.Item>
                        <Menu.Item key="banjigaunli">班级管理</Menu.Item>
                        <Menu.Item key="laoshiguanli">老师管理</Menu.Item>
                        <Menu.Item key="kechengguanli">课程管理</Menu.Item>
                        <Menu.Item key="shangkejilu">上课记录</Menu.Item>
                    </SubMenu>

                    <SubMenu key="xiaoshouzhongxin" icon title="销售中心">
                        <Menu.Item key="xueyuandangan">学员档案</Menu.Item>
                        <Menu.Item key="xueyuanbaoming">学员报名</Menu.Item>
                        <Menu.Item key="xufeiyujing">续费预警</Menu.Item>
                        <Menu.Item key="shitingjilu">试听记录</Menu.Item>
                        <Menu.Item key="chengzhangjilu">成长记录</Menu.Item>
                    </SubMenu>

                    <SubMenu key="caiwuzhongxin" icon title="财务中心">
                        <Menu.Item key="jiaofeijilu">缴费记录</Menu.Item>
                        <Menu.Item key="tuizhuankejilu">退转课记录</Menu.Item>
                        <Menu.Item key="laoshikeshijilu">老师课时记录</Menu.Item>
                    </SubMenu>

                    <SubMenu key="jigoushezhi" icon title="机构设置">
                        <Menu.Item key="yuangongguanli">员工管理</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        </div>
    )
}

export default SiderBar
