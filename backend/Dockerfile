# Go base image with alpine linux
FROM golang:1.22-alpine AS builder

WORKDIR /app;

# Copies the module management files
COPY go.mod ./

# Lower Go dependencies
RUN go mod download

COPY . .

# Compile the app
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main



# We use the lightest image
FROM alpine:latest


WORKDIR /root/


COPY --from=builder /app/main .

# Expose port 8080
EXPOSE 8080


CMD ["./main"]