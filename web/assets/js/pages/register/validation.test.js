import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { jest, expect } from "@jest/globals";
import schemaValidation from "./validation";
import "regenerator-runtime/runtime";
import { ValidationError } from "yup";
import { subYears } from "date-fns";

/**
 * Test  validation of a field and expect an error
 *
 * @param {string} field the field to test
 * @param {string} valueField the value to test
 */
async function expectErrorsField(field, valueField) {
	const errorBlank = await schemaValidation
		.validateAt(field, { [field]: valueField })
		.catch((err) => err);
	expect(errorBlank).toBeInstanceOf(ValidationError);
}

async function expectErrorsOnRepeatField(field1, field2, value1, value2) {
	const errorBlank = await schemaValidation
		.validateAt(field1, { [field1]: value1, [field2]: value2 })
		.catch((err) => err);
	expect(errorBlank).toBeInstanceOf(ValidationError);
}

/**
 * Test value of a field with blank, too small and too big value
 *
 * @param {string} field the field to test
 * @param {string} tooSmallValue a too small value for the field
 * @param {string} tooBigValue a too big value for the field
 */
async function testLenghtOfFieldValue(field, tooSmallValue, tooBigValue) {
	await expectErrorsField(field, "");
	await expectErrorsField(field, tooSmallValue);
	await expectErrorsField(field, tooBigValue);
}

it("register validation return no error when data isValid", async () => {
	const isValid = await schemaValidation.isValid({
		firstname: "Henri",
		lastname: "Doe",
		birthday: "1990-03-12",
		sexe: "m",
		email: "example@example.com",
		email_confirm: "example@example.com",
		username: "henri",
		plainPassword: "password",
		plainPassword_confirm: "password",
		legal: true,
	});

	expect(isValid).toBe(true);
});

it("register validation return error when firstname is not valid", async () => {
	const fieldName = "firstname";

	// Test when special characters
	await expectErrorsField(fieldName, "Henri40");

	await testLenghtOfFieldValue(
		fieldName,
		"a",
		"Lorem ipsum dolor sit amet consectetur adipiscing elit vel"
	);
});

it("register validation return error when lastname is not valid", async () => {
	const fieldName = "lastname";

	// Test when special characters
	await expectErrorsField(fieldName, "Henri40");

	await testLenghtOfFieldValue(
		fieldName,
		"a",
		"Lorem ipsum dolor sit amet consectetur adipiscing elit vel"
	);
});

it("register validation return error when username is not valid", async () => {
	const fieldName = "username";

	// Test when special characters
	await expectErrorsField(fieldName, "Henri///");

	await testLenghtOfFieldValue(
		fieldName,
		"a",
		"Lorem ipsum dolor sit amet consectetur adipiscing elit vel"
	);
});

it("register validation return error when plainPassword is not valid", async () => {
	const fieldName = "plainPassword";

	await testLenghtOfFieldValue(fieldName, "a", "Lorem ipsum dolor sit mi");
});

it("register validation return error when plainPassword_confirm is not same as plainPassword", async () => {
	const fieldName = "plainPassword_confirm";
	const originField = "plainPassword";

	await expectErrorsOnRepeatField(
		fieldName,
		originField,
		"password",
		"mot de passe"
	);
});

it("register validation return error when email is not valid", async () => {
	const fieldName = "email";

	// Not valid email
	await expectErrorsField(fieldName, "exampleexample.com");
});

it("register validation return error when email_confirm is not same as email", async () => {
	const fieldName = "email_confirm";
	const originField = "email";

	await expectErrorsOnRepeatField(
		fieldName,
		originField,
		"example@example.com",
		"bou@bou.fr"
	);
});

it("register validation return error when legal is not valid", async () => {
	const fieldName = "legal";

	await expectErrorsField(fieldName, false);
});

it("register validation return error when sexe is not valid", async () => {
	const fieldName = "sexe";

	await expectErrorsField(fieldName, "z");
});

it("register validation return error when birthday is not valid", async () => {
	const fieldName = "birthday";

	await expectErrorsField(fieldName, "1990-02-31");

	const tooRecentYear = subYears(new Date(), 5).getFullYear();

	await expectErrorsField(fieldName, `${tooRecentYear}-02-25`);
});
