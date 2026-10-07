"""Contact sheet of candidate photos for one car: python3 tools/browse.py slug [regex] -> scratchpad/browse.jpg + list"""
import json,sys,io,re,urllib.request
from PIL import Image,ImageDraw
sys.path.insert(0,'tools')
from cats import UA
import pick
slug=sys.argv[1]; rx=sys.argv[2] if len(sys.argv)>2 else None
C=json.load(open('tools/candidates.json'))[slug]
pool=[x for x in C if not pick.BAD.search(x['title']) or pick.INT.search(x['title'])]
if rx: pool=[x for x in pool if re.search(rx,x['title'],re.I)]
pool=sorted(pool,key=pick.score,reverse=True)[:30]
W,H=300,200; cols=6; rows=(len(pool)+cols-1)//cols
sheet=Image.new('RGB',(W*cols,(H+16)*rows),'white'); d=ImageDraw.Draw(sheet)
for i,x in enumerate(pool):
    u=x['thumb'].replace('1400px-','330px-')
    try: im=Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read())).convert('RGB')
    except Exception: continue
    im.thumbnail((W-4,H-4)); cx,cy=(i%cols)*W,(i//cols)*(H+16)
    sheet.paste(im,(cx+2,cy+16)); d.text((cx+3,cy+2),f'{i}:{pick.view(x["title"])}',fill='red')
    print(i,x['title'])
sheet.save('/tmp/claude-1000/-home-nick-Bureau-app/ce566151-e021-4460-b4d8-cf04882bea76/scratchpad/browse.jpg',quality=75)
json.dump([x['title'] for x in pool],open('tools/browse-last.json','w'))
