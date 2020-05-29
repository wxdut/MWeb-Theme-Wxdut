#! /usr/bin/env python
# coding:utf-8
import os
import re
import subprocess

def handleDir(path):
    for file in os.listdir(path):
        file = path + '/' + file
        if os.path.isdir(file):
            handleDir(file)
        elif os.path.isfile(file):
            handleFile(file)
        else :
            print 'file is not handled: ' + file

def handleFile(file):
    isJsToCompile = file.endswith("tencent.js") or file.endswith("office_html2pdf.js") or file.endswith("footer.html.js")
    if isJsToCompile:
        bak = file + '.js'
        os.rename(file, bak)
        os.system("java -jar ./../../SiteThemes/MWeb-Theme-Wxdut/closure-compiler-v20200517.jar --js " + bak + " --js_output_file " + file)
        os.remove(bak)
#        java -jar js-compiler.jar --js file --js_output_file file
    elif file.endswith(".html"):
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


watermark = "?imageView2/0/interlace/1/q/75|watermark/2/text/d3hkdXQuY29t/font/5b6u6L2v6ZuF6buR/fontsize/320/fill/IzAwMDAwMA==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim"

path = "./../../Site/wxdut.com"
os.chdir(path)

handleDir("./")

print "替换成功 图片、CSS、JS已全部替换成CDN资源。"

