# Stage 1: Build the Maven application
FROM maven:3.9.9-eclipse-temurin-17
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create execution container
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/vms-backend-1.0.0.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
