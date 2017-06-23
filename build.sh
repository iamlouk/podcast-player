#!/bin/bash

if [ "$1" == "clean" ]; then
	rm -rf css
	rm -rf .sass-cache
	rm -rf js
	rm -rf deploy.js
	exit 0
fi

if [ ! -d ./css ]; then
  mkdir css
fi
sass --scss scss/style.scss css/style.css

find . -name "*.ts" -type f > ts-files.txt
tsc @ts-files.txt --outFile ./deploy.js
rm ts-files.txt
