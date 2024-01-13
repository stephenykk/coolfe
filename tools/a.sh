echo hello shell
echo '------------ start -------------'
shopt -s expand_aliases
shopt expand_aliases

alias hi="echo hello everyone, i am alice, see me???"
type echo 
type alias

hi

# vim foo.txt
echo '------------ end -------------'


echo 按任意键退出
read -n 1
echo 88
