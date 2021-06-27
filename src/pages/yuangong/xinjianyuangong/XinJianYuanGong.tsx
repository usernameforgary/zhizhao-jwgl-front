import { Form, Input, Radio, Switch, Select, Row, Col, Button, Checkbox, message } from "antd"
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import JueseGroupFormItem from "../../../components/juesecheckbox";
import { JueseGroupData } from "../../../components/juesecheckbox/JueseCheckboxGroup";
import TianJiaJueSeModal from "../../../components/modals/tianjiajuese/TianJiaJueSeModal";
import { JueSe, NoPageSearchResult, ShanChangKeMu, XingBie } from "../../../customtypes";
import { huoQuShanChangKeMu } from "../../../services/common";
import { huoQuJueSeLieBiao } from "../../../services/juese";
;

const { Option } = Select;
const { TextArea } = Input;

const convertJueSe2JueseGroupData = (data: NoPageSearchResult<JueSe>): JueseGroupData[] => {
    const jueSeGroupDatas: JueseGroupData[] = [];
    data.list.map(v => {
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

    @action
    async getShanChangKeMuLieBiao(): Promise<void> {
        const result = await huoQuShanChangKeMu();
        this.shanChangKeMuList = result.list;
    }

    constructor() {
        makeObservable(this)
    }
}

const XinJianYuanGong = () => {
    const [form] = Form.useForm();
    //是否显示添加角色模态窗口
    const [showTianJianJueseModal, setShowTianJianJueseModal] = useState<boolean>(false);
    const [jueSeDatas, setJueSeDatas] = useState<JueseGroupData[]>([]);
    const [viewStore] = useState<XinJianYuanGongStore>(new XinJianYuanGongStore());

    const { shanChangKeMuList } = viewStore;

    //获取角色列表
    const getJueSeLieBiao = async () => {
        try {
            const res = await huoQuJueSeLieBiao();
            const jueSeDatas: JueseGroupData[] = convertJueSe2JueseGroupData(res);
            setJueSeDatas([...jueSeDatas]);
        } catch (err) {
            message.error(err.message || err.toString());
        }
    }

    useEffect(() => {
        getJueSeLieBiao();
        viewStore.getShanChangKeMuLieBiao();
    }, []);

    const onFinish = (value: any) => {
        console.log(value)
    }
    const selectShanChang = (value: any) => {
        console.log(value)
    }

    //添加角色按钮点击
    const tianJanJueSeHandler = () => {
        setShowTianJianJueseModal(!showTianJianJueseModal);
    }

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
            >
                <Form.Item label="姓名" name="xingMing" rules={[{ required: true, message: "请输入姓名" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item label="手机" name="shouJi" rules={[{ required: true, message: "请输入手机号" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item label="性别" name="xingBie" initialValue={XingBie.NAN}>
                    <Radio.Group>
                        <Radio value={XingBie.NAN}>男</Radio>
                        <Radio value={XingBie.NV}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="是否授课" name="isLaoShi">
                    <Switch defaultChecked={false} />
                </Form.Item>
                <Row>
                    <Form.Item label="擅长科目" name="shanChangKeMu">
                        <Select
                            mode="multiple"
                            allowClear
                            labelInValue
                            style={{ width: 120 }}
                            onChange={selectShanChang}
                        >
                            {
                                shanChangKeMuList.map(v => <Option value={v.id || ""}>{v.mingCheng}</Option>)
                            }
                        </Select>
                    </Form.Item>
                    <a>编辑擅长科目</a>
                </Row>
                <Form.Item label="备注" name="beiZhu">
                    <TextArea showCount maxLength={50}></TextArea>
                </Form.Item>
                <Button type="primary" onClick={tianJanJueSeHandler} >自定义添加角色</Button>
                <Form.Item label="功能权限选择" name="jueSeZu" rules={[{ required: true, message: "点击选择角色" }]}>
                    <JueseGroupFormItem datas={jueSeDatas} />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            {showTianJianJueseModal ? <TianJiaJueSeModal visible={showTianJianJueseModal} onClose={() => setShowTianJianJueseModal(false)} /> : ""}
        </>
    )
}

export default observer(XinJianYuanGong)
