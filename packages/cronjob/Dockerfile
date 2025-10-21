FROM node:20-alpine

RUN corepack enable

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .yarnrc.yml ./

# Install the application dependencies
RUN yarn install --immutable

# Copy the rest of the application code to the working directory
COPY . .

# Define the command to run the application
CMD [ "yarn", "start" ]
