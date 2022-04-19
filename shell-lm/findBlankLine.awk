BEGIN { x=0 }
/^$/ { x=x+1 }
END { print "Found " x " blank lines." }

