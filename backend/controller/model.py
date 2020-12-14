from bson.objectid import ObjectId
import datetime
import base64
import os
from controller import db
from bs4 import BeautifulSoup
import re
import random
import string


class Comment():
    def __init__(self, dict=None):
        if dict is None:
            self._id = ObjectId()
            self.content = ""
            self.created_date = datetime.datetime.now()
            self.created_by = None
            self.list_comment = []
            self.vote = 0
            self.edit_history = []
        else:
            self._id = dict['_id']
            self.content = dict['content']
            self.created_date = dict['created_date']
            self.created_by = dict['created_by']
            self.list_comment = dict['list_comment']
            self.vote = dict['vote']
            self.edit_history = dict['edit_history']

    def add_comment(self, comment):
        self.list_comment.append(comment.__dict__)


def get_url_post(title, draft=False):
    title = re.sub(r'[áàảãạăắằẳẵặâấầẩẫậ]', 'a', title)
    title = re.sub(r'[éèẻẽẹêếềểễệ]', 'e', title)
    title = re.sub(r'[óòỏõọôốồổỗộơớờởỡợ]', 'o', title)
    title = re.sub(r'[íìỉĩị]', 'i', title)
    title = re.sub(r'[úùủũụưứừửữự]', 'u', title)
    title = re.sub(r'[ýỳỷỹỵ]', 'y', title)
    title = re.sub(r'đ', 'd', title)
    title = re.sub(r'[^\w\s]', '', title)
    title = re.sub(r' ', '-', title)
    url = title

    if draft:
        while db.draft.find_one({"url_draft": url}) is not None:
            url = title + '-' + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))
    else:
        while db.post.find_one({"url_post": url}) is not None:
            url = title + '-' + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))
    return url


def get_time_to_read(content):
    soup = BeautifulSoup(content, "lxml")
    return int(len(soup.text.split()) / 200)


class Post():
    def __init__(self, dict=None):
        if dict is None:
            self._id = ObjectId()
            self.url_post = ""
            self.title = ""
            self.content = ""
            self.created_date = datetime.datetime.now()
            self.list_hashtag = []
            self.category = None
            self.created_by = None
            self.time_to_read = 0
            self.list_comment = []
            self.vote = 0
            self.views = 0
            self.edit_history = []
            self.voted_user = {}

        else:
            self._id = dict['_id']
            self.url_post = dict['url_post']
            self.title = dict['title']
            self.content = dict['content']
            self.created_date = dict['created_date']
            self.list_hashtag = dict['list_hashtag']
            self.category = dict['category']
            self.created_by = dict['created_by']
            self.time_to_read = dict['time_to_read']
            self.list_comment = dict['list_comment']
            self.vote = dict['vote']
            self.views = dict['views']
            self.edit_history = dict['edit_history']
            self.voted_user = dict['voted_user']

    def add_comment(self, comment):
        self.list_comment.append(comment.__dict__)

    def insert_to_db(self):
        db.post.insert_one(self.__dict__)
        db.user.update_one({'_id': self.created_by}, {'$push': {'list_post': self._id}})

    def get_mini_post(self, get_username=True):
        category = db.category.find_one({"_id": self.category}, {"_id": 0, "name_category": 1, "url": 1})
        soup = BeautifulSoup(self.content, "lxml")

        img_soup = soup.find("img")
        if img_soup is not None:
            img_post = img_soup.get_attribute_list("src")[0]
        else:
            img_post = ""

        mini_content = soup.text[:150] + "..."
        if get_username:
            user = db.user.find_one({"_id": self.created_by}, {"_id": 0, "username": 1, "display_name": 1})
            return {"username": user["username"], "display_username": user["display_username"], "title": self.title,
                    "category": category, "created_date": self.created_date, "id": str(self._id),
                    "time_to_read": self.time_to_read, "image": img_post, "content": mini_content, "vote": self.vote,
                    "comment": len(self.list_comment)}
        else:
            return {"title": self.title, "category": category, "created_date": self.created_date, "id": str(self._id),
                    "time_to_read": self.time_to_read, "image": img_post, "content": mini_content, "vote": self.vote,
                    "comment": len(self.list_comment)}

    def get_micro_post(self):
        user = db.user.find_one({"_id": self.created_by}, {"_id": 0, "username": 1, "display_name": 1})
        return {"title": self.title, "username": user["username"], "created_date": self.created_date,
                "id": str(self._id),
                "display_username": user["display_name"]}

    def toDraft(self):
        draft = Draft(history=True)
        draft.title = self.title
        draft.url_draft = get_url_post(draft.title, draft=True)
        draft.content = self.content
        draft.created_date = self.created_date
        draft.list_hashtag = self.list_hashtag
        draft.category = self.category
        draft.created_by = self.created_by

        return draft


