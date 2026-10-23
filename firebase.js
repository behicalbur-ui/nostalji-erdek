import{initializeApp}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import{getAuth}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import{getFirestore}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
const app=initializeApp({apiKey:"AIzaSyBAiG08P8M_a6yaAAhJbYMCUqVPmn7KVE4",authDomain:"nostaljierdek-60f5b.firebaseapp.com",projectId:"nostaljierdek-60f5b",storageBucket:"nostaljierdek-60f5b.firebasestorage.app",messagingSenderId:"671939663155",appId:"1:671939663155:web:a01245b5a353b1f35e5a46"});
export const auth=getAuth(app),db=getFirestore(app);
export const ADMIN_EMAIL="behicalbur@gmail.com";
export const CLOUD={name:"uxk86ov1",preset:"nostalji-erdek"};
export const thumb=(u,w=480)=>String(u).replace("/upload/","/upload/c_fill,w_"+w+",h_"+w+",f_auto,q_auto/");
export const full=u=>String(u).replace("/upload/","/upload/f_auto,q_auto,w_1400/");
