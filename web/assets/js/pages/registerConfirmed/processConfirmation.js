
/**
 * 
 * @param {string} token 
 */
async function processConfirmation(token)
{
    const baseUrl = "/api/users/{confirmationToken}/confirmation";
    const finalUrl = baseUrl.replace("{confirmationToken}",token);

    return await fetch(finalUrl,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.status)
    
}

export default processConfirmation;