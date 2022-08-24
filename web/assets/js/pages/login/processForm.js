
async function sendRequest(data)
{
    return await fetch("/authentication_token",{
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    .then((res) => {
        if(res.ok)
            return res.json()
        else
            return {error: "Les identifiants sont incorrects"}
    });
}

export default sendRequest