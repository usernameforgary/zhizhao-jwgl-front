import { TableColumnType, TablePaginationConfig, Table, Space, Col, Row, Button } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { DownloadUploadFile, IMainStore, IStore, User, WenJianZhuangTai } from '../../../customtypes'
import { huoQuXiaZaiWenJianByZhangHaoId, xiaZaiWenJianById } from '../../../services/downloaduploadfile';
import { getStore } from '../../../store/useStore'
import { convertWenJianZhuangTai2Text } from '../../../utils/converter';

class DaoChuJiLuStore {
    constructor() {
        const userStore = getStore<IMainStore>();
        this.userStore = userStore;
        const { user } = userStore;
        this.user = user;
        makeObservable(this);
    }

    @observable
    userStore: IMainStore | undefined = undefined;

    // 当前登录用户信息
    @observable
    user: User | undefined = undefined;

    // 上传下载文件信息列表
    @observable
    downloadUploadFileList: DownloadUploadFile[] = [];

    // 分页信息
    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    @action
    setPagination(pagination: TablePaginationConfig) {
        this.pagination = pagination;
        this.search();
    }

    @action
    async search() {
        const { current, pageSize } = this.pagination;
        try {
            if (this.user && this.user.id) {
                const result = await huoQuXiaZaiWenJianByZhangHaoId(
                    current || 0,
                    pageSize || 10,
                    this.user.id
                );
                if (result) {
                    runInAction(() => {
                        const { list, total } = result;
                        this.downloadUploadFileList = list;
                        this.pagination = { ...this.pagination, total, current, pageSize };
                    });
                }
            }
        } catch (e) { }
    }
}

const DaoChuJiLu = () => {
    const [viewStore] = useState<DaoChuJiLuStore>(new DaoChuJiLuStore());

    const { userStore, user, pagination, downloadUploadFileList } = viewStore;

    useEffect(() => {
        const search = async () => {
            await viewStore.search();
        }
        search();
    }, [user])

    // 分页改变
    const onTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setPagination(pagination)
    }

    // 下载文件
    const handleDownloadFile = async (id: string) => {
        if (id) {
            try {
                const url = await xiaZaiWenJianById(id);
                window.open(url, '_blank');
                if (userStore) {
                    userStore.huoQuDaiXiaZaiWenJianShu();
                }
                viewStore.search();
            } catch (e) { }
        }
    }

    const columns: TableColumnType<DownloadUploadFile>[] = [
        {
            title: '文件名',
            dataIndex: 'mingCheng',
            key: 'mingCheng'
        },
        {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render(value, record) {
                return (
                    <span>
                        {moment(Number(record.createTime)).format('yyyy-MM-DD HH:mm')}
                    </span>
                );
            }
        },
        {
            title: '文件大小',
            dataIndex: 'daXiao',
            key: 'daXiao',
            render: (value, record) => {
                return (
                    <span>{(record.daXiao / 1024).toFixed(3)} KB</span>
                );
            }
        },
        {
            title: '状态',
            dataIndex: 'wenJianZhuangTai',
            key: 'wenJianZhuangTai',
            render: (value, record) => {
                return (
                    <span>{convertWenJianZhuangTai2Text(record.wenJianZhuangTai)}</span>
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (value, record) => {
                let result: React.ReactNode = "";
                if (record.wenJianZhuangTai === WenJianZhuangTai.WEI_XIA_ZAI) {
                    result = <Button type="link" onClick={e => handleDownloadFile(record.id || "")}>下载</Button>;
                } else {
                    result = <Button type="link" disabled>下载</Button>;
                }
                return result;
            }
        }
    ];
    return (
        <>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={pagination}
                            dataSource={downloadUploadFileList}
                            columns={columns}
                            onChange={onTableChange}
                        >
                        </Table>
                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default observer(DaoChuJiLu)
