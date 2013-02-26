
0) install dependencies

	npm install

1) Create the named pipes

	mkfifo fromphp
	mkfifo fromphp_error
	mkfifo tophp

2) start php

	php -a < tophp > fromphp 2> fromphp_error &

3) start the proxy

	node proxy

4) navigate to: http://localhost:9001

There is no UI right now, so open a debugging terminal and use:

	sendToPHP('code...');

