from datasets import load_dataset, Audio
from transformers import (
    Wav2Vec2Processor,
    Wav2Vec2ForSequenceClassification,
    TrainingArguments,
    Trainer
)
import evaluate
import torch

# 1. Загружаем датасет
dataset = load_dataset("xbgoose/dusha", "default")

# 2. Получаем список уникальных эмоций (строки)
unique_emotions = sorted(set(example["emotion"] for example in dataset["train"]))
label2id = {emotion: i for i, emotion in enumerate(unique_emotions)}
id2label = {i: emotion for emotion, i in label2id.items()}
num_labels = len(label2id)

# 3. Модель и процессор
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model = Wav2Vec2ForSequenceClassification.from_pretrained(
    "facebook/wav2vec2-base-960h",
    num_labels=num_labels,
    label2id=label2id,
    id2label=id2label,
    problem_type="single_label_classification"
)

# 4. Приводим аудио к 16кГц
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))

# 5. Препроцессинг
def preprocess_function(example):
    audio = example["audio"]["array"]
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)
    return {
        "input_values": inputs["input_values"][0],
        "labels": label2id[example["emotion"]]
    }

encoded_dataset = dataset.map(preprocess_function, remove_columns=["audio", "emotion"])

# 6. Метрики
accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = torch.from_numpy(logits).argmax(dim=-1)
    return accuracy.compute(predictions=preds, references=labels)

# 7. Аргументы обучения
training_args = TrainingArguments(
    output_dir="./wav2vec2-dusha-finetuned",
    do_train=True,
    do_eval=True,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=1e-4,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=5,
    warmup_steps=500,
    save_total_limit=2,
    fp16=True,
    logging_steps=50,
<<<<<<< HEAD
=======
    dataloader_pin_memory=False,
>>>>>>> 3067019 ([ml]: change testing of Wav2Vec2  add dusha)
    report_to="none"
)

# 8. Обучение
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=encoded_dataset["train"],
    eval_dataset=encoded_dataset["test"],
    tokenizer=processor.feature_extractor,
    compute_metrics=compute_metrics
)

trainer.train()

# 9. Сохраняем
trainer.save_model("./wav2vec2-dusha-finetuned")
processor.save_pretrained("./wav2vec2-dusha-finetuned")