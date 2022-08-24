import { expect } from "@jest/globals";
import { render } from "@testing-library/react"
import CardMenuMember from "./CardMenuMember";
import 'regenerator-runtime/runtime'
import React from 'react'
import { BrowserRouter } from "react-router-dom";

it("MenuCardRender component render waited element", async () => {
    const {container} = render(<CardMenuMember name="Test" icon="fas fa-user" link="/truc"/>, {wrapper: BrowserRouter})

    const linkCont = container.querySelector('.card-menu-member')
    const nameCont = container.querySelector('.card-menu-member--name')
    const iconCont = container.querySelector('.card-menu-member--icon')

    const linkValue = linkCont.getAttribute('href')
    const nameValue = nameCont.textContent;
    const iconNb = iconCont.querySelectorAll('i.fas.fa-user').length;

    expect(linkValue).toBe('/space-member/truc')
    expect(nameValue).toBe(nameValue)
    expect(iconNb).toBe(1)
    
})