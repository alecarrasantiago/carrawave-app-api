#!/usr/bin/env bash
# Equivalente ao run.ps1, para quem preferir usar Git Bash / WSL no Windows.
set -euo pipefail
export SPRING_PROFILES_ACTIVE=local
echo "Subindo carrawave-app-api (perfil local)..."
mvn -DskipTests spring-boot:run
