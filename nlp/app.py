import os
from flask import Flask, request
import pickle
from utils import tokenizer

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 20

with open("classifier.pk", 'rb') as f:
    classifier = pickle.load(f)  
with open("vectorizer.pk", 'rb') as f:
    vectorizer = pickle.load(f)


@app.route('/analyze', methods=['POST'])
def analyze_msg():
    data = request.get_json(force=True)
    message = data['message']

    prediction = classifier.predict(vectorizer.transform([message]))[0]
    return str(prediction)


@app.route('/', methods=['GET'])
def index():
    msg = str(request.args.get('message'))
    prediction = classifier.predict(vectorizer.transform([msg]))[0]
    return str(prediction) + ' ' + msg

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='8080')
