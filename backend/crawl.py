import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from controller.model import *
import re
from time import sleep

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('headless')
chrome_options.add_argument('window-size=1920x1080')
chrome_options.add_argument("disable-gpu")
def get_date(str):
    str=str.strip()
    date_str=re.findall(r"\d+ giờ trước", str)
    if (len(date_str)>0):
        value=re.findall(r"\d+", date_str[0])
        return datetime.datetime.now()-datetime.timedelta(hours=int(value[0]))
    date_str=re.findall(r"\d+ tháng \d+ \d+", str)
    if (len(date_str)>0):
        value=re.findall(r"\d+", date_str[0])
        return datetime.datetime(int(value[2]), int(value[1]), int(value[0]))
    date_str=re.findall(r"\d+ tháng \d+", str)
    if (len(date_str)>0):
        value=re.findall(r"\d+", date_str[0])
        return datetime.datetime(datetime.datetime.today().year, int(value[1]), int(value[0]))
    date_str=re.findall(r"Hôm qua", str)
    if (len(date_str)>0):
        return datetime.datetime.now()-datetime.timedelta(days=1)
    date_str=re.findall(r"\d+ phút trước", str)
    if (len(date_str)>0):
        value=re.findall(r"\d+", date_str[0])
        return datetime.datetime.now()-datetime.timedelta(minutes=int(value[0]))
    print("Không thể crawl ngày đăng: "+str)
    exit()

def crawl_post(url, time_to_read=0, category_id=None):
    if (db.post.find_one({'url_post': url[30:]})!=None):
        return

    print()
    print("Crawling post: "+url)
    print()

    driver=webdriver.Chrome("C:/Users/hvhai/Downloads/chromedriver_win32/chromedriver.exe", chrome_options=chrome_options)
    driver.get(url)

    post=Post()
    post.url_post=url[30:]

    user_url=driver.find_element(By.XPATH, "//h3[@class='username']").find_element_by_tag_name('a').get_attribute("href")
    username=user_url[32:-8]
    user_find=db.user.find_one({'username': username})
    if (user_find==None):
        user=crawl_user(user_url)
    else:
        user=User(user_find)
    
    post.created_by=user._id
    post.title=driver.find_element(By.XPATH, "//div[@class='title']").find_element(By.XPATH, "//h1").text.strip()
    post.content=driver.find_element(By.XPATH, "//div[@class='fr-element fr-view']").get_attribute('innerHTML')
    post.created_date=get_date(driver.find_element(By.XPATH, "//div[@class='created']").text)
    post.vote=int(driver.find_element(By.XPATH, "//span[@class='vote-count']").text)
    post.time_to_read=time_to_read
    post.category=category_id
    try:
        post.views = int(re.findall(r"\d+", driver.find_element(By.XPATH, "//div[@class='views']").text.strip())[0])
    except:
        post.views = 0
    
    try:
        list_driver_hashtag=driver.find_element(By.XPATH, "//ul[@class='tags-list list-unstyled clearfix']").find_elements_by_tag_name('li')
        for driver_hashtag in list_driver_hashtag:
            post.list_hashtag.append(driver_hashtag.text.strip())
    except:
        post.list_hashtag=[]

    while True:
        try:
            btn_more_cmt=driver.find_element(By.XPATH, "//li[@class='show-more-comment']")
            btn_more_cmt.click()
            sleep(1)
        except:
            break
    
    list_driver_cmt=driver.find_elements(By.XPATH, "//li[@class='comment-li']")
    for driver_cmt in list_driver_cmt:
        comment=Comment()
        try:
            comment.content=driver_cmt.find_element(By.XPATH, ".//div[@class='content']").text
        except:
            continue
        comment.created_date=get_date(driver_cmt.find_element(By.XPATH, ".//div[@class='created']").text.strip())

        user_url=driver_cmt.find_element(By.XPATH, ".//h3[@class='name']").find_element_by_tag_name('a').get_attribute("href")
        username=user_url[32:-8]
        user_find=db.user.find_one({'username': username})
        if (user_find==None):
            user=crawl_user(user_url)
        else:
            user=User(user_find)
        
        comment.created_by=user._id
        comment.vote=driver_cmt.find_element(By.XPATH, ".//span[@class='vote-count']").text
        
        list_driver_reply=driver_cmt.find_elements(By.XPATH, ".//li[@class='subcomment-li']")
        for driver_reply in list_driver_reply:
            reply=Comment()
            reply.content=driver_reply.find_element(By.XPATH, ".//div[@class='content']").text
            reply.created_date=get_date(driver_reply.find_element(By.XPATH, ".//div[@class='created']").text.strip())

            user_url=driver_reply.find_element(By.XPATH, ".//h3[@class='name']").find_element_by_tag_name('a').get_attribute("href")
            username=user_url[32:-8]
            user_find=db.user.find_one({'username': username})
            if (user_find==None):
                user=crawl_user(user_url)
            else:
                user=User(user_find)
            
            reply.created_by=user._id
            reply.vote=driver_reply.find_element(By.XPATH, ".//span[@class='vote-count']").text

            comment.add_comment(reply)
        
        post.add_comment(comment)
    driver.close()
    driver.quit()
    post.insert_to_db()

