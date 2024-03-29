FROM node:18.12.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env .

RUN npm rebuild bcrypt --build-from-source
RUN npm run build

EXPOSE 5001

CMD [ "npm", "start" ]