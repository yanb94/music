async function getInitialData(slug, token) {
	return await fetch("/api/playlists/" + slug, {
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

async function getStats(slug, token) {
	return await fetch("/api/playlists/" + slug + "/stats", {
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

export { getInitialData, getStats };
