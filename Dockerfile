FROM node:14.15-alpine AS build
WORKDIR /trav_bpf_services
RUN npm cache clean --force
COPY . .
RUN npm install
#RUN npm run build --configuration=dev --aot --outputHashing=all
RUN npm run build --prod --aot --outputHashing=none

FROM nginx:latest AS ngi
COPY --from=build /trav_bpf_services/dist /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
