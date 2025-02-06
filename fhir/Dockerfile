FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --omit=dev

COPY . .

CMD [ "npm", "start" ]