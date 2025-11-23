from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import os

app = FastAPI()

# Get allowed origins from environment variable, default to localhost for development
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5175,http://localhost:5173")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get model path from environment variable or use default
model_path = os.getenv("MODEL_PATH", "./predictor.pt")
model = None

def get_model():
    """Lazy load model - only load when first needed"""
    global model
    if model is None:
        try:
            model = YOLO(model_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    return model

@app.get("/")
async def root():
    return {"message": "Backend is running!", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        model = get_model()  # Load model on first request
    except Exception as e:
        return JSONResponse(
            {"error": f"Model loading failed: {str(e)}"},
            status_code=500
        )
    
    try:
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        results = model(img)
        
        detections = []
        for result in results:
            boxes = result.boxes
            
            if len(boxes) > 0:
                xyxy = boxes.xyxy.cpu().numpy() 
                conf = boxes.conf.cpu().numpy() 
                cls = boxes.cls.cpu().numpy().astype(int)
                
                for i in range(len(boxes)):
                    detections.append({
                        "class_index": int(cls[i]),
                        "class_name": result.names[cls[i]],
                        "confidence": float(conf[i]),
                        "bbox": {
                            "x1": float(xyxy[i][0]),
                            "y1": float(xyxy[i][1]),
                            "x2": float(xyxy[i][2]),
                            "y2": float(xyxy[i][3])
                        }
                    })
        
        return JSONResponse({
            "num_detections": len(detections),
            "detections": detections,
            "class_names": results[0].names if len(results) > 0 else {}
        })
    except Exception as e:
        return JSONResponse(
            {"error": f"Prediction failed: {str(e)}"},
            status_code=500
        )
