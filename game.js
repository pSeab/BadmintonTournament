/* ═══════════════════════════════════════════════
   จอมยุทธแบดมินตัน — Game Logic
   ═══════════════════════════════════════════════ */

/* ═══════ PLAY STYLES ═══════ */
var PLAY_STYLES={
    smash:{name:'สายตบ',nameEn:'Smash',desc:'โจมตีรุนแรง เน้นลูกตบทำคะแนน',icon:'💥',color:'#c41e3a',atk:80,def:45,spd:65,tec:50,sta:55,mnt:50,
        growth:{atk:3,def:1,spd:2,tec:1,sta:1,mnt:1}},
    drop:{name:'สายหยอด',nameEn:'Drop',desc:'ลูกหยอดเนียน หลอกคู่ต่อสู้',icon:'🎯',color:'#9333ea',atk:40,def:55,spd:55,tec:85,sta:60,mnt:70,
        growth:{atk:1,def:1,spd:1,tec:3,sta:2,mnt:2}},
    defense:{name:'สายรับ',nameEn:'Defense',desc:'เกมรับเหนียวแน่น รอจังหวะโต้กลับ',icon:'🛡',color:'#2563eb',atk:45,def:85,spd:50,tec:55,sta:80,mnt:60,
        growth:{atk:1,def:3,spd:1,tec:1,sta:2,mnt:2}},
    control:{name:'สายคอนโทรล',nameEn:'Control',desc:'คุมจังหวะเกม วางลูกแม่นยำ',icon:'🧠',color:'#0891b2',atk:55,def:60,spd:60,tec:75,sta:65,mnt:75,
        growth:{atk:1,def:2,spd:1,tec:2,sta:1,mnt:3}},
    speed:{name:'สายสปีด',nameEn:'Speed',desc:'เคลื่อนไหวเร็ว รุกเร็ว-ถอยเร็ว',icon:'⚡',color:'#16a34a',atk:60,def:45,spd:85,tec:55,sta:70,mnt:50,
        growth:{atk:2,def:1,spd:3,tec:1,sta:2,mnt:1}},
    allround:{name:'สายครบเครื่อง',nameEn:'All-round',desc:'สมดุลทุกด้าน ไม่มีจุดอ่อน',icon:'⚖',color:'#d97706',atk:60,def:60,spd:60,tec:60,sta:60,mnt:60,
        growth:{atk:2,def:2,spd:2,tec:2,sta:2,mnt:2}}
};
var STAT_LABELS={atk:'⚔ โจมตี',def:'🛡 ป้องกัน',spd:'💨 ความเร็ว',tec:'🎯 เทคนิค',sta:'❤ อึด',mnt:'🧠 จิตใจ'};
var STAT_COLORS={atk:'atk',def:'def',spd:'spd',tec:'tec',sta:'sta',mnt:'mnt'};
var RANKS=[
    {minWins:0,title:'เด็กฝึกหัด',emoji:'🌱',color:'#786858'},
    {minWins:2,title:'ศิษย์ฝึกหัด',emoji:'🥊',color:'#a09080'},
    {minWins:5,title:'จอมยุทธ์',emoji:'⚔',color:'#60a5fa'},
    {minWins:8,title:'ดาบพิทักษ์',emoji:'🗡',color:'#4ade80'},
    {minWins:12,title:'นักรบสงคราม',emoji:'🛡',color:'#c084fc'},
    {minWins:18,title:'ขุนพล',emoji:'🐉',color:'#f59e0b'},
    {minWins:25,title:'ทัพหลวง',emoji:'👑',color:'#d4a843'},
    {minWins:35,title:'จักรพรรดิ์',emoji:'🏛',color:'#ef4444'}
];
var CHARACTERS='龙虎豹鹰鹤蛇熊狼凤麒麟';
function getRank(w){var r=RANKS[0];for(var i=0;i<RANKS.length;i++){if(w>=RANKS[i].minWins)r=RANKS[i]}return r}
function getCharForName(n){var h=0;for(var i=0;i<n.length;i++){h=((h<<5)-h)+n.charCodeAt(i);h|=0}return CHARACTERS[Math.abs(h)%CHARACTERS.length]}
function powerOf(f){return Math.round((f.atk+f.def+f.spd+f.tec+f.sta+f.mnt)/6)}
function cornerOrnaments(){return '<svg style="position:absolute;top:0;left:0;width:40px;height:40px;pointer-events:none" viewBox="0 0 40 40"><path d="M2 38 C2 18 12 6 38 2" fill="none" stroke="#d4a843" stroke-width=".7" opacity=".25"/></svg><svg style="position:absolute;top:0;right:0;width:40px;height:40px;pointer-events:none" viewBox="0 0 40 40"><path d="M38 38 C38 18 28 6 2 2" fill="none" stroke="#d4a843" stroke-width=".7" opacity=".25"/></svg>'}
function vsSVG(){return '<svg viewBox="0 0 60 60" width="60" height="60" style="position:absolute;inset:0"><circle cx="30" cy="30" r="28" fill="none" stroke="#c41e3a" stroke-width="1.5" opacity=".25"/><circle cx="30" cy="30" r="22" fill="none" stroke="#c41e3a" stroke-width=".5" opacity=".15"/><path d="M15 30 L30 15 L45 30 L30 45Z" fill="none" stroke="#c41e3a" stroke-width="1" opacity=".2"/></svg>'}

