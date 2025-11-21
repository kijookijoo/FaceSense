from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("./predictor.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
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
