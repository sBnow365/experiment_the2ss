
# AI Multi-Agent Intelligence System

A robust, full-stack application featuring a specialized multi-agent backend architecture and a responsive React-based intelligence dashboard. The system utilizes dedicated agents for vision, travel, news, and cultural analysis, coordinated through a central orchestration layer.

---

## 🏗 Project Architecture

### Backend (Python/FastAPI)
The backend follows a modular **Agent-Orchestrator** pattern:
* **Agents (`src/agents/`):** Independent modules for specific logic (Vision, Geo, News, Cultural, etc.).
* **Orchestrator (`src/orchestrator/`):** Manages the flow between multiple agents to fulfill complex follow-up queries.
* **API Layer (`src/api/`):** Clean routing using FastAPI to expose agent capabilities.
* **Utils:** Specialized handlers for async operations, chat history persistence, and file processing.

### Frontend (React/Vite)
A modern, component-driven UI:
* **Features:** Specialized panels like `TabFollowupPanel` for multi-turn interactions.
* **Hooks:** Custom hooks (`useFollowup`, `useTabImages`) for state management and API abstraction.
* **Services:** Centralized API client for backend communication.

---

## 🛠 Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, Markdown Rendering |
| **Backend** | Python, FastAPI, Pydantic |
| **AI/ML** | Multi-Agent Systems, Orchestration Logic |
| **Storage** | Context & Chat History Stores |

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+
* Node.js 18+
* NPM 

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend

```

2. Write this :
```bash
pip install -r requirements.txt

```




4. Configure environment variables in `.env`.
```bash

```

5. Start the server:
```bash
uvicorn src.main:app --reload

```



### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```



---

## 📂 Key Directory Structure

```text
├── backend/
│   ├── src/
│   │   ├── agents/        # Specialized AI logic (Travel, News, Vision)
│   │   ├── api/           # Fast API Routes
│   │   ├── orchestrator/  # Multi-agent coordination logic
│   │   └── utils/         # Async & Storage helpers
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI elements (Chat, Input, Cards)
│   │   ├── features/      # Complex business logic modules
│   │   ├── hooks/         # Custom React hooks
│   │   └── services/      # API integration

```

---

## 🧪 Testing & Quality

* **Linting:** ESLint is configured for frontend code quality.
* **Type Safety:** Pydantic models are used in the backend for request/response validation.
* **Agents:** Each agent is designed for unit-testing isolation.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