/* ═══════ ADMIN AUTH ═══════ */
var ADMIN_PASSWORD='bmt1150';
var isAdmin=false;
var pendingAction=null;
function requireAdmin(callback){
    if(isAdmin){callback();return}
    pendingAction=callback;
    document.getElementById('admin-modal').classList.add('open');
    document.getElementById('admin-password').value='';
    document.getElementById('admin-error').style.display='none';
    setTimeout(function(){document.getElementById('admin-password').focus()},100);
}
function verifyAdmin(){
    var pw=document.getElementById('admin-password').value;
    if(pw===ADMIN_PASSWORD){
        isAdmin=true;
        document.getElementById('admin-modal').classList.remove('open');
        document.getElementById('admin-indicator').style.display='flex';
        showToast('✓ Admin Mode เปิดใช้งานแล้ว','success');
        if(pendingAction){pendingAction();pendingAction=null}
    }else{
        document.getElementById('admin-error').style.display='block';
        document.getElementById('admin-password').value='';
        document.getElementById('admin-password').focus();
    }
}

/* ═══════ DATA ═══════ */
var STORAGE_KEY='badminton_tournament';
function loadData(){try{var r=localStorage.getItem(STORAGE_KEY);if(r)return JSON.parse(r)}catch(e){}return{fighters:[],matches:[],pairings:[]}}
function saveData(d){localStorage.setItem(STORAGE_KEY,JSON.stringify(d))}
var appData=loadData();

/* ═══════ DATA MIGRATION: reset old format ═══════ */
function migrateData(){
    /* Old format used 'hp' stat or had no 'style' field — force reset */
    if(appData.fighters.length>0){
        var first=appData.fighters[0];
        if(!first.style || first.hasOwnProperty('hp')){
            appData={fighters:[],matches:[],pairings:[]};
            saveData(appData);
        }
    }
    /* Fix missing avatars */
    if(appData.fighters.length>0){
        var avatars={1:'img/art_char.png',2:'img/ice_char.png',3:'img/ong_char.png',4:'img/oat_char.png',5:'img/dum_char.png',6:'img/pro_char.png'};
        var changed=false;
        appData.fighters.forEach(function(f){if(!f.avatar && avatars[f.id]){f.avatar=avatars[f.id];changed=true}});
        if(changed)saveData(appData);
    }
}

