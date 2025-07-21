# 🎙️ Voice Diary - AI Emotion Analysis Application

## 🌟 Overview
Voice Diary is an innovative application that enables users to record voice entries which are automatically analyzed for emotional content using advanced AI. The app provides valuable insights into the user's emotional patterns over time, along with personalized recommendations.

## 🛠️ Tech Stack

### 🖥️ Frontend
- **Framework**: React
- **State Management**: Redux
- **UI/UX Design**: Figma-designed interface

### ⚙️ Backend Services
#### 🐹 Core Service (Go)
- **Web Framework**: Gin
- **Authentication**: HTTP-Only + Cookies
- **API Development**: RESTful endpoints

#### 🐍 AI Service (Python)
- **Emotion Analysis**:
| Component        | Model Used                | Task                             |
|------------------|---------------------------|----------------------------------|
| Transcription     | Whisper Small/Medium      | Speech-to-text                   |
| Emotion from Voice | Whisper Large V3 (fine-tuned) | Audio emotion classification   |
| Emotion from Text | Emotion-english-distilroberta-base | Text emotion classification |
| Summary     | Bart-large-cnn-samsum     | Text summary                   |
| Emotional feedback | OpenHermes-2.5-Mistral-7B  | Psychological insight generation  |

😊🤝 **Emotion Fusion Approach**

This method combines emotion predictions from two models: an audio-based model 🎧 and a text-based model ✍️, using a custom similarity matrix 🔍 and weighted fusion ⚖️.

The similarity matrix, personally developed 🛠️, quantifies semantic closeness between emotions based on psychological insights 🧠💡.

By weighting and integrating the outputs, the fusion accounts for cases where vocal tone 🎶 and spoken content 📜 differ — for example, happy speech 😄 with sad content 😢 — inferring the most plausible underlying emotion 🤔💭.

With this fusion approach, we approximate human ability 👤🧩 to interpret mixed signals and understand the true emotional state ❤️🎭 behind voice and words 🗣️📝.

This method improves emotion recognition accuracy 📈 by capturing subtle interactions between voice and text signals, reflecting complex human emotional expression 🌈✨.

- **NLP Processing**:
  - 
- **API Framework**: FastAPI

### 🗄️ Infrastructure
- **Database**: PostgreSQL
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## ✨ Key Features
- 🎤 **Voice Recording**
- 😊 **Real-time Emotion Analysis** (anger, happiness, sadness, etc.)
- 📈 **Emotion Trend Visualization**
- 📝 **Diary Entry Management**
- 🔐 **Secure User Authentication**
- ☁️ **Cross-device Cloud Sync**
- 💡 **Special AI Recommendations** (personalized insights)

## 🚀 Getting Started

### Prerequisites
- Node.js v20.17.0
- Go 1.23.4
- Python 3.13
- Docker

### Installation
- See installation in the special files for frontend and backend


