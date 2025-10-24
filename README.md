# Mason IVR System

The Mason IVR System is an AI-powered Interactive Voice Response (IVR) solution designed to streamline communication between construction managers and masons.  
Masons can call into the IVR, answer three simple questions by voice (name, location, and expected wages), and the system automatically converts the audio to text and stores it in a database.  
Managers can later access this data through a web interface or backend system.

---

## Overview

This project demonstrates an end-to-end pipeline for processing spoken data from masons using automated transcription and data handling.  
It integrates audio processing, AI transcription, and backend data management using Python.

---

## Features

- Voice-to-Text Transcription using OpenAI Whisper (can be replaced with a custom ASR model)
- Automatic extraction of key information from speech (name, location, expected wages)
- Structured data storage in a database
- FastAPI backend for easy API deployment
- Ready for extension into a full web dashboard for managers

---

## Project Structure
```bash
MASON_IVR/
├── backend/
│   ├── __pycache__/
│   ├── tester/
│   ├── __init__.py
│   ├── app.py
│   ├── database.py
│   ├── ivr_handler.py
│   └── transcribe_module.py
├── data/
├── frontend/
├── model/
├── tmp/
├── uploads/
├── venv/
├── .env
├── .gitignore
├── masons.db
├── README.md
└── requirements.txt
```