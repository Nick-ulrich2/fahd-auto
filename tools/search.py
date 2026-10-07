"""Add Commons full-text search results to candidates: python3 tools/search.py slug "query" ["query2"...]"""
import json,sys
sys.path.insert(0,'tools')
from cats import api
from collect import info,OKLIC
slug=sys.argv[1]; C=json.load(open('tools/candidates.json'))
titles=[]
for q in sys.argv[2:]:
    r=api(action='query',list='search',srnamespace=6,srsearch=q+' filetype:bitmap',srlimit=50)
    titles+=[x['title'] for x in r['query']['search'] if x['title'].lower().endswith(('.jpg','.jpeg'))]
have={x['title'] for x in C.get(slug,[])}
new=[x for x in info([t for t in dict.fromkeys(titles) if t not in have]) if OKLIC.search(x['license'] or '') and x['w']>=1200 and 1.2<=x['w']/x['h']<=2.1]
C[slug]=new+C.get(slug,[])
json.dump(C,open('tools/candidates.json','w'),indent=1)
print(slug,'+',len(new))
