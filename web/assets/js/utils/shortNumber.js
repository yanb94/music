export default function shortNumber($num)
{
    const $units = ['', 'K', 'M', 'B', 'T'];
    let $i;
    for ($i = 0; $num >= 1000; $i++) {
        $num /= 1000;
    }
    return Math.round($num) + "" + $units[$i];
}