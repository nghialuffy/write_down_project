from controller import bp, db
from controller.model import Post

@bp.route('/user/<username>', methods=['GET'])
def get_user(username):
    user=db.user.find_one({"username": username},
                          {"password": 0, "link_facebook": 0, "email": 0, "list_draft": 0, "list_category": 0})
    list_post=[]
    if (len(user["list_post"])>0):
        for id_post in user["list_post"]:
            post=Post(db.post.find_one({"_id": id_post}))
            list_post.append(post.get_mini_post(get_username=False))
    followers=len(list(db.user.find({"list_follow": user["_id"]})))

    return {"username": user["username"], "display_name": user["display_name"], "avatar": user["avatar"],
            "cover_img": user["cover_img"], "bio": user["bio"], "list_post": list_post,
            "followings": len(user["list_follow"]), "followers": followers}
if __name__=="__main__":
    print(get_user("Araragikoyomioc"))