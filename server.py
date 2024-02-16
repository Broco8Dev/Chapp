from flask import Flask, jsonify, request

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

messages = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/messages', methods=['POST'])
def add_message():
    message = request.json.get('message')
    if message:
        messages.append(message)
        return jsonify({'status': 'success'}),  200
    else:
        return jsonify({'error': 'Missing message field'}),  400

if __name__ == '__main__':
    app.run()
