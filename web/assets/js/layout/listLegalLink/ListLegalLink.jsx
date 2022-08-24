import React from 'react'
import { Link } from 'react-router-dom'

export default function ListLegalLink({legals, classLink})
{
    return Array.isArray(legals) ? legals.map((legal) => {
        return <Link key={legal["id"]} to={"/legal/"+legal['slug']} className={classLink}>
            {legal["label"]}
        </Link>
    }) : ""
}