def crawl_user(url):
    print()
    print("Crawling user: "+url)
    print()
    driver=webdriver.Chrome("C:/Users/hvhai/Downloads/chromedriver_win32/chromedriver.exe", chrome_options=chrome_options)
    driver.get(url)
    user=User()
    user.username=url[32:-8]
    print(user.username)
    try:
        user.display_name=driver.find_element(By.XPATH, "//span[@class='display-name']").text.strip()
    except:
        try:
            user.display_name=driver.find_element(By.XPATH, "//div[@class='display-name']").text.strip()
        except:
            user.display_name=""
    user.bio=driver.find_element(By.XPATH, "//div[@class='description']").text.strip()
    user.avatar=driver.find_element(By.XPATH, "//div[@class='avatar']").find_element_by_tag_name('img').get_attribute("src").strip()
    try:
        user.cover_img=driver.find_element(By.XPATH, "//div[@class='cover']").find_element_by_tag_name('img').get_attribute("src").strip()
    except:
        user.cover_img=driver.find_element(By.XPATH, "//div[@class='thumb clearfix']").find_element_by_tag_name('img').get_attribute("src").strip()
    user.insert_to_db()
    driver.close()
    driver.quit()
    return user

def crawl_category(url):
    print()
    print("Crawling category: "+url)
    print()
    category_find=db.category.find_one({'url': url[23:-22]})
    driver=webdriver.Chrome("C:/Users/hvhai/Downloads/chromedriver_win32/chromedriver.exe", chrome_options=chrome_options)
    driver.get(url)
    if (category_find==None):
        category=Category()
        category.url=url[23:-22]
        category.name_category=driver.find_element(By.XPATH, "//div[@id='category-heading']").find_element(By.XPATH, ".//div[@class='title']").text.strip()
        category.url_images=driver.find_element(By.XPATH, "//div[@class='background']").find_element_by_tag_name('img').get_attribute("src").strip()
        category.rule=driver.find_element(By.XPATH, "//div[@class='box-rule']").get_attribute('innerHTML')
        category.insert_to_db()
    else:
        category=Category(category_find)

    list_driver_post=driver.find_elements(By.XPATH, "//li[@class='feed-post']")
    for i, driver_post in enumerate(list_driver_post):
        if i==0:
            continue
        post_url=driver_post.find_element(By.XPATH, ".//h3[@class='title']").find_element_by_tag_name('a').get_attribute("href")
        time_to_read=int(re.findall(r"\d+",
                        re.findall(r"\d+ phút đọc", driver_post.find_element(By.XPATH, ".//div[@class='created']").text)[0])[0])
        crawl_post(post_url, time_to_read, category._id)

def crawl():
    list_category_url=[
        "https://spiderum.com/s/quan-diem-tranh-luan/controversial?page=1#",
        "https://spiderum.com/s/truyen-cam-hung/controversial?page=1#",
        "https://spiderum.com/s/khoa-hoc-cong-nghe/controversial?page=1#",
        "https://spiderum.com/s/science2vn/controversial?page=1#",
        "https://spiderum.com/s/the-thao/controversial?page=1",
        "https://spiderum.com/s/game/controversial?page=1#",
        "https://spiderum.com/s/otakulture/controversial?page=1#",
        "https://spiderum.com/s/sang-tac/controversial?page=1#",
        "https://spiderum.com/s/comics/controversial?page=1#",
        "https://spiderum.com/s/phim/controversial?page=1#",
        "https://spiderum.com/s/sach/controversial?page=1#",
        "https://spiderum.com/s/an-choi/controversial?page=1#",
        "https://spiderum.com/s/ky-nang/controversial?page=1#",
        "https://spiderum.com/s/am-nhac/controversial?page=1#",
        "https://spiderum.com/s/english-zone/controversial?page=1#",
        "https://spiderum.com/s/chuyen-tro-tam-su/controversial?page=1#"
    ]
    for category_url in list_category_url:
        crawl_category(category_url)

if __name__=="__main__":
    crawl()