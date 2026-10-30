// Firebase setup: paste your Firebase Web App config in firebaseConfig below.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCmeziF1M-i7hlRlvAV5EyFbZ0FBZj3a1U',
  authDomain: 'atul-kumar-official.firebaseapp.com',
  projectId: 'atul-kumar-official',
  storageBucket: 'atul-kumar-official.firebasestorage.app',
  messagingSenderId: '133890724145',
  appId: '1:133890724145:web:0d68ff61c249354574e010',
  measurementId: 'G-EC0R4BM5V7'
};
const configured = !firebaseConfig.apiKey.startsWith('PASTE_') && !firebaseConfig.appId.startsWith('PASTE_');
let auth, db, storage, confirmation, recaptcha;
if (configured) { const app=initializeApp(firebaseConfig); auth=getAuth(app); db=getFirestore(app); storage=getStorage(app); }
const $=id=>document.getElementById(id);
$('year').textContent=new Date().getFullYear();
$('menuBtn').onclick=()=>$('nav').classList.toggle('open');
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
function modal(id,show){$(id).classList.toggle('show',show);$(id).setAttribute('aria-hidden',String(!show));}
$('openLogin').onclick=$('footerLogin').onclick=()=>{modal('loginModal',true);if(!configured)$('loginMessage').textContent='Firebase Web App config पहले app.js में जोड़ें।';};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal(b.dataset.close,false));
$('playVideo').onclick=()=>{const v=$('heroVideo');v.muted=false;v.controls=true;v.play().catch(()=>{});};
let content={heading:'Mattress Manufacturing Operator & Contractor',heroText:'Professional mattress machine operation and contract services. Reliable work, skilled operation and quality-focused results.',years:'10–15',experienceText:'Experienced mattress operators providing dependable manufacturing and contractor services.',phone:'',email:'',facebook:'',rates:'',heroVideo:'',gallery:[]};
function render(){const safeHeading=(content.heading||'Mattress Operator & Contractor').replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));document.querySelector('h1').innerHTML=safeHeading.replace(' Operator','<br><em>Operator').replace(' Contractor',' Contractor</em>');$('heroText').textContent=content.heroText||'';$('experienceYears').innerHTML=(content.years||'').replaceAll('<','&lt;')+'<small>YEARS EXPERIENCE</small>';$('experienceText').textContent=content.experienceText||'';$('ratesText').textContent=content.rates||'Contact us for current rates and contract details.';if(content.heroVideo){$('heroVideo').src=content.heroVideo;$('heroVideo').load();$('heroVideo').play().catch(()=>{});}else{$('heroVideo').removeAttribute('src');}
const p=(content.phone||'').replace(/\D/g,'');$('callLink').href=p?'tel:+'+p:'#';$('waLink').href=p?'https://wa.me/'+p:'#';$('mailLink').href=content.email?'mailto:'+content.email:'#';$('fbLink').href=content.facebook||'#';$('fbLink').style.opacity=content.facebook?1:.45;
const grid=$('galleryGrid');grid.innerHTML='';if(!(content.gallery||[]).length){grid.innerHTML='<div class="empty-gallery">Your work photos and videos will appear here after you add them from Admin Login.</div>';return;}content.gallery.forEach(item=>{const el=document.createElement(item.type==='video'?'video':'img');el.src=item.url;if(item.type==='video'){el.controls=true;el.playsInline=true;}el.alt='Mattress work gallery';grid.append(el);});}
render();
async function loadContent(){if(!configured)return;try{const snap=await getDoc(doc(db,'siteContent','main'));if(snap.exists()){content={...content,...snap.data()};render();}}catch(e){console.warn('Public content could not be loaded:',e.message);}}
loadContent();
function showMessage(id,msg){$(id).textContent=msg;}
$('sendOtp').onclick=async()=>{if(!configured){showMessage('loginMessage','Firebase Web App config जोड़ना बाकी है। README देखें।');return;}const phone=$('phoneNumber').value.replace(/\D/g,'');if(phone.length!==10){showMessage('loginMessage','कृपया 10 अंकों का मोबाइल नंबर डालें।');return;}try{if(!recaptcha)recaptcha=new RecaptchaVerifier(auth,'recaptcha-container',{size:'normal'});await recaptcha.render();confirmation=await signInWithPhoneNumber(auth,'+91'+phone,recaptcha);$('otpArea').classList.remove('hidden');showMessage('loginMessage','OTP भेज दिया गया है।');}catch(e){showMessage('loginMessage','OTP नहीं भेज पाए: '+e.message);}};
$('verifyOtp').onclick=async()=>{try{if(!confirmation)throw new Error('पहले OTP भेजें।');await confirmation.confirm($('otpCode').value.trim());}catch(e){showMessage('loginMessage','OTP सत्यापित नहीं हुआ: '+e.message);}};
if(configured) onAuthStateChanged(auth,async user=>{if(!user)return;try{const admin=await getDoc(doc(db,'admins',user.uid));if(admin.exists()){modal('loginModal',false);modal('adminModal',true);fillAdmin();}else{showMessage('loginMessage','यह नंबर अभी Admin के रूप में स्वीकृत नहीं है।');await signOut(auth);}}catch(e){showMessage('loginMessage','Admin access जाँच नहीं हो सकी: '+e.message);}});
function fillAdmin(){$('editHeading').value=content.heading;$('editHeroText').value=content.heroText;$('editYears').value=content.years;$('editExperience').value=content.experienceText;$('editPhone').value=content.phone;$('editEmail').value=content.email;$('editFacebook').value=content.facebook;$('editRates').value=content.rates;}
async function upload(file,path){const r=ref(storage,path);await uploadBytes(r,file);return await getDownloadURL(r);}
$('saveContent').onclick=async()=>{if(!auth?.currentUser)return;const btn=$('saveContent');btn.disabled=true;showMessage('saveMessage','Saving…');try{let heroVideo=content.heroVideo;const vf=$('videoFile').files[0];if(vf)heroVideo=await upload(vf,'site-media/hero-'+Date.now()+'-'+vf.name.replace(/[^a-zA-Z0-9._-]/g,'_'));
let gallery=[...(content.gallery||[])];for(const f of $('galleryFiles').files){const url=await upload(f,'site-media/gallery-'+Date.now()+'-'+f.name.replace(/[^a-zA-Z0-9._-]/g,'_'));gallery.push({url,type:f.type.startsWith('video/')?'video':'image'});}
content={...content,heading:$('editHeading').value.trim(),heroText:$('editHeroText').value.trim(),years:$('editYears').value.trim(),experienceText:$('editExperience').value.trim(),phone:$('editPhone').value.trim(),email:$('editEmail').value.trim(),facebook:$('editFacebook').value.trim(),rates:$('editRates').value.trim(),heroVideo,gallery};await setDoc(doc(db,'siteContent','main'),content);render();showMessage('saveMessage','Website update हो गई।');}catch(e){showMessage('saveMessage','Save नहीं हुआ: '+e.message);}finally{btn.disabled=false;}};
$('logoutBtn').onclick=async()=>{await signOut(auth);modal('adminModal',false);};
