# Build stage
FROM maven:3.9.9-eclipse-temurin-23 AS build
LABEL authors="Barata Ribeiro <"
WORKDIR /app
COPY src /app/src
COPY pom.xml /app
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=production"]