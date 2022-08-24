import React from 'react'
import "./CardMenuMember.scss"
import {Link} from "react-router-dom";

export default function CardMenuMember({name,icon,link})
{
    return <Link to={"/space-member"+link} className="card-menu-member">
        <div className="card-menu-member--icon">
            <i className={icon}></i>
        </div>
        <div className="card-menu-member--name">
            {name}
        </div>
    </Link>
}