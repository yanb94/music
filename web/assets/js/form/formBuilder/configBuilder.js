class InputConfig
{
    type
}

class SeparatorConfig extends InputConfig
{
    type = "separator"
}

class CheckBoxInputConfig extends InputConfig
{
    type = "checkbox"
    id
    label

    setId(id){
        this.id = id
        return this
    }

    setLabel(label){
        this.label = label
        return this
    }
}

class BirthdayInputConfig extends InputConfig
{
    type = "birthday"
    label
    name

    setLabel(label){
        this.label = label
        return this
    }
    setName(name){
        this.name = name
        return this
    }
}

class RadioInputConfig extends InputConfig
{
    type = "radio"
    id
    label
    options

    setId(id){
        this.id = id
        return this
    }
    setLabel(label){
        this.label = label
        return this
    }
    setOptions(options){
        this.options = options
        return this
    }
}

class ImageInputConfig extends InputConfig
{
    type = 'image'
    id
    label
    placeholder

    setId(id){
        this.id = id
        return this
    }
    setLabel(label){
        this.label = label
        return this
    }
    setPlaceholder(placeholder)
    {
        this.placeholder = placeholder
        return this
    }
}

class FileInputConfig extends InputConfig
{
    type = 'file'
    id
    label
    placeholder

    setId(id){
        this.id = id
        return this
    }
    setLabel(label){
        this.label = label
        return this
    }
    setPlaceholder(placeholder)
    {
        this.placeholder = placeholder
        return this
    }
}

class TextInputConfig extends InputConfig
{
    type = "text"
    id
    label
    placeholder

    setId(id){
        this.id = id
        return this
    }
    setLabel(label){
        this.label = label
        return this
    }
    setPlaceholder(placeholder)
    {
        this.placeholder = placeholder
        return this
    }
}

class TextareaInputConfig extends TextInputConfig
{
    type = "textarea"
}

class EmailInputConfig extends TextInputConfig
{
    type = "email"
}

class PasswordInputConfig extends TextInputConfig
{
    type = "password"
}

class SongListInput extends InputConfig
{
    type = "songList"
    label
    name

    setLabel(label){
        this.label = label
        return this
    }
    setName(name){
        this.name = name
        return this
    }
}

export default class FormConfig
{
    static build(fields){
        return fields
    }

    static addTextInput()
    {
        return new TextInputConfig()
    }

    static addSeparator()
    {
        return new SeparatorConfig()
    }

    static addCheckbox()
    {
        return new CheckBoxInputConfig()
    }

    static addBirthday()
    {
        return new BirthdayInputConfig()
    }

    static addRadioInput()
    {
        return new RadioInputConfig()
    }

    static addTextareaInput()
    {
        return new TextareaInputConfig()
    }

    static addEmailInput()
    {
        return new EmailInputConfig()
    }

    static addPasswordInput()
    {
        return new PasswordInputConfig()
    }

    static addImageInput()
    {
        return new ImageInputConfig()
    }

    static addFileInput()
    {
        return new FileInputConfig()
    }

    static addSongListInput()
    {
        return new SongListInput()
    }
}