import requests


url = "http://127.0.0.1:5000/postofmonth/"

cookie = {
    "token" : r"BJ4csFD81Ax/HvhKPbBR8wIQUU5XkdpC"
}
res = requests.get(url, cookies = cookie)

print(res.text)