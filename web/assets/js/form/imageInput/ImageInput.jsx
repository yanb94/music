import React, { useState } from 'react'
import './ImageInput.scss';
import { Controller } from "react-hook-form";

export default function ImageInput({id,label,placeholder,labelStyle,inputStyle,contStyle,register,errors,name,control})
{
    const [background, setBackground] = useState(null)
    const [afterContent, setAfterContent] = useState("'+'")

    const validateFile = (file) => {
        return file && ['image/jpeg','image/png'].includes(file.type)
    }

    return <div className="input-image" style={contStyle}>
        <label id={"label-image-"+id} htmlFor={id} style={{"--backgroundBefore": "url('"+background+"')","--afterContent": afterContent}}>{label}</label>
        <Controller
            control={control}
            name={name}
            defaultValue={null}
            render={ ({ field: { value, onChange}}) => {
                return <input {...register(name)} id={id} style={inputStyle} name={name} placeholder={placeholder} onChange={(e) => {
                    setBackground(validateFile(e.target.files[0]) ? URL.createObjectURL(e.target.files[0]) : null)
                    setAfterContent(validateFile(e.target.files[0]) ? "''": "'+'")
                    onChange(e.target.files)
                }} type="file" />

            }}
        />
        
        {
            errors[name]?.message ? <div className="input-image--error">
                <i className="fas fa-exclamation-triangle"></i> {errors[name]?.message}
            </div> : ""
        }
    </div>
}