"""python3 tools/force.py slug 2 3 4 [+'File:extra title'] -> overrides[slug]={'only':True,'force':[...]} then re-pick"""
import json,sys,subprocess
slug=sys.argv[1]; last=json.load(open('tools/browse-last.json')); ov=json.load(open('tools/overrides.json'))
titles=[a[1:] if a.startswith('+') else last[int(a)] for a in sys.argv[2:]]
ov[slug]={'only':True,'force':titles}
json.dump(ov,open('tools/overrides.json','w'),indent=1,ensure_ascii=False)
subprocess.run(['python3','tools/pick.py',slug])
