import React from 'react'
import { jest, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react"
import TextareaInput from './TextareaInput';
import { expectElementExist } from '@app/test/util';
import 'regenerator-runtime/runtime'

it("texarea input render expected elements", async() => {

    // Mock
    const register = () => {};
    const errors = {};

    const {container} = render(<TextareaInput id="desc" register={register} errors={errors} name="desc" label="Description" placeholder="Entrez votre description"/>)

    expectElementExist(".input-textarea",container)
    const input = expectElementExist("textarea",container)
    const label = expectElementExist("label",container)

    expect(input.getAttribute('name')).toBe('desc');
    expect(input.getAttribute('id')).toBe('desc');
    expect(input.getAttribute('placeholder')).toBe("Entrez votre description");
    expect(label.textContent).toBe("Description")

})

it("textarea render errors has expected", () => {
    // Mock
    const register = () => {};
    const errors = {"desc": {"message": "Vous devez indiquer un texte"}};

    const {container} = render(<TextareaInput id="desc" register={register} errors={errors} name="desc" label="Description"/>, container);

    expect(container.querySelectorAll('.input-textarea--error').length).toBe(1)

    const error = container.querySelector('.input-textarea--error')

    expect(error.innerHTML).toBe("<i class=\"fas fa-exclamation-triangle\"></i> Vous devez indiquer un texte")
})