FROM       node:8
MAINTAINER pandora@crazyguys.me

ENV        NODE_ENV="development"

RUN        apt-get -yqq update && \
           npm install pm2 -gq && \
           ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

WORKDIR    /root
ADD        server.tar ./

EXPOSE     3000
CMD        ["node", "server"]