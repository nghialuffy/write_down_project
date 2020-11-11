from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime

client=MongoClient('mongodb+srv://pikan:zpldDfKVSo1E6wDK@writedown.xtaf7.mongodb.net/')
db=client.write_down

class Comment():
    def __init__(self, dict=None):
        if (dict==None):
            self._id=ObjectId()
            self.content=""
            self.created_date=datetime.datetime.now()
            self.created_by=None
            self.list_comment=[]
            self.vote=0
        else:
            self._id=dict['_id']
            self.content=dict['content']
            self.created_date=dict['created_date']
            self.created_by=dict['created_by']
            self.list_comment=dict['list_comment']
            self.vote=dict['vote']

class Post():
    def __init__(self, dict=None):
        if (dict==None):
            self._id=ObjectId()
            self.url_post=""
            self.title=""
            self.content=""
            self.created_date=datetime.datetime.now()
            self.list_hashtag=[]
            self.category=None
            self.created_by=None
            self.time_to_read=0
            self.list_comment=[]
            self.vote=0

            self.db_saved=False

        else:
            self.db_saved=False
            self._id=dict['_id']
            self.url_post=dict['url_post']
            self.title=dict['title']
            self.content=dict['content']
            self.created_date=dict['created_date']
            self.list_hashtag=dict['list_hashtag']
            self.category=dict['category']
            self.created_by=dict['created_by']
            self.time_to_read=dict['time_to_read']
            self.list_comment=dict['list_comment']
            self.vote=dict['vote']

            self.db_saved=dict['db_saved']

    def add_comment(self, comment, save_to_db=True):
        self.list_comment.append(comment.__dict__)
        if (self.db_saved and save_to_db):
            db.post.update_one({'_id': self._id}, {'$push': {'list_comment': comment.__dict__}})

    def insert(self):
        self.db_saved=True
        db.post.insert_one(self.__dict__)

class User():
    def __init__(self, dict=None):
        if (dict==None):
            self._id=ObjectId()
            self.username=""
            self.email=""
            self.password=""
            self.link_facebook=""
            self.gender=""
            self.avatar=""
            self.birthday=datetime.date(1999, 1, 1)
            self.bio=""
            self.list_post=[]
            self.list_draft=[]
            self.list_category=[]

            self.db_saved=False
            
        else:
            self._id=dict['_id']
            self.username=dict['username']
            self.email=dict['email']
            self.password=dict['password']
            self.link_facebook=dict['link_facebook']
            self.gender=dict['gender']
            self.avatar=dict['avatar']
            self.birthday=dict['birthday']
            self.bio=dict['bio']
            self.list_post=dict['list_post']
            self.list_draft=dict['list_draft']
            self.list_category=dict['list_category']

            self.db_saved=dict['db_saved']

    def add_post(self, post, save_to_db=True):
        self.list_post.append(post.__dict__)
        if (self.db_saved and save_to_db):
            db.user.update_one({'_id': self._id}, {'$push': {'list_post': post.__dict__}})

    def insert(self):
        self.db_saved=True
        db.user.insert_one(self.__dict__)

if __name__=="__main__":
    post=Post(db.post.find_one({}))
    comment=Comment()
    post.add_comment(comment)