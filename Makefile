
.PHONY: lint

lint:
	gjslint ./*.js
	jshint *.js
