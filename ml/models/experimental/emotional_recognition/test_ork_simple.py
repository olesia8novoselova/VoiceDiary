emotion_map_audio_to_text = {
    "Angry": "anger",
    "Disgust": "disgust",
    "Fearful": "fear",
    "Happy": "joy",
    "Neutral": "neutral",
    "Sad": "sadness",
    "Surprised": "surprise"
}

def combine_emotions(audio_emotion, text_emotion):
    audio = emotion_map_audio_to_text[audio_emotion]
    text = text_emotion.lower()

    if audio == text:
        return audio

    if 'neutral' in [audio, text]:
        return text if audio == 'neutral' else audio

    if (audio, text) in [('anger', 'sadness'), ('fear', 'sadness')]:
        return 'sadness'

    if (audio, text) in [('joy', 'surprise'), ('surprise', 'joy')]:
        return 'joy' 

    return text

#Данилка вставь сюда вывод моделек люблю тебя пипец
audio = "Happy"
text = "surprise"

print(combine_emotions(audio, text))