from jsonschema import validate
from flask import json


class JsonValidator:
    def __init__(self, json_file, schema_path):
        with open(schema_path) as schema_file:
            schema = json.load(schema_file)
        self.json = json_file
        self.schema = schema

    def check_json_schema(self):
        try:
            validate(instance=self.json, schema=self.schema)
            return True, None
        except Exception as e:
            return False, e


class InvalidSchemaException(Exception):
    pass
