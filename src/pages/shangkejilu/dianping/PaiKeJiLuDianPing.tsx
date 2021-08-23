import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, Upload, Button, Modal, Space } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import MyAvatar from '../../../components/customicons/avatar/MyAvatar';
import { ChengZhangJiLu, ChengZhangJiLuLeiXing, ChengZhangJiLuWenJian, OssSignature, PaiKeJiLu } from '../../../customtypes';
import { huoQuPaiKeJiLuKeHouDianPingById } from '../../../services/pakejilu';
import { useForm } from 'antd/lib/form/Form'
import { huoQuShangChuanWenJianOssXinXi } from '../../../services/downloaduploadfile';
import { randomId } from '../../../utils';
import { baoCunKeHouDianPingXinXi } from '../../../services/combine';
import DaoKeZhuangTaiSpan from '../../../components/daokezhuangtai/DaoKeZhuangTaiSpan';

type ParamsType = {
    paiKeJiLuId: string
}

type DianPingFormValueType = {
    xueYuanId: string,
    neiRong: string,
    wenJianZu: UploadChangeParam<UploadFile>
}


type OssUploadData = {
    // oss上文件key（路径+文件名)
    key: string
    policy: string
    OSSAccessKeyId: string
    success_action_status: number
    signature: string
}

class PaiKeJiLuDianPingStore {
    constructor(paiKeJiLuId: string) {
        this.paiKeJiLuId = paiKeJiLuId;
        makeObservable(this);
    }

    @observable
    paiKeJiLuId: string | undefined = undefined;

    @observable
    paiKeJiLu: PaiKeJiLu | undefined = undefined;

    @action
    setPaiKeJiLu(newPaiKeJiLu: PaiKeJiLu) {
        this.paiKeJiLu = newPaiKeJiLu;
    }

    @action
    async search() {
        if (this.paiKeJiLuId) {
            try {
                const result = await huoQuPaiKeJiLuKeHouDianPingById(this.paiKeJiLuId);
                runInAction(() => {
                    this.paiKeJiLu = result;
                })
            } catch (e) { }
        }
    }
}

