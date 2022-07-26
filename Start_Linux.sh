#!/bin/sh
while true
do
node .
echo "To close the server press CTRL and C!"
echo "Restarting system, starting in:"
for i in 5 4 3 2 1
do
echo "$i..."
sleep 1
done
echo "System restarted!"
done
