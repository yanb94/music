export default async function getLegalList() {
	return await fetch("/api/legals", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	}).then((response) => {
		if (response.ok) return response.json();
		else return "error";
	});
}
