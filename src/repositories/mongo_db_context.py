import pymongo

__mongo_client__ = pymongo.MongoClient(
    "ds215229.mlab.com:15229",
    username='room_203_adm',
    password='room_203_adm',
    authSource='heroku_pjdmzjmd',
    retryWrites=False)

__mongo_db__ = __mongo_client__["heroku_pjdmzjmd"]

test_collection = __mongo_db__["test"]
