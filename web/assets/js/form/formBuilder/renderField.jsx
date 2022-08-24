import React from 'react';
import TextInput from '@app/form/textInput/TextInput';
import TextareaInput from '@app/form/textareaInput/TextareaInput';
import ImageInput from '@app/form/imageInput/ImageInput';
import CheckBoxInput from '@app/form/checkboxInput/CheckBoxInput';
import RadioInput from '@app/form/radioInput/RadioInput';
import BirthdateInput from '@app/form/birthdateInput/BirthdateInput';
import FileInput from '@app/form/fileInput/FileInput';
import SongListInput from '@app/form/songListInput/SongListInput';

const separatorStyle = {
    'height': "3px", 
    "color": "white", 
    "backgroundColor": "white", 
    "margin": "20px auto",
    "width": "95%"
};

const renderTextField = (config, key, formLinks) => {
    return <TextInput 
        key={key}
        id={config.id}
        name={config.name ?? config.id}
        label={config.label}
        type={config.type}
        placeholder={config.placeholder}
        register={formLinks.register}
        errors={formLinks.errors}
    />
}

const renderTextareaField = (config, key, formLinks) => {
    return <TextareaInput
        key={key}
        id={config.id}
        name={config.name ?? config.id}
        label={config.label}
        placeholder={config.placeholder}
        register={formLinks.register}
        errors={formLinks.errors}
    />
}

const renderImageField = (config, key, formLinks) => {
    return <ImageInput
        key={key}
        id={config.id}
        name={config.name ?? config.id}
        label={config.label}
        placeholder={config.placeholder}
        register={formLinks.register}
        errors={formLinks.errors}
        control={formLinks.control}
    />
}

const renderSeparator = (config, key, formLinks) => {
    return <hr style={separatorStyle} key={key} />
}

const renderCheckBox = (config, key, formLinks) => {
    return <CheckBoxInput 
        key={key}
        id={config.id}
        name={config.name ?? config.id}
        label={config.label}
        register={formLinks.register}
        errors={formLinks.errors}
    />
}

const renderRadio = (config, key, formLinks) => {
    return <RadioInput 
        key={key}
        register={formLinks.register} 
        errors={formLinks.errors} 
        label={config.label} 
        name={config.name ?? config.id} 
        options={config.options}
    />
}

const renderBirthday = (config, key, formLinks) => {
    return <BirthdateInput 
        key={key}
        name={config.name}
        label={config.label} 
        control={formLinks.control} 
        errors={formLinks.errors}
    />
}

const renderFileField = (config, key, formLinks) => {
    return <FileInput
        key={key}
        id={config.id}
        name={config.name ?? config.id}
        label={config.label}
        register={formLinks.register}
        errors={formLinks.errors}
    />
    ; 
}

const renderSongListField = (config, key, formLinks) => {
    return <SongListInput
        key={key}
        label={config.label}
        name={config.name}
        control={formLinks.control} 
        errors={formLinks.errors}
    />
}

const renderField = (config, key, formLinks) => {
    if(['text','email','password'].includes(config.type))
        return renderTextField(config, key, formLinks)
    else if(config.type == 'textarea')
        return renderTextareaField(config, key, formLinks)
    else if(config.type == 'image')
        return renderImageField(config, key, formLinks)
    else if(config.type == 'separator')
        return renderSeparator(config, key, formLinks)
    else if(config.type == 'checkbox')
        return renderCheckBox(config, key, formLinks)
    else if(config.type == 'radio')
        return renderRadio(config, key, formLinks)
    else if(config.type == 'birthday')
        return renderBirthday(config, key, formLinks)
    else if(config.type == 'file')
        return renderFileField(config, key, formLinks)
    else if(config.type == 'songList')
        return renderSongListField(config, key, formLinks)
}

export default renderField;