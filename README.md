# 🎙️ Voice Diary - AI Emotion Analysis Application

## 🌟 Overview
Voice Diary is an innovative application that enables users to record voice entries which are automatically analyzed for emotional content using advanced AI. The app provides valuable insights into the user's emotional patterns over time, along with personalized recommendations.

## 🛠️ Tech Stack

### 🖥️ Frontend
- **Framework**: React with TypeScript
- **State Management**: Redux/Zustand
- **UI/UX Design**: Figma-designed interface
- **Audio Processing**: Web Audio API
- **Visualization**: Chart.js/D3.js

### ⚙️ Backend Services
#### 🐹 Core Service (Go)
- **Web Framework**: Gin/Echo
- **Authentication**: JWT
- **API Development**: RESTful endpoints

#### 🐍 AI Service (Python)
- **Emotion Analysis**:
  - librosa
  - OpenSMILE
  - PyTorch/TensorFlow
- **NLP Processing**:
  - spaCy
  - NLTK
- **API Framework**: FastAPI/Flask

### 🗄️ Infrastructure
- **Database**: PostgreSQL/MongoDB
- **Storage**: AWS S3 (voice recordings)
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## ✨ Key Features
- 🎤 **Voice Recording & Playback**
- 😊 **Real-time Emotion Analysis** (anger, happiness, sadness, etc.)
- 📈 **Emotion Trend Visualization**
- 📝 **Diary Entry Management**
- 🔐 **Secure User Authentication**
- ☁️ **Cross-device Cloud Sync**
- 💡 **Special AI Recommendations** (personalized insights)

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Go 1.20+
- Python 3.9+
- Docker

### Installation
```bash
# Clone repository
git clone https://github.com/your-repo/voice-diary.git
cd voice-diary

# Install frontend dependencies
cd frontend && npm install

# Setup backend
cd ../backend/go && go mod download

# Install AI service requirements
cd ../python && pip install -r requirements.txt