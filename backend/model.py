from pymongo import MongoClient
from mongoengine import ObjectIdField, StringField, DateTimeField, ListField, IntField, Document, connect, ReferenceField
from bson.objectid import ObjectId
import datetime

client=MongoClient('mongodb+srv://pikan:zpldDfKVSo1E6wDK@writedown.xtaf7.mongodb.net/')
db=client.write_down
connect(db='write_down', username='pikan', password='zpldDfKVSo1E6wDK', host='mongodb+srv://writedown.xtaf7.mongodb.net/')

class Comment(Document):
    _id=ObjectIdField(primary_key=True)
    id_post=ObjectIdField()
    id_parent_comment=ObjectIdField()
    content=StringField(required=True)
    created_date=DateTimeField(default=datetime.datetime.now)
    created_by=ObjectIdField(required=True)
    vote=IntField(default=0)
    
    def save(self):
        super().save()
        db['post'].update_one({'_id': self.id_post}, {'$push': {'list_comment':self._id}})

class Post(Document):
    _id=ObjectIdField(default=ObjectId(), primary_key=True)
    url_post=StringField()
    title=StringField(required=True)
    content=StringField(required=True)
    created_date=DateTimeField(default=datetime.datetime.now)
    list_hashtag=ListField(fields=StringField(), default=[])
    category=ObjectIdField(required=True)
    created_by=ObjectIdField(required=True)
    time_to_read=IntField(default=5)
    list_comment=ListField(fields=ObjectIdField, default=[])
    vote=IntField(default=0)

if __name__=="__main__":
    comment=Comment(_id=ObjectId(), 
                id_post=ObjectId(db.post.find_one({})['_id']), 
                content="asdfad",
                created_by=ObjectId())
    comment.save()

    # post=Post(_id=ObjectId(), 
    #             url_post="asdf", 
    #             title="asdfasdg", 
    #             content="asdfasd", 
    #             created_date=datetime.datetime.now(), 
    #             list_hashtag=[ObjectId()],
    #             category=ObjectId(), 
    #             created_by=ObjectId(), 
    #             time_to_read=20, 
    #             list_comment=[], 
    #             vote=30)
    # post.save()