import { jest, expect } from "@jest/globals";
import 'regenerator-runtime/runtime'
import FormConfig from "./configBuilder";

it("test separator config", async () => {
    const formFields = FormConfig.build([
        FormConfig.addSeparator()
    ])
    expect(formFields[0].type).toBe('separator')
})

it("test checkbox config", async () => {
    const formFields = FormConfig.build([
        FormConfig.addCheckbox()
            .setId('checkbox')
            .setLabel('Checkbox')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('checkbox')
    expect(fieldConfig.id).toBe('checkbox')
    expect(fieldConfig.label).toBe('Checkbox')
})

it("test birthday config", async () => {
    const formFields = FormConfig.build([
        FormConfig.addBirthday()
            .setName('birthday')
            .setLabel('Birthday')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('birthday')
    expect(fieldConfig.name).toBe('birthday')
    expect(fieldConfig.label).toBe('Birthday')
})

it("test radio config", async () => {
    const formFields = FormConfig.build([
        FormConfig.addRadioInput()
            .setId('radio')
            .setLabel('Radio')
            .setOptions({"1": "Un", '2': 'Deux'})
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('radio')
    expect(fieldConfig.id).toBe('radio')
    expect(fieldConfig.label).toBe('Radio')
    expect(fieldConfig.options).toStrictEqual({"1": "Un", '2': 'Deux'})
})

it("test image config", async() => {
    const formFields = FormConfig.build([
        FormConfig.addImageInput()
            .setId('image')
            .setLabel('Image')
            .setPlaceholder('Image')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('image')
    expect(fieldConfig.id).toBe('image')
    expect(fieldConfig.label).toBe('Image')
    expect(fieldConfig.placeholder).toBe('Image')
})

it("test text config", async() => {
    const formFields = FormConfig.build([
        FormConfig.addTextInput()
            .setId('text')
            .setLabel('Text')
            .setPlaceholder('Text')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('text')
    expect(fieldConfig.id).toBe('text')
    expect(fieldConfig.label).toBe('Text')
    expect(fieldConfig.placeholder).toBe('Text')
})

it("test textarea config", async() => {
    const formFields = FormConfig.build([
        FormConfig.addTextareaInput()
            .setId('textarea')
            .setLabel('Textarea')
            .setPlaceholder('Textarea')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('textarea')
    expect(fieldConfig.id).toBe('textarea')
    expect(fieldConfig.label).toBe('Textarea')
    expect(fieldConfig.placeholder).toBe('Textarea')
})

it("test email config", async() => {
    const formFields = FormConfig.build([
        FormConfig.addEmailInput()
            .setId('email')
            .setLabel('Email')
            .setPlaceholder('Email')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('email')
    expect(fieldConfig.id).toBe('email')
    expect(fieldConfig.label).toBe('Email')
    expect(fieldConfig.placeholder).toBe('Email')
})

it("test password config", async() => {
    const formFields = FormConfig.build([
        FormConfig.addPasswordInput()
            .setId('password')
            .setLabel('Password')
            .setPlaceholder('Password')
    ])
    
    const fieldConfig = formFields[0];

    expect(fieldConfig.type).toBe('password')
    expect(fieldConfig.id).toBe('password')
    expect(fieldConfig.label).toBe('Password')
    expect(fieldConfig.placeholder).toBe('Password')
})

it("test formConfig with multiple field", async () => {
    const formFields = FormConfig.build([
        FormConfig.addPasswordInput()
            .setId('password')
            .setLabel('Password')
            .setPlaceholder('Password'),
        FormConfig.addEmailInput()
            .setId('email')
            .setLabel('Email')
            .setPlaceholder('Email'),
        FormConfig.addImageInput()
            .setId('image')
            .setLabel('Image')
            .setPlaceholder('Image')
    ]);

    const passwordField = formFields[0];
    const emailField = formFields[1];
    const imageField = formFields[2];

    expect(passwordField.type).toBe('password')
    expect(emailField.type).toBe('email')
    expect(imageField.type).toBe('image')
})