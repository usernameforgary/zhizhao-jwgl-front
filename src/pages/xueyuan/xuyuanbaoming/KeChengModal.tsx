import { Table, TableColumnType } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import { TableRowSelection } from 'antd/lib/table/interface'
import React, { useEffect, useState } from 'react'
import { KeCheng } from '../../../customtypes'


type KeChengModalProps<T> = {
    visible: boolean
    onClose: () => void
    onSearch: () => Promise<T[]>
    initialDatas: T[]
    setSelected: (keys: React.Key[], datas: T[]) => void
}

// TODO 优化成公用组件
const KeChengModal: React.FC<KeChengModalProps<KeCheng>> = ({ visible, onClose, onSearch, initialDatas, setSelected }) => {
    const [listDatas, setListDatas] = useState<KeCheng[]>([]);
    const [selectedKeys, setSeletedKeys] = useState<React.Key[]>([]);
    const [selectedDatas, setSeletedDatas] = useState<KeCheng[]>([]);

    useEffect(() => {
        const initial = async () => {
            if (onSearch) {
                try {
                    const res = await onSearch();
                    setListDatas(res);
                } catch (e) { }
            }
        }

        initial()
    }, [])

    useEffect(() => {
        const keySelected: React.Key[] = [];
        initialDatas.forEach(v => {
            if (v.id) {
                keySelected.push(v.id);
            }
        });
        setSeletedKeys(keySelected);
    }, [initialDatas])

    // table选择定义
    const rowSelection: TableRowSelection<KeCheng> = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: KeCheng[]) => {
            setSeletedKeys(selectedRowKeys)
            setSeletedDatas(selectedRows)
        },
        selectedRowKeys: selectedKeys
        // getCheckboxProps: (record: KeCheng) => ({
        //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //     name: record.name,
        // }),
    };

    const handleOnOk = () => {
        setSelected(selectedKeys, selectedDatas);
        onClose();
    }

    const columns: TableColumnType<KeCheng>[] = [
        {
            title: '课程名称',
            dataIndex: "mingCheng",
            key: 'mingCheng'
        },
        {
            title: '单价',
            dataIndex: 'danJia',
            key: 'danJia',
            render: (text) => {
                return (
                    <span>{text}元/课时</span>
                );
            }
        }
    ];

    return (
        <>
            <Modal visible={visible}
                title="选择课程"
                onCancel={onClose}
                okText={"选好了"}
                cancelText={"取消"}
                onOk={handleOnOk}
            >
                <Table
                    rowSelection={rowSelection}
                    dataSource={listDatas}
                    columns={columns}
                    pagination={false}
                />
            </Modal>
        </>
    )
}

export default KeChengModal
