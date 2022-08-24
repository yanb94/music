import React from 'react'
import { jest, expect } from "@jest/globals";
import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import 'regenerator-runtime/runtime';
import renderField from './renderField';
import FormConfig from './configBuilder';
import { expectElementExist, expectElementHasContent } from '@app/test/util';
import { useForm } from 'react-hook-form';
import ImageInput from '@app/form/imageInput/ImageInput';
import BirthdateInput from '@app/form/birthdateInput/BirthdateInput';

it("render textInput has expected", async () => {
    const field = renderField(
        FormConfig.addTextInput()
            .setId('textInput')
            .setLabel('TextInput')
            .setPlaceholder('TextInput'),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(field)

    expectElementExist(".input-text",container)
    const label = expectElementExist("label[for='textInput']",container)
    expectElementHasContent(label,"TextInput")
    expectElementExist("input[placeholder='TextInput']", container)
})

it("render emailInput has expected", async () => {
    const field = renderField(
        FormConfig.addEmailInput()
            .setId('emailInput')
            .setLabel('EmailInput')
            .setPlaceholder('EmailInput'),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(field)

    expectElementExist(".input-text",container)
    const label = expectElementExist("label[for='emailInput']",container)
    expectElementHasContent(label,"EmailInput")
    expectElementExist("input[placeholder='EmailInput'][type='email']", container)
})

it("render passwordInput has expected", async () => {
    const field = renderField(
        FormConfig.addPasswordInput()
            .setId('passwordInput')
            .setLabel('PasswordInput')
            .setPlaceholder('PasswordInput'),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(field)

    expectElementExist(".input-text",container)
    const label = expectElementExist("label[for='passwordInput']",container)
    expectElementHasContent(label,"PasswordInput")
    expectElementExist("input[placeholder='PasswordInput'][type='password']", container)
})

it("render textArea has expected", async () => {
    const field = renderField(
        FormConfig.addTextareaInput()
            .setId('textarea')
            .setLabel('Textarea')
            .setPlaceholder('Textarea'),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(field)

    expectElementExist(".input-textarea",container)
    const label = expectElementExist("label[for='textarea']",container)
    expectElementHasContent(label,"Textarea")
    expectElementExist("textarea[placeholder='Textarea']", container)
})

it("render separator has expected", async () => {
    const separator = renderField(
        FormConfig.addSeparator(),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(separator)

    expectElementExist('hr',container)
})


it("render image has expected", async () => {
        
    const field = renderField(
        FormConfig.addImageInput()
            .setId('image')
            .setLabel('Image')
            .setPlaceholder('Image'),
        1,
        {
            register: (name) => {},
            errors: [],
            control: {
            }
        }
    )

    expect(field.type).toBe(ImageInput)
    const props = field.props;

    expect(props.id).toBe('image')
    expect(props.name).toBe('image')
    expect(props.label).toBe('Image')
    expect(props.placeholder).toBe('Image')
})

it("render checkbox has expected", async () => {
    const field = renderField(
        FormConfig.addCheckbox()
            .setId('checkbox')
            .setLabel('Checkbox'),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(field)

    expectElementExist(".checkbox-input",container)
    const label = expectElementExist("label[for='checkbox']",container)
    expectElementHasContent(label,"Checkbox")
    expectElementExist("input[type='checkbox']", container)
})

it("render radio has expected", async () => {
    const field = renderField(
        FormConfig.addRadioInput()
            .setId('radio')
            .setLabel('radio')
            .setOptions({"Un": "1", "Deux": "2"}),
        1,
        {
            register: (name) => {},
            errors: []
        }
    )

    const {container} = render(field)

    expectElementExist(".radio-input",container)
    expectElementExist("input#Un[type='radio']", container)
    expectElementExist("input#Deux[type='radio']", container)
})

it("render image has expected", async () => {
    const field = renderField(
        FormConfig.addBirthday()
            .setName('birthday')
            .setLabel('Birthday'),
        1,
        {
            register: (name) => {},
            errors: [],
            control: {
            }
        }
    )

    expect(field.type).toBe(BirthdateInput)
    const props = field.props;

    expect(props.name).toBe('birthday')
    expect(props.label).toBe('Birthday')
})