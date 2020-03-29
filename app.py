import os
from flask import Flask, jsonify, request, url_for, send_from_directory
from werkzeug.utils import redirect

from src.common.common import check_request, ValidationResult
from src.repositories import generic_repository, mongo_db_context

app = Flask(__name__)

script_dir = os.path.dirname(__file__)  # absolute dir the script is in

spot_collection = mongo_db_context.spot_collection;
@app.route('/')
def send_index():
    return app.send_static_file('./index.html')

@app.route('/')
@app.route('/home')
@app.route('/home/')
def send_home():
    return app.send_static_file('./home/index.html')

@app.route('/add')
@app.route('/add/')
def send_add():
    return app.send_static_file('./add/index.html')


@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/spot/<string:spot_id>', methods=['GET'])
def get_spot(spot_id):
    items = generic_repository.get(spot_collection, spot_id)
    return jsonify(items)


@app.route('/spots', methods=['GET'])
def get_spots():
    items = generic_repository.get_list(spot_collection)
    return jsonify(items)


@app.route('/spot/<string:spot_id>', methods=['DELETE'])
def delete_spot(spot_id):
    generic_repository.delete(spot_collection, spot_id)
    return jsonify(ValidationResult(True).json())

@app.route('/spot', methods=['POST'])
def save_spot():
    result = check_request(request.json, os.path.join(script_dir, 'src/schema/spot_schema.json'))
    if result.is_valid:
        item = request.json
        generic_repository.save(spot_collection, item)

    return jsonify(result.json())


if __name__ == "__main__":
    app.run(debug=True)
