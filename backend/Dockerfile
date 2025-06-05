FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

COPY data/ ./data/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]