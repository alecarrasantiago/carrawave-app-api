# Sobe o backend Carra Wave (carrawave-app-api) em modo de desenvolvimento
# local, usando o perfil "local" (application-local.yml, nunca commitado).
#
# Pré-requisitos (rode uma vez):
#   - JDK 21 instalado (verifique com: java -version)
#   - Maven instalado (verifique com: mvn -version)
#     Se não tiver Maven: winget install Apache.Maven -e
#   - PostgreSQL rodando com o banco "carrawave" já criado.
#
# Uso:
#   .\run.ps1

$ErrorActionPreference = "Stop"
$env:SPRING_PROFILES_ACTIVE = "local"

Write-Host "Subindo carrawave-app-api (perfil local)..." -ForegroundColor Cyan
mvn -DskipTests spring-boot:run
