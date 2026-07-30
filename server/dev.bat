@echo off
cd /d "%~dp0"
echo ============================================
echo  CA3 Planner - Modo Desenvolvimento (SQLite)
echo ============================================

set SCHEMA_DIR=%cd%\prisma
set POSTGRES_SCHEMA=%SCHEMA_DIR%\schema.prisma
set SQLITE_SCHEMA=%SCHEMA_DIR%\schema.sqlite.prisma
set BACKUP=%SCHEMA_DIR%\schema.postgres.bak

if not exist "%SQLITE_SCHEMA%" (
    echo ERRO: schema.sqlite.prisma nao encontrado em %SCHEMA_DIR%
    pause
    exit /b 1
)

if exist "%BACKUP%" (
    echo Backup PostgreSQL ja existe. Pulando backup...
) else (
    echo Criando backup do schema PostgreSQL...
    copy "%POSTGRES_SCHEMA%" "%BACKUP%" >nul
)

echo Ativando schema SQLite...
copy "%SQLITE_SCHEMA%" "%POSTGRES_SCHEMA%" >nul

echo.
echo Configurando .env para SQLite...
echo PORT=3001 > "%SCHEMA_DIR%\..\.env"
echo DATABASE_URL="file:./dev.db" >> "%SCHEMA_DIR%\..\.env"
echo JWT_SECRET="dev-secret-key-123" >> "%SCHEMA_DIR%\..\.env"
echo JWT_EXPIRES_IN="7d" >> "%SCHEMA_DIR%\..\.env"
echo CORS_ORIGIN="http://localhost:5173" >> "%SCHEMA_DIR%\..\.env"

echo.
echo Gerando Prisma Client...
call npx prisma generate

echo.
echo Sincronizando banco de dados...
call npx prisma db push

echo.
echo Populando dados iniciais...
call npx tsx src/seed.ts

echo.
echo ============================================
echo  Modo desenvolvimento ativado!
echo  Para voltar ao PostgreSQL, execute: prod.bat
echo ============================================
pause
