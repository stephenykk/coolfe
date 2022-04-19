#!/bin/bash
function line() {
 echo ----------------------
}

function dots() {
  echo ....
}


arr=(
one
two
three
)

# only print first elment :(
echo "arr: $arr"

# print all elements
echo "arr eles: ${arr[*]}"
echo "arr eles too: ${arr[@]}"


dots

for v in ${arr[*]}
do
 echo $v
done



line

favs=(shopping sleeping playing watching)
echo "favs: $favs"

dots

for u in ${favs[@]}
do
  echo $u
done

line


echo merge array

arr1=(1 2 3)
arr2=(a b c)
arrm=(${arr1[*]} ${arr2[*]})
arrn=(${arr1[@]} ${arr2[@]})
echo "arrm: ${arrm[*]}"
for v in ${arrn[@]}
do
  echo "arrn el: $v"
done

line


echo bye

