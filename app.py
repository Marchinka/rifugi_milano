import os
from flask import Flask, jsonify, request, url_for, send_from_directory
from werkzeug.utils import redirect

from src.repositories import test_repository

app = Flask(__name__)

script_dir = os.path.dirname(__file__)  # absolute dir the script is in


@app.route('/')
def send_index():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/test', methods=['GET'])
def get_events():
    items = test_repository.get_test_items()
    return jsonify(items)


if __name__ == "__main__":
    app.run(debug=True)
