import { Table, Button, Col, Row, TableColumnType, Space } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import IconBanJi from '../../../components/customicons/banji/IconBanJi'
import LinkButton from '../../../components/linkbutton'
import { XueYuanKeCheng, XueYuanXinXi } from '../../../customtypes'
import { getDefinedRouteByRouteName, routeName } from '../../../router'
import { huoQuXueYuanKeChengByXueYuanId } from '../../../services/xueyuankecheng'
import { TabNamesBanJiXiangQing } from '../../banji/BanJiXiangQing'


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
    }, [isLiShi, xueYuanXinXi])

    // 【当前报读班级】和【历史报读班级】切换
    const toggleSelect = (v: boolean) => {
        setIsLiShi(v);
    }

    // 获取学员选班Link地址
    const getXuanBanLinkTo = (): string => {
        let to: string = "";
        to = getDefinedRouteByRouteName(routeName.xueyuanxuanban)?.path + "";
        to = to.substring(0, to.lastIndexOf(":"));
        to += "" + xueYuanXinXi?.id;
        return to;
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
                        <Col offset={1} span={23}><span>{row.banJi?.banJiFenLeiMingCheng}</span></Col>
                        <Col offset={2} span={22}>
                            {row.banJi &&
                                <Space>
                                    <IconBanJi />
                                    <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${row.banJi?.id}/${TabNamesBanJiXiangQing.paikexinxi}`}>
                                        {row.banJi?.mingCheng}
                                    </Link>
                                </Space>}
                        </Col>
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
                    <Link to={"#"} >{Number(record.keChengShuLiang) + Number(record.zengSongKeShi) - Number(record.shengYuKeShi)}</Link>
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
        },
        {
            title: '操作',
            key: 'action',
            render: (value, record) => {
                return (
                    <>
                        <Button type="link">退课</Button>
                        <span style={{ color: '#40a9ff' }}>|</span>
                        <Button type="link">转课</Button>
                    </>
                );
            },
        }
    ];

    const columnsLiShi: TableColumnType<XueYuanKeCheng>[] = [
        {
            title: '课程名称',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng',
            render: (value, row) => {
                return (
                    <Row>
                        <Col span={24}><span>{row.keChengMingCheng}</span></Col>
                        <Col span={24}><span>{row.banJi?.banJiFenLeiMingCheng}</span></Col>
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
                    <Link to={"#"} >{Number(record.keChengShuLiang) + Number(record.zengSongKeShi) - Number(record.shengYuKeShi)}</Link>
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
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row justify="space-between">
                    <Col>
                        <Button onClick={e => toggleSelect(false)} style={isLiShi ? {} : { borderColor: '#40a9ff', color: '#40a9ff' }}>当前报读班级</Button>
                        <Button onClick={e => toggleSelect(true)} style={!isLiShi ? {} : { borderColor: '#40a9ff', color: '#40a9ff' }}>历史报读班级</Button>
                    </Col>
                    <Col>
                        <LinkButton to={getXuanBanLinkTo()} text="选班" />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {!isLiShi ?
                            <Table
                                pagination={false}
                                dataSource={xueYuanKeChengList}
                                columns={columns}
                                bordered={true}
                            >
                            </Table>
                            :
                            <Table
                                pagination={false}
                                dataSource={xueYuanKeChengList}
                                columns={columnsLiShi}
                                bordered={true}
                            >
                            </Table>
                        }
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default BaoDuBanJiTab
