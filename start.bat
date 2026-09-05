@echo off
echo =====================================================================
echo    GovConnect - Unified Government Service Interoperability Platform
echo =====================================================================
echo.

echo 1. Seeding Database with Demo Accounts and Department Schemes...
call .\venv\Scripts\python.exe backend\seed.py

echo.
echo 2. Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start "GovConnect FastAPI Backend" cmd /k ".\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo 3. Starting React Frontend Development Server on http://localhost:5173 ...
start "GovConnect React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo Platform Ready!
echo Frontend Portal: http://localhost:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo.
echo Quick Demo Role Accounts:
echo   - Citizen (Ramesh Kumar): citizen@govconnect.in / Citizen@123
echo   - Education Officer: officer.edu@govconnect.in / Officer@123
echo   - Revenue Officer: officer.rev@govconnect.in / Officer@123
echo   - System Admin: admin@govconnect.in / Admin@123
echo =====================================================================
pause
