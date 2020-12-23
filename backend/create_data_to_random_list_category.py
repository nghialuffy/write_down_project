from pymongo import MongoClient
from bson import ObjectId
import random
client = MongoClient('mongodb+srv://haihuynh:rb04Oe88i9FpVgG3@cluster0.jlv3c.mongodb.net/test')
db = client.write_down


list_categories = list(db["category"].find({},{"_id":1}))
categories = []
for i in list_categories:
    categories.append(i["_id"])
# print(categories)

list_user = list(db["user"].find({}))

for user in list_user:
    for i in range(5):
        te = categories[random.randint(0,len(categories)-1)]
        if(te not in user["list_category"]):
            user["list_category"].append(te)
    db["user"].update_one({"_id" : ObjectId(user["_id"])},{
        "$set": user
    })

