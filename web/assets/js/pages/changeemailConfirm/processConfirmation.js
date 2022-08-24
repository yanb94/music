export default async function processConfirmation(token)
{
    return await fetch("/api/users/"+token+"/confirmation-change-email",{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => res.status)
}