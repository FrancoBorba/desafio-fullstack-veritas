# Use a Node.js image (based on Alpine) to build the app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

RUN npm install


COPY . .

# Run the React build script (creates the /build folder)
RUN npm run build


# Use the official Nginx image
FROM nginx:stable-alpine

# Copy the built static files from the 'builder' stage
# to the directory that Nginx serves by default
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration
# so React Router can work properly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# C start Nginx
CMD ["nginx", "-g", "daemon off;"]
