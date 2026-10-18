(function(){

// live-typed tagline: types, pauses, erases, cycles, with human-like timing and one typo fix
var r=document.getElementById('role'),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!rm){
var P=[r.textContent.trim()||'Researcher in Privacy and Anonymity Systems','PhD scholar @ IIT Delhi'],pi=0,done=false;
r.innerHTML='<span class="sr"></span><span aria-hidden="true"></span>';
r.firstChild.textContent=P[0];
var tx=r.lastChild;
function rnd(a,b){return a+Math.random()*(b-a)}
function set(s){tx.textContent=s}
function typeP(){
 var p=P[pi],k=0,typo=(pi===0&&!done)?p.indexOf('Anonymity')+5:-1;
 r.classList.add('typing');
 (function step(){
  if(k===typo){typo=-1;done=true;set(p.slice(0,k)+'i');
   setTimeout(function(){set(p.slice(0,k));setTimeout(step,rnd(120,220))},rnd(380,560));return}
  k++;set(p.slice(0,k));
  if(k<p.length){var c=p[k-1];setTimeout(step,rnd(40,110)+(c===' '||c===','?rnd(30,90):0))}
  else{r.classList.remove('typing');setTimeout(erase,4500)}
 })()}
function erase(){
 var s=tx.textContent;r.classList.add('typing');
 (function back(){s=s.slice(0,-1);set(s);
  if(s.length)setTimeout(back,rnd(16,38));
  else{r.classList.remove('typing');pi=(pi+1)%P.length;setTimeout(typeP,550)}})()}
set('');setTimeout(typeP,400);
}
var i=document.getElementById('cmd'),o=document.getElementById('res');
var go={about:'#about',research:'#research',publications:'#publications',education:'#education',projects:'#projects',honors:'#honors',service:'#service',news:'#news',contact:'#contact'};
var ext={github:'https://github.com/AbhayKabdwal',linkedin:'https://www.linkedin.com/in/abhaykabdwal',youtube:'https://www.youtube.com/@doctor_innovator',email:'mailto:abhaykabdwal@gmail.com'};
i.addEventListener('keydown',function(e){
if(e.key!=='Enter')return;
var c=i.value.trim().toLowerCase().replace(/^(cd|open|cat|ls)\s+/,'');i.value='';
if(c==='help'||c===''){o.textContent='commands: '+Object.keys(go).concat(Object.keys(ext)).join(', ')+', clear';}
else if(c==='clear'){o.textContent='';}
else if(go[c]){o.textContent='jumping to '+c+'...';location.hash=go[c];}
else if(ext[c]){o.textContent='opening '+c+'...';window.open(ext[c],'_blank','noopener');}
else{o.textContent='command not found: '+c+'. Type help.';}
});
})();
