import{auth,ADMIN_EMAIL}from"./firebase.js";
import{onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const pg=document.body.dataset.page,L=[["arsiv","Arşiv"],["hakkimizda","Hakkımızda"],["iletisim","İletişim"]];
document.body.insertAdjacentHTML("afterbegin",`<header class="nav"><a class="brand" href="index.html"><img src="logo.webp" alt=""><span>Nostalji Erdek</span></a><button class="burger" id="bg" aria-label="Menüyü aç" aria-expanded="false">☰</button><nav id="nv">${L.map(([p,t])=>`<a href="${p}.html"${p===pg?' class="on" aria-current="page"':""}>${t}</a>`).join("")}<a id="au" class="cta" href="giris.html">Giriş yap</a></nav></header>`);
document.body.insertAdjacentHTML("beforeend",`<footer class="foot"><div class="wrap"><b>Nostalji Erdek</b><span>© ${new Date().getFullYear()} Nostalji Erdek. Tüm hakları saklıdır.</span></div></footer>`);
const nv=document.getElementById("nv"),bg=document.getElementById("bg");
bg.onclick=()=>{const o=nv.classList.toggle("open");bg.setAttribute("aria-expanded",o)};
onAuthStateChanged(auth,u=>{const a=document.getElementById("au");nv.querySelector(".adm")?.remove();
if(u){a.textContent="Çıkış yap"+(u.displayName?" ("+u.displayName.split(" ")[0]+")":"");a.href="#";a.onclick=e=>{e.preventDefault();signOut(auth).then(()=>location.href="index.html")};
if(u.email===ADMIN_EMAIL)a.insertAdjacentHTML("beforebegin",'<a class="adm" href="admin.html">Yönetim</a>')}
else{a.textContent="Giriş yap";a.href="giris.html";a.onclick=null}});
