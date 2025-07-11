# 1. Emotion Recognition Research (VoiceDiary Project)

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

---


# 2. 🧠 Psychological Text Analysis - Research

This repository presents three distinct approaches to psychological analysis of natural language, leveraging state-of-the-art language models. Each approach has been tailored for specific research or clinical utility, ranging from structured clinical assessment to deep generative insight extraction.

## 📌 Overview of Approaches

| Approach Name         | Model Backbone                       | Purpose                          | Speed     | Output Richness |
|-----------------------|--------------------------------------|----------------------------------|-----------|-----------------|
| `Mistral-Instruct`    | Mistral 7B Instruct v0.2             | Generative insight generation    | ❌ Slow   | ✅ Rich          |
| `Roberta Clinical`    | FacebookAI/roberta-base              | Dimensional & clinical analysis  | ✅ Fast   | ⚠️ Sparse        |
| `Multi-Model Ensemble`| Roberta + FiniteAutomata + MentalAI | Multi-verified psychological output | ⚠️ Medium | ⚠️ Sparse        |

---

## 🧬 1. Mistral-Instruct Approach (LLM Insight Generator)

**Model:** `mistralai/Mistral-7B-Instruct-v0.2`  
**Purpose:** Generative structured psychological insight from raw text.

### 🔧 How It Works

- Accepts raw user text as input.
- Constructs a carefully designed prompt with a **strict JSON output schema**.
- Uses quantized 4-bit inference (via `BitsAndBytesConfig`) for GPU memory efficiency.
- Outputs high-fidelity psychological insights, including:
  - Emotional dynamics
  - Triggers
  - Physical reactions
  - Coping strategies
  - Recommendations

### ✅ Pros
- **High-quality** and **contextually rich output**
- Flexible to various psychological constructs
- Capable of subtle nuance (e.g., emotional shifts, contradictions)

### ❌ Cons
- **~100x slower** inference than OpenHermes or quantized encoder-only models
- Requires **strong hardware** (7B parameters, GPU recommended)
- Output occasionally deviates from schema under edge cases

### 🔬 Suggested Improvements
- Fine-tune on clinical narrative datasets (e.g., PsychNarrative, ISEAR)
- Implement schema validation post-processing for cleaner outputs
- Replace Mistral with **smaller instruction-tuned models** (e.g., Phi-3, TinyLLaMA) for speed without severe quality loss

---

## 🧪 2. Clinical RoBERTa Analyzer

**Model:** `FacebookAI/roberta-base`  
**Purpose:** Encode clinically validated psychological constructs (PHQ-9, CBT) in structured format.

### 🔧 How It Works

- Classifies each sentence against flattened taxonomy of constructs:
  - `emotional_state`: positive / neutral / negative
  - `risk_level`: low / medium / high
  - `coping_style`: active / avoidant / mixed
- Tokenized with RoBERTa tokenizer, output converted using temperature-calibrated softmax.

### ✅ Pros
- **Research-aligned** — grounded in validated psychological taxonomies (PHQ-9, CBT)
- Fast and lightweight (encoder-only, small footprint)
- Deterministic output with schema guarantee

### ❌ Cons
- Outputs are often **minimal** or **generic**
- Lacks context-awareness or narrative chaining
- No natural language explanations or reasoning traces

### 🔬 Suggested Improvements
- Fine-tune on clinical interview transcripts or therapy session logs
- Add auxiliary labels (e.g., insomnia, anhedonia) to expand scope
- Incorporate sentence-level attention heatmaps for interpretability

---

## 🤖 3. Multi-Model Psychological Ensemble

**Models Used:**
- `FacebookAI/roberta-base`: Dimensional representation
- `finiteautomata/bertweet-base-sentiment-analysis`: Emotional nuance (GoEmotions-aligned)
- `mental/mental-roberta-base`: Clinical risk markers (PHQ-9 inspired)

### 🔧 How It Works

- Combines **three specialized models**:
  - Dimensional classifier (5-label)
  - Sentiment pipeline for emotion disambiguation
  - Risk analyzer for red-flag mental health markers
- Uses prompt engineering to generate clinically structured output (JSON).
- Applies multi-model verification for robustness.

### ✅ Pros
- **Cross-validated** psychological inference
- Supports **multiple psychological facets** (emotions, coping, risk)
- Modular architecture — can be expanded with more models

### ❌ Cons
- **Fragmented output** due to model disagreement
- Slow due to sequential model calls
- **Sparse and sometimes redundant results** (e.g., duplicated sentiment terms)

