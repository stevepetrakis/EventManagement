FROM node:22-alpine
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
EXPOSE 5000
 
ENV NODE_ENV=development
 
CMD ["npm", "run", "start:dev"]