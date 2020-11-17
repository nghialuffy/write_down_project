from pymongo import MongoClient
import logging
import config_with_yaml as config

cfg = config.load("config.yaml")
MONGO_URI = cfg.getProperty("MONGODB.MONGOURI_NGHIA")
MONGO_DBNAME = cfg.getProperty("MONGODB.MONGO_DBNAME")
def ConnectMongoDB():
    try:
        mongo_uri = MONGO_URI
        mongo_db = MONGO_DBNAME
        client = MongoClient(mongo_uri) 
        db = client[mongo_db]
        return db
    except Exception as e:
        print(e)
        return None 