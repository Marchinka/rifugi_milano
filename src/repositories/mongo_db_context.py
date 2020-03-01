import pymongo

__mongo_client__ = pymongo.MongoClient(
    "ds215219.mlab.com:15219",
    username='rifugimilano_adm',
    password='rifugimilano_adm01',
    authSource='heroku_98zb5w9j',
    retryWrites=False)

__mongo_db__ = __mongo_client__["heroku_98zb5w9j"]

spot_collection = __mongo_db__["spot"]