function initMockData(){
    if(appData.fighters.length>0)return;
    appData.fighters=[
        {id:1,name:'อาร์ต',nickname:'พายุmscorlib',avatar:'img/art_char.png',style:'allround',atk:62,def:62,spd:62,tec:62,sta:62,mnt:62,wins:0,losses:0,matchesPlayed:0},
        {id:2,name:'ไอซ์',nickname:'โล่แห่งเทือกเขา',avatar:'img/ice_char.png',style:'defense',atk:48,def:85,spd:50,tec:55,sta:80,mnt:60,wins:0,losses:0,matchesPlayed:0},
        {id:3,name:'อ๋อง',nickname:'นักปราชญ์แห่ง shuttle',avatar:'img/ong_char.png',style:'drop',atk:42,def:55,spd:55,tec:85,sta:60,mnt:72,wins:0,losses:0,matchesPlayed:0},
        {id:4,name:'โอ็ต',nickname:'ค้อนสายฟ้า',avatar:'img/oat_char.png',style:'smash',atk:88,def:45,spd:65,tec:50,sta:55,mnt:50,wins:0,losses:0,matchesPlayed:0},
        {id:5,name:'ดำ',nickname:'อสูรยามราตรี',avatar:'img/dum_char.png',style:'smash',atk:85,def:48,spd:68,tec:52,sta:55,mnt:50,wins:0,losses:0,matchesPlayed:0},
        {id:6,name:'ปอ',nickname:'หินผาไม่มีวันแตก',avatar:'img/pro_char.png',style:'defense',atk:45,def:82,spd:52,tec:55,sta:78,mnt:62,wins:0,losses:0,matchesPlayed:0},
        {id:7,name:'พี่ตัง',nickname:'ดาบผ่าฟ้า',avatar:'',style:'smash',atk:90,def:45,spd:62,tec:48,sta:52,mnt:48,wins:0,losses:0,matchesPlayed:0},
        {id:8,name:'พี่โอ็ต',nickname:'จอมกลยุทธ์',avatar:'',style:'drop',atk:40,def:55,spd:55,tec:82,sta:62,mnt:70,wins:0,losses:0,matchesPlayed:0}
    ];
    appData.matches=[];
    appData.pairings=[];appData.nextId=9;appData.nextMatchId=6;saveData(appData);
}

/* ═══════ NAV ═══════ */
function navigateTo(page){
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
    document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active')});
    document.getElementById('page-'+page).classList.add('active');
    document.querySelector('.nav-btn[data-page="'+page+'"]').classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
    if(page==='home')renderHome();if(page==='fighters')renderFighters();
    if(page==='arena')renderArena();if(page==='ranking')renderRanking();
}
function showToast(msg,type){
    type=type||'success';var c=document.getElementById('toast-container');
    var t=document.createElement('div');t.className='toast '+type;
    t.innerHTML='<span>'+(type==='success'?'✓':type==='error'?'✕':'ℹ')+'</span> '+msg;
    c.appendChild(t);setTimeout(function(){t.classList.add('removing');setTimeout(function(){t.remove()},300)},3000);
}
function fmtDate(s){if(!s)return'';var d=new Date(s);return d.toLocaleDateString('th-TH',{day:'numeric',month:'short'})}
function renderStyleBadge(f){
    var s=PLAY_STYLES[f.style];if(!s)return'';
    return '<div class="fighter-style-badge" style="color:'+s.color+';border-color:'+s.color+'30;background:'+s.color+'15">'+s.icon+' '+s.name+'</div>';
}

/* ═══════ RENDER HOME ═══════ */
function renderHome(){
    document.getElementById('stat-fighters').textContent=appData.fighters.length;
    document.getElementById('stat-matches').textContent=appData.matches.length;
    document.getElementById('stat-battles').textContent=appData.fighters.reduce(function(s,f){return s+f.matchesPlayed},0);
    var rc=document.getElementById('recent-matches');
    var rm=appData.matches.slice().reverse().slice(0,5);
    if(!rm.length){rc.innerHTML='<div class="empty-state"><div class="empty-icon">📜</div><h3>ยังไม่มีศึกที่สู้แล้ว</h3></div>';return}
    rc.innerHTML=rm.map(function(m){
        var w=appData.fighters.find(function(f){return f.id===m.winnerId});var l=appData.fighters.find(function(f){return f.id===m.loserId});
        if(!w||!l)return'';
        return '<div class="match-card-mini"><div class="match-mini-fighters"><div class="match-mini-fighter">'+(w.avatar?'<img class="mini-avatar" src="'+w.avatar+'">':'<div class="mini-avatar-placeholder">'+getCharForName(w.name)+'</div>')+'<span class="mini-name match-mini-winner">'+w.name+'</span></div><span class="match-mini-vs">VS</span><div class="match-mini-fighter">'+(l.avatar?'<img class="mini-avatar" src="'+l.avatar+'">':'<div class="mini-avatar-placeholder">'+getCharForName(l.name)+'</div>')+'<span class="mini-name">'+l.name+'</span></div></div><div class="match-mini-result">'+(m.score||'')+'</div></div>';
    }).join('');
    var tc=document.getElementById('top-fighters');
    var ts=appData.fighters.slice().sort(function(a,b){return b.wins-a.wins}).slice(0,4);
    tc.innerHTML=ts.map(function(f,i){return '<div class="top-fighter-card" onclick="navigateTo(\'fighters\')"><div class="top-rank rank-'+(i+1)+'">'+(i+1)+'</div><div class="top-info"><div class="top-name">'+f.name+'</div><div class="top-title">'+getRank(f.wins).emoji+' '+getRank(f.wins).title+'</div></div><div class="top-wins">'+f.wins+' ชนะ</div></div>'}).join('');
}

