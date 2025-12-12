# 🎓 HAPPY TUTORING SYSTEM

Hệ thống quản lý và kết nối giữa sinh viên và gia sư tại HCMUT. Nền tảng này cho phép sinh viên tìm kiếm gia sư, đặt lịch hẹn, và quản lý các buổi học; đồng thời gia sư có thể cập nhật lịch rảnh, quản lý yêu cầu từ sinh viên và xác nhận cuộc gặp.

---

## 📋 Table of Contents

- [Tổng Quan Kiến Trúc](#-tổng-quan-kiến-trúc)
- [Prerequisites](#-prerequisites)
- [Cài Đặt & Chạy](#-cài-đặt--chạy)
- [Cấu Trúc Folder](#-cấu-trúc-folder)
- [API Documentation](#-api-documentation)
- [Flow SSO & Authentication](#-flow-sso--authentication)
- [Database](#-database)
- [Troubleshooting](#-troubleshooting)

---

## 🏗 Tổng Quan Kiến Trúc

Hệ thống sử dụng **Microservices Architecture** với 4 service độc lập:

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Frontend      │       │  Backend Happy   │       │  HCMUT_Datacore │
│   (React)       │◄─────►│  (Spring Boot)   │◄─────►│  (Spring Boot)   │
│   Port 3000     │       │  Port 8081       │       │  Port 9001       │
└─────────────────┘       └──────────────────┘       └──────────────────┘
         │                                                    ▲
         │                                                    │
         │                   ┌──────────────────┐            │
         └──────────────────►│   HCMUT_SSO      │────────────┘
                             │   (Spring Boot)  │
                             │   Port 9002      │
                             └──────────────────┘
```

### Services

| Service | Port | Chức Năng | Database |
|---------|------|----------|----------|
| **Frontend** | 3000 | UI cho Tutor/Student | - |
| **Backend (Happy)** | 8081 | API: Appointment, Meeting, Scheduling | H2 In-Memory |
| **HCMUT_Datacore** | 9001 | User Profile, Role, Faculty, etc. | MySQL: `datacore_db` |
| **HCMUT_SSO Backend** | 9002 | Authentication, Ticket-based SSO | MySQL: `sso_db` |
| **HCMUT_SSO Frontend** | 5173 | UI cho login SSO | - |

### Kiến Trúc Chi Tiết

- **Frontend (React)**: Giao diện cho sinh viên và gia sư, gọi API backend qua HTTP.
- **Backend (Spring Boot - Happy)**: Xử lý logic business (lịch hẹn, cuộc họp, matching). Dùng mock SSO filter trong dev.
- **Datacore (Spring Boot)**: Lưu trữ profile người dùng từ HCMUT (bkNetId, role, faculty, gpa, v.v.). Frontend và SSO đều gọi tới để lấy profile.
- **SSO (Spring Boot)**: Quản lý xác thực dùng ticket (CAS-like). Khi validate, SSO gọi Datacore để lấy profile người dùng.

**⚠️ Thứ tự chạy quan trọng**: Xem phần "Chạy Từng Service" dưới đây.

---

## ⚙ Prerequisites

Đảm bảo bạn đã cài đặt:

- **Java JDK 17+** (cho Backend, Datacore, SSO)
- **Node.js 16+** (cho Frontend)
- **Maven 3.8+** (cho Java projects)
- **MySQL 8.0+** (cho Datacore và SSO databases)
- **Git**

### Kiểm tra cài đặt

```bash
java -version
node --version
npm --version
mvn --version
mysql --version
```

---

## 🚀 Cài Đặt & Chạy

### 📋 Bước Chuẩn Bị (Chỉ Làm 1 Lần)

#### Bước 1: Tạo Database

Mở PowerShell/Terminal và chạy:

```bash
# Kết nối MySQL
mysql -u root -p

# Nhập password, sau đó chạy 2 câu lệnh SQL:
source D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_DATACORE\datacore.sql
source D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso.sql

# Thoát MySQL
exit
```

**Hoặc chạy trực tiếp (từng cái một):**

```bash
mysql -u root -p < D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_DATACORE\datacore.sql
mysql -u root -p < D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso.sql
```

#### Bước 2: Kiểm Tra MySQL Chạy

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

Đảm bảo có `sso_db` và `datacore_db` trong danh sách.

---

## 🔧 Chạy Từng Service

### Thứ Tự Chạy (Bắt Buộc)

**⚠️ Phải chạy theo đúng thứ tự này:**

1. **HCMUT_DATACORE** (Port 9001)
2. **HCMUT_SSO Backend** (Port 9002)
3. **HCMUT_SSO Frontend** (Port 5173)
4. **Backend Happy** (Port 8081)
5. **Frontend** (Port 3000)

---

### 1️⃣ Chạy HCMUT_DATACORE (Port 9001)

**Mở Terminal/PowerShell thứ nhất:**

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_DATACORE

mvn clean install

mvn spring-boot:run
```

**Chờ tới khi thấy:**
```
Started DatacoreApplication in X seconds
2025-12-12T10:00:00...  INFO [...] : Tomcat started on port(s): 9001
```

✅ Datacore đã chạy ở `http://localhost:9001`

---

### 2️⃣ Chạy HCMUT_SSO Backend (Port 9002)

**Mở Terminal/PowerShell thứ hai (riêng biệt):**

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso-backend

mvn clean install

mvn spring-boot:run
```

**Chờ tới khi thấy:**
```
Started SsoApplication in X seconds
2025-12-12T10:00:00...  INFO [...] : Tomcat started on port(s): 9002
```

✅ SSO Backend đã chạy ở `http://localhost:9002`

---

### 3️⃣ Chạy HCMUT_SSO Frontend (Port 5173)

**Mở Terminal/PowerShell thứ ba (riêng biệt):**

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso-frontend

npm install

npm run dev
```

**Chờ tới khi thấy:**
```
  VITE v7.2.5  ready in 250 ms

  ➜  Local:   http://localhost:5173/
```

✅ SSO Frontend đã chạy ở `http://localhost:5173`

---

### 4️⃣ Chạy Backend Happy (Port 8081)

**Mở Terminal/PowerShell thứ tư (riêng biệt):**

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\backend

mvn clean install

mvn spring-boot:run
```

**Chờ tới khi thấy:**
```
Started HappyApplication in X seconds
2025-12-12T10:00:00...  INFO [...] : Tomcat started on port(s): 8081
```

✅ Backend đã chạy ở `http://localhost:8081`

---

### 5️⃣ Chạy Frontend (Port 3000)

**Mở Terminal/PowerShell thứ năm (riêng biệt):**

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\frontend

npm install

npm start
```

**Chờ tới khi thấy:**
```
Compiled successfully!

You can now view happy-tutoring in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ Frontend đã chạy ở `http://localhost:3000`

---

## ✅ Kiểm Tra Hệ Thống Chạy

Sau khi tất cả 5 service đang chạy, mở trình duyệt và kiểm tra:

```
Datacore:    http://localhost:9001/api   ✅
SSO Backend: http://localhost:9002/api   ✅
SSO Frontend: http://localhost:5173      ✅
Backend:     http://localhost:8081       ✅
Frontend:    http://localhost:3000       ✅
```

Kiểm tra nhanh API Datacore:
```bash
curl http://localhost:9001/api/users/20520001
```

---

## 🛑 Dừng Hệ Thống

Nhấn `Ctrl+C` trong mỗi terminal để dừng service.

---

## 📝 Copy-Paste Ready (Nhanh Gọn)

### Tạo Database (1 lần)

```bash
mysql -u root -p < D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_DATACORE\datacore.sql
mysql -u root -p < D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso.sql
```

### Datacore (Terminal 1)

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_DATACORE && mvn clean install && mvn spring-boot:run
```

### SSO Backend (Terminal 2)

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso-backend && mvn clean install && mvn spring-boot:run
```

### SSO Frontend (Terminal 3)

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso-frontend && npm install && npm run dev
```

### Backend (Terminal 4)

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\backend && mvn clean install && mvn spring-boot:run
```

### Frontend (Terminal 5)

```bash
cd D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\frontend && npm install && npm start
```

---

## 🎯 Cách Tiêu Biểu Để Chạy (Windows PowerShell)

**Mở 5 PowerShell riêng biệt:**

**PowerShell 1 - Datacore:**
```powershell
cd "D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_DATACORE"
mvn clean install
mvn spring-boot:run
```

**PowerShell 2 - SSO Backend:**
```powershell
cd "D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso-backend"
mvn clean install
mvn spring-boot:run
```

**PowerShell 3 - SSO Frontend:**
```powershell
cd "D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\HCMUT_SSO\sso-frontend"
npm install
npm run dev
```

**PowerShell 4 - Backend:**
```powershell
cd "D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\backend"
mvn clean install
mvn spring-boot:run
```

**PowerShell 5 - Frontend:**
```powershell
cd "D:\study\SE\Redo_2\HAPPY_TUTORING_SYSTEM\frontend"
npm install
npm start
```

---

## 🚨 Lỗi Thường Gặp & Giải Pháp

### Lỗi: "Port already in use"

**Nguyên nhân:** Port đó đã bị sử dụng

**Giải pháp:**

```bash
# Windows: Tìm process dùng port 9002
netstat -ano | findstr :9002

# Tắt process
taskkill /PID <PID> /F

# Hoặc change port trong application.properties
```

### Lỗi: "Cannot connect to MySQL"

**Nguyên nhân:** MySQL chưa bật hoặc mật khẩu sai

**Giải pháp:**
```bash
# Kiểm tra MySQL chạy
mysql -u root -p

# Nếu lỗi: Update password trong application.properties
# spring.datasource.password=<your_password>
```

### Lỗi: "npm: command not found"

**Giải pháp:**
```bash
# Cài Node.js từ https://nodejs.org/
# Sau đó chạy lại: npm install
```

### Lỗi: "mvn: command not found"

**Giải pháp:**
```bash
# Cài Maven từ https://maven.apache.org/download.cgi
# Thêm vào PATH, kiểm tra:
mvn --version
```

### Ticket validate thất bại

**Lỗi:** `Ticket không tồn tại` hoặc `Ticket hết hạn`

**Kiểm tra:**
1. Ticket còn trong `sso_db.sso_tickets` table?
2. Thời gian hệ thống đúng không?
3. `service` parameter trong request có khớp không?

---

## 📌 Lưu Ý Quan Trọng

- **Thứ tự rất quan trọng**: **Datacore → SSO Backend → SSO Frontend → Backend → Frontend**. Datacore phải chạy trước SSO (vì SSO gọi Datacore để lấy profile).
- **5 Terminal riêng**: Mỗi service cần 1 terminal riêng để tiếp tục chạy.
- **Maven lần đầu chậm**: Lần đầu `mvn install` sẽ download dependencies, mất vài phút.
- **npm install mất thời gian**: SSO frontend lần đầu cũng phải install node_modules.
- **Check console**: Nếu lỗi, xem console log để debug.

---

---

## 📁 Cấu Trúc Folder

```
HAPPY_TUTORING_SYSTEM/
├── backend/                      # Backend chính (Spring Boot)
│   ├── src/main/java/com/project/happy/
│   │   ├── controller/           # REST controllers
│   │   ├── service/              # Business logic
│   │   ├── repository/           # Database access
│   │   ├── entity/               # JPA entities
│   │   ├── dto/                  # Data transfer objects
│   │   ├── security/             # Authentication & filters
│   │   └── config/               # Spring configs
│   ├── src/main/resources/
│   │   └── application.properties # Config (port, SSO URL, Datacore URL)
│   └── pom.xml                   # Maven dependencies
│
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── pages/                # Page components (HomePage, TutorProfile, etc.)
│   │   ├── components/           # Reusable components (Footer, UserMenu)
│   │   ├── service/              # API client services
│   │   ├── api/                  # API endpoint definitions
│   │   ├── AuthContext.js        # Auth state management
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   ├── package.json              # NPM dependencies
│   └── public/
│       └── index.html
│
├── HCMUT_DATACORE/               # Datacore Service (Spring Boot)
│   ├── src/main/java/com/hcmut/datacore/
│   │   ├── controller/           # UserController (GET /api/users/{bkNetId})
│   │   ├── entity/               # User JPA entity
│   │   ├── repository/           # UserRepository
│   │   └── dto/                  # UserProfileDto
│   ├── src/main/resources/
│   │   ├── application.properties # Config (MySQL, port 9001)
│   │   └── application.yml
│   ├── datacore.sql              # SQL setup script
│   └── pom.xml
│
├── HCMUT_SSO/                    # SSO Service (Spring Boot)
│   ├── sso-backend/              # Backend
│   │   ├── src/main/java/com/hcmut/sso/
│   │   │   ├── controller/       # SsoAuthController (login, service-validate)
│   │   │   ├── entity/           # SsoUser, SsoTicket
│   │   │   ├── repository/       # Ticket & User repositories
│   │   │   ├── dto/              # LoginRequest, LoginResponse, etc.
│   │   │   ├── config/           # WebClientConfig (Datacore HTTP client)
│   │   │   └── service/          # Business logic
│   │   ├── src/main/resources/
│   │   │   └── application.properties
│   │   └── pom.xml
│   ├── sso-frontend/             # Frontend cho SSO login
│   └── sso.sql                   # SQL setup script
│
└── README.md                     # This file
```

---

## 📡 API Documentation

### Backend (Happy) - `http://localhost:8081`

Các endpoint chính (xem `backend/src/main/java/com/project/happy/controller/` cho danh sách đầy đủ):

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| `POST` | `/api/tutor/register` | Đăng ký gia sư (điền thông tin) |
| `GET` | `/api/users/{bkNetId}` | Lấy profile người dùng |
| `POST` | `/api/appointment/create` | Tạo lịch hẹn |
| `GET` | `/api/appointment/list` | Danh sách lịch hẹn |
| `POST` | `/api/meeting/start` | Bắt đầu cuộc họp |

**Authentication:** Trong dev, dùng header:
```
X-User-Id: <bkNetId>
X-User-Role: TUTOR hoặc STUDENT
```

### HCMUT_Datacore - `http://localhost:9001`

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| `GET` | `/api/users/{bkNetId}` | Lấy profile người dùng (role, faculty, gpa, etc.) |

**Phản hồi mẫu:**
```json
{
  "bkNetId": "20520123",
  "fullName": "Nguyễn Văn A",
  "email": "20520123@hcmut.edu.vn",
  "role": "STUDENT",
  "faculty": "HCMUT",
  "major": "Computer Science",
  "phoneNumber": "0123456789",
  "yearOfStudy": 3,
  "gpa": 3.5
}
```

### HCMUT_SSO - `http://localhost:9002`

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| `POST` | `/api/sso/login` | Đăng nhập SSO, trả ticket & redirect URL |
| `GET` | `/api/sso/service-validate` | Validate ticket, trả user profile từ Datacore |

**Login Request:**
```json
{
  "bkNetId": "20520123",
  "password": "password123",
  "service": "http://localhost:3000/sso/callback"
}
```

**Login Response:**
```json
{
  "ticket": "TICKET-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "redirectUrl": "http://localhost:3000/sso/callback?ticket=...&bkNetId=20520123",
  "bkNetId": "20520123"
}
```

---

## 🔐 Flow SSO & Authentication

### Luồng Đăng Nhập

1. **Frontend** → Người dùng click "Login" trên HomePage
2. **Frontend** → Redirect tới SSO login page: `http://localhost:9002/sso/login?service=http://localhost:3000/sso/callback`
3. **SSO** → Người dùng nhập bkNetId + password
4. **SSO** → Tạo ticket, lưu vào DB, redirect: `http://localhost:3000/sso/callback?ticket=...&bkNetId=...`
5. **Frontend** (SsoCallbackPage) → Nhận ticket từ URL
6. **Frontend** → Gọi `GET http://localhost:9002/api/sso/service-validate?ticket=...&service=...&bkNetId=...`
7. **SSO** → Validate ticket, gọi Datacore để lấy profile người dùng
8. **Datacore** → Trả profile (role, faculty, etc.)
9. **SSO** → Trả profile cho frontend, xóa ticket
10. **Frontend** → Lưu vào AuthContext, redirect tới dashboard (tutor hoặc student)

**Diagram:**
```
User              Frontend           SSO              Datacore
 │                  │                 │                  │
 ├──click Login────►│                 │                  │
 │                  ├──redirect to SSO─────────────────►│
 │                  │                 │                  │
 ├──login form────►│                 │                  │
 │                  ├─login request──►│                  │
 │                  │                 ├─get profile────►│
 │                  │                 │◄─user profile───┤
 │                  │◄──redirect+ticket───────────────────┤
 │◄─redirect────────┤                 │                  │
 │                  ├─validate ticket►│                  │
 │                  │◄─user profile───┤                  │
 │                  │                 │                  │
 ├─show dashboard──│                 │                  │
```

### Token / Header (Dev Mode)

Trong dev, backend không thực sự validate SSO ticket, mà dùng mock filter đọc header:

```
Authorization: Bearer <token>
X-User-Id: 20520123
X-User-Role: TUTOR
```

## 💾 Database

### Datacore Database (`datacore_db`)

```sql
CREATE TABLE users (
  bk_net_id VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50),      -- TUTOR, STUDENT, ADMIN
  faculty VARCHAR(100),
  major VARCHAR(100),
  phone_number VARCHAR(20),
  gpa DECIMAL(3,2),
  year_of_study INT,
  qualifications TEXT
);
```

### SSO Database (`sso_db`)

```sql
CREATE TABLE sso_users (
  bk_net_id VARCHAR(50) PRIMARY KEY,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE sso_tickets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  value VARCHAR(255) UNIQUE,
  bk_net_id VARCHAR(50),
  service VARCHAR(255),
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (bk_net_id) REFERENCES sso_users(bk_net_id)
);
```

### Backend Database (`happydb`)

H2 in-memory (auto-create từ entities):
- Tutor (profile, specialization, rating)
- Student (profile)
- Appointment (request, status, time)
- Meeting (recording, notes)
- v.v.

---

## 🐛 Troubleshooting

### "Connection refused" khi gọi API

**Lỗi:** `ConnectException: Connection refused`

**Giải pháp:**
1. Kiểm tra service có chạy không: `http://localhost:9001`, `http://localhost:9002`, etc.
2. Kiểm tra cấu hình URL trong `application.properties`:
   - Backend: `app.datacore.base-url`, `app.sso.base-url`
   - SSO: `app.datacore.base-url`

### "Database connection failed"

**Lỗi:** `SQLException: Cannot get JDBC Connection`

**Giải pháp:**
1. Kiểm tra MySQL chạy: `mysql -u root -p`
2. Kiểm tra database tồn tại: `SHOW DATABASES;`
3. Update `application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=<your_password>
   ```
4. Chạy SQL setup script:
   ```bash
   mysql -u root -p < HCMUT_DATACORE/datacore.sql
   mysql -u root -p < HCMUT_SSO/sso.sql
   ```

### Frontend không thể kết nối backend

**Lỗi:** `CORS error` hoặc `fetch failed`

**Giải pháp:**
1. Kiểm tra backend chạy ở port 8081
2. Frontend phải dùng đúng base URL trong `frontend/src/api/userApi.js`:
   ```javascript
   const BASE_URL = "http://localhost:9001/api";
   ```
3. Đảm bảo CORS được enable trong backend

### Ticket validate thất bại

**Lỗi:** `Ticket không tồn tại` hoặc `Ticket hết hạn`

**Kiểm tra:**
1. Ticket còn trong `sso_db.sso_tickets` table?
2. Thời gian hệ thống đúng không?
3. `service` parameter trong request có khớp không?

---

## 📚 Thêm Tài Liệu

- [Backend API Details](backend/README.md) (nếu có)
- [Frontend Development Guide](frontend/README.md) (nếu có)
- [Datacore Setup](HCMUT_DATACORE/README.md) (nếu có)
- [SSO Architecture](HCMUT_SSO/README.md) (nếu có)

---

## 🤝 Contributing

1. Fork repo
2. Tạo branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

---

## 📝 License

MIT License (hoặc cấu hình theo yêu cầu)

---

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Check lại Prerequisites
2. Xem Troubleshooting section
3. Kiểm tra console logs của từng service
4. Mở issue hoặc liên hệ team development

---

**Last Updated:** December 2025  
**Version:** 1.0.0
