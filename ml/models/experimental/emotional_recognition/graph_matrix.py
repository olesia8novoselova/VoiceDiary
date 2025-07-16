import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

similarity = {
    'anger':     {'anger': 1.0, 'disgust': 0.9, 'fear': 0.8, 'sadness': 0.7, 'joy': 0.0, 'neutral': 0.2, 'surprise': 0.6},
    'disgust':   {'anger': 0.9, 'disgust': 1.0, 'fear': 0.7, 'sadness': 0.8, 'joy': 0.0, 'neutral': 0.2, 'surprise': 0.5},
    'fear':      {'anger': 0.9, 'disgust': 0.6, 'fear': 1.0, 'sadness': 0.7, 'joy': 0.0, 'neutral': 0.2, 'surprise': 0.8},
    'joy':       {'anger': 0.0, 'disgust': 0.0, 'fear': 0.0, 'sadness': 0.0, 'joy': 1.0, 'neutral': 0.2, 'surprise': 0.9},
    'neutral':   {'anger': 0.0, 'disgust': 0.6, 'fear': 0.5, 'sadness': 0.9, 'joy': 0.7, 'neutral': 1.0, 'surprise': 0.8},
    'sadness':   {'anger': 0.6, 'disgust': 0.8, 'fear': 0.7, 'sadness': 1.0, 'joy': 0.0, 'neutral': 0.2, 'surprise': 0.5},
    'surprise':  {'anger': 0.6, 'disgust': 0.5, 'fear': 0.8, 'sadness': 0.0, 'joy': 0.9, 'neutral': 0.2, 'surprise': 1.0},
}

df = pd.DataFrame(similarity).T

print(df)

plt.figure(figsize=(8, 6))
sns.heatmap(df, annot=True, cmap='coolwarm', vmin=0, vmax=1, square=True, fmt=".2f")
plt.title("Emotion Similarity Matrix")
plt.tight_layout()
plt.show()