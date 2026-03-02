@echo off
REM ==========================================================
REM ADVANCED GIT AUTO PUSH SCRIPT
REM Safely stages, commits (if needed), and pushes to GitHub
REM Works even if repo is not initialized or remote missing
REM ==========================================================

REM ----- CONFIGURATION -----
set REPO_URL=https://github.com/SuhamSarkar/daily-logger.git
set BRANCH=main

echo.
echo =========================================
echo   DAILY LOGGER - GITHUB AUTO PUSH TOOL
echo =========================================
echo.

REM ----- CHECK IF GIT IS INSTALLED -----
where git >nul 2>nul
if %errorlevel% neq 0 (
echo ERROR: Git is not installed or not in PATH.
pause
exit /b
)

REM ----- CHECK IF CURRENT FOLDER IS A GIT REPOSITORY -----
if not exist ".git" (
echo Git repository not found. Initializing...
git init
)

REM ----- CHECK IF REMOTE ORIGIN EXISTS -----
git remote | findstr origin >nul
if %errorlevel% neq 0 (
echo Adding remote origin...
git remote add origin %REPO_URL%
)

REM ----- ENSURE MAIN BRANCH -----
git rev-parse --verify %BRANCH% >nul 2>nul
if %errorlevel% neq 0 (
echo Creating main branch...
git branch -M %BRANCH%
)

REM ----- STAGE ALL FILES -----
echo.
echo Adding files...
git add .

REM ----- CHECK IF THERE ARE CHANGES TO COMMIT -----
git diff --cached --quiet
if %errorlevel% equ 0 (
echo.
echo No changes to commit.
) else (
echo.
echo Creating commit...
git commit -m "Auto update - %date% %time%"
)

REM ----- PULL FIRST TO AVOID CONFLICTS -----
echo.
echo Syncing with remote repository...
git pull origin %BRANCH% --rebase

REM ----- PUSH TO GITHUB -----
echo.
echo Pushing to GitHub...
git push -u origin %BRANCH%

REM ----- RESULT -----
if %errorlevel% neq 0 (
echo.
echo Push failed. Please check credentials or conflicts.
) else (
echo.
echo Push completed successfully.
)

echo.
pause
