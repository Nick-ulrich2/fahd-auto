import sys
sys.path.insert(0,'tools')
from cats import api
for q in sys.argv[1:]:
    r=api(action='query',list='search',srnamespace=14,srsearch=q,srlimit=8)
    print(q,'=>',[x['title'][9:] for x in r.get('query',{}).get('search',[])])
