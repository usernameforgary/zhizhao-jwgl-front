import React from 'react'
import { Modal, Row, Col, Table, TableColumnType, Space } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { BanJiView, PaiKeJiLu, ShanKeXueYuan } from '../../../../customtypes'
import { convertMomentIsoWeekDay2Text, convertShangKeXueYuanLeiXing2Text, convertXueYuanDaoKeZhuangTai2Text } from '../../../../utils/converter'
import { paiKeJiLuDianMing } from '../../../../services/combine'
import moment from 'moment'


type DianMingJieGuoModalProps = {
    visible: boolean
    banJiXiangQing: BanJiView | undefined
    paiKeJiLu: PaiKeJiLu
    onClose: () => void
}

const DianMingJieGuoModal: React.FC<DianMingJieGuoModalProps> = ({ visible, banJiXiangQing, paiKeJiLu, onClose }) => {

    const columns: TableColumnType<ShanKeXueYuan>[] = [
        {
            title: '姓名',
            dataIndex: 'xueYuanId',
            key: 'xueYuanId',
            render: (value, record) => {
                const xueYuanLeiXing = convertShangKeXueYuanLeiXing2Text(record.shangKeXueYuanLeiXing);
                return <>
                    <>{record.xueYuanXingMing} {xueYuanLeiXing ? `(${xueYuanLeiXing})` : ""}</>
                </>
            }
        },
        {
            title: '手机号',
            dataIndex: 'shouJi',
            key: 'shouJi',
            render: (value, record) => {
                return <>
                    {record.shouJi}
                </>
            }
        },
        {
            title: '到课状态',
            dataIndex: 'xueYuanDaoKeZhuangTai',
            key: 'xueYuanDaoKeZhuangTai',
            render: (value, record) => {
                return (
                    <span>{convertXueYuanDaoKeZhuangTai2Text(record.xueYuanDaoKeZhuangTai)}</span>
                );
            }
        },
        {
            title: '扣课时',
            dataIndex: 'kouChuKeShi',
            key: 'kouChuKeShi'
        },
        {
            title: '备注',
            dataIndex: 'beiZhu',
            key: 'beiZhu'
        }
    ]

    return (
        <>
            <Modal
                visible={visible}
                title="实到人数"
                onCancel={onClose}
                footer={false}
                width={"60rem"}
                closeIcon={<CloseCircleOutlined />}
            >

                <Row>
                    <Space>

                        <span>签到名单</span>
                        <span>{banJiXiangQing?.mingCheng}</span>
                        <span> {convertMomentIsoWeekDay2Text(moment(Number(paiKeJiLu.shangKeRiQi)).isoWeekday())}</span>
                        <span>{moment(Number(paiKeJiLu.shangKeShiJianStart)).format('HH:mm') + "-" + moment(Number(paiKeJiLu.shangKeShiJianEnd)).format('HH:mm')}</span>
                    </Space>
                </Row>

                <Row>
                    <Col span={24}>
                        <Table
                            bordered={true}
                            dataSource={paiKeJiLu.shangKeXueYuanZu}
                            columns={columns}
                            pagination={false}
                        >
                        </Table>
                    </Col>
                </Row>

            </Modal>
        </>
    )
}

export default DianMingJieGuoModal
