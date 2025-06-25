from transformers import pipeline

summarizer = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")

dialogue_text = """
hi i love my cat Misha it is grey and british and very very fat cute boy he love fish and seafood and love grass but don't like going outside and love watching birds
"""

summary = summarizer(dialogue_text, max_length=50, min_length=20, do_sample=False)
print("Summary:", summary[0]['summary_text'])
