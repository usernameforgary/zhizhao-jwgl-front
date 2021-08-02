import React, { useState, useEffect } from 'react'
import { Table, Button, Row, Col, Space, TableColumnType } from 'antd'
import { BanJiView, BanJiXueYuanView, XingBie } from '../../../../customtypes'
import { huoQuBanJiXueYuanByBanJiId } from '../../../../services/banji';
import { convertXingBie2Text } from '../../../../utils/converter';

type BanJiXueYuanTabProps = {
    banJiXiangQing: BanJiView | undefined
}

const BanJiXueYuanTab: React.FC<BanJiXueYuanTabProps> = ({ banJiXiangQing }) => {
    const [banJiXueYuanViewList, setBanJiXueYuanViewList] = useState<BanJiXueYuanView[]>([]);

    useEffect(() => {
        const getBanJiXueYuan = async () => {
            if (banJiXiangQing && banJiXiangQing.id) {
                try {
                    const res = await huoQuBanJiXueYuanByBanJiId(banJiXiangQing.id);
                    res.forEach(v => {
                        v.key = v.xueYuanId
                    })
                    setBanJiXueYuanViewList(res);
                } catch (e) { }
            }
        }

        getBanJiXueYuan()
    }, [banJiXiangQing])

    const columns: TableColumnType<BanJiXueYuanView>[] = [
        {
            title: '姓名',
            dataIndex: 'xueYuanXingMing',
            key: 'xueYuanXingMing'
        },
        {
            title: '性别',
            dataIndex: 'xingBie',
            key: 'xingBie',
            render: (value: XingBie) => {
                return <>{value ? convertXingBie2Text(value) : ""}</>
            }
        },
        {
            title: '手机号',
            dataIndex: 'shouJi',
            key: 'shouJi'
        },
        {
            title: '课程名',
            dataIndex: 'xueYuanKeCheng.keChengMingCheng',
            key: 'xueYuanKeCheng.keChengMingCheng',
            render: (value, record) => {
                return (
                    <>
                        {record.xueYuanKeCheng.keChengMingCheng}
                    </>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (value, record) => {
                return (<>
                    <Button type="link">调至其他班</Button>
                    <Button type="link">移出本班</Button>
                </>);
            }
        },
    ]
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row>
                    <Button type="primary">添加学员</Button>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            bordered={true}
                            pagination={false}
                            dataSource={banJiXueYuanViewList}
                            columns={columns}
                        >
                        </Table>
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default BanJiXueYuanTab
