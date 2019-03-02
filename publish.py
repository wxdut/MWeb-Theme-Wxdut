#! /usr/bin/env python
# coding:utf-8
import os
import re

watermark = "?imageView2/0/interlace/1/q/75|watermark/2/text/d3hkdXQuY29t/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/IzAwMDAwMA==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim"

path = "/Users/wx/Library/Containers/com.coderforart.MWeb3/Data/Documents/themes/Site/wxdut.com"

os.chdir(path)
for file in os.listdir("./"):
    if file.endswith(".html"):
        with open(file, "r") as f:
            s = f.read()
            f.close()
        with open(file, "w") as f:
            s = re.sub(r'<img src=\"(media/[^\"]+)', r'<img src="https://cdn.wxdut.com/\1' + watermark,
                       s)  # 把图片替换成CDN资源
            s = re.sub(r'<link(.*?)href="asset/', r'<link\1href="https://cdn.wxdut.com/asset/', s)  # 把CSS替换成CDN资源
            s = re.sub(r'<script(.*?)src="asset/', r'<script\1src="https://cdn.wxdut.com/asset/', s)  # 把JS替换成CDN资源
            f.write(s)
            f.close()

print "替换成功 图片、CSS、JS已全部替换成CDN资源。"