/* ═══════ RENDER FIGHTERS ═══════ */
function renderFighters(){
    var g=document.getElementById('fighters-grid');
    var s=appData.fighters.slice().sort(function(a,b){return b.wins-a.wins});
    if(!s.length){g.innerHTML='<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚔</div><h3>ยังไม่มีจอมยุทธ</h3></div>';return}
    g.innerHTML=s.map(function(f,i){
        var r=getRank(f.wins);var p=powerOf(f);var st=PLAY_STYLES[f.style]||PLAY_STYLES.allround;
        var rankClass=i<3?' rank-'+(i+1):'';
        return '<div class="fighter-card" onclick="openDetail('+f.id+')">'+
            '<div class="fighter-card-image">'+(f.avatar?'<img src="'+f.avatar+'" alt="'+f.name+'">':'<div class="fighter-card-image-placeholder">'+getCharForName(f.name)+'</div>')+
            '<div class="fighter-card-rank'+rankClass+'">'+(i+1)+'</div>'+
            '<div class="fighter-card-actions">'+
            '<button class="fighter-action-btn" onclick="event.stopPropagation();editFighter('+f.id+')" title="แก้ไข">✎</button>'+
            '<button class="fighter-action-btn delete" onclick="event.stopPropagation();deleteFighter('+f.id+')" title="ลบ">✕</button></div></div>'+
            '<div class="fighter-card-info"><div class="fighter-card-name">'+f.name+'</div>'+(f.nickname?'<div class="fighter-card-nickname">'+f.nickname+'</div>':'')+
            renderStyleBadge(f)+'</div>'+
            '<div class="fighter-card-stats-mini">'+
            ['atk','def','spd','tec','sta','mnt'].map(function(k){return '<div class="fighter-stat-mini"><span>'+STAT_LABELS[k].split(' ')[0]+'</span><span class="fighter-stat-mini-val">'+f[k]+'</span></div>'}).join('')+'</div>'+
            '<div class="fighter-card-footer"><div class="fighter-record"><div class="record-item"><span class="record-value">'+f.wins+'</span><span class="record-label">ชนะ</span></div><div class="record-item"><span class="record-value" style="color:var(--red)">'+f.losses+'</span><span class="record-label">แพ้</span></div><div class="record-item"><span class="record-value">'+f.matchesPlayed+'</span><span class="record-label">รอบ</span></div></div>'+
            '<div style="text-align:right"><div class="fighter-power">'+p+'</div><div class="fighter-power-label">พลังรวม</div></div></div></div>';
    }).join('');
}

