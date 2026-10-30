ATUL KUMAR MATTRESS OPERATOR & CONTRACTORS — WEBSITE STARTER

इस ZIP में responsive website, mobile layout, Firebase OTP login और admin content editor का starter है।

महत्वपूर्ण:
1) index.html को सीधे file manager से खोलने पर Firebase OTP काम नहीं करेगा। वेबसाइट को HTTPS hosting (जैसे Firebase Hosting या Netlify) पर publish करना होगा।
2) Firebase Console > Project settings > General > Your apps में Web App बनाकर Firebase config लें। app.js में apiKey, messagingSenderId और appId भरें। authDomain/projectId/storageBucket की पुष्टि भी करें।
3) Firebase Console > Authentication > Sign-in method में Phone provider enable करें। Authentication > Settings > Authorized domains में अपनी hosting domain जोड़ें।
4) Firestore Database और Storage enable करें। नीचे दिए गए rules publish करें।
5) पहले website पर अपने मोबाइल से OTP login करें। Firebase Authentication > Users में उस user का UID कॉपी करें। Firestore में admins नाम का collection बनाएं और document ID में वही UID डालें। Document में enabled: true लिखें। Admin document Console से project owner ही बनाए। इसके बाद Admin Login से editor खुलेगा।
6) Phone OTP SMS पर Firebase/Google की billing, quota और region conditions लागू हो सकती हैं। OTP अभी आपके प्रोजेक्ट में चालू/काम कर रहा है, इसकी पुष्टि hosting पर टेस्ट करके करें।
7) वीडियो ऑटो-प्ले browser policy के कारण muted शुरू होता है। यूज़र Play Video दबाकर आवाज़ चालू कर सकता है।

FIRESTORE RULES (Firebase Console > Firestore > Rules)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }
    match /siteContent/{docId} {
      allow read: if docId == 'main';
      allow create, update: if docId == 'main' && isAdmin();
      allow delete: if false;
    }
  }
}

STORAGE RULES (Firebase Console > Storage > Rules)

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null &&
        firestore.exists(/databases/(default)/documents/admins/$(request.auth.uid));
    }
    match /site-media/{fileName=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 100 * 1024 * 1024;
    }
  }
}

CONTACT DETAILS:
Admin panel में अपना सही phone, email और Facebook URL भरें। फिलहाल contact buttons खाली हैं ताकि गलत नंबर न दिखे।

PUBLISH:
- इस folder को hosting पर upload करें (Netlify Drop या Firebase Hosting)।
- Firebase Authentication में hosting domain authorized करें।
- OTP और Admin upload को वास्तविक hosting URL पर test करें।

NOTE: Rates/contract details अभी Admin panel में save होते हैं; अगले design update में इनके लिए public rate card section जोड़ा जा सकता है।
