from bson.objectid import ObjectId
import datetime
import base64
import os
from controller import db
from bs4 import BeautifulSoup
from flask import jsonify

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
    def add_comment(self, comment):
        self.list_comment.append(comment.__dict__)

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
            self.views=0

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
            self.views=dict['views']

    def add_comment(self, comment):
        self.list_comment.append(comment.__dict__)

    def insert_to_db(self):
        db.post.insert_one(self.__dict__)
        db.user.update_one({'_id': self.created_by}, {'$push': {'list_post': self._id}})

    def get_mini_post(self, get_username=True):
        category=db.category.find_one({"_id": self.category}, {"_id": 0, "name_category": 1, "url": 1})
        soup=BeautifulSoup(self.content, "lxml")

        img_soup=soup.find("img")
        if img_soup!=None:
            img_post=img_soup.get_attribute_list("src")[0]
        else:
            img_post=""

        mini_content=soup.text[:150]+"..."
        if get_username:
            user=db.user.find_one({"_id": self.created_by}, {"_id": 0, "username": 1, "display_name": 1})
            return {"username": user["username"], "display_username": user["display_username"], "title": self.title,
                    "category": category, "created_date": self.created_date, "url": self.url_post,
                    "time_to_read": self.time_to_read, "image": img_post, "content": mini_content, "vote": self.vote,
                    "comment": len(self.list_comment)}
        else:
            return {"title": self.title, "category": category, "created_date": self.created_date, "url": self.url_post,
                    "time_to_read": self.time_to_read, "image": img_post, "content": mini_content, "vote": self.vote,
                    "comment": len(self.list_comment)}

    def get_micro_post(self):
        user = db.user.find_one({"_id": self.created_by}, {"_id": 0, "username": 1, "display_name": 1})
        return {"title": self.title, "username": user["username"], "created_date": self.created_date, "url": self.url_post,
                "display_username": user["display_name"]}
class User():
    def __init__(self, dict=None):
        if (dict==None):
            self._id=ObjectId()
            self.username=""
            self.display_name=""
            self.email=""
            self.password=""
            self.link_facebook=""
            self.avatar=""
            self.cover_img=""
            self.bio=""
            self.list_post=[]
            self.list_draft=[]
            self.list_category=[]
            self.list_follow=[]
            
        else:
            self._id=dict['_id']
            self.username=dict['username']
            self.display_name=dict['display_name']
            self.email=dict['email']
            self.password=dict['password']
            self.link_facebook=dict['link_facebook']
            self.avatar=dict['avatar']
            self.cover_img=dict['cover_img']
            self.bio=dict['bio']
            self.list_post=dict['list_post']
            self.list_draft=dict['list_draft']
            self.list_category=dict['list_category']
            self.list_follow=dict['list_follow']

    def add_post(self, post):
        self.list_post.append(post.__dict__)
        post.created_by=self._id

    def insert_to_db(self):
        db.user.insert_one(self.__dict__)

class Category():
    def __init__(self, dict=None):
        if (dict==None):
            self._id=ObjectId()
            self.url=""
            self.name_category=""
            self.url_images=""
            self.rule=""
        else:
            self._id=dict['_id']
            self.url=dict['url']
            self.name_category=dict['name_category']
            self.url_images=dict['url_images']
            self.rule=dict['rule']
    def insert_to_db(self):
        db.category.insert_one(self.__dict__)

class Token():
    def __init__(self, id_user):
        self._id=""
        self.token_expiration=datetime.datetime.utcnow()-datetime.timedelta(seconds=1)
        self.id_user=id_user

    def get_token(self, expires_in=3600):
        now = datetime.datetime.utcnow()
        if self._id and self.token_expiration > now + datetime.timedelta(seconds=60):
            return self._id
        self._id = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + datetime.timedelta(seconds=expires_in)
        db.session.insert_one(self.__dict__)
        return self

    def revoke_token(self):
        self.token_expiration = datetime.datetime.utcnow() - datetime.timedelta(seconds=1)
        db.session.delete_one({"_id": self._id})

    @staticmethod
    def check_token(id_token):
        token = db.session.find_one({"_id": id_token})
        if token is None or token.token_expiration < datetime.datetime.utcnow():
            return None
        return token

if __name__=="__main__":
    post=Post(db.post.find_one({"_id": ObjectId("5fb24d10685674ae279f1404")}))
    print(post.get_mini_post())