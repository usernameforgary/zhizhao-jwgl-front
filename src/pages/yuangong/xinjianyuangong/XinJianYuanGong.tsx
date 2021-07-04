import { Form, Input, Radio, Switch, Select, Row, Col, Button } from "antd"
import { LabeledValue } from "antd/lib/select";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'

import JueseGroupFormItem from "../../../components/juesecheckbox";
import { JueseGroupData } from "../../../components/juesecheckbox/JueseCheckboxGroup";
import TianJiaJueSeModal from "../../../components/modals/tianjiajuese/TianJiaJueSeModal";
import ShanChangKeMuModal from "../../../components/modals/tianjiashanchangkemu/ShanChangKeMuModal";
import { JueSe, NoPageSearchResult, ShanChangKeMu, XingBie } from "../../../customtypes";
import { chuangJianYuanGong } from "../../../services/account";
import { huoQuShanChangKeMu } from "../../../services/common";
import { huoQuJueSeLieBiao } from "../../../services/juese";
import { convertXingBie2Text } from "../../../utils/converter";

const { Option } = Select;
const { TextArea } = Input;

const convertJueSe2JueseGroupData = (data: NoPageSearchResult<JueSe>): JueseGroupData[] => {
    const jueSeGroupDatas: JueseGroupData[] = [];
    data.list.forEach(v => {
        const jueSeGroupData: JueseGroupData = {
            val: v.id || "",
            mingCheng: v.mingCheng,
            jianJie: v.jianJie || ""
        }
        jueSeGroupDatas.push(jueSeGroupData);
    });
    return jueSeGroupDatas;
}

class XinJianYuanGongStore {
    @observable
    shanChangKeMuList: ShanChangKeMu[] = [];

    @observable
    jueSeDatas: JueseGroupData[] = [];

    // 获取擅长科目列表
    @action
    async getShanChangKeMuLieBiao(): Promise<void> {
        const result = await huoQuShanChangKeMu();
        this.shanChangKeMuList = result.list;
    }

    // 新增擅长科目
    @action
    addNewShanChangKeMu = (item: ShanChangKeMu) => {
        this.shanChangKeMuList.push(item);
    }

    // 获取角色列表
    @action
    async getJueSeLieBiao(): Promise<void> {
        const res = await huoQuJueSeLieBiao();
        const jueSeDatas: JueseGroupData[] = convertJueSe2JueseGroupData(res);
        this.jueSeDatas = jueSeDatas;
    }

    @action
    addNewJueSe(item: JueseGroupData): void {
        this.jueSeDatas.push(item);
    }

    constructor() {
        makeObservable(this)
    }
}

const XinJianYuanGong = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    //是否显示添加角色窗口
    const [showTianJianJueseModal, setShowTianJianJueseModal] = useState<boolean>(false);
    // 是否显示添加擅长科目窗口
    const [showShanChangKeMuModal, setShowShanChangKeMuModal] = useState<boolean>(false);

    const [viewStore] = useState<XinJianYuanGongStore>(new XinJianYuanGongStore());

    const { shanChangKeMuList, jueSeDatas } = viewStore;

    useEffect(() => {
        viewStore.getJueSeLieBiao();
        viewStore.getShanChangKeMuLieBiao();
    }, []);

    // 擅长科目窗口显示
    const toggleShowShanChangKeMu = () => {
        setShowShanChangKeMuModal(!showShanChangKeMuModal);
    }

    // 添加擅长科目
    const addShanChangKeMu = (item: ShanChangKeMu) => {
        viewStore.addNewShanChangKeMu(item);
    }

    //表单提交
    const onFormSubmit = async (value: any) => {
        let shanChangKeMuSelected: LabeledValue[] = [];
        const shanChangKeMuKeys: string[] = [];
        const { xingMing, shouJi, xingBie, isLaoShi, jueSeZu, beiZhu, shanChangKeMu } = value;
        if (shanChangKeMu) {
            shanChangKeMuSelected = shanChangKeMu;
        }
        shanChangKeMuSelected.forEach(s => {
            shanChangKeMuKeys.push(s.key || s.value.toString());
        });

        try {
            await chuangJianYuanGong(xingMing, shouJi, jueSeZu, xingBie, isLaoShi, beiZhu, shanChangKeMuKeys);
            history.goBack();
        } catch (e) {
        }
    }

    // 角色窗口显示
    const toggleTianJanJueSe = () => {
        setShowTianJianJueseModal(!showTianJianJueseModal);
    }
    // 添加角色
    const addJueSe = (item: JueseGroupData) => {
        viewStore.addNewJueSe(item);
    }

    return (
        <>
            <Form
                form={form}
                onFinish={onFormSubmit}
            >
                <Row>
                    <Col span={12}>
                        <Form.Item labelAlign="left" labelCol={{ span: 8 }} label="姓名" name="xingMing" rules={[{ required: true, message: "请输入姓名" }]}>
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item labelAlign="left" labelCol={{ span: 8 }} label="手机" name="shouJi"
                            rules={[{ required: true, message: "请输入手机号" }, { message: "请正确输入手机号", pattern: new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$") }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item labelAlign="left" labelCol={{ span: 8 }} label="性别" name="xingBie" initialValue={XingBie.NAN}>
                            <Radio.Group>
                                <Radio value={XingBie.NAN}>{convertXingBie2Text(XingBie.NAN)}</Radio>
                                <Radio value={XingBie.NV}>{convertXingBie2Text(XingBie.NV)}</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item labelAlign="left" initialValue={false} labelCol={{ span: 8 }} label="是否授课" name="isLaoShi">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <Form.Item labelAlign="left" labelCol={{ span: 8 }} label="擅长科目" name="shanChangKeMu">
                            <Select
                                mode="multiple"
                                allowClear
                                labelInValue
                            >
                                {
                                    shanChangKeMuList.map(v => <Option key={v.id} value={v.id || ""}>{v.mingCheng}</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Button onClick={toggleShowShanChangKeMu} type="link">编辑擅长科目</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item labelAlign="left" labelCol={{ span: 8 }} label="备注" name="beiZhu">
                            <TextArea showCount maxLength={50}></TextArea>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} style={{ margin: "10px" }}>
                        <Button type="primary" onClick={toggleTianJanJueSe} >自定义添加角色</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item labelAlign="left" labelCol={{ span: 4 }} label="功能权限选择" name="jueSeZu" rules={[{ required: true, message: "至少选择一个角色" }]}>
                            <JueseGroupFormItem datas={jueSeDatas} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end">
                    <Form.Item>
                        <Row gutter={10}>
                            <Col>
                                <Button onClick={() => history.goBack()}>
                                    取消
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                            </Col>
                        </Row>

                    </Form.Item>
                </Row>
            </Form>
            {
                showTianJianJueseModal ?
                    <TianJiaJueSeModal
                        visible={showTianJianJueseModal}
                        onClose={toggleTianJanJueSe}
                        addNew={addJueSe}
                    />
                    : ""
            }
            {
                showShanChangKeMuModal ?
                    <ShanChangKeMuModal
                        visible={showShanChangKeMuModal}
                        onClose={toggleShowShanChangKeMu}
                        existShanChangKeMu={shanChangKeMuList}
                        addNew={addShanChangKeMu} />
                    : ""
            }
        </>
    )
}

export default observer(XinJianYuanGong)
