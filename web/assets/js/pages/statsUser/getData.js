async function getInitialData(token) {
	return await fetch("/api/users/my-stats", {
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

const itemPerPage = 10;

async function getArtistPayment(token) {
	return await fetch(
		"/api/artist_payouts/my_payement?itemsPerPage=" + itemPerPage,
		{
			method: "GET",
			headers: {
				Accept: "application/ld+json",
				"Content-Type": "application/ld+json",
				Authorization: "Bearer " + token,
			},
		}
	).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 401) return 401;
		else return "error";
	});
}

async function getNextArtistPayment(url, token) {
	return await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/ld+json",
			"Content-Type": "application/ld+json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 401) return 401;
		else return "error";
	});
}

export { getInitialData, getArtistPayment, getNextArtistPayment };
