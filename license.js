/* فحص الترخيص عن بُعد بالخلفية بدون تعطيل أو تأخير فتح المتجر للزبون */
(function () {
  var S = window.STORE || {};
  if (!S.licenseWorker || !S.license) return;
  var CK = "lic_cache_" + S.license, RECHECK = 10 * 6e4, last = 0, locked = false;
  var MSG = {
    expired: "الاشتراك منتهي",
    suspended: "الاشتراك موقوف",
    invalid: "الترخيص غير صالح"
  };
  function cache() { try { return JSON.parse(localStorage.getItem(CK) || "null"); } catch (e) { return null; } }
  function put(o) { try { localStorage.setItem(CK, JSON.stringify(o)); } catch (e) { } }
  function lock(reason) {
    if (locked) return; locked = true;
    try { window.stop(); } catch (e) { }
    try { if (window.firebase && firebase.apps.length) firebase.database().goOffline(); } catch (e) { }
    var t = MSG[reason] || MSG.invalid;
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + t + '</title></head>' +
      '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1220;color:#e8eefc;font-family:Cairo,Tahoma,sans-serif;text-align:center;padding:24px" dir="rtl">' +
      '<div><div style="font-size:56px">🔒</div><h2 style="margin:10px 0 6px">' + t + '</h2>' +
      '<p style="color:#8a9bbd;margin:0">تواصل مع المطور لتجديد الاشتراك</p></div></body>';
  }
  function check() {
    last = Date.now();
    var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
    fetch(S.licenseWorker.replace(/\/$/, "") + "/check?k=" + encodeURIComponent(S.license), { cache: "no-store", signal: ctl && ctl.signal })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(to);
        if (j && j.ok) { put({ ok: true, exp: j.exp, t: Date.now() }); }
        else if (j && j.reason) { put({ ok: false, t: Date.now() }); lock(j.reason); }
      })
      .catch(function () {
        clearTimeout(to);
        var c = cache();
        if (c && c.ok && c.exp < Date.now()) lock("expired");
      });
  }
  var c0 = cache();
  if (c0 && c0.ok === false) lock("invalid");
  check();
  document.addEventListener("visibilitychange", function () { if (!document.hidden && Date.now() - last > RECHECK) check(); });
  setInterval(function () { if (Date.now() - last > RECHECK) check(); }, RECHECK);
})();