/* ═══════ DETAIL MODAL ═══════ */
function openDetail(id){
    var f=appData.fighters.find(function(x){return x.id===id});if(!f)return;
    var r=getRank(f.wins);var p=powerOf(f);var st=PLAY_STYLES[f.style]||PLAY_STYLES.allround;
    var hdr=document.getElementById('detail-header');
    hdr.innerHTML=f.avatar?'<img src="'+f.avatar+'" alt="'+f.name+'">':'<div class="detail-modal-header-placeholder">'+getCharForName(f.name)+'</div>';
    var bd=document.getElementById('detail-body');
    var statsHtml=['atk','def','spd','tec','sta','mnt'].map(function(k){
        var icons={atk:'⚔',def:'🛡',spd:'💨',tec:'🎯',sta:'❤',mnt:'🧠'};
        return '<div class="detail-stat-row"><div class="detail-stat-icon '+k+'">'+icons[k]+'</div><span class="detail-stat-label">'+STAT_LABELS[k].split(' ')[1]+'</span><div class="detail-stat-bar"><div class="detail-stat-bar-fill stat-bar-fill '+STAT_COLORS[k]+'" style="width:'+f[k]+'%"></div></div><span class="detail-stat-val">'+f[k]+'</span></div>';
    }).join('');
    bd.innerHTML='<div class="detail-modal-name">'+f.name+'</div>'+(f.nickname?'<div class="detail-modal-nickname">'+f.nickname+'</div>':'')+
        renderStyleBadge(f)+'<div class="detail-stats-full">'+statsHtml+'</div>'+
        '<div class="detail-record"><div class="detail-record-item"><div class="detail-record-value">'+f.wins+'</div><div class="detail-record-label">ชนะ</div></div><div class="detail-record-item"><div class="detail-record-value" style="color:var(--red)">'+f.losses+'</div><div class="detail-record-label">แพ้</div></div><div class="detail-record-item"><div class="detail-record-value">'+f.matchesPlayed+'</div><div class="detail-record-label">รอบ</div></div></div>'+
        '<div class="detail-power"><div class="detail-power-value">'+p+'</div><div class="detail-power-label">พลังรวม</div></div>';
    document.getElementById('detail-overlay').classList.add('open');
    document.body.style.overflow='hidden';
}
function closeDetail(){
    document.getElementById('detail-overlay').classList.remove('open');
    document.body.style.overflow='';
}

/* ═══════ RENDER ARENA ═══════ */
function renderArena(){
    var c=document.getElementById('pairings-container');var ps=appData.pairings;
    if(!ps.length){c.innerHTML='<div class="empty-state"><div class="empty-icon">🏯</div><h3>ยังไม่มีคู่ประลอง</h3><p>กดปุ่ม "สุ่มจับคู่" เพื่อเริ่มศึก</p></div>';return}
    c.innerHTML=ps.map(function(p,idx){
        var f1=appData.fighters.find(function(f){return f.id===p.fighter1Id});var f2=appData.fighters.find(function(f){return f.id===p.fighter2Id});
        if(!f1||!f2)return'';
        return '<div class="pair-card"><div class="pair-fighters"><div class="pair-fighter">'+(f1.avatar?'<img class="pair-avatar" src="'+f1.avatar+'">':'<div class="pair-avatar-placeholder">'+getCharForName(f1.name)+'</div>')+'<div class="pair-name">'+f1.name+'</div><div class="pair-power">พลัง '+powerOf(f1)+'</div></div><div class="pair-vs">'+vsSVG()+'<span class="pair-vs-text">⚔</span></div><div class="pair-fighter">'+(f2.avatar?'<img class="pair-avatar" src="'+f2.avatar+'">':'<div class="pair-avatar-placeholder">'+getCharForName(f2.name)+'</div>')+'<div class="pair-name">'+f2.name+'</div><div class="pair-power">พลัง '+powerOf(f2)+'</div></div></div><div class="pair-actions"><button class="pair-btn pair-btn-win" onclick="recordWin('+idx+','+f1.id+')">'+f1.name+' ชนะ</button><button class="pair-btn pair-btn-win" onclick="recordWin('+idx+','+f2.id+')">'+f2.name+' ชนะ</button><button class="pair-btn pair-btn-cancel" onclick="cancelPair('+idx+')">ยกเลิก</button></div></div>';
    }).join('');
    var hc=document.getElementById('match-history');var rc=appData.matches.slice().reverse().slice(0,10);
    if(!rc.length){hc.innerHTML='<div class="empty-state"><div class="empty-icon">📜</div><h3>ยังไม่มีบันทึกศึก</h3></div>';return}
    hc.innerHTML=rc.map(function(m){var w=appData.fighters.find(function(f){return f.id===m.winnerId});var l=appData.fighters.find(function(f){return f.id===m.loserId});if(!w||!l)return'';return '<div class="history-item"><span class="history-icon">⚔</span><div class="history-text"><span class="history-winner">'+w.name+'</span> ชนะ <span style="color:var(--text-secondary)">'+l.name+'</span>'+(m.score?'<span style="color:var(--text-dim);margin-left:.5rem">'+m.score+'</span>':'')+'</div><span class="history-date">'+fmtDate(m.date)+'</span></div>'}).join('');
}

