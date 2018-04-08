#! /usr/bin/env python
# coding:utf-8
import os

import re

path = "/Users/hi/Library/Containers/com.coderforart.MWeb/Data/Documents/themes/Site/个人博客"
os.chdir(path)
for file in os.listdir("./"):
    if file.endswith(".html"):
        with open(file, "r") as f:
            s = f.read()
            f.close()
        with open(file, "w") as f:
            s = re.sub(r'<img src=\"(media/[^\"]+)', r'<img src="https://cdn.wxdut.com/\1', s)
            s = re.sub(r'<script src=\"asset/chart/all-min.js\"></script>',
                       r'<script src="https://cdn.wxdut.com/asset/chart/all-min.js"></script>', s)
            f.write(s)
            f.close()

print "替换成功"
