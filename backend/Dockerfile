FROM maven:3.8.5-openjdk-11 AS builder

WORKDIR /app/
COPY pom.xml .
RUN mvn -e -B dependency:resolve
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim

COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]