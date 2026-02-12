# MASON-IVR: AI-Powered Interactive Voice Response System

An enterprise-grade Interactive Voice Response (IVR) system designed for the construction industry. MASON-IVR enables workers to submit spoken applications via phone, with automatic speech-to-text transcription, intelligent data extraction, and a professional web dashboard for employers to manage applicants.

**Live Demo Frontend**: Built with Next.js 16 + React 19 with a neumorphic, neo-brutalist design  
**Backend API**: FastAPI with Supabase integration  
**AI Services**: Hugging Face Whisper (via Hugging Face Spaces) + OpenAI TTS

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [What's on Git/GitHub](#whats-on-gitgithub)
4. [What You Need to Do Locally](#what-you-need-to-do-locally)
5. [Frontend Setup & Details](#frontend-setup--details)
6. [Backend Setup & Details](#backend-setup--details)
7. [Hugging Face Integration](#hugging-face-integration)
8. [Database (Supabase)](#database-supabase)
9. [Environment Variables](#environment-variables)
10. [Installation & Getting Started](#installation--getting-started)
11. [Running Locally](#running-locally)
12. [API Endpoints](#api-endpoints)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What It Does

**For Masons (Applicants):**
- Call a phone number and talk to an AI assistant
- Answer 5 simple voice questions: **name, age, phone number, address, expected monthly pay**
- The system transcribes their speech in real-time using Hugging Face Whisper
- System confirms the information and saves it automatically
- No app download needed—works from any phone via IVR

**For Employers/Managers:**
- Web dashboard to view all submitted applications
- See transcribed information, original audio, and contact status
- Mark applicants as "Pending", "Contacted", "Rejected", etc.
- Upload profile and post opportunities

**Technical Pipeline:**
```
User Phone Call → Twilio/IVR → Backend Records Audio 
  → Hugging Face Whisper Transcription 
  → NLP Processing (Extract Info) 
  → Supabase Database 
  → Employer Dashboard (Next.js)
```

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                         │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  Home Page   │  │  Apply Page    │  │  Hire/Login    │  │
│  │  Contact     │  │  (Voice Input) │  │  Dashboard     │  │
│  └──────────────┘  └────────────────┘  └────────────────┘  │
└────────────────────────┬──────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼──────────────────────────────────────┐
│              BACKEND (FastAPI) on Port 8000                    │
│ ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│ │ IVR Handler  │  │ Transcriber  │  │ Employer Endpoints  │  │
│ │ (Logic Flow) │  │ (HF Whisper) │  │ Auth, Profiles      │  │
│ └──────────────┘  └──────────────┘  └─────────────────────┘  │
│                         │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Data Handler & Database Connector (Supabase)            │  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│          EXTERNAL SERVICES (Third-Party APIs)                 │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│ │ HF Whisper   │  │ OpenAI TTS   │  │ Supabase DB          │ │
│ │ (Audio→Text) │  │ (Text→Audio) │  │ (PostgreSQL)         │ │
│ └──────────────┘  └──────────────┘  └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript/JavaScript | Web UI for masons & employers |
| **Styling** | Tailwind CSS v4, Custom CSS | Neumorphic, no-gradient design |
| **Backend** | FastAPI, Python 3.10+ | REST API server |
| **Transcription** | Hugging Face Whisper (via Spaces) | Speech-to-Text |
| **TTS** | OpenAI gTTS/Elevenlabs | Text-to-Speech for IVR prompts |
| **Database** | Supabase (PostgreSQL) | Persistent data storage |
| **Auth** | bcrypt + JWT (Supabase Auth) | Employer authentication |
| **Infrastructure** | Render/Railway (optional) | Deployment hosting |

---

## What's on Git/GitHub

### Files Included in Repository

```
MASON-IVR/
├── backend/
│   ├── __init__.py
│   ├── app.py                 # Main FastAPI application
│   ├── database.py            # Supabase database functions
│   ├── ivr_handler.py         # IVR conversation logic (state machine)
│   ├── data_handler.py        # Save collected data to DB
│   ├── transcribe_module.py   # Hugging Face Whisper integration
│   ├── tts_module.py          # OpenAI TTS integration
│   ├── requirements.txt       # Python dependencies
│   ├── procfile               # For Render/Heroku deployment
│   └── __pycache__/           # (auto-generated, gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js                    # Home page
│   │   │   ├── globals.css               # Global styles (neumorphic)
│   │   │   ├── contact/page.js           # Contact page
│   │   │   ├── apply/page.js             # Applicant voice submission
│   │   │   ├── hire/page.js              # Employer overview
│   │   │   ├── hire/login/page.jsx       # Employer login
│   │   │   ├── hire/signup/page.jsx      # Employer signup
│   │   │   └── hire/dashboard/page.jsx   # Employer dashboard
│   │   └── ...
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── next.config.mjs        # Next.js config
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── tsconfig.json          # TypeScript config
│   └── DESIGN_SYSTEM.md       # UI/Design guidelines
│
├── model/                     # ML model files (placeholder or training)
│   ├── placeholder.py
│   └── train.py
│
├── data/                      # Data directory (usually empty, for exports)
├── uploads/                   # User-uploaded files (local testing)
├── tmp/                       # Temporary files (gitignored)
├── .env.example               # Template for environment variables
├── .env.production            # Production env (gitignored - you set this)
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

### What's NOT on Git (Gitignored)

- `.env` – Contains sensitive API keys and secrets
- `venv/` – Local Python virtual environment
- `__pycache__/` – Python cache
- `*.db`, `*.sqlite3` – Local databases
- `node_modules/` – Frontend dependencies (use `npm install`)
- `uploads/`, `tmp/` – Temporary files and uploads
- `.next/` – Next.js build files
- `*.log` – Log files

---

## What You Need to Do Locally

### 1. **Set Up Environment Variables** (Critical!)

Create two `.env` files:

**Backend `.env` file** (`backend/.env`):
```bash
# Supabase (Database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_key_here

# Hugging Face Whisper API (for transcription)
WHISPER_API_URL=https://your-hf-space.hf.space/transcribe

# OpenAI (for TTS - Text-to-Speech)
OPENAI_API_KEY=sk-your-openai-key-here

# Backend Server
BACKEND_URL=http://localhost:8000  # Local
DB_URL=postgresql://...            # (optional, if using direct PostgreSQL)
PORT=8000
```

**Frontend `.env.production`** or `.env.local` (`frontend/.env.production`):
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # Local
```

### 2. **Create Hugging Face Spaces Whisper API** 

You have two options:

**Option A: Use Public HF Whisper Space** (Easiest)
- Go to https://huggingface.co/spaces
- Search for "Whisper API" or fork an existing Whisper space
- Get the public API endpoint and put it in `WHISPER_API_URL`

**Option B: Create Your Own HF Space**
- Create a Hugging Face account at https://huggingface.co
- Go to Spaces and create a new Space with "Gradio" template
- Upload/create a Whisper transcription app (see examples below)
- Deploy it and get the public URL

Example Whisper Space code:
```python
import gradio as gr
import speech_recognition as sr
from transformers import pipeline

# Load model
transcriber = pipeline("automatic-speech-recognition", 
                       model="openai/whisper-base")

def transcribe(audio):
    result = transcriber(audio)
    return result["text"]

gr.Interface(
    transcribe,
    inputs=gr.Audio(source="microphone"),
    outputs="text",
    title="Whisper Transcriber"
).launch()
```

### 3. **Set Up Supabase Database** (PostgreSQL)

1. Create Supabase account: https://supabase.com
2. Create a new project
3. In SQL Editor, run these SQL queries to create tables:

```sql
-- Calls/Applicants Table
CREATE TABLE calls (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER,
    number VARCHAR(20),
    address TEXT,
    pay VARCHAR(255),
    contact_status VARCHAR(50) DEFAULT 'Pending',
    transcription TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employers Table
CREATE TABLE employers (
    id BIGSERIAL PRIMARY KEY,
    emp_id UUID UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employer Profiles Table
CREATE TABLE employer_profiles (
    id BIGSERIAL PRIMARY KEY,
    emp_id UUID UNIQUE REFERENCES employers(emp_id),
    name VARCHAR(255),
    location VARCHAR(255),
    expected_wage DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

4. Get your credentials from Supabase Settings:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_SERVICE_KEY` (API Key - under Service Role)

### 4. **Set Up OpenAI API Key** (for TTS)

1. Go to https://platform.openai.com
2. Create API key
3. Add to `.env`: `OPENAI_API_KEY=sk-...`

---

## Frontend Setup & Details

### Stack
- **Framework**: Next.js 16.1.0
- **React**: 19.2.0
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS v4 + Custom CSS (no gradients, neumorphic design)
- **UI Framework**: None (custom components)

### Design System

All pages follow a **neumorphic, neo-brutalist** design:

**Colors:**
- Navy: `#1a1f3a` (primary text, dark elements)
- Clay/Brown: `#c17257` (primary accent buttons)
- Beige: `#f5f1ed` (backgrounds, cards, footer)
- Slate: `#6b7280` (secondary text)
- Success: `#4b9170` (confirmations)
- Error: `#dc2626` (alerts)

**Typography:**
- Headings: Bold, navy color, left-aligned
- Body: Slate gray, readable, clean
- No decorations, no gradients—flat but textured

**Buttons:**
- Primary: Clay background, white text, rounded corners, shadow
- Hover: Reduced opacity for soft interaction
- Secondary: Navy background with outline style

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page, hero, mission, CTA |
| Contact | `/contact` | Contact form + contact info |
| Apply | `/apply` | Voice recording form for applicants |
| Hire | `/hire` | Client overview |
| Hire/Login | `/hire/login` | Employer login |
| Hire/Signup | `/hire/signup` | Employer registration |
| Hire/Dashboard | `/hire/dashboard` | Employer's applicant dashboard |

### Key Features

1. **Responsive Design**: Mobile-first, desktop-optimized
2. **No External Dashboard Library**: All custom React components
3. **Voice Recording**: Uses Web Audio API to record audio in the browser
4. **Real-time Feedback**: Loading states, error handling, success confirmations

### Running Frontend Locally

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Backend Setup & Details

### Stack
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Database**: Supabase (PostgreSQL)
- **Audio**: Hugging Face Whisper API, OpenAI TTS

### Structure

**Core Files:**

1. **`app.py`** (173 lines) - Main API server
   - Health check endpoint
   - IVR processing endpoint (`POST /ivr`)
   - Employer authentication & signup
   - Session management
   - CORS enabled for frontend

2. **`ivr_handler.py`** (141 lines) - Conversation State Machine
   - Manages session state for each caller
   - Tracks which field is being asked
   - Handles confirmation logic ("Is this correct? Yes/No")
   - Generates TTS prompts using OpenAI
   - Extract values from user speech

3. **`transcribe_module.py`** - Hugging Face Whisper Integration
   - Sends audio to HF Spaces Whisper API
   - Returns transcribed text
   - Error handling for failed transcriptions

4. **`tts_module.py`** - Text-to-Speech (OpenAI)
   - Converts system prompts to audio
   - Falls back to gTTS if OpenAI fails
   - Returns MP3 file path

5. **`database.py`** (103 lines) - Supabase Operations
   - `insert_record()` - Save applicant data
   - `checklogin()` - Verify employer credentials
   - `add_employer_login()` - Register employer
   - `add_employer_profile()` - Create employer profile
   - `get_masons()` - Fetch all applicants
   - `update_contact_status()` - Mark as Contacted/Rejected/etc.

6. **`data_handler.py`** - Data Processing
   - Prepares collected fields for database insertion
   - Concatenates transcription info

### API Endpoints

```
POST   /ivr                          Process voice call
GET    /health                       Health check
POST   /reset                        Reset session
POST   /employer/login               Employer authentication
POST   /employer/signup              Employer registration
GET    /employer/{emp_id}            Get employer profile
GET    /employer/{emp_id}/masons     Get all applicants for employer
PUT    /masons/{mason_id}/status     Update applicant status
GET    /audio/{file_name}            Serve audio files
```

### Dependencies (Python)

See `backend/requirements.txt`:
```
fastapi>=0.104.0              # Web framework
uvicorn[standard]>=0.24.0     # Server
python-multipart>=0.0.6       # Form data handling
requests>=2.31.0              # HTTP requests (for HF API)
httpx>=0.25.0                 # Async HTTP
openai>=1.3.0                 # OpenAI API (TTS)
supabase>=2.3.0               # Database client
bcrypt>=4.1.0                 # Password hashing
python-dotenv>=1.0.0          # Env variables
gTTS>=2.4.0                   # Fallback TTS
huggingface-hub>=0.17.0       # HF integration (utilities)
other deps...
```

### Running Backend Locally

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
# or: source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

# Set up .env file with all required API keys

uvicorn app:app --reload
# Server runs at http://localhost:8000
```

---

## Hugging Face Integration

### What is Hugging Face?

Hugging Face is a platform for **open-source machine learning models**. We use it for:

1. **Whisper Model** (Speech-to-Text)
   - OpenAI's powerful ASR model for accurate transcription
   - Supports 97+ languages
   - Can run locally OR via Hugging Face Spaces (cloud API)

2. **Model Hub** (Optional future use)
   - Host custom intent classification models
   - Deploy NER (Named Entity Recognition) for extracting addresses, wages, etc.

### Our Implementation

We use **Hugging Face Spaces** (free cloud deployment):

```
User Audio File (webm/wav)
            ↓
POST to: https://[your-hf-space].hf.space/transcribe
            ↓
Hugging Face Whisper Model (runs in cloud)
            ↓
Returns: { "text": "My name is John..." }
            ↓
Backend processes and saves
```

### Setting Up Your Own Whisper Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Select "Gradio" template
4. Use this code in `app.py`:

```python
import gradio as gr
import requests
from transformers import pipeline

# Load Whisper model
transcriber = pipeline("automatic-speech-recognition", 
                       model="openai/whisper-base")

def transcribe(audio_file):
    """Transcribe audio using Whisper."""
    result = transcriber(audio_file)
    return result["text"]

# Create Gradio interface
interface = gr.Interface(
    fn=transcribe,
    inputs=gr.Audio(sources="upload"),
    outputs="text",
    title="MASON IVR Whisper API",
    description="Transcribe audio files using OpenAI Whisper"
)

if __name__ == "__main__":
    interface.launch()
```

5. Click "Deploy" and get the public URL
6. Add to `.env`: `WHISPER_API_URL=https://[your-username]-whisper-api.hf.space/transcribe`

### Alternative: Use Public Whisper Spaces

If you don't want to create your own:
- Search HF Spaces for "Whisper API"
- Use a public endpoint (may have rate limits)
- Modify `transcribe_module.py` if needed

### Why Hugging Face?

✅ Free to use
✅ No need to host heavy ML models yourself
✅ Scales automatically
✅ Easy to customize (fork existing spaces, modify, redeploy)
✅ Active open-source community

---

## Database (Supabase)

### What is Supabase?

Supabase is **PostgreSQL as a Service** — basically:
- Managed PostgreSQL database in the cloud
- Real-time subscriptions
- Built-in authentication
- RESTful API (no need to write server just for DB)
- Free tier available

### Schema

**`calls` Table** (Applicant submissions)
```sql
- id (BIGSERIAL PRIMARY KEY)
- name (VARCHAR)
- age (INTEGER)
- number (VARCHAR) - Phone number
- address (TEXT)
- pay (VARCHAR) - Expected salary
- contact_status (VARCHAR) - "Pending", "Contacted", "Rejected"
- transcription (TEXT) - Full transcribed conversation
- created_at (TIMESTAMP)
```

**`employers` Table** (Company accounts)
```sql
- id (BIGSERIAL PRIMARY KEY)
- emp_id (UUID UNIQUE) - Employee ID
- email (VARCHAR UNIQUE)
- password (VARCHAR) - bcrypt hashed
- created_at (TIMESTAMP)
```

**`employer_profiles` Table** (Company info)
```sql
- id (BIGSERIAL PRIMARY KEY)
- emp_id (UUID FOREIGN KEY)
- name (VARCHAR)
- location (VARCHAR)
- expected_wage (DECIMAL)
- created_at (TIMESTAMP)
```

### Why Supabase?

✅ Free tier: 500MB storage, 2GB transfer/month
✅ PostgreSQL—industry standard
✅ Easy to query from Python (Supabase client library)
✅ No DevOps needed
✅ Automatic backups

---

## Environment Variables

### Backend `.env`

```bash
# === Supabase (Database) ===
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  # Found in Project Settings > API

# === Hugging Face Whisper ===
WHISPER_API_URL=https://username-whisper-api.hf.space/transcribe

# === OpenAI (TTS) ===
OPENAI_API_KEY=sk-proj-...  # From https://platform.openai.com/api-keys

# === Server Config ===
PORT=8000
ENVIRONMENT=development  # or "production"
```

### Frontend `.env.production` or `.env.local`

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # Local development
# For production:
# NEXT_PUBLIC_BACKEND_URL=https://your-api.com
```

### Getting API Keys

1. **Supabase**:
   - Project > Settings > API
   - Copy "Project URL" → `SUPABASE_URL`
   - Copy "Service Role Secret" → `SUPABASE_SERVICE_KEY`

2. **OpenAI**:
   - https://platform.openai.com/api-keys
   - Create API key → copy to `OPENAI_API_KEY`
   - Set usage limits to avoid surprise charges

3. **Hugging Face**:
   - Create Space with Whisper app
   - Get public Space URL → `WHISPER_API_URL`

---

## Installation & Getting Started

### Prerequisites

- **Python 3.10+** (backend)
- **Node.js 18+** (frontend)
- **Git** (to clone the repo)
- API keys for: **Supabase, OpenAI, Hugging Face**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/MASON-IVR.git
cd MASON-IVR
```

### Step 2: Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
# (See Environment Variables section above)
cp .env.example .env
# Edit .env with your actual keys

# Test the backend
uvicorn app:app --reload
# Should see: "Uvicorn running on http://127.0.0.1:8000"
```

### Step 3: Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.production
# Edit .env.production with your backend URL

# Run development server
npm run dev
# Should see: "Local: http://localhost:3000"
```

### Step 4: Verify Everything Works

1. **Health Check Backend**:
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"ok","service":"Mason IVR Backend"}
   ```

2. **Visit Frontend**:
   - Open http://localhost:3000 in browser
   - Click "Apply" or "Get Started"
   - You should see the application form

3. **Test IVR Flow**:
   - Go to `/apply` page
   - Click "Start Application"
   - Speak into your microphone
   - Should transcribe and show confirmation

---

## Running Locally

### Development Workflow

**Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
uvicorn app:app --reload
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 3 - (Optional) Logs/Monitoring**:
```bash
# Just monitor:
# - http://localhost:8000/docs (FastAPI interactive docs)
# - http://localhost:3000 (Next.js frontend)
```

### Useful Commands

**Backend**:
```bash
# Run without reload (production-like)
uvicorn app:app --host 0.0.0.0 --port 8000

# Run with specific workers
uvicorn app:app --workers 4

# Debug mode
python -m pdb app.py
```

**Frontend**:
```bash
# Build for production
npm run build
npm start

# Lint code
npm run lint

# Type check (TypeScript)
npx tsc --noEmit
```

---

## API Endpoints

### IVR Flow

**`POST /ivr`**

Process a voice turn in the IVR conversation.

**Request:**
```
Content-Type: multipart/form-data

session_id: "550e8400-e29b-41d4-a716-446655440000"
file: <audio file (.webm, .wav, etc.)>
```

**Response:**
```json
{
  "status": "success",
  "assistant_text": "Thank you John. Can you confirm your phone number is 555-1234?",
  "finished": false,
  "fields": {
    "name": "John",
    "age": null,
    "number": null,
    "address": null,
    "pay": null
  },
  "audio_url": "/audio/tmp12345.mp3"
}
```

---

### Employer Endpoints

**`POST /employer/signup`**

Register a new employer account.

**Request:**
```json
{
  "email": "company@example.com",
  "password": "secure_password",
  "name": "ABC Construction",
  "location": "New York, NY",
  "expected_wage": 75000
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Employer signed up successfully",
  "emp_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

**`POST /employer/login`**

Authenticate employer.

**Request:**
```
Content-Type: application/x-www-form-urlencoded

email=company@example.com&password=secure_password
```

**Response:**
```json
{
  "status": "success",
  "verified": true,
  "employer": {
    "id": 1,
    "emp_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "company@example.com",
    "password": "[hashed]"
  }
}
```

---

**`GET /employer/{emp_id}`**

Get employer profile.

**Response:**
```json
{
  "name": "ABC Construction",
  "email": "company@example.com"
}
```

---

**`GET /employer/{emp_id}/masons`**

Get all collected applicants.

**Response:**
```json
{
  "masons": [
    {
      "id": 1,
      "name": "John Doe",
      "age": 35,
      "number": "555-1234",
      "address": "123 Main St, NY",
      "pay": "75000",
      "contact_status": "Pending",
      "created_at": "2026-02-10T12:34:56Z"
    }
  ]
}
```

---

**`PUT /masons/{mason_id}/status`**

Update applicant contact status.

**Request:**
```json
{
  "contact_status": "Contacted"
}
```

**Response:**
```json
{
  "status": "success",
  "updated": true
}
```

---

### Audio File Serving

**`GET /audio/{file_name}`**

Serve temporary audio files (TTS responses).

```
Response: Audio file (audio/mpeg)
```

---

## Deployment

### Option 1: Render.com (Recommended - Easy)

**Backend Deployment:**

1. Push code to GitHub
2. Go to https://render.com
3. Create new "Web Service"
4. Connect GitHub repository
5. Build command: `pip install -r backend/requirements.txt`
6. Start command: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
7. Add environment variables (same as `.env` above)
8. Deploy

**Frontend Deployment:**

1. Create new "Static Site" on Render
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/.next`
4. Add environment variable: `NEXT_PUBLIC_BACKEND_URL=https://your-render-backend.onrender.com`
5. Deploy

### Option 2: Vercel + Railway

**Frontend** → Vercel (Free)
```bash
npm install -g vercel
vercel login
cd frontend
vercel
```

**Backend** → Railway (Paid)
```bash
npm i -g railway
railway login
railway init (select Python)
railway deploy
```

### Option 3: Docker + Any VPS

**Create `Dockerfile` for backend:**
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deploy to AWS, DigitalOcean, etc.**

---

## Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'fastapi'"**
```bash
# Activate venv and install dependencies
source venv/bin/activate
pip install -r requirements.txt
```

**"SUPABASE_URL not found" or database errors**
- Check `.env` file exists in `backend/` directory
- Verify all environment variables are set
- Test Supabase connection: `python -c "from supabase import create_client; print('OK')"`

**"Transcription API failed: Connection refused"**
- Check `WHISPER_API_URL` is correct
- Test with curl: `curl https://your-hf-space/transcribe`
- HF Space might be sleeping; wake it up by visiting the URL

**"OpenAI API key invalid"**
- Verify `OPENAI_API_KEY` is correct
- Check API key hasn't expired
- Ensure you have credits/billing set up

### Frontend Issues

**"Cannot GET /apply" or blank pages**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.production`
- Browser console might have CORS errors

**"Audio not recording"**
- Check browser microphone permissions
- Not supported in HTTP (only HTTPS or localhost)
- Try a different browser (Chrome recommended)

**"Transcription empty or garbled"**
- Speak clearly into microphone
- Check audio is actually being recorded
- Test with HF Whisper space directly

### Database Issues

**"psycopg2.OperationalError: could not translate host name"**
- Internet connection might be down
- Supabase might be down (check status page)
- Firewall might be blocking connection

**"Unique constraint violated" (email already exists)**
- That employer email is already registered
- Try signing up with different email

---

## Future Improvements

1. **Custom NER Model** - Extract addresses, wages automatically
2. **Multi-language Support** - Add Spanish, Mandarin, etc.
3. **Voice Biometrics** - Identity verification via voice
4. **Dark Mode** - Add to frontend
5. **Mobile App** - React Native version
6. **SMS/Email Notifications** - Notify employers when new applicants submit
7. **Call Recording** - Store original audio for legal compliance
8. **Analytics Dashboard** - Conversion rates, completion times, etc.
9. **Twilio/VoIP Integration** - Actual phone call routing (not just web)
10. **Payment Processing** - Stripe integration for employer billing

---

## License

[Add your license here - e.g., MIT, Apache 2.0]

---

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: [Your contact info]
- Documentation: [Your docs URL]

---

**Built with ❤️ for the construction industry. Let's make hiring simpler.**
