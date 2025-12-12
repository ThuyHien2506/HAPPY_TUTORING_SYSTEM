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

## 📝 Copy-Paste Ready

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
