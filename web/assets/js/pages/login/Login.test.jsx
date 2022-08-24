import React, { useContext } from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { jest, expect } from "@jest/globals";
import { screen, render as renderLibrary, fireEvent } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import Login from "./Login";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import 'regenerator-runtime/runtime'
import sendRequest from "./processForm";
import { AuthProvider } from "@app/auth/auth";

/**
 * @typedef HTMLElement
 */
 let container = null;

 beforeEach(() => {
     container = document.createElement("div");
     document.body.appendChild(container);
 });
 
 afterEach(() => {
     unmountComponentAtNode(container);
     container.remove();
     container = null;
 });

jest.mock("./processForm.js");

it("login page render has expected", () => {

    render(<Login/>,container)

    const loginInput = container.querySelector("[name='username']");
    expect(loginInput).not.toBeNull()

    const loginLabel = container.querySelector("label[for='username']");
    expect(loginLabel).not.toBeNull();
    expect(loginLabel.textContent).toBe("Nom d'utilisateur")

    const passwordInput = container.querySelector("[name='password']");
    expect(passwordInput).not.toBeNull();
    expect(passwordInput.getAttribute("type")).toBe('password')

    const passwordLabel = container.querySelector("label[for='password']");
    expect(passwordLabel).not.toBeNull();
    expect(passwordLabel.textContent).toBe("Mot de passe")

    const button = container.querySelector("input[type='submit']")
    expect(button).not.toBeNull();
    expect(button.getAttribute('value')).toBe("Se connecter")
})

it("login test submit when return error", async () => {

    sendRequest.mockImplementation(() => Promise.resolve({error: "Les identifiants sont incorrects"}))
    
    await act(async () => {
        render(<Login/>,container)
    })

    const button = container.querySelector("input[type='submit']")

    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    const error = container.querySelector('.input-text--error')
    expect(error).not.toBeNull()

})

it("login test submit when return ok", async () => {
    sendRequest.mockImplementation(() => Promise.resolve({}))

    const fakeLogin = jest.fn().mockImplementation(() => {});

    const fakeAuthObject = {
        auth: {
          token: null,
          isAuth: false
        },
        login: fakeLogin,
        logout: () => {}
    }

    await act(async () => {
        renderLibrary(
        <AuthProvider value={fakeAuthObject}>
            <Login/>
        </AuthProvider>
        ,{wrapper: MemoryRouter})
    })

    const loginInput = screen.getByLabelText("Nom d'utilisateur")
    const passwordInput = screen.getByLabelText("Mot de passe")

    const button = screen.getByDisplayValue("Se connecter")

    fireEvent.change(loginInput, {target: {value: "username"}})
    fireEvent.change(passwordInput, {target: {value: "password"}})


    await act(async () => {
        button.dispatchEvent(new MouseEvent('click',{bubbles: true}))
    })

    expect(fakeLogin).toHaveBeenCalled()

})