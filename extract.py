import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(file_path):
    try:
        docx = zipfile.ZipFile(file_path)
        content = docx.read('word/document.xml').decode('utf-8')
        tree = ET.fromstring(content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for p in tree.iter('{%s}p' % ns['w']):
            texts = [node.text for node in p.iter('{%s}t' % ns['w']) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
            else:
                paragraphs.append('')
                
        res = []
        for p in paragraphs:
            if not p.strip() and (not res or not res[-1].strip()):
                continue
            res.append(p)
            
        return '\n'.join(res)
    except Exception as e:
        return str(e)

with open('template1.txt', 'w', encoding='utf-8') as f:
    f.write(read_docx(r"g:\Clone\CHTOJ\GameWeaver\3_Bao cao ket qua nghien cuu MAU (1).docx"))

with open('template2.txt', 'w', encoding='utf-8') as f:
    f.write(read_docx(r"g:\Clone\CHTOJ\GameWeaver\Mẫu thông tin gửi bài dự thi.docx"))
