export const defaultComment = {
    "_id": "5fe21dc668048e2e6f572cbb",
    "content": "Bài của Tonard làm mình nhớ đến sự ưa chuộng một thời của dòng tiểu thuyết võ hiệp Trung Quốc. Dòng văn này rõ ràng có giá trị và chỗ đứng riêng, nhưng cũng là đầu nguồn của não trạng hiệp nghĩa trên hết, \"Hiệp dĩ võ phạm cấm\" của người Việt Nam mình. Não trạng này xuất hiện từ việc \"lậm\", phổ quát hóa và áp dụng tư tưởng trong các tác phẩm giả tưởng vào cuộc sống thường ngày mà không cân nhắc đến khác biệt về bối cảnh.",
    "created_by": {
        "_id": "5fe21dcd68048e2e6f572cbc",
        "avatar": "https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/4cf4874034f011e9ad5b2bd8dc0f8c6b.jpg",
        "display_name": "Cao Đức Huy"
    },
    "created_date": "Fri, 18 Dec 2020 00:00:00 GMT",
    "list_comment": [] as ReplyType[],
    "vote": 8
};

export type CommentType = typeof defaultComment;

const defaultReply = {
    "_id": "5fe21dc668048e2e6f572cbb",
    "content": "Bài của Tonard làm mình nhớ đến sự ưa chuộng một thời của dòng tiểu thuyết võ hiệp Trung Quốc. Dòng văn này rõ ràng có giá trị và chỗ đứng riêng, nhưng cũng là đầu nguồn của não trạng hiệp nghĩa trên hết, \"Hiệp dĩ võ phạm cấm\" của người Việt Nam mình. Não trạng này xuất hiện từ việc \"lậm\", phổ quát hóa và áp dụng tư tưởng trong các tác phẩm giả tưởng vào cuộc sống thường ngày mà không cân nhắc đến khác biệt về bối cảnh.",
    "created_by": {
        "_id": "5fe21dcd68048e2e6f572cbc",
        "avatar": "https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-xs-avatar/4cf4874034f011e9ad5b2bd8dc0f8c6b.jpg",
        "display_name": "Cao Đức Huy"
    },
    "created_date": "Fri, 18 Dec 2020 00:00:00 GMT",
    "vote": "8"
};

export type ReplyType = typeof defaultReply; 

export const listComment = {
    "list_comment": [
        {
            "_id": "5fe43314817ad99889d17d74",
            "content": "Lỗi lúc trước chưa có nội dung.",
            "created_by": {
                "_id": "5fe4277b817ad99889d17d59",
                "avatar": "http://res.cloudinary.com/dj5xafymg/image/upload/v1608753409/bsp5c1yjlxosj9smznfr.jpg",
                "display_name": "Lê Văn Cần"
            },
            "created_date": "Thu, 24 Dec 2020 13:20:04 GMT",
            "list_comment": [] as ReplyType[],
            "vote": 0
        }
    ]
}

export type ListCommentType = typeof listComment;