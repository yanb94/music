import { PRICE_ID } from "./price_id";

async function processPayement(token) {
	return await fetch("/api/paiement", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify({
			id_price: PRICE_ID,
		}),
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 401) return 401;
		else return "error";
	});
}

async function manageBilling(token, sessionId) {
	return await fetch("/api/manage_billing", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify({
			session_id: sessionId,
		}),
	}).then((response) => {
		if (response.ok) return response.json();
		else if (response.status == 401) return 401;
		else return "error";
	});
}

async function getSubscriptionInfo(token) {
	return await fetch("/api/my_subscription", {
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

async function pauseSubscription(token, action) {
	return await fetch("/api/pause_subscription?action=" + action, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => {
		if (response.ok) return "ok";
		else if (response.status == 401) return 401;
		else return "error";
	});
}

async function cancelSubscription(token) {
	return await fetch("/api/cancel_subscription", {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => {
		if (response.ok) return "ok";
		else if (response.status == 401) return 401;
		else return "error";
	});
}

export {
	processPayement,
	manageBilling,
	getSubscriptionInfo,
	pauseSubscription,
	cancelSubscription,
};
