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
will attach .env file to the email
```

---

## 🚀 How to Run (Local)

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Start MongoDB

#### Option A: Local Mongo

```bash
mongod
```

#### Option B: Docker

```bash
docker run -d -p 27017:27017 --name mongo mongo
```

---

### 3️⃣ Start Redis

#### Option A: Local

```bash
redis-server
```

#### Option B: Docker

```bash
docker run -d -p 6379:6379 --name redis redis
```

---

### 4️⃣ Run the application

```bash
npm run dev
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

## ⚡ Redis Caching

* Cache Key:

```text
order:awb:<awb>
token : ub_token
```

* Strategy:

```text
Cache Aside Pattern
```

---

## 📦 Queue (BullMQ)

* Used for async processing (order creation, tracking updates)
* Dashboard:

```text
http://localhost:3000/admin/queues
```

---

## 🐳 Docker Setup (Recommended)

### Run Mongo + Redis

```bash
docker network create courier-net
```



### Run App

```bash
docker build -t courier-app .
docker run -d -p 3000:3000 --network courier-net courier-app
```

---

## 🔍 Debugging Tips

* Check Redis keys:

```bash
redis-cli
keys order:awb:*
```

* Check logs:

```bash
Cache hit ✅
Cache miss ❌
```

---

## ⚠️ Notes

* Do **not pass `_id` manually** while creating order
* Use **unique `orderNumber`**
* Ensure Redis and Mongo are running before starting app

---


## 👨‍💻 Author

Bhargav Katira
