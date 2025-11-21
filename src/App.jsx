import { Link, Routes, Route } from 'react-router-dom'

import './App.css'
import DetectorPage from './pages/DetectorPage'
import HomePage from './pages/HomePage'
import Header from './components/Header'

function App() {

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/detector" element={<DetectorPage />} />
            </Routes>
        </>
    )
}

export default App
