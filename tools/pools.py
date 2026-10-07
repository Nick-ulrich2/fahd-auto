"""Collect candidate photos into named pools from categories and full-text searches."""
import json,sys
sys.path.insert(0,'tools')
from cats import api
from collect import crawl,info,OKLIC
POOLS={
 'p-tvs':(["TVS Motor Company"],["TVS HLX","TVS Star HLX 125","TVS HLX 150","TVS motorcycle Africa","TVS Star City"]),
 'p-bajaj':([],["Bajaj Boxer","Bajaj Boxer 150","Bajaj Boxer BM","Bajaj CT 125","Bajaj CT100","Bajaj motorcycle Africa"]),
 'p-haojue':(["Haojue motorcycles"],["Haojue","Haojue 125","Haojue 150"]),
 'p-lifan':(["Lifan motorcycles"],["Lifan motorcycle","Lifan 150","Lifan 125"]),
 'p-loncin':(["Loncin motorcycles"],["Loncin 150","Loncin 125"]),
 'p-zongshen':(["Zongshen motorcycles"],["Zongshen 150","Zongshen 125"]),
 'p-jialing':(["Jialing motorcycles"],["Jialing 125","Jialing 150","Jialing JH"]),
 'p-hondacg':(["Honda CG125"],["Honda CG 125","Honda CG125 Titan","Honda CG 150"]),
 'p-yamaha':([],["Yamaha YBR 125","Yamaha YBR125","Yamaha Crux 110","Yamaha Crux"]),
 'p-hero':([],["Hero Splendor","Hero HF Deluxe","Hero Splendor Plus"]),
 'p-misc':([],["Sanili","Senke motorcycle","Sanya motorcycle","Nanfang motorcycle","Qlink motorcycle","Fenghao motorcycle","Nanya motorcycle","Bazar motorcycle"]),
 'p-tri':(["Motorcycle taxis in Cameroon"],["Lifan tricycle","Lifan LF200ZH","motor tricycle cargo","cargo tricycle Africa","tricycle motorcycle Cameroon","three-wheeler cargo motorcycle"]),
}
C=json.load(open('tools/candidates.json'))
for k,(cats,qs) in POOLS.items():
    files=[]
    for c in cats:
        try: files+=crawl(c,depth=2,limit=150)
        except Exception as e: print('cat fail',c,e)
    for q in qs:
        r=api(action='query',list='search',srnamespace=6,srsearch=q+' filetype:bitmap',srlimit=40)
        files+=[x['title'] for x in r.get('query',{}).get('search',[]) if x['title'].lower().endswith(('.jpg','.jpeg'))]
    files=list(dict.fromkeys(files))
    imgs=[x for x in info(files) if OKLIC.search(x['license'] or '') and x['w']>=1000 and 1.15<=x['w']/x['h']<=2.2]
    C[k]=imgs
    json.dump(C,open('tools/candidates.json','w'),indent=1)
    print(k,len(files),'->',len(imgs),flush=True)
