#!/bin/sh
cd /var/www/taurus && yarn && PORT=3050 NODE_ENV=production npm run build-serve
