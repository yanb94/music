export default async function getData(slug) {
	return await fetch("/api/legals/" + slug, {
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
