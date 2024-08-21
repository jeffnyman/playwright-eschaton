# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

RUN mkdir /tests
COPY . /tests
WORKDIR /tests

RUN npm install
RUN npx @playwright/test install
