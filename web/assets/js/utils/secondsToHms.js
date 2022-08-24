function secondsToHms(d) {
    d = Number(d);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const mDisplay = m;
    const sDisplay = s;
    return mDisplay.toString().padStart(2,"0") + ":" + sDisplay.toString().padStart(2,"0"); 
}

export default secondsToHms;