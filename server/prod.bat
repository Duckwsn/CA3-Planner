@echo off
cd /d "%~dp0"
echo ============================================
echo  CA3 Planner - Modo Producao (PostgreSQL)
echo ============================================

set SCHEMA_DIR=%cd%\prisma
set POSTGRES_SCHEMA=%SCHEMA_DIR%\schema.prisma
set BACKUP=%SCHEMA_DIR%\schema.postgres.bak

if not exist "%BACKUP%" (
    echo ERRO: Backup PostgreSQL nao encontrado.
    echo Execute dev.bat primeiro para criar o backup.
    pause
    exit /b 1
)

echo Restaurando schema PostgreSQL...
copy "%BACKUP%" "%POSTGRES_SCHEMA%" >nul

echo.
echo Backup removido.
del "%BACKUP%"

echo.
echo Lembre-se de ajustar manualmente o .env com suas credenciais PostgreSQL:
echo   DATABASE_URL="postgresql://usuario:senha@host:5432/db"
echo   CORS_ORIGIN="URL_DO_SEU_FRONTEND"
echo.
echo ============================================
echo  Modo producao restaurado!
echo  Execute: npx prisma generate
echo  Depois: npx prisma db push
echo ============================================
pause
