import React from "react";

export default function PageCard({className, title, desc, buttons})
{
    return <div className={className}>
    <div className={className+"--card"}>
            <h1 className={className+"--card--title"}>{ title }</h1>
            <p className={className+"--card--desc"}>{ desc }</p>
            <div className={className+"--card--btn-cont"}>
                {buttons}
            </div>
        </div>
    </div>
}