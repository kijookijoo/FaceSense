import WebcamStream from "../components/WebcamStream"
import { useState, useCallback } from 'react'
import './DetectorPage.css'

const emotionEmojis = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😠',
    'neutral': '😐',
    'surprise': '😲',
    'fear': '😨',
    'disgust': '🤢',
};

const getEmotionEmoji = (className) => {
    if (!className) return '😐';
    const lowerName = className.toLowerCase().trim();

    if (emotionEmojis[lowerName]) {
        return emotionEmojis[lowerName];
    }

    return '😐';
};

function DetectorPage() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const handleFrame = useCallback(async (blob) => {
        if (isPaused) return;

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("file", blob, "frame.jpg");

            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/predict`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Detection results:", data);
            setResult(data);
        } catch (err) {
            console.log(err);
            setError(err.message || "Failed to get prediction");
        } finally {
            setLoading(false);
        }
    }, []);

    function handlePauseResume() {
        setIsPaused(!isPaused);

    }

    return (
        <div className="container mt-4">
            <h1>Facial Expression Detector</h1>

            <div className="row detector-row">

                <div className="col-md-6 video-container">
                    {(!isPaused) ? <WebcamStream onFrame={handleFrame} isPaused={isPaused} />
                        : <div className="video-off-frame"></div>}
                </div>

                <div className="col-md-6 prediction-panel">
                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            Error: {error}
                            <br />
                            <small>Make sure the backend server is running</small>
                        </div>
                    )}

                    {result && (result.num_detections === 0 || !isPaused) && (
                        <div className="mt-3">
                            <div className="card">

                                <div className="card-header bg-primary text-white">
                                    <h3 className="mb-0">Detection Result</h3>
                                </div>

                                <div className="card-body text-center">
                                    {result.num_detections === 0 ? (
                                        <div>
                                            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>
                                                😐
                                            </div>
                                            <h4 className="mb-2">Unable to detect</h4>
                                        </div>
                                    ) : (() => {
                                        const bestDetection = result.detections.reduce((best, current) =>
                                            current.confidence > best.confidence ? current : best
                                        );

                                        return (
                                            <div>
                                                <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>
                                                    {getEmotionEmoji(bestDetection.class_name)}
                                                </div>
                                                <h4 className="mb-2">{bestDetection.class_name}</h4>
                                                <p className="text-muted mb-0">
                                                    Confidence: {(bestDetection.confidence * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>


                            </div>

                        </div>
                    )}
                    {!isPaused ?
                        <button type="button" className="btn btn-danger" onClick={handlePauseResume}>Pause</button> :
                        <button type="button" className="btn btn-success" onClick={handlePauseResume}>Resume</button>
                    }

                </div>

            </div>
        </div>
    )
}

export default DetectorPage

