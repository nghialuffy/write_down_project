from controller import bp, db
from controller.model import Post
import datetime


@bp.route('/postmonth', methods=['GET'])
def postmonth():
    list_dict_post = list(
        db.post.find({"created_date": {"$gte": datetime.datetime.utcnow() - datetime.timedelta(days=30)}}).sort(
            [("views", -1)]).limit(5))
    list_post = []
    if len(list_dict_post) > 0:
        for dict_post in list_dict_post:
            post = Post(dict_post)
            list_post.append(post.get_micro_post())
    return {"postmonth": list_post}


if __name__ == "__main__":
    print(postmonth())
