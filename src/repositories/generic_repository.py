from bson import ObjectId


def get_list(mongo_collection):
    cursor = mongo_collection.find({'is_deleted': {'$ne': True}})
    items = list(cursor)
    for item in items:
        item["_id"] = str(item["_id"])
    return items


def get(mongo_collection, _id):
    query = {"_id": _id}
    item = mongo_collection.find_one(query)
    item["_id"] = str(item["_id"])
    return item


def save(mongo_collection, item):
    if item.get('_id', '') == '':
        _id = str(ObjectId())
    else:
        _id = item['_id']

    query = {"_id": _id}
    item["is_deleted"] = False
    del item["_id"];
    new_values = {"$set": item}
    mongo_collection.update_one(query, new_values, upsert=True)
    return


def delete(mongo_collection, _id):
    query = {"_id": _id}
    item = dict()
    item["is_deleted"] = True
    new_values = {"$set": item}
    mongo_collection.update_one(query, new_values, upsert=True)
    return
