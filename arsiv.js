import{auth,db,thumb,full}from"./firebase.js";
import{collection,getDocs,query,orderBy,doc,updateDoc,arrayUnion,arrayRemove,increment}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import{onAuthStateChanged}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const $=id=>document.getElementById(id);
const grid=$("grid"),modal=$("modal"),mImg=$("mImg"),likeBtn=$("likeBtn"),likeN=$("likeN"),list=$("comments"),cText=$("cText");
let user=null,cur=null,urls=[],idx=0;
onAuthStateChanged(auth,u=>{user=u;if(cur)paintLike()});
const getUrls=d=>d.imageUrls||(d.imageUrl?[d.imageUrl]:[]);
const stat=d=>"❤ "+(d.likes||0)+"   💬 "+(d.comments||[]).length;
async function load(){
try{const s=await getDocs(query(collection(db,"fotograflar"),orderBy("timestamp","desc")));
grid.textContent="";
s.forEach(snap=>{const d=snap.data(),u=getUrls(d);if(!u.length)return;
const b=document.createElement("button");b.className="tile";b.setAttribute("aria-label","Fotoğrafı aç");
const i=new Image();i.loading="lazy";i.alt=(d.description||"Erdek arşiv fotoğrafı").slice(0,100);i.src=thumb(u[0]);
const ov=document.createElement("span");ov.className="ov";ov.textContent=stat(d);b.append(i);
if(u.length>1){const g=document.createElement("i");g.className="badge";g.textContent="▦ "+u.length;b.append(g)}
b.append(ov);b.onclick=()=>openM({id:snap.id,d,ov});grid.append(b)});
if(!grid.children.length)grid.innerHTML='<p class="empty">Henüz arşive fotoğraf eklenmemiş.</p>'
}catch(e){console.error(e);grid.innerHTML='<p class="empty">Fotoğraflar yüklenemedi. Sayfayı yenileyip tekrar deneyin.</p>'}}
function openM(c){cur=c;urls=getUrls(c.d);idx=0;show();$("mDesc").textContent=c.d.description||"Açıklama girilmemiş.";likeN.textContent=c.d.likes||0;paintLike();paintComments();modal.classList.add("open");document.body.style.overflow="hidden";$("mClose").focus()}
function closeM(){modal.classList.remove("open");document.body.style.overflow="";cur=null}
function show(){mImg.src=full(urls[idx]);mImg.alt=cur.d.description||"Erdek arşiv fotoğrafı";$("prev").hidden=$("next").hidden=urls.length<2}
const step=n=>{idx=(idx+n+urls.length)%urls.length;show()};
$("prev").onclick=()=>step(-1);$("next").onclick=()=>step(1);$("mClose").onclick=closeM;
modal.onclick=e=>{if(e.target===modal)closeM()};
document.addEventListener("keydown",e=>{if(!cur)return;if(e.key==="Escape")closeM();if(e.target.tagName==="INPUT"||urls.length<2)return;if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});
function paintLike(){likeBtn.classList.toggle("on",!!user&&(cur.d.likedUsers||[]).includes(user.uid))}
function addC(c){const p=document.createElement("p"),b=document.createElement("strong");b.textContent=(c.user||"Ziyaretçi")+": ";p.append(b,document.createTextNode(c.text||(typeof c==="string"?c:"")));list.append(p)}
function paintComments(){list.textContent="";const cs=cur.d.comments||[];if(!cs.length){const p=document.createElement("p");p.style.color="#6b7683";p.textContent="Henüz yorum yok. İlk yorumu siz yazın.";list.append(p);return}cs.forEach(addC)}
likeBtn.onclick=async()=>{if(!user){location.href="giris.html";return}
const d=cur.d,had=(d.likedUsers||[]).includes(user.uid);likeBtn.disabled=true;
try{await updateDoc(doc(db,"fotograflar",cur.id),{likes:increment(had?-1:1),likedUsers:had?arrayRemove(user.uid):arrayUnion(user.uid)});
d.likedUsers=had?(d.likedUsers||[]).filter(x=>x!==user.uid):[...(d.likedUsers||[]),user.uid];
d.likes=Math.max(0,(d.likes||0)+(had?-1:1));likeN.textContent=d.likes;cur.ov.textContent=stat(d);paintLike()
}catch(e){console.error(e)}finally{likeBtn.disabled=false}};
$("cForm").onsubmit=async e=>{e.preventDefault();if(!user){location.href="giris.html";return}
const text=cText.value.trim();if(!text)return;const c={user:user.displayName||"Üye",text};
try{await updateDoc(doc(db,"fotograflar",cur.id),{comments:arrayUnion(c)});
if(!(cur.d.comments||[]).length)list.textContent="";
(cur.d.comments=cur.d.comments||[]).push(c);addC(c);cText.value="";cur.ov.textContent=stat(cur.d)
}catch(err){console.error(err)}};
load();
