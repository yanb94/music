function secondsToHmsWithLetter(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const mDisplay = m;
    const sDisplay = s;
    return h.toString().padStart(2,"0") + "h " + mDisplay.toString().padStart(2,"0") + "min " + sDisplay.toString().padStart(2,"0") + "s"; 
}

export default secondsToHmsWithLetter;