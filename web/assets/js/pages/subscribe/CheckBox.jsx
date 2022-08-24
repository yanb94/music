import React from 'react'
import './CheckBox.scss'

export default function CheckBox({label, name, setValid})
{
    return <div className="checkbox">
        <input type="checkbox" name={name} id={name} onChange={(e) => setValid(e.currentTarget.checked)} />
        <label htmlFor={name}>{label}</label>
    </div>
}