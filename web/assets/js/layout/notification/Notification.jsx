import React from "react"
import "./Notification.scss"

export default function Notification({notificationOpen, notificationContent, closeNotification})
{
    return <div className={"notification"+(notificationOpen ? " open" : "")}>
        {notificationContent} 
        <div className="notification--close" onClick={closeNotification}>
            <i className="fas fa-times"></i>
        </div>
    </div>
}