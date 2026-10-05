# Build: compila o jar com Maven + JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests clean package

# Run: imagem final só com o JRE (bem mais leve, sem o Maven)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# O Render injeta a variável PORT — o application.yml já lê ${PORT:8080}.
EXPOSE 8080
# Flags pensadas pro plano grátis do Render (pouca CPU e ~512 MB de RAM):
# - SerialGC + TieredStopAtLevel=1: a JVM sobe bem mais rápido (menos tempo de
#   "acordar" depois de um deploy ou reinício) e usa menos memória.
# - MaxRAMPercentage: deixa folga pro sistema em vez de estourar o limite.
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-XX:MaxRAMPercentage=75", "-Xss512k", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
