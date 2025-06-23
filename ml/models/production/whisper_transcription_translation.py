import os
import json
import time
import whisper
from datetime import datetime

def load_model(model_size):
    """Загружает модель с обработкой предупреждений"""
    print(f"Loading {model_size} model...")
    return whisper.load_model(model_size)

def detect_language(audio_path, detector_model):
    """Определяет язык аудио с помощью детекторной модели"""
    audio = whisper.load_audio(audio_path)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio, n_mels=detector_model.dims.n_mels).to(detector_model.device)
    _, probs = detector_model.detect_language(mel)
    detected_lang = max(probs, key=probs.get)
    return detected_lang

def transcribe_with_timing(model, audio_path, **kwargs):
    """Транскрибирует аудио с замером времени"""
    start_time = time.time()
    result = model.transcribe(audio_path, **kwargs)
    elapsed_time = time.time() - start_time
    return {
        "text": result["text"],
        "language": result.get("language", kwargs.get("language")),
        "time_seconds": round(elapsed_time, 2)
    }

def process_audio_files(audio_dir, output_dir):
    # Загружаем детекторную модель (large-v3) один раз
    detector_model = load_model("large-v3")
    
    audio_files = [f for f in os.listdir(audio_dir) if f.lower().endswith(('.wav', '.mp3'))]
    results = {}
    
    for audio_file in audio_files:
        audio_path = os.path.join(audio_dir, audio_file)
        file_results = {}
        
        print(f"\nProcessing {audio_file}...")
        
        # Шаг 1: Определяем язык с помощью large-v3
        detected_lang = detect_language(audio_path, detector_model)
        print(f"Detected language: {detected_lang}")
        
        # Шаг 2: Выбираем модель в зависимости от языка
        model_size = "medium" if detected_lang == "en" else "large-v3"
        model = load_model(model_size)
        
        # Шаг 3: Транскрибация
        transcription = transcribe_with_timing(
            model, audio_path,
            language=detected_lang,
            fp16=False  # Важно для CPU
        )
        file_results["transcription"] = transcription
        
        # Шаг 4: Перевод (если не английский)
        if detected_lang != "en":
            translation = transcribe_with_timing(
                model, audio_path,
                task="translate",
                language=detected_lang,
                fp16=False
            )
            file_results["translation"] = translation
        
        results[audio_file] = file_results
    
    # Сохраняем результаты
    output_file = os.path.join(output_dir, "smart_transcription_results.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nResults saved to {output_file}")

if __name__ == "__main__":
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
    audio_dir = os.path.join(project_root, "ml", "audio_samples")
    output_dir = os.path.join(project_root, "ml", "outputs", "whisper", f"results_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    
    os.makedirs(output_dir, exist_ok=True)
    process_audio_files(audio_dir, output_dir)