import React from 'react';
import { Link } from 'react-router-dom';

import './linkbutton.css';

type LinkButtonProps = {
    to: string,
    text: string
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, text }: LinkButtonProps) => {
    return (
        <div className={"outline"}>
            <Link className={"linkColor"} to={to}><span>{text}</span></Link>
        </div>
    )
}

export default LinkButton
