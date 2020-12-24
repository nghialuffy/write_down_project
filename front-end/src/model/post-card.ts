export const defaultPostCard = {
    "category": "5fb2495d685674ae279f1357",
    "comments": 0,
    "content": "Marvel Comics luôn tràn ngập các nhân vật, từ những siêu anh hùng, cho tới các siêu ác nhâ, và các t",
    "created_by": "5fb24938685674ae279f1351",
    "created_date": "Wed, 07 Oct 2020 00:00:00 GMT",
    "_id": "5fb249c9685674ae279f136a",
    "time_to_read": "16",
    "title": "Những siêu anh hùng quyền năng nhất Marvel Comics",
    "views": 20069,
    "vote": 9,
    "url_image": "",
    "is_voted": 1
};

export type PostCardType = typeof defaultPostCard;

export const ListPost = {
    "current_page": 1,
    "data": [
        {
            "_id": "5fb25f715542d4271188d71a",
            "category": "5fb251de685674ae279f152a",
            "comments": 3,
            "content": "Các nghệ sĩ indie ở Việt Nam không có nhiều người được đào tạo một cách bài bản về thanh nhạc. Chính vì thế, thật khó để lấy thước đo về kĩ thuật để đánh giá khả năng ca hát của họ. Tuy nhiên, các ngh",
            "created_by": "5fb25227685674ae279f153a",
            "created_date": "Wed, 14 Oct 2020 00:00:00 GMT",
            "time_to_read": "8",
            "title": "Những giọng ca ấn tượng trong cộng đồng indie",
            "url_image": "",
            "views": 4746,
            "vote": 42,
            "is_voted": -1
        }
    ],
    "total_page": 324
}
export type ListPostType = typeof ListPost;

export const UserPostCard = {
    "_id": "5fe2ef4593e33abfe3b4ec44",
        "category": {
        "_id": "5fe2ef2293e33abfe3b4ec41",
        "name_category": "English Zone",
        "url": "english-zone"
    },
    "comment": 0,
    "content": "A few days ago, hundreds of Grab drivers turned off their app (smartphone application) and gathered in Hanoi and Ho Chi Minh City (HCMC) to protest Gr...",
    "created_date": "Wed, 16 Dec 2020 00:00:00 GMT",
    "image": "",
    "time_to_read": 5,
    "title": "Three grievances against ride-sharing apps: A Vietnamese perspective",
    "vote": 3,
    "voted_user": 1
};

export type UserPostCardType = typeof UserPostCard;