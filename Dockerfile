FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm     

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]