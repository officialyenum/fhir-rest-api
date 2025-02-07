FROM node:alpine

WORKDIR /usr/src/app

# Copy package.json and install dependencies

COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000
# Compile TypeScript
RUN npm run build

# Start the app using the compiled JavaScript
CMD ["npm", "run", "start"]
