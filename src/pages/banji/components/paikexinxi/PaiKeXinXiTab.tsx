import { Row, Button, TableColumnType, Table, Col, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BanJiView, PaiKeFangShiFenLei, PaiKeGuiZe, PaiKeJieShuFangShiFenLei, PaiKeXinXi } from '../../../../customtypes';
import { huoQuBanJiPaiKeXinXiLieBiao } from '../../../../services/paikexinxi';
import { convertPaiKeChongFuFangShi2Text, convertPaiKeFangShi2Text, convertPaiKeShangKeTian2Text } from '../../../../utils/converter';
import PaiKeModal from './PaiKeModal';

/**
 * keChengMingCheng（课程名称）只需要显示
 * banJiId（班级Id）和banJiMingCheng（班级名称），由父组件传入，页面上不可编辑
 */
export type PaiKeXinXiProps = {
    banJiXiangQing: BanJiView | undefined
}

const PaiKeXinXiTab: React.FC<PaiKeXinXiProps> = ({ banJiXiangQing }) => {
    const [showPaiKeModal, setShowPaiKeModal] = useState<boolean>(false);
    const [paiKeXinXi, setPaiKeXinXi] = useState<PaiKeXinXi[]>([]);
    const [refreshList, setRefreshList] = useState<boolean>(false);

    useEffect(() => {
        //获取班级排课信息列表
        const onHuoQuBanJiPaiKeXinXi = async () => {
            if (banJiXiangQing?.id) {
                try {
                    const result = await huoQuBanJiPaiKeXinXiLieBiao((banJiXiangQing.id));
                    result.list.forEach(v => {
                        v.key = v.key || v.id;
                    })
                    setPaiKeXinXi(result.list);
                } catch (e) { }
            }
        }

        onHuoQuBanJiPaiKeXinXi();
    }, [banJiXiangQing, refreshList])

    /**
     * 刷新列表
     */
    const onListRefresh = () => {
        setRefreshList(!refreshList);
    }

    const toggleShowPaiKeModal = () => {
        setShowPaiKeModal(!showPaiKeModal);
    }

    const columns: TableColumnType<PaiKeXinXi>[] = [
        {
            title: '排课方式',
            dataIndex: 'paiKeGuiZe',
            key: 'paiKeGuiZe.PaiKeFangShiFenLei',
            render: (value: PaiKeGuiZe) => {
                if (value.guiZeChongFuFangShi) {
                    return convertPaiKeChongFuFangShi2Text(value.guiZeChongFuFangShi);
                }
                if (value.paiKeFangShi) {
                    return convertPaiKeFangShi2Text(value.paiKeFangShi);
                }
                return "--";
            }
        },
        {
            title: '上课日期',
            dataIndex: 'paiKeGuiZe',
            key: 'paiKeGuiZe.guiZeKaiShiRiQi',
            render: (value: PaiKeGuiZe) => {
                if (value.paiKeFangShi === PaiKeFangShiFenLei.RI_LI_PAI_KE) {
                    let res = "";
                    value.riLiShangKeRiQi?.forEach(v => {
                        res += " " + moment(Number(v)).format("YYYY-MM-DD") + "\n";
                    });
                    return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
                }
                if (value.paiKeFangShi === PaiKeFangShiFenLei.GUI_ZE_PAI_KE) {
                    let resStart = moment(Number(value.guiZeKaiShiRiQi)).format("YYYY-MM-DD");
                    if (value.guiZeJiShuFangShi === PaiKeJieShuFangShiFenLei.CI_SHU_JIE_SHU) {
                        let res = "";
                        if (value.paiKeShangKeShiJianZu && value.paiKeShangKeShiJianZu.length > 0) {
                            value.paiKeShangKeShiJianZu.forEach(v => {
                                res += `从${resStart} (${convertPaiKeShangKeTian2Text(v.paiKeShangKeTian)}) (重复${value.guiZePaiKeCiShu}次)\n`;
                            })
                        }
                        return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
                    }
                    if (value.guiZeJiShuFangShi === PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU) {
                        let resDate = resStart + ` ~ ${moment(Number(value.guiZeJieShuRiQi)).format("YYYY-MM-DD")}`;
                        let res = "";
                        if (value.paiKeShangKeShiJianZu && value.paiKeShangKeShiJianZu.length > 0) {
                            value.paiKeShangKeShiJianZu.forEach(v => {
                                res += resDate + " (" + convertPaiKeShangKeTian2Text(v.paiKeShangKeTian) + ")\n";
                            });
                            return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
                        }
                    }
                }
                return "--";
            }
        },
        {
            title: '上课时间',
            dataIndex: 'paiKeGuiZe',
            key: 'paiKeGuiZe.guiZeKaiShiRiQi',
            render: (value: PaiKeGuiZe) => {
                let res: string = "";
                if (value.paiKeShangKeShiJianZu && value.paiKeShangKeShiJianZu.length > 0) {
                    value.paiKeShangKeShiJianZu.forEach(v => {
                        res += moment(Number(v.startTime)).format("HH:mm") + " ~ " + moment(Number(v.stopTime)).format("HH:mm") + "\n";
                    });
                    return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
                }

                return "--";
            },
        },
        {
            title: '上课教室',
            dataIndex: 'shangKeJiaoShiMingCheng',
            key: 'shangKeJiaoShiMingCheng',
        },
        {
            title: '上课老师',
            dataIndex: 'shangKeLaoShiXingMing',
            key: 'shangKeLaoShiXingMing',
        },
        {
            title: '上课内容',
            dataIndex: 'shangKeNeiRong',
            key: 'shangKeNeiRong',
        },
        {
            title: '操作',
            key: 'action',
            render: (value, record) => (
                <>
                    <a href={"/" + record.id}>编辑</a> |
                    <a href={"/" + record.id}>删除</a>
                </>
            ),
        },
    ];

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Row>
                    <Button type="primary" onClick={toggleShowPaiKeModal}>一键排课</Button>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            bordered={true}
                            pagination={false}
                            dataSource={paiKeXinXi}
                            columns={columns}
                        >
                        </Table>
                    </Col>
                </Row>
                <PaiKeModal
                    visible={showPaiKeModal}
                    banJiXiangQing={banJiXiangQing}
                    onCancel={toggleShowPaiKeModal}
                    refreshList={onListRefresh}
                />
            </Space>
        </>
    )
}

export default PaiKeXinXiTab
