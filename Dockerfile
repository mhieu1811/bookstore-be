FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./
COPY package*.json ./
COPY openapi.yaml ./
RUN npm install
CMD [ "node", "server.js" ]

# docker run -p 3000:3000 -e MONGO_URI="mongodb+srv://mhieu:d18112000@cluster0.m8iztpo.mongodb.net/?retryWrites=true&w=majority" -e PORT=3000 -i image