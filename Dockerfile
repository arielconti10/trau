FROM nginx:latest
MAINTAINER Eduardo Leal <hi@eduardoleal.me>

ARG ENV

RUN apt-get update && apt-get install -y curl apt-transport-https nginx

COPY ./nginx.conf.$ENV /etc/nginx/conf.d/default.conf

RUN service nginx start && service nginx restart

COPY ./build /var/www/html
EXPOSE 80
