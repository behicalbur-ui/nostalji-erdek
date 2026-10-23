import{auth,db,ADMIN_EMAIL,CLOUD,thumb}from"./firebase.js";
import{collection,addDoc,getDocs,deleteDoc,doc,query,orderBy,serverTimestamp}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import{onAuthStateChanged}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const $=id=>document.getElementById(id);
onAuthStateChanged(auth,u=>{if(!u){location.href="giris.html";return}if(u.email!==ADMIN_EMAIL){location.href="arsiv.html";return}
$("gate").classList.add("hidden");$("panel").classList.remove("hidden");loadPosts();loadMsgs()});
async function list(col,box,render){box.textContent="";
try{const s=await getDocs(query(collection(db,col),orderBy("timestamp","desc")));if(s.empty){box.textContent="Kayıt yok.";return}
s.forEach(x=>{const r=document.createElement("div");r.className="row";const l=document.createElement("div");l.style.cssText="display:flex;gap:12px;align-items:center;min-width:0";render(x.data(),l);
const b=document.createElement("button");b.className="del";b.textContent="Sil";
b.onclick=async()=>{if(!confirm("Bu kaydı silmek istediğinize emin misiniz?"))return;try{await deleteDoc(doc(db,col,x.id));list(col,box,render)}catch(e){alert("Silinemedi: "+e.message)}};
r.append(l,b);box.append(r)})}catch(e){box.textContent="Yüklenemedi: "+e.message}}
const loadPosts=()=>list("fotograflar",$("posts"),(d,l)=>{const u=(d.imageUrls||[d.imageUrl])[0];if(u){const i=new Image();i.src=thumb(u,100);i.alt="";l.append(i)}const s=document.createElement("span");s.textContent=(d.description||"Açıklama yok").slice(0,70);l.append(s)});
const loadMsgs=()=>list("mesajlar",$("msgs"),(d,l)=>{const s=document.createElement("span");s.style.overflowWrap="anywhere";s.textContent=d.ad+" ("+d.eposta+"): "+d.mesaj;l.append(s)});
$("up").onclick=async()=>{const fs=[...$("files").files],b=$("up"),st=$("st");
if(!fs.length){st.className="msg err";st.textContent="Lütfen en az bir fotoğraf seçin.";return}
b.disabled=true;
try{const urls=[];for(const f of fs){b.textContent="Yükleniyor ("+(urls.length+1)+"/"+fs.length+")...";
const fd=new FormData();fd.append("file",f);fd.append("upload_preset",CLOUD.preset);
const r=await fetch("https://api.cloudinary.com/v1_1/"+CLOUD.name+"/image/upload",{method:"POST",body:fd});const j=await r.json();
if(!r.ok||!j.secure_url)throw new Error(j.error?.message||"Yükleme başarısız");urls.push(j.secure_url)}
await addDoc(collection(db,"fotograflar"),{imageUrls:urls,description:$("desc").value.trim(),likes:0,likedUsers:[],comments:[],timestamp:serverTimestamp()});
st.className="msg ok";st.textContent="Arşive eklendi.";$("files").value="";$("desc").value="";loadPosts()
}catch(e){st.className="msg err";st.textContent="Hata: "+e.message}finally{b.disabled=false;b.textContent="Yükle ve arşive ekle"}};
