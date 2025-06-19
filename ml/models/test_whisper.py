import whisper
import json
import os
import time
from datetime import datetime
import pandas as pd
import numpy as np

def create_output_directory():
    output_dir = os.path.abspath(f"ml/outputs/whisper/test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def load_models():
    return {'small': whisper.load_model('small')}

def process_audio_file(models, audio_path, output_dir):
    results = []
    
    try:
        audio = whisper.load_audio(audio_path)
        audio = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio).to(models['small'].device)
        
        for model_name, model in models.items():
            start_time = time.time()
            result = model.transcribe(audio_path)
            
            _, lang_probs = model.detect_language(mel)
            detected_lang = max(lang_probs, key=lang_probs.get)
            
            res = {
                'audio_file': audio_path,
                'model': model_name,
                'detected_language': detected_lang,
                'transcription': result["text"],
                'transcription_time_sec': time.time() - start_time,
                'timestamp': datetime.now().isoformat()
            }
            
            results.append(res)
            
            with open(os.path.join(output_dir, f"{os.path.basename(audio_path)}_{model_name}_result.json"), 'w') as f:
                json.dump(res, f, ensure_ascii=False, indent=2)
                
    except Exception as e:
        print(f"Error processing {audio_path}: {str(e)}")
    
    return results

def main():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
    audio_dir = os.path.join(project_root, "ml", "audio_samples")
    
    audio_files = [os.path.join(audio_dir, f) for f in os.listdir(audio_dir) if f.lower().endswith('.wav')]
    
    if not audio_files:
        print("No WAV files found in audio directory")
        return
    
    output_dir = create_output_directory()
    models = load_models()
    all_results = []
    
    for audio_file in audio_files:
        all_results.extend(process_audio_file(models, audio_file, output_dir))
    
    if all_results:
        pd.DataFrame(all_results).to_csv(os.path.join(output_dir, "all_results.csv"), index=False)
    
    print("Processing completed")

if __name__ == "__main__":
    main()