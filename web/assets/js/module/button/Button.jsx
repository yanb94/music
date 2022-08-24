import React from "react";
import "./Button.scss";

export default function Button({theme,fontSize,height,width,children,style,onClick,disabled,className="",type="button"})
{    
    switch (type) {
        case "button":
            return <div onClick={onClick} disabled={disabled} className={"button-"+(theme)+(className != "" ? " "+className : "") } style={{"fontSize": fontSize, "height": height, "width": width,...style}}>
                {children}
            </div>
            break;
        case "submit":
            return <input className={"button-"+(theme)+(className != "" ? " "+className : "")} onClick={onClick} disabled={disabled} style={{"fontSize": fontSize, "height": height, "width": width,'border': 'none',...style}} type="submit" value={children} />
        default:
            break;
    }
    
}