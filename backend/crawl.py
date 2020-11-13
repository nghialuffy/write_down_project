import requests
from bs4 import BeautifulSoup
from model import *
import re
def crawl_post(url):
    req=requests.get(url)
    soup=BeautifulSoup(req.text, "html.parser")
    post_soup=soup.find_all('div', class_="post-main hide-content-noscript no-print")[0]

    post=Post()

    post.title=post_soup.find('div', class_="title").h1.contents[0]
    post.content=post_soup.find('div', class_="fr-element fr-view").contents
    post.url_post=url[30:]

    author=soup.find('div', class_="author pull-left")
    str_date=author.find('div', 'created').contents[2].strip().split(' ')
    post.created_date=datetime.datetime()
if __name__=="__main__":
    # crawl_post("https://spiderum.com/bai-dang/VE-TRI-HOAN-VA-SONG-O-HIEN-TAI-CHO-TUONG-LAI-v28")
    rex=re.compile("Đăng . giờ trước trong")
    print(rex.match("Đăng 15 giờ trước trong"))