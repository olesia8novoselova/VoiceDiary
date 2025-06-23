# 🧠 Voice Diary - Machine Learning Overview

**Voice Diary** is an innovative application that allows users to record voice entries, which are automatically analyzed for emotional content using advanced AI. This document outlines the machine learning models currently used in the MVP, along with training details, evaluation results, and future plans.


## 🎯 Objective

The goal of the ML component is to accurately detect emotions in users' voice recordings and extract meaningful summaries from the transcribed text. The insights are used to track emotional patterns and provide helpful psychological feedback.


## 📦 Models Used (MVP)

### 1. 🎤 Emotion Recognition from Voice (Speech Audio)

We use a **fine-tuned Whisper Large V3** model to classify emotions from raw voice recordings.

#### ⚙️ Preprocessing
- **Audio Loading**: Using Librosa to load `.wav` files.
- **Feature Extraction**: Whisper's feature extractor is applied for normalization and formatting.

#### 🧠 Model Details
- **Base Model**: `openai/whisper-large-v3`
- **Task**: Audio classification
- **Output**: Emotion labels (`Angry`, `Disgust`, `Fearful`, `Happy`, `Neutral`, `Sad`, `Surprised`)

> The **'calm'** emotion was excluded from training due to underrepresentation.

#### 📊 Evaluation Metrics
| Metric     | Value   |
|------------|---------|
| Loss       | 0.5008  |
| Accuracy   | 0.9199  |
| Precision  | 0.9230  |
| Recall     | 0.9199  |
| F1 Score   | 0.9198  |

> The model performs well in distinguishing between multiple emotional states in speech.


### 2. 📝 Transcription (Voice to Text)

We use **Whisper** models for transcribing user voice recordings into text. The choice of model depends on the language and desired balance between speed and accuracy.

#### 🧪 Experimental Findings

- **Whisper Small**: Very fast, but low accuracy. Suitable only for quick English transcriptions where quality is not critical.
- **Whisper Medium**: Good for English. Decent speed and reliable transcriptions. Sometimes picks up other languages, but language detection is often inaccurate.
- **Whisper Large V3**: High accuracy. Supports proper translation with the right settings. Slower, but offers robust multilingual capabilities.
- **Whisper Large V3 Turbo**: Optimized for speed, but translation support is limited or unavailable. Inconsistent speed – sometimes faster or slower than Medium. Our experiments show that it is not reliable for multilingual use.

> **Official multilingual support** is only available in **Large V3** and **Turbo** models.

#### 🚀 Current Strategy

To balance transcription **speed** and **quality**:
1. **Use Whisper Large V3** for **language detection**.
2. If the language is **English**, use **Whisper Medium** for faster transcription.
3. If the language is **not English**, use **Whisper Large V3** to **transcribe and translate** to English.

This hybrid approach ensures reliable language handling while keeping performance efficient.

---

#### 📊 Model Comparison

| Model       | Parameters | Multilingual | Recommended Use                         |
|-------------|------------|--------------|------------------------------------------|
| small       | 244M       | ❌           | Very fast but inaccurate, English only   |
| medium      | 769M       | ❌           | Good for English, unreliable for others  |
| large-v3    | 1550M      | ✅           | High-quality multilingual transcription and translation |
| large-v3-turbo | 798M    | ✅           | Fast but limited translation, inconsistent results |

> All Whisper models are trained on over **680,000 hours** of multilingual and multitask supervised data collected from the web.


The transcribed text is then forwarded to a text-based analysis module for tasks such as emotion extraction, summarization, and supportive feedback (currently under development).


### 3. 💬 Text-Based Emotion & Insight Generation (In Development)

We are currently experimenting with **LLM-based processing** of transcribed entries to:
- Summarize the diary entry
- Extract the emotional tone from text
- Generate supportive and psychologist-like responses

> ⚠️ This component is still under development. Final model choice is pending experimentation and tuning.


### 4. 🧾 Emotion Recognition from Text (In Testing)

We're also testing **text-based emotion detection**, which will eventually be combined with voice-based results for a richer analysis. (not for MVP)

### 🔍 Model in Testing

- **Model**: Fine-tuned version of **XLM-T**
- **Trained on**: Social media emotion datasets in 19 languages
- **Use case**: Multilingual emotion detection in text

### 📊 Results

- **F1 Score**: 0.85 (on test set)
- **Strength**: Effective even in low-resource languages (zero-shot settings)

This model allows us to understand emotional content from transcribed text, enhancing insights for users.


## 🔮 Future Plans

We are actively working to enhance the ML component of the Voice Diary app:

- **Better Text Emotion Detection**: Improve recognition of emotions from text using LLM fine-tuning or ensemble models.
- **Multimodal Emotion Fusion**: Combine insights from both **voice** and **text** to improve overall emotion recognition accuracy.
- **Richer Psychological Responses**: Make AI-generated feedback more helpful, empathetic, and tailored.
- **Multilingual Support**: Further improve performance across different languages and accents.


## 📌 Summary

| Component        | Model Used                | Task                             | Status        |
|------------------|---------------------------|----------------------------------|---------------|
| Emotion from Voice | Whisper Large V3 (fine-tuned) | Audio emotion classification     | ✅ In Use      |
| Transcription     | Whisper Small/Medium      | Speech-to-text                   | ✅ In Use      |
| Emotional feedback | TBD               | Summary, emotion, psychologist reply | 🔄 In Progress |
| Emotion from Text | XLM-T (fine-tuned)      | Text emotion classification | 🚧 In Testing |


For more technical details or questions, please feel free to contact the development team.

---

## 🔧 Setup & Installation

This section outlines the steps required to install and run the machine learning components used in the Voice Diary project. It includes installation instructions for Whisper models, fine-tuned Whisper for emotion recognition, and supporting tools like FFmpeg.

### 📦 Python Environment Requirements

Install general dependencies used across different modules:

```bash
pip install torch torchaudio transformers openai-whisper ffmpeg-python librosa numpy pandas more-itertools tqdm tiktoken
```

### 2. Install FFmpeg for Whisper
#### 🪟 Windows

1. **Download FFmpeg**  
   - Get `ffmpeg-git-full.7z` from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)

2. **Installation**  
   - Extract the archive to `C:\ffmpeg`  
   (This should create a `bin` folder with `ffmpeg.exe` inside)

3. **Add to System PATH**  
   - Press `Win + X` → Select "System"  
   - Click "Advanced system settings"  
   - Go to the "Environment Variables" button  
   - Under "System variables", find and select "Path" → Click "Edit"  
   - Click "New" and add: `C:\ffmpeg\bin`  
   - Click "OK" on all open windows

4. **Final Steps**  
   - Restart your terminal or VSCode  
   - Verify with:  
     ```cmd
     ffmpeg -version
     ```

#### 🍎 macOS
```bash
# Install via Homebrew
brew install ffmpeg

# If you get "command not found":
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### 🐧 Linux
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg

# Fedora
sudo dnf install ffmpeg
```

##### ✅ Verification

Check FFmpeg is installed correctly:
```bash
ffmpeg -version
```

### 3. 🚀 Running the Models
#### 1. 🎤 Whisper Transcription (Speech-to-Text)

Run the basic Whisper model to transcribe voice:
```bash
python test_whisper.py
```

#### 2. 🧠 Whisper Large V3 (Emotion Recognition)

Run the fine-tuned Whisper Large V3 model for audio emotion classification:

```bash
python test_whisper_er.py
```
#### 3. 🔊 Wav2Vec2 (Optional Speech Recognition Model)

If testing with Wav2Vec2-based models:
```bash
pip install speechbrain
python test_Wav2Vec2.py
```