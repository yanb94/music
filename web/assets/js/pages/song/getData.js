async function getData(slug, token = null) {
	let headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};

	if (token != null)
		headers = { ...headers, ...{ Authorization: "Bearer " + token } };

	return await fetch("/api/songs/" + slug, {
		method: "GET",
		headers: headers,
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 404) return 404;
		else if (response.status == 401) return 401;
		else return "error";
	});
}

async function getRandomPlaylists() {
	return await fetch("/api/playlists/random", {
		method: "GET",
		headers: {
			Accept: "application/ld+json",
			"Content-Type": "application/ld+json",
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 404) return 404;
		else return "error";
	});
}

async function getOtherSongs(slug) {
	return await fetch("/api/songs/similar/" + slug, {
		method: "GET",
		headers: {
			Accept: "application/ld+json",
			"Content-Type": "application/ld+json",
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 404) return 404;
		else return "error";
	});
}

async function setView(id) {
	return await fetch("/api/view_song", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			song: id,
		}),
	}).then((response) => {
		if (response.ok) return true;
		else return "error";
	});
}

export { getData, getRandomPlaylists, getOtherSongs, setView };
