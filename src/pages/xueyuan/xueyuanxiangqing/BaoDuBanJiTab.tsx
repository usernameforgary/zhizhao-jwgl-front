import { Table, Button, Col, Row, TableColumnType, Space } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { XueYuanKeCheng, XueYuanXinXi } from '../../../customtypes'
import { huoQuXueYuanKeChengByXueYuanId } from '../../../services/xueyuankecheng'


type BaoDuBanJiTabProps = {
    xueYuanXinXi: XueYuanXinXi | undefined
}

/**
 * 学员详情 - 报读班级Tab
 * @returns 
 */
const BaoDuBanJiTab: React.FC<BaoDuBanJiTabProps> = ({ xueYuanXinXi }) => {
    const [isLiShi, setIsLiShi] = useState<boolean>(false);
    const [xueYuanKeChengList, setXueYuanKeChengList] = useState<XueYuanKeCheng[]>([]);

    useEffect(() => {
        const huoQuXueYuanKeCheng = async (isLiShi: boolean) => {
            try {
                if (xueYuanXinXi && xueYuanXinXi.id) {
                    const res = await huoQuXueYuanKeChengByXueYuanId(xueYuanXinXi.id, isLiShi);
                    setXueYuanKeChengList(res.list);
                }
            } catch (e) { }
        }
        if (isLiShi) {
            huoQuXueYuanKeCheng(true);
        } else {
            huoQuXueYuanKeCheng(false);
        }
    }, [isLiShi])

    // 【当前报读班级】和【历史报读班级】切换
    const toggleSelect = (v: boolean) => {
        setIsLiShi(v);
    }

    const columns: TableColumnType<XueYuanKeCheng>[] = [
        {
            title: '课程名称',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng',
            render: (value, row) => {
                return (
                    <Row>
                        <Col span={24}><span>{row.keChengMingCheng}</span></Col>
                        <Col span={24}><span>{row.banJi?.banJiFenLeiMingCheng}</span></Col>
                        <Col offset={2} span={22}><span>{row.banJi?.mingCheng}</span></Col>
                    </Row>
                );
            }
        },
        {
            title: '购买课时',
            dataIndex: 'keChengShuLiang',
            key: 'keChengShuLiang'
        },
        {
            title: '赠送课时',
            dataIndex: 'zengSongKeShi',
            key: 'zengSongKeShi'
        },
        {
            title: '已上课时',
            dataIndex: 'shengYuKeShi',
            key: 'banJiMingCheng',
            render: (value, record) => {
                return (
                    <span >{Number(record.keChengShuLiang) + Number(record.zengSongKeShi) - Number(record.shengYuKeShi)}</span>
                );
            },
        },
        {
            title: '有效期至',
            dataIndex: 'keChengYouXiaoQi',
            key: 'keChengYouXiaoQi',
            render: (value) => {
                return (
                    <span >{value ? moment(Number(value)).format('YYYY-MM-DD') : '--'}</span>
                );
            },
        }
    ];

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between">
                    <Col>
                        <Button onClick={e => toggleSelect(false)} style={isLiShi ? {} : { borderColor: '#40a9ff', color: '#40a9ff' }}>当前报读班级</Button>
                        <Button onClick={e => toggleSelect(true)} style={!isLiShi ? {} : { borderColor: '#40a9ff', color: '#40a9ff' }}>历史报读班级</Button>
                    </Col>
                    <Col>
                        <Button type="primary">选班</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={false}
                            dataSource={xueYuanKeChengList}
                            columns={columns}
                            bordered={true}
                        >
                        </Table>
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default BaoDuBanJiTab
