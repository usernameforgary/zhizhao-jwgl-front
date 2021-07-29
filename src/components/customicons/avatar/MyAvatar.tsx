import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined'
import { Avatar, Image } from 'antd'
import { AvatarSize } from 'antd/lib/avatar/SizeContext'
import React from 'react'

type AvatarDefaultProps = {
    url?: string
    size?: AvatarSize | undefined,
}

const MyAvatar = ({ url, size }: AvatarDefaultProps): JSX.Element => {
    let avatar = <Avatar size={size || "large"} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />;
    if (url) {
        avatar = <Avatar size={size || "large"} src={<Image src={url} />} />
    }
    return avatar;
}

export default MyAvatar
