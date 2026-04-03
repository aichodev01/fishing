# fishing 예약 사이트 (React + Spring Boot)

## 구성
- `frontend/`: React (Vite) + TailwindCSS(v4) + shadcn/ui
- `backend/`: Spring Boot + MyBatis + MySQL
- `infra/`: 로컬 인프라 (MySQL docker-compose)

## 로컬 실행

### 1) DB (MySQL)
Docker가 설치되어 있으면:

```bash
cd infra
docker compose up -d
```

- DB: `fishing`
- User/Password: `fishing` / `fishing`
- Port: `3306`

### 2) 백엔드

```bash
cd backend
./gradlew.bat bootRun
```

헬스체크: `GET http://localhost:8080/api/health`

DB 계정이 다르면 환경변수로 지정:

```bash
set DB_URL=jdbc:mysql://localhost:3306/fishing?useUnicode=true^&characterEncoding=utf8^&serverTimezone=Asia/Seoul
set DB_USERNAME=YOUR_DB_USER
set DB_PASSWORD=YOUR_DB_PASSWORD
./gradlew.bat bootRun --no-daemon --args="--server.port=8081"
```

### 3) 프론트엔드

```bash
cd frontend
npm run dev
```

접속: `http://127.0.0.1:5173/`

