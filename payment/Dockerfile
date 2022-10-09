###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:16-alpine As development

# Set working directory
WORKDIR /usr/src/app

# Install and cache app dependencies development
COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

# Install yarn
RUN yarn

# Copy existing application directory contents
COPY --chown=node:node . .

USER node

CMD ["yarn", "start:prod"]