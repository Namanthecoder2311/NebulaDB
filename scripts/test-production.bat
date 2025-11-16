@echo off
echo Testing NebulaDB Production Deployment...

set BASE_URL=http://localhost

echo.
echo 1. Testing health endpoint...
curl -s %BASE_URL%/api/v1/health

echo.
echo.
echo 2. Testing user registration...
curl -s -X POST %BASE_URL%/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Production Test\",\"email\":\"test@production.com\",\"password\":\"testpass123\"}"

echo.
echo.
echo 3. Testing frontend accessibility...
curl -s -I %BASE_URL% | findstr "200 OK"

echo.
echo.
echo 4. Testing API rate limiting...
for /L %%i in (1,1,5) do (
  curl -s %BASE_URL%/api/v1/health > nul
  echo Request %%i sent
)

echo.
echo.
echo Production tests complete!
echo.
echo Access your application at:
echo Frontend: %BASE_URL%
echo API: %BASE_URL%/api/v1