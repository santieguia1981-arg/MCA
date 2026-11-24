import json,sys
T=json.load(open('normativa.json',encoding='utf-8'))
R={'I':1,'V':5,'X':10,'L':50}
def r2i(s):
    t=0
    for i,c in enumerate(s):
        v=R[c]; t+= -v if i+1<len(s) and R[s[i+1]]>v else v
    return t
issues=[]
def seq(label, vals):
    exp=1; prev=None
    for v in vals:
        if v==prev: continue   # bis/ter
        if v!=exp: issues.append(f'{label}: esperado {exp}, hallado {v}'); exp=v
        exp+=1; prev=v
def visit(n, path):
    ch=n.get('children',[])
    chs=[c for c in ch if c['kind']=='chapter']; ses=[c for c in ch if c['kind']=='section']
    if chs: seq(path+' CAP',[r2i(c['num']) for c in chs])
    if ses: seq(path+' SEC',[r2i(c['num']) for c in ses])
    if n['kind']=='chapter' or (n['kind']=='title' and not chs):
        ars=[]
        def col(x):
            for c in x.get('children',[]):
                if c['kind']=='article': ars.append(c['n'])
                elif c['kind']=='section': col(c)
        col(n)
        seq(path+' ART',ars)
    for c in ch:
        if c['kind'] in('chapter','section'): visit(c, path+'>'+c['kind'][:3]+c['num'])
for t in T: visit(t,'T'+t['num'])
print(len(issues),'anomalías')
for x in issues[:int(sys.argv[1]) if len(sys.argv)>1 else 50]: print(x)
