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
# Flags pensadas pro plano grátis do Render (pouca CPU e 512 MB de RAM):
# - SerialGC + TieredStopAtLevel=1: a JVM sobe bem mais rápido e usa menos memória.
# - Limites FIXOS de memória: antes era MaxRAMPercentage=75 (heap de até
#   384 MB) + ~180 MB fora do heap (metaspace, código, threads) = mais de
#   512 MB no pior caso, e o Render matava o processo. Agora o total máximo
#   fica em ~450 MB: heap 200 + metaspace 140 + código 40 + buffers 32 + threads.
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-Xms64m", "-Xmx200m", "-XX:MaxMetaspaceSize=140m", "-XX:ReservedCodeCacheSize=40m", "-XX:MaxDirectMemorySize=32m", "-Xss512k", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
