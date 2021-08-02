import React from 'react'
import { Tree } from 'antd'
import { } from './TianJiaJueSeModal'
import { OrderableDataNode } from '../../../customtypes'

type FormTreeProps = {
    treeData: OrderableDataNode[]
    onChange?: (checkedVals: any) => void
}
const FormTree: React.FC<FormTreeProps> = ({ treeData, onChange }) => {
    const onTreeCheck = (checked: any, info: any) => {
        let result = [];
        if (checked) {
            result.push(...checked);
        }
        if (info.halfCheckedKeys) {
            result.push(...(info.halfCheckedKeys));
        }
        if (onChange) {
            onChange(result);
        }
    }

    return (
        <>
            <Tree
                checkable
                treeData={treeData}
                onCheck={onTreeCheck}
            >
                {/* {treeData.map(data => {
                            return (
                                <TreeNode title={data.title} key={data.key}>
                                    {
                                        data.children?.map(child => {
                                            return <TreeNode title={child.title} key={child.key}></TreeNode>
                                        })
                                    }
                                </TreeNode>
                            );
                        })} */}
            </Tree>
        </>
    )
}

export default FormTree
