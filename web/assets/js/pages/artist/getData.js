async function getData(slug) {
	return await fetch("/api/artists/" + slug, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 404) return 404;
		else return "error";
	});
}

const itemPerPageSongs = 8;

async function getSongs(slug) {
	return fetch(
		"/api/artists/" + slug + "/songs?itemsPerPage=" + itemPerPageSongs,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/ld+json",
				Accept: "application/ld+json",
			},
		}
	).then((response) => {
		if (response.ok) return response.json();
		else return "error";
	});
}

async function getNewSongs(url) {
	return fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/ld+json",
			Accept: "application/ld+json",
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else return "error";
	});
}

export { getData, getSongs, getNewSongs };
