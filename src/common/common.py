import inspect
import os

from jsonschema import ValidationError

from src.common.json_validator import JsonValidator, InvalidSchemaException


class ValidationResult:
    def __init__(self, input):
        if isinstance(input, bool):
            self.is_valid = input
            self.errors = []
        else:
            self.is_valid = len(input) == 0
            self.errors = input

    def json(self):
        json = dict()
        json["is_valid"] = self.is_valid
        json["errors"] = self.errors
        return json


def check_request(request_json, schema_path):
    """
    Rise an InvalidSchemaException if the request is not compliant to the specified schema.
    :param request_json: client request to check
    :param schema_path: path of the schema to check
    """
    json_validator = JsonValidator(request_json, schema_path)
    check_result = json_validator.check_json_schema()

    errors = []

    if not check_result[0]:
        for check in check_result:
            if not isinstance(check, bool):
                errors.append(check.message)
    return ValidationResult(errors)

