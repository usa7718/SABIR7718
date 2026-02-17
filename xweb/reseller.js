const API="https://proxyweb-pgev.onrender.com";

async function getDeviceCode() {
  const saved = localStorage.getItem("deviceCode");
  if (saved && saved.length === 64) return saved;

  const safe = v =>
    v !== undefined && v !== null && v !== "" ? v : "0";

  const parts = [
    safe(navigator.userAgent),
    safe(navigator.language),
    safe(screen.width),
    safe(screen.height),
    safe(screen.colorDepth),
    safe(navigator.hardwareConcurrency),
    safe(navigator.deviceMemory),
    safe(Intl.DateTimeFormat().resolvedOptions().timeZone),
    safe(new Date().getTimezoneOffset())
  ].join("|");

  const encoded = new TextEncoder().encode(parts);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);

  const dc = [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  localStorage.setItem("deviceCode", dc);
  return dc;
}

async function login(){
  const username=u.value.trim();
  const accessKey=k.value.trim();
  const deviceCode = await getDeviceCode();

  const res=await fetch(`${API}/reseller/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
     body: JSON.stringify({
     username,
     accessKey,
     deviceCode
})
  });

  const data=await res.json();
  if(data.success){
    localStorage.setItem("rs_user",username);
    localStorage.setItem("rs_key",accessKey);
    window.location.href="reseller_panel.html"; // next page
  } else alert(data.message);
}
