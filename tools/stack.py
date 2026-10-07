import sys
from PIL import Image
fs=[f'tools/sheets/{s}.jpg' for s in sys.argv[2:]]; ims=[Image.open(f) for f in fs]
o=Image.new('RGB',(max(i.width for i in ims),sum(i.height for i in ims)),'white'); y=0
for i in ims: o.paste(i,(0,y)); y+=i.height
o.save(sys.argv[1],quality=78)
