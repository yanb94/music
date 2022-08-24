function prepareData(data) {
	data.imageFile == null
		? delete data.imageFile
		: (data.imageFile = data.imageFile[0]);
	return data;
}

function createFormData(data) {
	const formData = new FormData();
	Object.keys(data).map((value) => formData.append(value, data[value]));

	return formData;
}

function hasError(resultRequest, setError) {
	if (resultRequest) {
		resultRequest.map((v) =>
			setError(
				v["propertyPath"],
				{ type: "manual", message: v["message"] },
				{ shouldFocus: true }
			)
		);
		return true;
	}

	return false;
}

async function processForm(id, data, token) {
	const formattedData = prepareData(data);
	const formData = createFormData(formattedData);

	console.log(formData);

	return await fetch("/api/songs/" + id, {
		method: "POST",
		body: formData,
		headers: {
			Accept: "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((res) => {
		switch (res.status) {
			case 200:
				return "ok";
			case 401:
				return 401;
			case 422:
				return res.json();
			default:
				return "error";
		}
	});
}

async function getInitialData(id, token) {
	return await fetch("/api/songs/" + id, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 401) return 401;
		else return "error";
	});
}

export { hasError, processForm, getInitialData };
