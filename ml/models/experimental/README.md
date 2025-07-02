# Emotion Recognition Research (VoiceDiary Project)

This document summarizes the research and selection of models for **emotion recognition from text and audio** in the VoiceDiary project. The goal is to enable the system to analyze both **speech transcriptions** and **raw audio** to infer user emotions.

---

## 1. Problem Statement

Emotion recognition from user input is a crucial component in building an empathetic voice-based diary application. We focus on two main modalities:

- **Text**: Transcribed speech using ASR (e.g., Whisper)
- **Audio**: Voice signal with emotional cues (tone, pitch, etc.)

Our objective is to evaluate and integrate models that classify emotional states from either or both sources.

---

## 2. Text-Based Emotion Recognition Models

These models classify emotions directly from textual transcriptions.

### 2.1 j-hartmann/emotion-english-distilroberta-base

- **Architecture**: DistilRoBERTa
- **Classes**: anger, joy, sadness, fear, love, surprise
- **Size**: ~280MB
- **Language**: English
- **Notes**: High accuracy, trained on 6 diverse datasets

### 2.2 nateraw/bert-base-uncased-emotion

- **Architecture**: BERT-base
- **Classes**: joy, sadness, anger, fear, surprise, love
- **Size**: ~420MB
- **Language**: English
- **Notes**: Lightweight and production-ready

### 2.3 mrm8488/t5-base-finetuned-emotion

- **Architecture**: T5-base (text-to-text)
- **Classes**: 6 classes (as above)
- **Size**: ~850MB
- **Notes**: Generative model for classification

### 2.4 MilaNLProc/xlm-emo-t *(Multilingual)*

- **Architecture**: XLM-RoBERTa
- **Classes**: others, joy, sadness, anger, surprise, fear, disgust, trust, anticipation
- **Size**: ~550MB
- **Languages**: Multilingual (English, Russian, etc.)
- **Notes**: Best option for multilingual support

---

## 3. Multimodal Emotion Recognition

Multimodal models use both audio and text to classify emotions more accurately.

### Why Multimodal?

| Modality       | Pros                  | Cons                   |
| -------------- | --------------------- | ---------------------- |
| Text           | Understands semantics | Misses tone/intonation |
| Audio          | Captures vocal tone   | Misses word meaning    |
| **Multimodal** | Combines both         | More complex, slower   |

### Architecture Components

- **Text Encoder**: BERT, XLM-R, etc.
- **Audio Encoder**: Wav2Vec2, HuBERT

### Fusion Module Approaches

There are three main types of fusion strategies for combining audio and text features:

#### 1. Early Fusion
- **Description**: Concatenate raw or low-level features (e.g., MFCCs + word embeddings) before passing them into a shared encoder.
- **Pros**: Simple, allows joint learning from the start
- **Cons**: Difficult to align modalities, sensitive to input formats

#### 2. Late Fusion
- **Description**: Process audio and text separately through independent models, then combine the outputs (e.g., logits or embeddings) using concatenation, averaging, or an ensemble method.
- **Pros**: Modular, easier to train and debug
- **Cons**: Less synergy between modalities, no joint feature learning

#### 3. Intermediate Fusion *(Recommended)*
- **Description**: Process each modality with a separate encoder, then merge the intermediate representations (hidden states) via attention or cross-modal layers.
- **Variants**:
  - **Cross-Attention**: One modality attends to the other (used in MEP-Emotion)
  - **Co-Attention**: Both modalities attend to each other symmetrically
  - **Multimodal Transformer**: Dedicated transformer layers that take both modalities jointly
- **Pros**: Balances modality interaction and model interpretability
- **Cons**: Requires more compute and careful design

### Example Models

#### MER-SED (2022)

- Fusion: Intermediate (attention-based)
- Inputs: Wav2Vec2 + BERT
- Output: 6 emotion classes

#### MEP-Emotion (2022)

- Fusion via cross-attention
- Data: MELD, IEMOCAP
- Multimodal: audio + text

### Relevant Datasets

| Dataset | Language | Modalities         | Notes                             |
| ------- | -------- | ------------------ | --------------------------------- |
| IEMOCAP | English  | Audio, text, video | Widely used benchmark             |
| MELD    | English  | Audio + text       | Based on TV dialogues             |
| DUSHA   | Russian  | Audio + text       | Suitable for RU-language research |

---

## 4. Model Comparison

| Model       | Type  | Lang  | Classes | Size  | Strength          |
| ----------- | ----- | ----- | ------- | ----- | ----------------- |
| j-hartmann  | Text  | EN    | 6       | 280MB | SOTA for English  |
| nateraw     | Text  | EN    | 6       | 420MB | Fast, light       |
| mrm8488 T5  | Text  | EN    | 6       | 850MB | Generative        |
| xlm-emo-t   | Text  | Multi | 9       | 550MB | Multilingual      |
| MER-SED     | Multi | EN    | 6       | Large | Audio+Text fusion |
| MEP-Emotion | Multi | EN    | 6       | Large | Cross-attention   |

---

## 5. Integration Strategy in VoiceDiary

### Inference Flow:

```
Audio Input
├── Whisper → Transcription
├── Wav2Vec2 → Audio features
├── XLM-R / RoBERTa → Text features
└── Fusion & Classification → Emotion Label
```

### Options:

- Use text-only classifier (e.g., xlm-emo-t) as baseline
- Add audio-only classifier (e.g., Wav2Vec2-finetuned)
- Combine both via fusion module (MER-SED-style)

---

## 6. References

- GoEmotions (Google): [https://arxiv.org/abs/2005.00547](https://arxiv.org/abs/2005.00547)
- MEP-Emotion: [https://arxiv.org/abs/2212.04356](https://arxiv.org/abs/2212.04356)
- MER-SED: [https://arxiv.org/abs/2212.12266](https://arxiv.org/abs/2212.12266)
- HuggingFace: [https://huggingface.co/models](https://huggingface.co/models)
- IEMOCAP Dataset: [https://sail.usc.edu/iemocap/](https://sail.usc.edu/iemocap/)
- MELD Dataset: [https://affective-meld.github.io/](https://affective-meld.github.io/)

