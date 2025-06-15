import whisper
import json
import os
import time
from datetime import datetime
import pandas as pd

def create_output_directory():
    """Create a timestamped output directory for storing results."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"../outputs/whisper/test_results_{timestamp}"
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def load_models():
    """Load efficient Whisper models with error handling."""
    models = {
        'tiny': None,
        'base': None,
        'small': None,
    }
    
    for model_name in models.keys():
        try:
            print(f"Loading {model_name} model...")

            start_time = time.time()
            models[model_name] = whisper.load_model(model_name)
            load_time = time.time() - start_time
            
            print(f"Successfully loaded {model_name} in {load_time:.2f} seconds")
        except Exception as e:
            print(f"Error loading {model_name}: {str(e)}")
    
    return models

def process_audio_file(models, audio_path, output_dir):
    """Process an audio file with all models and features."""
    filename = os.path.basename(audio_path)
    print(f"\nProcessing file: {filename}")
    
    results = []
    
    # Load audio once for all models
    try:
        audio = whisper.load_audio(audio_path)
        audio_trimmed = whisper.pad_or_trim(audio)
    except Exception as e:
        print(f"Error loading audio file {filename}: {str(e)}")
        return results
    
    for model_name, model in models.items():
        if model is None:
            continue
            
        print(f"\nTesting {model_name} model on {filename}")
        
        try:
            # Test 1: Basic transcription
            start_time = time.time()
            transcription = model.transcribe(audio_path)
            transcribe_time = time.time() - start_time
            
            # Test 2: Language detection
            mel = whisper.log_mel_spectrogram(audio_trimmed).to(model.device)
            start_time = time.time()
            _, lang_probs = model.detect_language(mel)
            detect_time = time.time() - start_time
            detected_lang = max(lang_probs, key=lang_probs.get)
            
            # Test 3: Translation (if not English)
            translation = None
            translate_time = None
            if detected_lang != 'en':
                try:
                    start_time = time.time()
                    translation_result = model.transcribe(audio_path, task="translate")
                    translate_time = time.time() - start_time
                    translation = translation_result["text"]
                except Exception as e:
                    print(f"Translation failed: {str(e)}")
            
            # Save results
            result = {
                'audio_file': filename,
                'model': model_name,
                'detected_language': detected_lang,
                'language_probabilities': json.dumps(lang_probs),
                'transcription': transcription["text"],
                'transcription_time_sec': transcribe_time,
                'segments': json.dumps(transcription["segments"]),
                'translation': translation,
                'translation_time_sec': translate_time,
                'language_detection_time_sec': detect_time,
                'timestamp': datetime.now().isoformat()
            }
            
            results.append(result)
            
            # Save individual JSON result
            result_filename = f"{filename}_{model_name}_result.json"
            with open(os.path.join(output_dir, result_filename), 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            
            print(f"Completed {model_name} on {filename}")
            
        except Exception as e:
            print(f"Error processing {model_name} on {filename}: {str(e)}")
    
    return results

def main():
    # Audio files to process
    audio_files = [
        "audio_samples/Back_Home.mp3",
        "audio_samples/gravitatsionnoe-pole.mp3"
    ]
    
    # Verify files exist
    for file in audio_files:
        if not os.path.exists(file):
            print(f"Error: File not found - {file}")
            return
    
    # Setup output
    output_dir = create_output_directory()
    print(f"All results will be saved to: {output_dir}")
    
    # Load models
    models = load_models()
    
    # Process each file
    all_results = []
    for audio_file in audio_files:
        file_results = process_audio_file(models, audio_file, output_dir)
        all_results.extend(file_results)
    
    # Save comprehensive results to CSV
    if all_results:
        df = pd.DataFrame(all_results)
        csv_path = os.path.join(output_dir, "all_results.csv")
        df.to_csv(csv_path, index=False, encoding='utf-8')
        print(f"\nSaved comprehensive results to: {csv_path}")
    
    print("\nTesting complete!")

if __name__ == "__main__":
    main()