/* ═══════ RENDER RANKING ═══════ */
function renderRanking(){
    var c=document.getElementById('ranking-list');
    var s=appData.fighters.slice().sort(function(a,b){if(b.wins!==a.wins)return b.wins-a.wins;return powerOf(b)-powerOf(a)});
    if(!s.length){c.innerHTML='<div class="empty-state"><div class="empty-icon">🏆</div><h3>ยังไม่มีจอมยุทธ</h3></div>';return}
    c.innerHTML=s.map(function(f,i){var r=getRank(f.wins);var p=powerOf(f);
        return '<div class="ranking-item"><div class="ranking-position pos-'+(i+1)+'">'+(i+1)+'</div>'+(f.avatar?'<img class="ranking-avatar" src="'+f.avatar+'">':'<div class="ranking-avatar-placeholder">'+getCharForName(f.name)+'</div>')+'<div class="ranking-info"><div class="ranking-name">'+f.name+'</div><div class="ranking-title">'+r.emoji+' '+r.title+'</div></div><div class="ranking-stats"><div class="ranking-stat"><div class="ranking-stat-value">'+f.wins+'</div><div class="ranking-stat-label">ชนะ</div></div><div class="ranking-stat"><div class="ranking-stat-value">'+f.losses+'</div><div class="ranking-stat-label">แพ้</div></div><div class="ranking-stat"><div class="ranking-stat-value">'+p+'</div><div class="ranking-stat-label">พลัง</div></div></div></div>'}).join('');
}

/* ═══════ STYLE SELECTOR ═══════ */
var selectedStyle='allround';
function renderStyleSelector(){
    var el=document.getElementById('style-selector');
    el.innerHTML=Object.keys(PLAY_STYLES).map(function(k){
        var s=PLAY_STYLES[k];
        return '<div class="style-option'+(selectedStyle===k?' selected':'')+'" data-style="'+k+'" onclick="selectStyle(\''+k+'\')"><div class="style-icon">'+s.icon+'</div><div class="style-name">'+s.name+'</div><div class="style-desc">'+s.desc+'</div></div>';
    }).join('');
}
function selectStyle(k){
    selectedStyle=k;renderStyleSelector();
    var s=PLAY_STYLES[k];
    document.getElementById('fighter-atk').value=s.atk;document.getElementById('atk-value').textContent=s.atk;
    document.getElementById('fighter-def').value=s.def;document.getElementById('def-value').textContent=s.def;
    document.getElementById('fighter-spd').value=s.spd;document.getElementById('spd-value').textContent=s.spd;
    document.getElementById('fighter-tec').value=s.tec;document.getElementById('tec-value').textContent=s.tec;
    document.getElementById('fighter-sta').value=s.sta;document.getElementById('sta-value').textContent=s.sta;
    document.getElementById('fighter-mnt').value=s.mnt;document.getElementById('mnt-value').textContent=s.mnt;
    showStatPreview(k);
}
function showStatPreview(k){
    var s=PLAY_STYLES[k];var pv=document.getElementById('stat-preview');var pc=document.getElementById('stat-preview-content');
    pv.style.display='block';
    pc.innerHTML=['atk','def','spd','tec','sta','mnt'].map(function(st){
        return '<div class="stat-preview-row"><span class="stat-preview-label">'+STAT_LABELS[st].split(' ')[1]+'</span><div class="stat-preview-bar"><div class="stat-preview-fill stat-bar-fill '+STAT_COLORS[st]+'" style="width:'+s[st]+'%"></div></div><span class="stat-preview-val">'+s[st]+'</span></div>';
    }).join('');
}

