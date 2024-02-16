from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

messages = []
usernames = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/usernames', methods=['GET'])
def get_usernames():
    return jsonify(usernames)

@app.route('/messages', methods=['POST'])
def add_message():
    message = request.json.get('message')
    if message:
        messages.append(message)
        return jsonify({'status': 'success'}),  200
    else:
        return jsonify({'error': 'Missing message field'}),  400
    
@app.route('/usernames', methods=['POST'])
def add_username():
    username = request.json.get('username')
    if username:
        usernames.append(username)
        return jsonify({'status': 'success'}),  200
    else:
        return jsonify({'error': 'Missing message field'}),  400

if __name__ == '__main__':
    app.run(debug=True)
