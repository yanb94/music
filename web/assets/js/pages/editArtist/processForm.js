async function getInitialData(id, token) {
	return await fetch("/api/users/" + id + "/artist", {
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

function createFormData(data) {
	const formData = new FormData();
	data.image == null ? "" : (data.image = data.image[0]);
	Object.keys(data).map((value) => formData.append(value, data[value]));

	return formData;
}

async function sendRequest(id, token, data) {
	const formatedData = createFormData(data);

	return await fetch("/api/artists/" + id, {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: "Bearer " + token,
		},
		body: formatedData,
	}).then((response) => {
		if (response.ok) return "ok";
		else if (response.status == 401) return 401;
		else if (response.status == 400 || response.status == 422)
			return response.json();
		else return "error";
	});
}

export { getInitialData, sendRequest, hasError };
