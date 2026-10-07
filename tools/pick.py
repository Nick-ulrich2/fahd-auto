"""Choose up to 5 photos per car (front, rear, interior), download, convert to WebP, write src/data/photos.json.
Usage: python3 tools/pick.py [slug ...]   (overrides in tools/overrides.json: {slug: {"exclude": [titles], "force": [titles]}})"""
import json,re,sys,os,io,time,urllib.request
from PIL import Image,ImageDraw
sys.path.insert(0,'tools')
from cats import UA
C=json.load(open('tools/candidates.json'))
OV=json.load(open('tools/overrides.json')) if os.path.exists('tools/overrides.json') else {}
OUTJ='src/data/photos.json'
PH=json.load(open(OUTJ)) if os.path.exists(OUTJ) else {}
BAD=re.compile(r'\b(engines?|motor ?raum|badges?|emblems?|logos?|wheels?|rims?|felgen?|details?|crash|accident|unfall|police|polizei|taxis?|ambulance|concept|prototypes?|mules?|rally|racing|race|tuned|tuning|headlights?|taillights?|lights?|grilles?|trunk|kofferraum|keys?|model car|miniature|toys?|scale|lego|wrap|camper|army|military|night|nacht|snow|schnee|wreck|damaged|burnt|cutaway|chassis|seats?|rear seats?|boot|cargo|steering|gear|shifter|display|screen|infotainment|speaker|door panel|sill|mirror|pedal|cluster|meter|roof|underbody|tow|ladder|camping|limousine|stretch|hearse|funeral)\b',re.I)
SHOW=re.compile(r'\b(iaa|salon|autosalon|auto ?show|motor ?show|genf|geneva|frankfurt|mondial|naias|expo|exhibition|messe|festival|event|museum|show|giims|bims|auto china|guangzhou|shanghai|beijing|tokyo|tms|essen|goodwood|pebble)\b',re.I)
INT=re.compile(r'interior|innenraum|cockpit|dashboard|armaturen|innen|\binnen\b| – i\b| - i\b|\(i\)',re.I)
REAR=re.compile(r'\brear\b|heck|rückansicht|\bback\b| – h\b| - h\b|\(h\)|rear view|_r\b|hinten',re.I)
FRONT=re.compile(r'\bfront\b|vorne|frontansicht| – f\b| - f\b|\(f\)|front view',re.I)
PREF=None;AVOID=None
def score(x):
    s=min(x['w'],4000)/1000
    if PREF and re.search(PREF,x['title'],re.I): s+=3
    if AVOID and re.search(AVOID,x['title'],re.I): s-=10
    if SHOW.search(x['title']): s-=2.5
    if re.search(r'\b(19|20)\d\d\b',x['title']): s+=0.3
    return s
def view(t):
    if INT.search(t): return 'interior'
    if REAR.search(t): return 'rear'
    if FRONT.search(t): return 'front'
    return 'side'
def pick(slug):
    global PREF,AVOID
    ov=OV.get(slug,{})
    PREF=ov.get('prefer'); AVOID=ov.get('avoid')
    ex=set(ov.get('exclude',[]))
    cands=[x for x in C.get(slug,[]) if x['title'] not in ex]
    by={x['title']:x for x in C.get(slug,[])}
    forced=[by[t] for t in ov.get('force',[]) if t in by]
    if ov.get('only'): return forced
    pool=[x for x in cands if not BAD.search(x['title'].replace('Interior','').replace('interior','')) or INT.search(x['title'])]
    pool=[x for x in pool if x not in forced]
    g={k:sorted([x for x in pool if view(x['title'])==k],key=score,reverse=True) for k in ('front','rear','interior','side')}
    out=list(forced)
    def best(k,artist=None,bonus=3):
        c=[x for x in g[k] if x not in out]
        if not c: return None
        return max(c,key=lambda x: score(x)+(bonus if artist and x['artist']==artist else 0))
    first=out[0] if out else (best('front') or best('side'))
    if first and first not in out: out.append(first)
    a=first['artist'] if first else None
    for k,b in [('rear',4),('interior',0.5),('front',-1)]:
        if len(out)>=5: break
        x=best(k,a,b)
        if x: out.append(x)
    rest=[x for k in ('side','front','rear') for x in g[k] if x not in out]
    while len(out)<4 and rest:
        x=max(rest,key=lambda x: score(x)+(2 if a and x['artist']==a else 0)); out.append(x); rest.remove(x)
    return out[:5]
def get(url):
    for k in range(6):
        try:
            return urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read()
        except Exception as e:
            time.sleep(4*(k+1))
    raise SystemExit('download failed '+url)
def run(slug):
    sel=pick(slug)
    d=f'public/cars/{slug}'; os.makedirs(d,exist_ok=True)
    for f in os.listdir(d): os.remove(os.path.join(d,f))
    photos=[]; sheet=[]
    for i,x in enumerate(sel,1):
        im=Image.open(io.BytesIO(get(x['thumb']))).convert('RGB')
        im.thumbnail((1280,1280),Image.LANCZOS); im.save(f'{d}/{i}.webp','WEBP',quality=78,method=6)
        sm=im.copy(); sm.thumbnail((640,640),Image.LANCZOS); sm.save(f'{d}/{i}-sm.webp','WEBP',quality=74,method=6)
        sheet.append(sm)
        v=view(x['title']); v='front' if v=='side' and i==1 else v
        photos.append(dict(src=f'/cars/{slug}/{i}.webp',thumb=f'/cars/{slug}/{i}-sm.webp',view=v,author=x['artist'][:120] or 'Wikimedia Commons',license=x['license'],licenseUrl=x['licenseUrl'],source=x['page'],title=x['title']))
    PH[slug]=photos
    json.dump(PH,open(OUTJ,'w'),indent=1,ensure_ascii=False)
    # contact sheet
    os.makedirs('tools/sheets',exist_ok=True)
    W=320; cs=Image.new('RGB',(W*5,240+20),'white'); dr=ImageDraw.Draw(cs)
    for i,s in enumerate(sheet):
        t=s.copy(); t.thumbnail((W-4,236)); cs.paste(t,(i*W+2,20))
        dr.text((i*W+4,2),f'{i+1}:{photos[i]["view"]}',fill='black')
    dr.text((W*4,2),slug,fill='red')
    cs.save(f'tools/sheets/{slug}.jpg',quality=80)
    print(slug,len(photos),[p['view'] for p in photos],flush=True)
if __name__=='__main__':
    for s in (sys.argv[1:] or list(C)): run(s)
