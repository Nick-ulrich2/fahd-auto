import json,urllib.request,urllib.parse,sys,time,urllib.error
UA={'User-Agent':'FahdAutoCatalogBuilder/1.0 (ulrich; contact via site)'}
def api(**p):
    p.update(format='json')
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)
    for k in range(8):
        try:
            time.sleep(0.15)
            return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30))
        except urllib.error.HTTPError as e:
            if e.code!=429: raise
            time.sleep(5*(k+1))
    raise SystemExit('rate limited')
if __name__=="__main__":
  cats=[l.strip() for l in sys.stdin if l.strip()]
  for i in range(0,len(cats),40):
      r=api(action='query',titles='|'.join('Category:'+c for c in cats[i:i+40]),prop='categoryinfo')
      for p in r['query']['pages'].values():
          print(('MISSING ' if 'missing' in p else 'ok      ')+p['title'], p.get('categoryinfo',{}).get('files'))
