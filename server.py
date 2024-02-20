from flask import Flask, jsonify, request

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

messages = []
base64_images = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/images', methods=['GET'])
def get_images():
    return jsonify(base64_images)

@app.route('/messages', methods=['POST'])
def add_message():
    data = request.json
    message = data.get('message')
    profile_picture = data.get('profile_picture')  # Add this line to get the profile picture from the request

    if message and profile_picture:
        messages.append(message)
        base64_images.append(profile_picture)

        return jsonify({'status': 'success'}),  200
    else:
        return jsonify({'error': 'Missing message or profile_picture field'}),  400

    
@app.route('/images', methods=['POST'])
def add_image():
    data = request.json
    image = data.get('image')

    if image:
        base64_images.append(image)
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Missing image field'}), 400

if __name__ == '__main__':
    app.run()
