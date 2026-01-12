# 🎙️ Voice Diary - AI Emotion Analysis Application

## Overview
Voice Diary is an innovative application that enables users to record voice entries which are automatically analyzed for emotional content using advanced AI. The app provides valuable insights into the user's emotional patterns over time, along with personalized recommendations.

## Tech Stack

### Frontend
- **Framework**: React
- **State Management**: Redux
- **UI/UX Design**: Figma-designed interface

### Backend Services
#### Core Service (Go)
- **Web Framework**: Gin
- **Authentication**: HTTP-Only + Cookies
- **API Development**: RESTful endpoints

#### AI Service (Python)
- ** Transcription**: Whisper Small/Medium
- ** Emotion from Voice**: Whisper Large V3 (fine-tuned)   
- ** Emotion from Text**: Emotion english distilroberta base  
- ** Summary**: Bart-large-cnn-samsum 
- ** Emotional feedback**: OpenHermes-2.5-Mistral-7B

- **API Framework**: FastAPI

### Infrastructure
- **Database**: PostgreSQL
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

##  Key Features
-  **Voice Recording**
-  **Real-time Emotion Analysis** (anger, happiness, sadness, etc.)
-  **Emotion Trend Visualization**
-  **Diary Entry Management**
-  **Secure User Authentication**
-  **Cross-device Cloud Sync**
-  **Special AI Recommendations** (personalized insights)

##  Getting Started

### Prerequisites
- Node.js v20.17.0
- Go 1.23.4
- Python 3.13
- Docker

### Installation
- See installation in the special files for frontend and backend


