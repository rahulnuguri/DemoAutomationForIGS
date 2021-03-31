#!/bin/sh
rm /etc/nginx/conf.d/default.conf
sed -i 's/listen 443 ssl;/listen '"$PORT0"' ssl;/g' /etc/nginx/conf.d/nginx.conf
nginx -g 'daemon off;'