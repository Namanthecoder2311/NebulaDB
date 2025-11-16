@echo off
echo Testing NebulaDB API endpoints...

set API_URL=http://localhost:8080/api/v1

echo.
echo 1. Testing health check...
curl -s %API_URL%/health

echo.
echo.
echo 2. Testing user registration...
curl -s -X POST %API_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"

echo.
echo.
echo 3. Testing user login...
curl -s -X POST %API_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"

echo.
echo.
echo API testing complete!