class Draft:
    def __init__(self, dict=None, history=False):
        if dict is None:
            self._id = ObjectId()
            self.url_draft = ""
            self.title = ""
            self.content = ""
            self.created_date = datetime.datetime.now()
            self.list_hashtag = []
            self.category = None
            self.created_by = None
            self.history = history

        else:
            self._id = dict['_id']
            self.url_draft = dict['url_draft']
            self.title = dict['title']
            self.content = dict['content']
            self.created_date = dict['created_date']
            self.list_hashtag = dict['list_hashtag']
            self.category = dict['category']
            self.created_by = dict['created_by']
            self.history = dict['history']

    def insert_to_db(self):
        db.draft.insert_one(self.__dict__)
        if not self.history:
            db.user.update_one({'_id': self.created_by}, {'$push': {'list_draft': self._id}})

    def get_mini_draft(self):
        category = db.category.find_one({"_id": self.category}, {"_id": 0, "name_category": 1, "url": 1})
        soup = BeautifulSoup(self.content, "lxml")

        img_soup = soup.find("img")
        if img_soup is not None:
            img_post = img_soup.get_attribute_list("src")[0]
        else:
            img_post = ""

        mini_content = soup.text[:150] + "..."
        return {"title": self.title, "category": category, "created_date": self.created_date, "id": str(self._id),
                "image": img_post, "content": mini_content}

    def toPost(self):
        post = Post()
        post.title = self.title
        post.url_post = get_url_post(post.title)
        post.content = self.content
        post.list_hashtag = self.list_hashtag
        post.category = self.category
        post.created_by = self.created_by
        post.time_to_read = get_time_to_read(post.content)

        return post


class User():
    def __init__(self, dict=None):
        if dict is None:
            self._id = ObjectId()
            self.username = ""
            self.display_name = ""
            self.email = ""
            self.password = ""
            self.link_facebook = ""
            self.avatar = ""
            self.cover_img = ""
            self.bio = ""
            self.list_post = []
            self.list_draft = []
            self.list_category = []
            self.list_follow = []

        else:
            self._id = dict['_id']
            self.username = dict['username']
            self.display_name = dict['display_name']
            self.email = dict['email']
            self.password = dict['password']
            self.link_facebook = dict['link_facebook']
            self.avatar = dict['avatar']
            self.cover_img = dict['cover_img']
            self.bio = dict['bio']
            self.list_post = dict['list_post']
            self.list_draft = dict['list_draft']
            self.list_category = dict['list_category']
            self.list_follow = dict['list_follow']

    def add_post(self, post):
        self.list_post.append(post.__dict__)
        post.created_by = self._id

    def insert_to_db(self):
        db.user.insert_one(self.__dict__)


class Category():
    def __init__(self, dict=None):
        if dict is None:
            self._id = ObjectId()
            self.url = ""
            self.name_category = ""
            self.url_images = ""
            self.rule = ""
        else:
            self._id = dict['_id']
            self.url = dict['url']
            self.name_category = dict['name_category']
            self.url_images = dict['url_images']
            self.rule = dict['rule']

    def insert_to_db(self):
        db.category.insert_one(self.__dict__)


class Token():
    def __init__(self, id_user):
        self._id = ""
        self.token_expiration = datetime.datetime.utcnow() - datetime.timedelta(seconds=1)
        self.id_user = id_user

    def get_token(self, expires_in=3600):
        now = datetime.datetime.utcnow()
        if self._id and self.token_expiration > now + datetime.timedelta(seconds=60):
            return self
        self._id = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + datetime.timedelta(seconds=expires_in)
        db.session.insert_one(self.__dict__)
        return self

    def revoke_token(self):
        self.token_expiration = datetime.datetime.utcnow() - datetime.timedelta(seconds=1)
        db.session.delete_one({"_id": self._id})

    @staticmethod
    def check_token(id_token):
        data = db.session.find_one({"_id": id_token})
        if data is None or data["token_expiration"] < datetime.datetime.utcnow():
            return None
        token = Token(data["id_user"])
        token._id = data["_id"]
        token.token_expiration = data["token_expiration"]
        return token


if __name__ == "__main__":
    post = Post(db.post.find_one({"_id": ObjectId("5fb24d10685674ae279f1404")}))
    print(post.get_mini_post())
