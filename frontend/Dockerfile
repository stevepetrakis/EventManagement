FROM node:18-alpine
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
EXPOSE 3000
 
ENV NODE_ENV=development
ENV CHOKIDAR_USE_POLLING=true
 
CMD ["npm", "run", "dev"]