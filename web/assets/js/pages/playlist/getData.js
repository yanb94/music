async function getData(slug, token = null) {
	let headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};

	if (token != null)
		headers = { ...headers, ...{ Authorization: "Bearer " + token } };

	return await fetch("/api/playlists/" + slug, {
		method: "GET",
		headers: headers,
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 404) return 404;
		else return "error";
	});
}

const itemPerPage = 5;

async function getInitialListOfSongs(slug, token = null) {
	let headers = {
		Accept: "application/ld+json",
		"Content-Type": "application/ld+json",
	};

	if (token != null)
		headers = { ...headers, ...{ Authorization: "Bearer " + token } };

	return await fetch(
		"/api/playlists/" + slug + "/songs?itemsPerPage=" + itemPerPage,
		{
			method: "GET",
			headers: headers,
		}
	).then((response) => {
		if (response.ok) return response.json();
		else return "error";
	});
}

async function getNextSongs(url, token = null) {
	let headers = {
		Accept: "application/ld+json",
		"Content-Type": "application/ld+json",
	};

	if (token != null)
		headers = { ...headers, ...{ Authorization: "Bearer " + token } };

	return await fetch(url, {
		method: "GET",
		headers: headers,
	}).then((response) => {
		if (response.ok) return response.json();
		else return "error";
	});
}

async function setView(id) {
	return await fetch("/api/view_playlist", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			playlist: id,
		}),
	}).then((response) => {
		if (response.ok) return true;
		else return "error";
	});
}

async function setViewSong(id) {
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

export { getData, getInitialListOfSongs, getNextSongs, setView, setViewSong };
