#!/bin/bash
# Production startup script for FastAPI backend

# Set default values if not provided
HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}
WORKERS=${WORKERS:-1}

# Run uvicorn with production settings
uvicorn main:app --host $HOST --port $PORT --workers $WORKERS

