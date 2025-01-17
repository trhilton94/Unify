# Use a Maven base image with JDK for development
FROM maven:3.8.5-openjdk-17

# Set the working directory
WORKDIR /app

# Copy only pom.xml to cache dependencies
COPY pom.xml ./

# Pre-download Maven dependencies
RUN mvn dependency:go-offline -B

# Copy the entire backend code for development
COPY . .

# Expose the application port
EXPOSE 8080

# Default command for development
CMD ["mvn", "spring-boot:run"]