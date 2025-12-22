# QZ Amgen Chatbot – Local Setup Guide

This project consists of **two repositories** that together power the QZ Amgen Chatbot:

1. **Backend (API)** – FastAPI + Uvicorn
2. **Frontend (UI)** – React-based chat UI

The UI communicates with the API. As long as the **Uvicorn server is running**, you can start the UI and use the chatbot locally.

---

## Repositories

* **API / Backend**
  [https://github.com/QZ-Amgen-Gateway/QZ-amgen-chatbot.git](https://github.com/QZ-Amgen-Gateway/QZ-amgen-chatbot.git)

* **UI / Frontend**
  [https://github.com/shraddhaqz/qz-insight-chat.git](https://github.com/shraddhaqz/qz-insight-chat.git)

---

## Prerequisites

Make sure the following are installed on your system:

* **Python**: 3.10 or higher (3.11 recommended)
* **Node.js**: 18+
* **npm**
* **Git**
* Python virtual environment support (`venv`)

Recommended tools:

* VS Code
* Postman (optional, for API testing)

---

## Clone the Repositories

Clone both repositories into the same parent directory (recommended for convenience).

```bash
git clone https://github.com/QZ-Amgen-Gateway/QZ-amgen-chatbot.git
git clone https://github.com/shraddhaqz/qz-insight-chat.git
```

Expected structure:

```
workspace/
│
├── QZ-amgen-chatbot/     # Backend / API
└── qz-insight-chat/      # Frontend / UI
```

---

## Backend (API) Setup

### 1. Navigate to the API Repository

```bash
cd QZ-amgen-chatbot
```

---

### 2. Create and Activate Virtual Environment

**Windows**

```bash
python -m venv env
env\Scripts\activate
```

**Mac / Linux**

```bash
python3 -m venv env
source env/bin/activate
```

You should see `(env)` in your terminal once activated.

---

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

If the repository contains multiple requirements files, install the primary one referenced in the repo documentation.

---

### 4. Environment Variables

Create a `.env` file in the **API root directory**.

Example:

```env
OPENAI_API_KEY=your_openai_key_here
ENV=local
LOG_LEVEL=INFO
```

If a `.env.example` file exists, copy it and rename it to `.env`.

---

### 5. Run the API Server

```bash
uvicorn main:app --reload
```

If the entry point differs, use the correct module path, for example:

```bash
uvicorn app.main:app --reload
```

Successful startup looks like:

```text
Uvicorn running on http://127.0.0.1:8000
```

Optional check:

* Open `http://127.0.0.1:8000/docs` in your browser to verify Swagger UI loads.

⚠️ Keep this server running. The UI depends on it.

---

## Frontend (UI) Setup

### 1. Open a New Terminal

Do **not** stop the API server. Open a new terminal window.

---

### 2. Navigate to the UI Repository

```bash
cd qz-insight-chat
```

---

### 3. Install UI Dependencies

```bash
npm install
```

---

### 4. Configure API Base URL

Locate one of the following in the UI project:

* `.env`
* `.env.local`
* API configuration file (e.g., `api.ts`, `config.ts`)

Ensure the API base URL points to the running backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If no `.env` file exists, create one in the UI root directory with the above value.

⚠️ If you change this file, restart the UI.

---

### 5. Start the UI

```bash
npm run dev
```

You should see output similar to:

```text
Local: http://localhost:5173
```

Open the URL in your browser.

---

## Using the Application

Once both services are running:

* **API** → `http://127.0.0.1:8000`
* **UI** → `http://localhost:5173`

Flow:

1. Enter a query in the UI
2. UI sends the request to the FastAPI backend
3. Backend processes the request
4. Response is rendered in the UI

If the API is not running, the UI will fail to fetch responses.

---

## Common Issues & Fixes

### API Not Reachable from UI

* Confirm Uvicorn is running
* Verify `VITE_API_BASE_URL`
* Restart the UI after updating environment variables

---

### Missing Python Dependencies

```bash
pip install -r requirements.txt --upgrade
```

---

### `uvicorn` Command Not Found

```bash
pip install uvicorn
```

---

### Port Already in Use

Run API on a different port:

```bash
uvicorn main:app --reload --port 8001
```

Then update the UI `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8001
```

Restart the UI.

---

## Stopping the Application

* **API**: `Ctrl + C`
* **UI**: `Ctrl + C`

---

## Quick Start (TL;DR)

```bash
# Backend
git clone https://github.com/QZ-Amgen-Gateway/QZ-amgen-chatbot.git
cd QZ-amgen-chatbot
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
git clone https://github.com/shraddhaqz/qz-insight-chat.git
cd qz-insight-chat
npm install
npm run dev
```