/* ═══════ CRUD ═══════ */
function addFighter(d){
    var f={id:appData.nextId++||Date.now(),name:d.name,nickname:d.nickname||'',avatar:d.avatar||'',style:d.style||'allround',
        atk:+d.atk,def:+d.def,spd:+d.spd,tec:+d.tec,sta:+d.sta,mnt:+d.mnt,wins:0,losses:0,matchesPlayed:0};
    appData.fighters.push(f);saveData(appData);showToast('⚔ '+f.name+' เข้าร่วมศึกแล้ว!');
}
function updateFighter(id,d){
    var f=appData.fighters.find(function(x){return x.id===id});if(!f)return;
    f.name=d.name;f.nickname=d.nickname||'';f.avatar=d.avatar||'';f.style=d.style||f.style;
    f.atk=+d.atk;f.def=+d.def;f.spd=+d.spd;f.tec=+d.tec;f.sta=+d.sta;f.mnt=+d.mnt;
    saveData(appData);showToast('✎ แก้ไขข้อมูล '+f.name+' แล้ว');
}
function deleteFighter(id){
    var f=appData.fighters.find(function(x){return x.id===id});if(!f)return;
    appData.fighters=appData.fighters.filter(function(x){return x.id!==id});
    appData.matches=appData.matches.filter(function(m){return m.winnerId!==id&&m.loserId!==id});
    appData.pairings=appData.pairings.filter(function(p){return p.fighter1Id!==id&&p.fighter2Id!==id});
    saveData(appData);showToast('✕ '+f.name+' ถูกลบออกแล้ว');renderAll();
}
function editFighter(id){var f=appData.fighters.find(function(x){return x.id===id});if(f)openModal(f)}
function openModal(f){
    var m=document.getElementById('fighter-modal'),t=document.getElementById('modal-title');
    if(f){t.textContent='แก้ไขข้อมูลจอมยุทธ';document.getElementById('fighter-id').value=f.id;
        document.getElementById('fighter-name').value=f.name;document.getElementById('fighter-nickname').value=f.nickname;
        document.getElementById('fighter-avatar').value=f.avatar;selectedStyle=f.style||'allround';
        document.getElementById('fighter-atk').value=f.atk;document.getElementById('fighter-def').value=f.def;
        document.getElementById('fighter-spd').value=f.spd;document.getElementById('fighter-tec').value=f.tec;
        document.getElementById('fighter-sta').value=f.sta;document.getElementById('fighter-mnt').value=f.mnt;
    }else{t.textContent='เพิ่มจอมยุทธใหม่';document.getElementById('fighter-form').reset();document.getElementById('fighter-id').value='';selectedStyle='allround';selectStyle('allround')}
    renderStyleSelector();updateRangeDisplays();m.classList.add('open');
}
function closeModal(){document.getElementById('fighter-modal').classList.remove('open')}
function updateRangeDisplays(){
    ['atk','def','spd','tec','sta','mnt'].forEach(function(k){
        document.getElementById(k+'-value').textContent=document.getElementById('fighter-'+k).value;
    });
}

/* ═══════ PAIRING + STAT GROWTH ═══════ */
function randomPair(){
    if(appData.fighters.length<2){showToast('ต้องมีจอมยุทธอย่างน้อย 2 คน','error');return}
    var paired=new Set();appData.pairings.forEach(function(p){paired.add(p.fighter1Id);paired.add(p.fighter2Id)});
    var np=appData.fighters.filter(function(f){return!paired.has(f.id)});
    if(np.length<2){showToast('จอมยุทธทุกคนถูกจับคู่แล้ว','error');return}
    for(var i=np.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=np[i];np[i]=np[j];np[j]=t}
    for(var k=0;k<np.length-1;k+=2){appData.pairings.push({fighter1Id:np[k].id,fighter2Id:np[k+1].id})}
    saveData(appData);showToast('🎲 จับคู่สำเร็จ '+Math.floor(np.length/2)+' คู่!');renderArena();
}
function cancelPair(i){appData.pairings.splice(i,1);saveData(appData);renderArena()}
function recordWin(pi,wid){
    var p=appData.pairings[pi];if(!p)return;
    var lid=p.fighter1Id===wid?p.fighter2Id:p.fighter1Id;
    var w=appData.fighters.find(function(f){return f.id===wid});var l=appData.fighters.find(function(f){return f.id===lid});
    if(!w||!l)return;
    w.wins++;w.matchesPlayed++;l.losses++;l.matchesPlayed++;
    /* STAT GROWTH: winner gets stats increased based on play style */
    var style=PLAY_STYLES[w.style]||PLAY_STYLES.allround;var growth=style.growth;var grew=[];
    ['atk','def','spd','tec','sta','mnt'].forEach(function(k){
        var gain=growth[k]||1;
        if(w[k]<100){
            var old=w[k];w[k]=Math.min(100,w[k]+gain);
            if(w[k]>old)grew.push({stat:k,from:old,to:w[k],gain:w[k]-old});
        }
    });
    appData.matches.push({id:appData.nextMatchId++||Date.now(),winnerId:wid,loserId:lid,date:new Date().toISOString().split('T')[0],score:''});
    appData.pairings.splice(pi,1);saveData(appData);
    var wr=getRank(w.wins);var growMsg=grew.length?' | เพิ่ม: '+grew.map(function(g){return STAT_LABELS[g.stat].split(' ')[1]+'+'+g.gain}).join(', '):'';
    showToast('🏆 '+w.name+' ชนะ '+l.name+'! '+wr.emoji+' '+wr.title+growMsg,'success');
    renderArena();
}

