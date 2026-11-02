/* إعدادات المتجر — هذا الملف الوحيد الذي يُعدَّل لكل عميل */
window.STORE = {
  name: "مجمع البسام",            // اسم المتجر (موقع + تطبيق + فواتير)
  color: "#0A3622",               // لون التطبيق الأساسي (أندرويد)
  social: "albsam_store",         // يوزر السوشيال
  pagesUrl: "https://bsamjasm.github.io/albsam_store/", // رابط الموقع (GitHub Pages)
  apkUrl: "https://github.com/bsamjasm/albsam_store/releases/download/store-apk/AlbsamStore.apk",
  packageName: "com.albsam.store", // حزمة التطبيق (فريدة لكل عميل)
  tgWorker: "https://albsam-notify.bsamjasmdell.workers.dev", // Cloudflare Worker الخاص بالعميل
  pushWorker: "https://albsam-push.bsamjasmdell.workers.dev",// رابط Worker الإشعارات (albsam-push) — فارغ = فحص دوري
    license: "v2dgkec743",
  licenseWorker: "https://licenses.bsamjasmdell.workers.dev",
  firebase: {
    apiKey: "AIzaSyClvOaY6x1ti_pSSi27bfTuQGuT9oaqJFs",
    authDomain: "albsam-store.firebaseapp.com",
    projectId: "albsam-store",
    databaseURL: "https://albsam-store-default-rtdb.firebaseio.com/"
  },
  supabase: {
    url: "https://oqlmptbmvqmmpwbbmohb.supabase.co",
    key: "sb_publishable_DalYbdSFkwro5UOuZhkSTw_aW8Y6bry"
  }
};
/* استبدال الاسم واليوزر المكتوبين بالصفحات الثابتة (يعمل بالمتصفح فقط) */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var S = window.STORE, N0 = "مجمع البسام", H0 = "albsam_store";
    function fix(v) { return v && (v.indexOf(N0) > -1 || v.indexOf(H0) > -1) ? v.split(N0).join(S.name).split(H0).join(S.social) : v; }
    document.title = fix(document.title);
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) { var t = fix(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; }
    document.querySelectorAll("[href],[content],[title],[alt],[placeholder]").forEach(function (e) {
      ["href", "title", "alt", "placeholder"].forEach(function (a) { var v = e.getAttribute(a); if (v) { var t = fix(v); if (t !== v) e.setAttribute(a, t); } });
    });
    document.querySelectorAll("meta[content]").forEach(function (m) { m.content = fix(m.content); });
  });
}
