from flask import request, abort, g
from flask_socketio import SocketIO
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId
import pymongo
from bs4 import BeautifulSoup
from app import socketio



