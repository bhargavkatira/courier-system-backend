# Courier Backend Service

A scalable backend system for **Order Management, Shipment Tracking, and Cancellation**, built with **Node.js, Express, MongoDB, and Redis**.

---

## Features

* ✅ Create Orders
* ✅ Fetch Orders (by ID / AWB)
* ✅ Shipment Cancellation API integration
* ✅ Tracking Sync (external API → DB)
* ✅ Redis Caching (order + tracking)
* ✅ BullMQ Queue for async processing
* ✅ Zod Validation (request validation)

---

## 🛠 Tech Stack

* **Node.js + Express**
* **TypeScript**
* **MongoDB + Mongoose**
* **Redis (Cloud / Local)**
* **BullMQ (Queue)**
* **Zod (Validation)**

---

## ⚙️ Environment Setup

Create a `.env` file in root:

```env
have attach .env file to the email
```

---

## 🚀 How to Run (Local)

### 1️⃣ Install dependencies

```bash
npm install
```

#### Option B: Docker Setup

🔨 Build Docker Image

```bash
    docker build -t courier-app .
```
 Run Docker Container

 ```bash
docker run -d -p 3001:3000 --env-file .env --name courier-app-container courier-app
```

### 3️⃣ Start Redis



### 4️⃣ Run the application

```bash
npm run start
```

👉 Server will start on:

```text
    http://localhost:3000
```
---

## 📡 API Endpoints

### 🔹 Create Order

```http
POST /api/orders
```
---

### 🔹 Get Order by ID / OrderNumber

```http
GET /api/orders/:id
```
---

### 🔹 Get Order by AWB

```http
GET /api/orders/awb/:awb
```
---

### 🔹 Cancel Shipment

```http
POST /api/cancel
```
---

### 🔹 Tracking Sync

```http
GET /api/tracking/:awb
```
---


```text
http://localhost:3000/admin/queues
```
--

```bash
redis-cli
keys order:awb:*
```

## 👨‍💻 Author

Bhargav Katira
