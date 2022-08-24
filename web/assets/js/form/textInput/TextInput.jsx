import React from "react";
import "./TextInput.scss";

export default function TextInput({id,label,placeholder,labelStyle,inputStyle,contStyle,register,errors,name,type="text"})
{
    return <div className="input-text" style={contStyle}>
        <label htmlFor={id} style={labelStyle}>{label}</label>
        <input {...register(name)} id={id} style={inputStyle} name={name} placeholder={placeholder} type={type} />
        {
            errors[name]?.message ? <div className="input-text--error">
                <i className="fas fa-exclamation-triangle"></i> {errors[name]?.message}
            </div> : ""
        }
    </div>
}