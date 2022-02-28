

test:
	slither src/dex.sol
	remix-tests -c 0.8.7 ./
