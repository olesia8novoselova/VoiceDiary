import whisper
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoConfig

config = AutoConfig.from_pretrained("MilaNLProc/xlm-emo-t")
print(config.id2label)

def analyze_emotion(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    emotion_labels = ['anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise']
    emotion = emotion_labels[torch.argmax(probabilities)]
    confidence = torch.max(probabilities).item()
    
    return emotion, confidence

def process_audio(audio_path):
    # Загрузка модели Whisper
    whisper_model = whisper.load_model('small')
    
    # Загрузка модели для анализа эмоций
    emotion_tokenizer = AutoTokenizer.from_pretrained("MilaNLProc/xlm-emo-t")
    emotion_model = AutoModelForSequenceClassification.from_pretrained("MilaNLProc/xlm-emo-t")
    
    # Транскрипция аудио
    result = whisper_model.transcribe(audio_path)
    transcription = result["text"]
    
    # Анализ эмоции
    emotion, confidence = analyze_emotion(transcription, emotion_tokenizer, emotion_model)
    
    # Вывод результатов
    print(f"\nAudio file: {audio_path}")
    print(f"Transcription: {transcription}")
    print(f"Detected emotion: {emotion} (confidence: {confidence:.2f})")

if __name__ == "__main__":
    # Укажите путь к вашему аудиофайлу
    audio_file = "ml/audio_samples/gravitatsionnoe-pole.wav"
    
    # Обработка аудиофайла
    process_audio(audio_file)