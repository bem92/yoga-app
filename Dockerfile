FROM node:22

ENV NG_CLI_ANALYTICS=false

RUN apt update -y && \ 
    apt install -y \
        libnotify-dev libgconf-2-4 \
        libasound2 libxtst6 xauth xvfb libgbm1 \
        libgtk-3-0 libnss3 libxss1 libgbm-dev

RUN npm install -g @angular/cli
