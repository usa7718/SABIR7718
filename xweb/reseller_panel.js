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

let rs_user = localStorage.getItem("rs_user");
let rs_key  = localStorage.getItem("rs_key");

if(!rs_user || !rs_key){
  alert("Not logged in!");
  window.location.href="reseller.html";
}

async function verifyReseller(){
  const username = localStorage.getItem("rs_user");
  const accessKey = localStorage.getItem("rs_key");

  if(!username || !accessKey){
    alert("Session expired — login again");
    return logout();
  }

  const res = await fetch(`${API}/reseller/login`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
  username,
  accessKey,
  deviceCode: await getDeviceCode()
})
  });

  const data = await res.json();

  if(!data.success){
    alert("⚠️ Reseller credentials invalid or expired!");
    return logout();
  }
}

/* ------------ LOAD USERS ----------- */
async function loadUsers(){
  const res = await fetch(`${API}/reseller/users`,{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify({
    username: rs_user,
    accessKey: rs_key,
    deviceCode: await getDeviceCode()
  })
});
  const users = await res.json();
  tbl.innerHTML = "";

  users.forEach(u=>{
  const expiry = new Date(u.expiry).toLocaleDateString();

  const usedCount = (u.devicesUsed || []).length;
  const limit = u.devicesAllowed === "unlimited"
    ? "∞"
    : u.devicesAllowed;

  const platform = u.platform || "both"; // fallback safety

  const devs = usedCount
    ? u.devicesUsed.map(d =>
        `<span title="${d}">${d.slice(0,8)}...${d.slice(-8)}</span>`
      ).join("<br>")
    : "—";

  tbl.innerHTML += `
<tr>
  <td>${u.username}</td>
  <td>${u.accessKey}</td>
  <td>${expiry}</td>
  <td>${limit}/${usedCount}</td>
  <td>${platform.toUpperCase()}</td>
  <td style="font-size:12px">${devs}</td>
  <td>
    <button class="small"
      onclick="editUser('${u.username}','${u.accessKey}')">
      Edit
    </button>
    <button class="small danger"
      onclick="deleteUser('${u.username}','${u.accessKey}')">
      Delete
    </button>
    <button class="small"
      onclick="clearUser('${u.username}','${u.accessKey}')">
      Clear
    </button>
  </td>
</tr>`;
});
}

/* ------------ ADD USER ----------- */
async function addUser(){
  const username=u.value.trim();
  const accessKey=k.value.trim();
  const expiry=e.value;
  const allowed=d.value.trim();

  if(!username||!accessKey||!expiry||!allowed)
    return alert("Fill all fields");

  const finalExp=new Date(expiry+"T23:59:59Z").toISOString();

  await fetch(`${API}/reseller/add`,{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify({
    username: rs_user,
    accessKey: rs_key,
    deviceCode: await getDeviceCode(),
    newUser: username,
    newKey: accessKey,
    expiry: finalExp,
    devicesAllowed: allowed
  })
});

  await verifyReseller();
loadUsers();
}

/* ------------ EDIT USER ----------- */
async function editUser(targetUser, targetKey){
  const newKey = prompt("New key?");
  const newExp = prompt("New expiry (YYYY-MM-DD)?");
  const newDeviceLimit = prompt("New limit? (number/unlimited)");

  const newExpiry = newExp
    ? new Date(newExp + "T23:59:59Z").toISOString()
    : null;

  const res = await fetch(`${API}/reseller/edit`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      username: rs_user,
      accessKey: rs_key,
      deviceCode: await getDeviceCode(),

      targetUser,
      targetKey,
      newKey,
      newExpiry,
      newDeviceLimit
    })
  });

  const data = await res.json();

  if(!res.ok){
    return alert(data.message || "❌ Edit failed");
  }

  alert("✅ User updated");
  loadUsers();
}

/* ------------ DELETE USER ----------- */
async function deleteUser(targetUser, targetKey){
  if(!confirm(`Delete ${targetUser}?`)) return;

  const res = await fetch(`${API}/reseller/delete`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      username: rs_user,
      accessKey: rs_key,
      deviceCode: await getDeviceCode(),

      targetUser,
      targetKey
    })
  });

  const data = await res.json();

  if(!res.ok){
    return alert(data.message || "❌ Delete failed");
  }

  alert("✅ User deleted");
  loadUsers();
}

/* ------------ CLEAR USER (DEVICE IDs) ----------- */
async function clearUser(targetUser, targetKey){
  if(!confirm(`Clear devices for ${targetUser}?`)) return;

  const res = await fetch(`${API}/reseller/clear`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      username: rs_user,
      accessKey: rs_key,
      deviceCode: await getDeviceCode(),

      targetUser,
      targetKey
    })
  });

  const data = await res.json();

  if(!res.ok){
    return alert(data.message || "❌ Clear failed");
  }

  alert("✅ Devices cleared");
  loadUsers();
}

/* ------------ LOGOUT ----------- */
function logout(){
  localStorage.removeItem("rs_user");
  localStorage.removeItem("rs_key");
  window.location.href="reseller.html";
}

// Run check before showing panel
(async () => {
  await verifyReseller();
  loadUsers();
})();
