from transformers import pipeline

summarizer = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")

#вставьте сюда на бэке путь к файлу с виспера ОБЯЗАТЕЛЬНО на английском!
dialogue_text = """
hi i love my cat Misha it is grey and british and very very fat cute boy he love fish and seafood and love grass but don't like going outside and love watching birds
"""

summary = summarizer(dialogue_text, max_length=50, min_length=20, do_sample=False)
print("Summary:", summary[0]['summary_text'])
