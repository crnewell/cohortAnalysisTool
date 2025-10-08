# ================================
#  Backend Dockerfile (Spring Boot + DuckDB)
# ================================
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven files and download dependencies first (for caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

# Copy source code and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ================================
#  Runtime image
# ================================
FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY data ./data

# Expose Spring Boot default port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
