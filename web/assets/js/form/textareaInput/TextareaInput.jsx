import React from "react";
import "./TextareaInput.scss";

export default function TextareaInput({id,label,placeholder,labelStyle,inputStyle,contStyle,register,errors,name,rows=5})
{
    return <div className="input-textarea" style={contStyle}>
        <label htmlFor={id} style={labelStyle}>{label}</label>
        <textarea rows={rows} {...register(name)} id={id} style={inputStyle} name={name} placeholder={placeholder}>
        </textarea>
        {
            errors[name]?.message ? <div className="input-textarea--error">
                <i className="fas fa-exclamation-triangle"></i> {errors[name]?.message}
            </div> : ""
        }
    </div>
}