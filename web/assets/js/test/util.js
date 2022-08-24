import { expect } from "@jest/globals";
import { fireEvent, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils";

function expectElementExist(selector, container)
{
    const cont = container.querySelector(selector)
    cont == null ? console.log(selector): ""
    expect(cont).not.toBeNull()

    return cont;
}

function expectElementExistForWaitFor(selector, container)
{
    const cont = container.querySelector(selector)
    expect(cont).not.toBeNull()

    return cont;
}

function fillInputWithValue(selector, container, value)
{
    const field = container.querySelector(selector)
    fireEvent.change(field, {target: {value: value}})
}

function fillInputWithFile(selector, container, file)
{
    const field = container.querySelector(selector)
    fireEvent.change(field, {target: {files: file}})
}

function expectElementHasValue(element, value)
{
    expect(element.value).toBe(value)
}

function expectElementIsChecked(element)
{
    expect(element.checked).toBeTruthy()
}

function expectElementHasContent(element, content)
{
    expect(element.innerHTML).toBe(content)
}

async function searchAndSelectSong(search, indexItemAutocomplete, nbSelectedItem, mockCall, container)
{
    fillInputWithValue("input#searchSongToAdd",container,search)

    await waitFor(() => expect(mockCall).toHaveBeenCalled())

    await waitFor(() => expectElementExistForWaitFor(".song-list-input--list-songs--item",container))

    await act(async() => {
        const item = container.querySelectorAll(".song-list-input--list-songs--item")[indexItemAutocomplete];
        item.dispatchEvent(new MouseEvent('click',{bubbles: true}));
    })

    await waitFor(() => expect(container.querySelectorAll(".song-list-input--selected-items--item").length).toBe(nbSelectedItem))
}

export { 
    expectElementExist, 
    fillInputWithValue,
    expectElementHasValue,
    expectElementIsChecked,
    expectElementHasContent,
    fillInputWithFile,
    expectElementExistForWaitFor,
    searchAndSelectSong
}