/* ═══════ ADMIN GATED ACTIONS ═══════ */
function gatedAddFighter(){openModal(null)}
function gatedEditFighter(id){editFighter(id)}
function gatedDeleteFighter(id){
    var f=appData.fighters.find(function(x){return x.id===id});if(!f)return;
    if(!confirm('ต้องการลบ '+f.name+' ออกจากการแข่งขัน?'))return;
    deleteFighter(id);
}

function renderAll(){renderHome();renderFighters();renderArena();renderRanking()}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',function(){
    migrateData();
    initMockData();
    setTimeout(function(){document.getElementById('loading-screen').classList.add('hidden')},2000);
    document.querySelectorAll('.nav-btn').forEach(function(b){b.addEventListener('click',function(){navigateTo(b.dataset.page)})});

    /* Admin-gated add button */
    document.getElementById('addFighterBtn').addEventListener('click',function(){requireAdmin(gatedAddFighter)});

    /* Admin modal */
    document.getElementById('admin-modal-close').addEventListener('click',function(){document.getElementById('admin-modal').classList.remove('open');pendingAction=null});
    document.getElementById('admin-cancel').addEventListener('click',function(){document.getElementById('admin-modal').classList.remove('open');pendingAction=null});
    document.getElementById('admin-submit').addEventListener('click',verifyAdmin);
    document.getElementById('admin-password').addEventListener('keydown',function(e){if(e.key==='Enter')verifyAdmin()});
    document.getElementById('admin-modal').addEventListener('click',function(e){if(e.target===e.currentTarget){document.getElementById('admin-modal').classList.remove('open');pendingAction=null}});

    /* Fighter modal */
    document.getElementById('modal-close').addEventListener('click',closeModal);
    document.getElementById('modal-cancel').addEventListener('click',closeModal);
    document.getElementById('fighter-modal').addEventListener('click',function(e){if(e.target===e.currentTarget)closeModal()});
    document.getElementById('fighter-form').addEventListener('submit',function(e){
        e.preventDefault();var id=document.getElementById('fighter-id').value;
        var d={name:document.getElementById('fighter-name').value.trim(),nickname:document.getElementById('fighter-nickname').value.trim(),
            avatar:document.getElementById('fighter-avatar').value.trim(),style:selectedStyle,
            atk:document.getElementById('fighter-atk').value,def:document.getElementById('fighter-def').value,
            spd:document.getElementById('fighter-spd').value,tec:document.getElementById('fighter-tec').value,
            sta:document.getElementById('fighter-sta').value,mnt:document.getElementById('fighter-mnt').value};
        if(!d.name){showToast('กรุณากรอกชื่อจอมยุทธ','error');return}
        if(id)updateFighter(+id,d);else addFighter(d);closeModal();renderAll();
    });
    ['fighter-atk','fighter-def','fighter-spd','fighter-tec','fighter-sta','fighter-mnt'].forEach(function(id){
        document.getElementById(id).addEventListener('input',updateRangeDisplays)});
    document.getElementById('randomPairBtn').addEventListener('click',randomPair);
    document.getElementById('manualPairBtn').addEventListener('click',function(){showToast('🚧 โหมดกำหนดคู่เอง กำลังพัฒนา','error')});

    /* Make edit/delete require admin */
    window.editFighter=function(id){requireAdmin(function(){gatedEditFighter(id)})};
    window.deleteFighter=function(id){requireAdmin(function(){gatedDeleteFighter(id)})};

    renderStyleSelector();renderHome();
});
