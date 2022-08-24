#!/bin/bash
set -e

output="assets/js/pages/subscribe/price_id.js"

echo "Veuillez indiquer l'id du produit stripe"
read productId

if test -f $output
then
    rm $output
fi

touch $output

echo "const PRICE_ID = \"$productId\";" >> $output
echo "export { PRICE_ID };" >> $output

echo "L'id du produit a bien été mise en place."