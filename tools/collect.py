"""Collect freely-licensed vehicle photos from Wikimedia Commons, pick front/rear/interior shots."""
import json,re,sys,os
sys.path.insert(0,'tools')
from cats import api
CARS=[l.split('|') for l in open(sys.argv[1] if __name__=='__main__' and len(sys.argv)>1 else 'tools/carcats.txt').read().strip().split('\n')]
OUT='tools/candidates.json'
data=json.load(open(OUT)) if os.path.exists(OUT) else {}
BAD=re.compile(r'\b(engines?|motorraum|badges?|emblems?|logos?|wheels?|rims?|felgen?|details?|crash|accident|unfall|police|polizei|taxis?|ambulance|concept|prototypes?|mules?|erlkönig|rally|racing|race|tuned|tuning|headlights?|taillights?|lights?|grilles?|seats?|trunk|kofferraum|keys?|model car|miniature|toys?|scale|lego|hot wheels|launch|fire|feuerwehr|wrap|camper|wohnmobil|army|military|night|nacht|snow|schnee|stand|display|exhibit|expo|auto ?show|motor ?show|genf|geneva|frankfurt|mondial|naias|traffic|competition|wreck|damaged|burnt)\b',re.I)
INT=re.compile(r'interior|innenraum|cockpit|dashboard|armaturen|innen| – i\b| - i\b|_i_',re.I)
REAR=re.compile(r'rear|heck|back| – h\b| - h\b|_h_|\(h\)',re.I)
FRONT=re.compile(r'front|vorne|frontansicht| – f\b| - f\b|_f_|\(f\)',re.I)
OKLIC=re.compile(r'^(cc[ -]by|cc0|public domain|pd)',re.I)
def crawl(cat,depth=3,limit=160):
    files,seen,queue=[],set(),[(cat,0)]
    while queue and len(files)<limit:
        c,d=queue.pop(0)
        if c in seen: continue
        seen.add(c); cont={}
        while True:
            r=api(action='query',list='categorymembers',cmtitle='Category:'+c,cmlimit=500,cmtype='file|subcat',**cont)
            for m in r['query']['categorymembers']:
                if m['ns']==6 and re.search(r'\.(jpe?g)$',m['title'],re.I): files.append(m['title'])
                elif m['ns']==14 and d<depth and not BAD.search(m['title']): queue.append((m['title'][9:],d+1))
            if 'continue' in r: cont={'cmcontinue':r['continue']['cmcontinue']}
            else: break
    return list(dict.fromkeys(files))[:limit]
def info(titles):
    res=[]
    for i in range(0,len(titles),50):
        r=api(action='query',titles='|'.join(titles[i:i+50]),prop='imageinfo',iiprop='url|size|extmetadata',iiurlwidth=1400,iiextmetadatafilter='Artist|LicenseShortName|LicenseUrl|ImageDescription')
        for p in r['query']['pages'].values():
            if 'imageinfo' not in p: continue
            ii=p['imageinfo'][0]; md=ii.get('extmetadata',{})
            g=lambda k: re.sub('<[^>]+>','',md.get(k,{}).get('value','')).strip()
            res.append(dict(title=p['title'],w=ii['width'],h=ii['height'],thumb=ii.get('thumburl'),page=ii['descriptionurl'],artist=g('Artist'),license=g('LicenseShortName'),licenseUrl=g('LicenseUrl')))
    return res
if __name__=="__main__":
  for slug,*cats in CARS:
      if slug in data: continue
      files=[]
      for c in cats: files+=crawl(c.strip())
      imgs=[x for x in info(files) if OKLIC.search(x['license'] or '') and x['w']>=1400 and 1.2<=x['w']/x['h']<=2.1]
      data[slug]=imgs
      print(slug,len(files),'files ->',len(imgs),'usable',flush=True)
      json.dump(data,open(OUT,'w'),indent=1)
