from flask import Flask, jsonify, request, json
from flask_cors import CORS
from flask_sock import Sock

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

messages = []
base64_images = []

sock = Sock(app)

# Flag for controlling the infinite loops in WebSocket routes
running = True

@sock.route('/messages')
def send_messages(ws):
    global running
    while running:
        if messages:
            ws.send(json.dumps(messages))
            messages.clear()

@sock.route('/images')
def send_images(ws):
    global running
    while running:
        if base64_images:
            ws.send(json.dumps(base64_images))
            base64_images.clear()

@app.route('/add_message', methods=['POST'])
def add_message():
    data = request.get_json()
    messages.append(data['message'])
    return jsonify({"status": "success"})

@app.route('/add_image', methods=['POST'])
def add_image():
    data = request.get_json()
    base64_images.append(data['image'])
    return jsonify({"status": "success"})

# Graceful shutdown route
@app.route('/shutdown', methods=['POST'])
def shutdown():
    global running
    running = False
    return jsonify({"status": "shutting down"})

if __name__ == '__main__':
    app.run()
