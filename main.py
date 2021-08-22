import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from transformers import pipeline
from starlette.responses import FileResponse

config = load_dotenv()

model = os.environ.get('ZSL_MODEL', 'typeform/mobilebert-uncased-mnli')
print(f'Model used: {model}')
classifier = pipeline('zero-shot-classification', model=model)

app = FastAPI()
app.mount("/public", StaticFiles(directory="public"), name="public")

@app.get('/ping')
def ping():
    return 'pong!'

@app.get('/api/classify')
def classify(sequence: str, candidate_labels: str, multi_label: bool):
    candidate_labels = [label.strip() for label in candidate_labels.split(',')]
    result = classifier(sequence, candidate_labels, multi_label=multi_label)
    response = []
    for label, score in zip(result['labels'], result['scores']):
        response.append({
            'label': label,
            'score': score
        })
    return response

@app.get('/')
def index():
    return FileResponse('public/index.html')