### 🔬 Suggested Improvements
- Use **Mixture-of-Experts (MoE)** routing instead of static ensembling
- Apply **attention-based fusion** of logits or embeddings
- Add semantic clustering to reduce emotional label noise

---

## 🧾 Why These Approaches?

Each approach is intentionally chosen to test **different philosophies** of psychological NLP:

| Approach              | Design Goal                            | Strength                        |
|-----------------------|----------------------------------------|----------------------------------|
| Mistral-Instruct      | High-context, free-form reasoning       | Best for exploratory insight     |
| Clinical RoBERTa      | Structured, schema-constrained analysis | Best for clinical diagnostics    |
| Ensemble              | Multi-perspective validation            | Best for robustness              |

---

## 📚 Further Research Directions

1. **Hybrid Inference Pipeline**:
   - Use RoBERTa to pre-filter low-risk inputs and only pass high-risk ones to Mistral for deep generation.

2. **Explainable AI (XAI)**:
   - Implement attention-weight visualizations or saliency maps for all models.

3. **Multimodal Fusion**:
   - Incorporate speech signals or physiological sensor data (e.g., heart rate) for more complete emotional profiling.

4. **Fine-Tuning Pipeline**:
   - Fine-tune models using the [DAIC-WOZ](https://dcapswoz.ict.usc.edu) dataset or [CounselChat](https://counselchat.com) for real psychological conversations.

5. **Deployment**:
   - Optimize with `ONNX`, `TorchScript`, or `GGUF` for mobile/edge use.

---

# Emotion Fusion in VoiceDiary

This project combines **audio-based** and **text-based** emotion recognition models to produce a single, more robust emotional interpretation of a spoken utterance.

## Models Used

### 🎤 Audio-Based Emotion Recognition

- **Base model**: `openai/whisper-large-v3` (for speech-to-text)
- **Classifier**: Fine-tuned audio classification model
- **Emotion Labels**:\
  `Angry`, `Disgust`, `Fearful`, `Happy`, `Neutral`, `Sad`, `Surprised`

### 📝 Text-Based Emotion Recognition

Two optional models are supported:

1. ``
   - Architecture: DistilRoBERTa
   - Labels: `anger`, `joy`, `sadness`, `fear`, `love`, `surprise`
   - Trained on six diverse emotion datasets
2. ``
   - Architecture: BERT
   - Labels: `sadness`, `joy`, `love`, `anger`, `fear`, `surprise`
   - Trained on the GoEmotions dataset

## 🎯 Fusion Strategies

To combine the outputs of both models into a final emotion label, several fusion techniques can be applied:

### 1. **Confidence-Based Weighted Averaging**

- Each model outputs a probability distribution over emotions.
- Map labels into a shared emotion space.
- Apply a weighted average:
  ```
  final_probs = α * audio_probs + (1 - α) * text_probs
  ```
- The `α` weight (e.g., 0.6 for audio, 0.4 for text) can be tuned based on validation results.

### 2. **Majority Voting**

- Convert predicted labels from both models to a unified set.
- Choose the label that appears most frequently.
- In case of a tie, prioritize the model with higher confidence or predefined weight.

### 3. **Rule-Based Fusion**

- Use heuristics such as:
  - If audio is `Neutral` but text is `Joy`/`Sadness`, trust text.
  - If both are `Anger`, amplify certainty.
  - If emotions contradict (`Happy` vs `Sad`), mark as `Mixed` or `Uncertain`.

### 4. **Train a Meta-Classifier (Optional)**

- Use outputs of both models as input features to a small neural network or decision tree.
- Train on a labeled dataset to learn the optimal combination.
- Requires additional data with both audio and transcribed emotion labels.

## 🧠 Emotion Mapping

Since the models use different label sets, we normalize them to a common emotion taxonomy:

| Audio Label | Mapped Label |
| ----------- | ------------ |
| Angry       | anger        |
| Disgust     | anger        |
| Fearful     | fear         |
| Happy       | joy          |
| Neutral     | neutral      |
| Sad         | sadness      |
| Surprised   | surprise     |

`love` (from text models) is currently treated as an optional extension, or mapped to `joy` if needed.

## ✅ Example Output

| Audio Emotion | Text Emotion | Final Emotion    |
| ------------- | ------------ | ---------------- |
| Sad           | Sadness      | sadness          |
| Neutral       | Joy          | joy (text bias)  |
| Angry         | Surprise     | anger (weighted) |
| Fearful       | Fear         | fear             |

## 🔧 Configuration

You can set the fusion strategy in the config:

```json
{
  "fusion_strategy": "weighted_average",
  "audio_weight": 0.6
}
```



## 🛠️ Setup

```bash
pip install torch transformers accelerate bitsandbytes
