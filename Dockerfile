FROM python:3.11-slim

# Set working directory to backend
WORKDIR /app

# Copy requirements and install dependencies
COPY curve-coffee-collab-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY curve-coffee-collab-backend/ .

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]