const PaiKeJiLuDianPing = () => {
    const { paiKeJiLuId } = useParams<ParamsType>();
    const [viewStore] = useState<PaiKeJiLuDianPingStore>(new PaiKeJiLuDianPingStore(paiKeJiLuId));
    const [ossPutUrl, setOssPutUrl] = useState<string>();
    const [ossSignature, setOssSignature] = useState<OssSignature>();
    const [uploaderData, setUploaderData] = useState<OssUploadData>();
    const history = useHistory();

    // 图片预览
    const [previewVisible, SetPreviewVisible] = useState<boolean>(false);
    const [previewImage, SetPreviewImage] = useState<string>();
    const [previewTitle, setPreViewTitle] = useState<string>();

    const [form] = useForm();

    const { paiKeJiLu } = viewStore;

    useEffect(() => {
        const search = async () => {
            await viewStore.search()
        }
        search()
    }, [])

    // 文件上传改变
    const handleFileUploadChange = (info: UploadChangeParam<UploadFile>, xueYuanId: string) => {
        if (info.file.error) {
            console.log(info);
            info.file.response = "文件上传失败";
        }
        // 当前文件OSS中的key
        info.file.url = ossSignature?.dir;
        console.log("info", info)
    }

    // 文件上传之前，获取文件上传到Oss需要的签名信息
    const handleBeforeUploadFile = async (file: RcFile, fileList: RcFile[]) => {
        //限制图片 格式、size
        const isJPG = file.type === 'image/jpeg';
        const isJPEG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        if (!(isJPG || isJPEG || isGIF || isPNG)) {
            Modal.error({
                title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~',
            });
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            Modal.error({
                title: '超过2M限制，不允许上传~',
            });
            return;
        }
        const result: OssSignature = await huoQuShangChuanWenJianOssXinXi(file.name);
        console.log(result);
        setOssSignature(result);
        setOssPutUrl(result.host);

        const data: OssUploadData = {
            key: result.dir,
            policy: result.policy,
            OSSAccessKeyId: result.accessid,
            success_action_status: 200,
            signature: result.signature
        }
        setUploaderData(data);
    }

    // 点击文件链接或预览图标时的回调
    const handleUploadPreview = async (file: UploadFile) => {
        setPreViewTitle(file.name);
        SetPreviewImage(file.thumbUrl);
        SetPreviewVisible(true);
    }

    // 取消显示
    const handleCancelPreview = () => {
        SetPreviewVisible(false)
    }

    const handleFormFinish = async (values: any) => {
        await form.validateFields();

        console.log("form values", values)
        const shangKeXueYuanZu: DianPingFormValueType[] = form.getFieldValue("shangKeXueYuanZu") || [];
        const chengZhangJiLuZu: ChengZhangJiLu[] = [];
        shangKeXueYuanZu.forEach(v => {
            let chengZhangJiLuWenJianZu: ChengZhangJiLuWenJian[] = [];
            if (v.wenJianZu && v.wenJianZu.fileList) {
                v.wenJianZu.fileList.forEach(w => {
                    if (!w.error && w.status === "done") {
                        const wenJianMing = w.name.substring(0, w.name.lastIndexOf('.'));
                        const houZhui = w.name.substring(w.name.lastIndexOf("."));
                        let chengZhangJiLuWenJian: ChengZhangJiLuWenJian = {
                            id: randomId(),
                            mingCheng: wenJianMing,
                            houZhui: houZhui,
                            ossKey: w.url || "",
                            ossBucketName: "",
                            daXiao: w.size || 0
                        }
                        chengZhangJiLuWenJianZu.push(chengZhangJiLuWenJian)
                    }
                });
            }

            let chengZhangJiLu: ChengZhangJiLu = {
                xueYuanId: v.xueYuanId,
                id: randomId(),
                neiRong: v.neiRong,
                paiKeJiLuId: paiKeJiLuId,
                chengZhangJiLuLeiXing: ChengZhangJiLuLeiXing.KE_HOU_DIAN_PING,
                jiaZhangYiDu: false,
                chengZhangJiLuWenJianZu: chengZhangJiLuWenJianZu,
            }
            chengZhangJiLuZu.push(chengZhangJiLu);
        })

        console.log("converted value: ", chengZhangJiLuZu);

        try {
            await baoCunKeHouDianPingXinXi(chengZhangJiLuZu);
            history.goBack();
        } catch (e) { }
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
            <Row style={{ marginBottom: '2rem' }}>
                <Row style={{ width: '100%' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>上课信息</span>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Col span={6}>
                        <span>上课日期：</span>
                        <span>{paiKeJiLu ? moment(Number(paiKeJiLu.shangKeRiQi)).format('yyyy-MM-DD') : '--'}</span>
                    </Col>
                    <Col span={6}>
                        <span>上课时段：</span>
                        <span>{paiKeJiLu ? moment(Number(paiKeJiLu.shangKeShiJianStart)).format('hh:mm') : '--'}</span>
                        &nbsp;-&nbsp;
                        <span>{paiKeJiLu ? moment(Number(paiKeJiLu.shangKeShiJianEnd)).format('hh:mm') : '--'}</span>
                    </Col>
                    <Col span={6}>
                        <span>上课老师：</span>
                        <span>{paiKeJiLu?.shangKeLaoShiXingMing}</span>
                    </Col>
                    <Col span={6}>
                        <span>上课内容：</span>
                        <span>{paiKeJiLu?.shangKeNeiRong}</span>
                    </Col>
                </Row>
            </Row>
            <Row>
                <Row style={{ width: '100%' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>课堂点评</span>
                </Row>
                <Form
                    style={{ width: '100%' }}
                    form={form}
                    onFinish={handleFormFinish}
                >
                    {paiKeJiLu?.shangKeXueYuanZu.map((v, index) => {
                        return (
                            <Row key={v.xueYuanId} style={{ width: '100%' }}>
                                <Row style={{ width: '100%', marginBottom: '1rem' }} align="middle">
                                    <Col offset={1} span={2}>
                                        <Space direction="vertical">
                                            <Row justify="center">
                                                <MyAvatar />
                                            </Row>
                                            <Row justify="center">
                                                <DaoKeZhuangTaiSpan daoKeZhuangTai={v.xueYuanDaoKeZhuangTai} />
                                            </Row>
                                        </Space>

                                    </Col>
                                    <Col>
                                        <Form.Item
                                            name={["shangKeXueYuanZu", index, "xueYuanId"]}
                                            initialValue={v.xueYuanId}
                                            style={{ marginBottom: 0 }}>
                                            <span style={{ fontSize: '1rem' }}>{v.xueYuanXingMing}</span>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ width: '100%' }}>
                                    <Col offset={3} span={12}>
                                        <Form.Item labelAlign="left" labelCol={{ span: 4 }} name={["shangKeXueYuanZu", index, "neiRong"]} label="老师评语">
                                            <Input.TextArea maxLength={100} showCount={true}></Input.TextArea>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ width: '100%' }}>
                                    <Col offset={3} span={12}>
                                        <Form.Item name={["shangKeXueYuanZu", index, "wenJianZu"]} label="上传文件" labelAlign="left" labelCol={{ span: 4 }} >
                                            <Upload
                                                listType="picture-card"
                                                accept={"image/*"}
                                                data={uploaderData}
                                                action={ossPutUrl}
                                                onChange={(info) => handleFileUploadChange(info, v.xueYuanId)}
                                                beforeUpload={(file, fileList) => handleBeforeUploadFile(file, fileList)}
                                                onPreview={handleUploadPreview}
                                            >
                                                <>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </>
                                            </Upload>
                                        </Form.Item>
                                        <Modal
                                            visible={previewVisible}
                                            title={previewTitle}
                                            footer={null}
                                            onCancel={handleCancelPreview}
                                        >
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </Col>
                                </Row>
                            </Row>
                        )
                    })}
                    <Row justify="center">
                        <Col span={12}>
                            <Row justify="end">
                                <Form.Item>
                                    <Row gutter={20}>
                                        <Col>
                                            <Button type="primary" htmlType="submit">
                                                保存
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </div>
    )
}

export default observer(PaiKeJiLuDianPing)

