
alias ho='echo long road'
ho

list="green red blue"
for color in $list
do
  echo "color: $color"
done

echo ---------

for col in "$list"
do
  echo "col: $col"
done


