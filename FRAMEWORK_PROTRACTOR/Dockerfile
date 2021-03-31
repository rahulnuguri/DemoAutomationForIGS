FROM nginx:1.14
LABEL maintainer = "xiao.zheng@qvc.com"

RUN mkdir app
WORKDIR /app

COPY ./dist /usr/share/nginx/html
# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf

#This copies the Keystore from the workspace and places it at the root of the container

# Handle qrg certs
COPY ./MyPem.pem /CA/MyPem.pem

COPY ./entrypoint.sh /opt/entrypoint.sh
RUN chmod a+x /opt/entrypoint.sh

EXPOSE 443

ENTRYPOINT ["/opt/entrypoint.sh"]