from datasets import load_dataset, Audio
from transformers import (
    Wav2Vec2Processor,
    Wav2Vec2ForSequenceClassification,
    TrainingArguments,
    Trainer
)
import evaluate
import torch
import numpy as np

# 1. Загружаем датасет
dataset = load_dataset("xbgoose/dusha", "default")

# 2. Эмоции
unique_emotions = sorted(set(example["emotion"] for example in dataset["train"]))
label2id = {emotion: i for i, emotion in enumerate(unique_emotions)}
id2label = {i: emotion for emotion, i in label2id.items()}
num_labels = len(label2id)

# 3. Вычисляем веса классов вручную
emotion_counts = {
    "neutral": 0.53,
    "angry": 0.21,
    "positive": 0.16,
    "sad": 0.09,
    "other": 0.01
}

class_weights = []
for emotion in unique_emotions:
    freq = emotion_counts[emotion]
    weight = np.log(1 + 1/freq)
    class_weights.append(weight)
class_weights = torch.tensor(class_weights, dtype=torch.float)

# 4. Модель и процессор
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
base_model = Wav2Vec2ForSequenceClassification.from_pretrained(
    "facebook/wav2vec2-base-960h",
    num_labels=num_labels,
    label2id=label2id,
    id2label=id2label,
    problem_type="single_label_classification"
)

# 5. Оборачиваем модель с кастомным loss-функционалом
class WeightedWav2Vec2(Wav2Vec2ForSequenceClassification):
    def __init__(self, config, class_weights):
        super().__init__(config)
        self.class_weights = class_weights

    def forward(self, input_values, attention_mask=None, labels=None):
        outputs = self.wav2vec2(input_values, attention_mask=attention_mask)
        hidden_states = outputs[0]
        logits = self.classifier(self.projector(hidden_states.mean(dim=1)))

        loss = None
        if labels is not None:
            loss_fct = torch.nn.CrossEntropyLoss(weight=self.class_weights.to(self.device))
            loss = loss_fct(logits.view(-1, self.num_labels), labels.view(-1))

        return {"loss": loss, "logits": logits}

model = WeightedWav2Vec2(base_model.config, class_weights)
model.load_state_dict(base_model.state_dict(), strict=False)

# 6. Подготовка аудио
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))

def preprocess_function(example):
    audio = example["audio"]["array"]
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)
    return {
        "input_values": inputs["input_values"][0],
        "labels": label2id[example["emotion"]]
    }

encoded_dataset = dataset.map(preprocess_function, remove_columns=["audio", "emotion"])

# 7. Метрики
accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = torch.from_numpy(logits).argmax(dim=-1)
    return accuracy.compute(predictions=preds, references=labels)

# 8. Аргументы обучения
training_args = TrainingArguments(
    output_dir="./wav2vec2-dusha-balanced",
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
    dataloader_pin_memory=False,
    report_to="none"
)

# 9. Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=encoded_dataset["train"],
    eval_dataset=encoded_dataset["test"],
    tokenizer=processor.feature_extractor,
    compute_metrics=compute_metrics
)

trainer.train()

# 10. Сохраняем
trainer.save_model("./wav2vec2-dusha-balanced")
processor.save_pretrained("./wav2vec2-dusha-balanced")
