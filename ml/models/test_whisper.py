import os
import json
import time
import whisper
from datetime import datetime

def transcribe_audio(model, model_name, audio_path, task="transcribe", language=None):
    start_time = time.time()
    
    # Для turbo модели явно указываем язык, если он известен
    if language and model_name == "large":
        result = model.transcribe(
            audio_path, 
            task=task,
            language=language,
            fp16=False  # Обязательно для CPU
        )
    else:
        result = model.transcribe(audio_path, task=task, language=language)
    
    elapsed_time = time.time() - start_time
    return {
        "text": result["text"],
        "language": result["language"],
        "time_seconds": round(elapsed_time, 2)
    }

def process_audio_files(audio_dir, output_dir):
    models = {
        # "small": "small", # - быстрая, но слишком плохая
        "medium": "medium", # норм английский, по времени ок, иногда стрельнет русский, но доверять не стоит, определение языка неточное
        "large": "large-v3", # долго грузит, понимает русский, ошибается на редко встечающихся словах, умеет переводить с правильными настройками
        # "turbo": "large-v3-turbo" # не умеет переводить - или я не нашла настройки, иногда читает быстрее медиума, ингода медленнее
    }
    
    audio_files = [f for f in os.listdir(audio_dir) if f.lower().endswith('.wav')]
    results = {}
    
    for audio_file in audio_files:
        audio_path = os.path.join(audio_dir, audio_file)
        file_results = {}
        
        for model_name, model_size in models.items():
            print(f"Processing {audio_file} with {model_name} model...")
            model = whisper.load_model(model_size)

            # препроц для определения языка - нужно для перевода
            lang_det_snippet = whisper.load_audio(audio_path)
            lang_det_snippet = whisper.pad_or_trim(lang_det_snippet) # pad to 30 seconds for language detection
            n_mels = model.dims.n_mels  # автоматически определит 128 для large-v3
            mel = whisper.log_mel_spectrogram(lang_det_snippet, n_mels=n_mels).to(model.device)

            # определение языка - нужно для перевода  
            _, lang_probs = model.detect_language(mel)
            detected_lang = max(lang_probs, key=lang_probs.get)
            
            # Транскрибация полного файла - основой функционал
            transcription = transcribe_audio(model, model_name, audio_path, language=detected_lang)
            file_results[model_name] = transcription
            
            # Перевод (особая обработка для large)
            if detected_lang != "en":
                if model_name == "large":
                    # Для large явно указываем исходный язык и задачу перевода
                    translation = transcribe_audio(
                        model, model_name, audio_path,
                        task="translate",
                        language=detected_lang
                    )
                else:
                    translation = transcribe_audio(
                        model, model_name, audio_path,
                        task="translate"
                    )
                file_results[f"{model_name}_translation"] = translation
        
        results[audio_file] = file_results
    
    # Сохраняем результаты
    output_file = os.path.join(output_dir, "transcription_results.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"Results saved to {output_file}")

if __name__ == "__main__":
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
    audio_dir = os.path.join(project_root, "ml", "audio_samples")
    output_dir = os.path.join(project_root, "ml", "outputs", "whisper", f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    
    os.makedirs(output_dir, exist_ok=True)
    process_audio_files(audio_dir, output_dir)