# 🎤 Whisper Speech Recognition Setup Guide

## 🛠️ Installation

### 1. Install Python Requirements
```bash
pip install -U openai-whisper
pip install torch torchaudio
pip install ffmpeg-python
```

### 2. Install FFmpeg for your OS
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

### 3. 🚀 Running Whisper

```bash
python test_whisper.py
```


# 🎤 Wav2Vec2 Speech Recognition Setup Guide

## 🛠️ Installation

### 1. Install Python Requirements
```bash
pip install speechbrain torchaudio
```

### 2. 🚀 Running Wav2Vec2

```bash
python test_Wav2Vec2.py
```
