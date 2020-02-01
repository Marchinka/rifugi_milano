from src.repositories import mongo_db_context


def get_test_items():
    cursor = mongo_db_context.test_collection.find()
    items = list(cursor)
    for item in items:
        item["_id"] = str(item["_id"])
    return items
