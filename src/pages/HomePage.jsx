import './HomePage.css'
import { useNavigate } from 'react-router-dom'

function HomePage() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/detector');
    };

    return (
        <>
            <div className="web-info">
                <h1 className='description-header'>Welcome to FaceSense!</h1>
                <h3 className='web-description'>
                    Welcome to FaceSense! This web application instantly recognizes a variety of facial expressions
                    directly from your camera (with NO data collected/stored at any point), through a custom-trained YOLO model.
                    The model was trained on Google Cloud Platform using a large-scale facial-expression dataset that I found online,
                    enabling real-time analysis and accurate emotion detection.

                    Built with a React frontend and a FastAPI backend, it provides an interactive experience by showing the
                    most likely emotion along with its confidence score. It can detect seven distinct emotions — happy,
                    sad, angry, neutral, surprise, fear, and disgust — with an accuracy of 74%. I plan to continue improving this
                    model as I acquire new ML techniques, so stay tuned!

                    Through building this project, I strengthened my skills in cloud-based machine learning,
                    full-stack web development, and computer vision.
                </h3>

                <button className="start-button" onClick={handleStart}>
                    Start Now
                </button>
            </div>
        </>
    );
}

export default HomePage;