FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN /app/node_modules/.bin/ng build

FROM nginx:alpine

COPY --from=builder /app/dist/afit_spa/browser /usr/share/nginx/html
COPY nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
