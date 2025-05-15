FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY . .

# Copy credentials file to a known location
COPY Lens-Hackathon-Bigquery-DB.json /secrets/Lens-Hackathon-Bigquery-DB.json

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]