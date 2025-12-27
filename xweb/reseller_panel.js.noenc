//const API="http://localhost:8888";
const API="https://proxyweb-pgev.onrender.com";

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
    body: JSON.stringify({ username, accessKey })
  });

  const data = await res.json();

  if(!data.success){
    alert("⚠️ Reseller credentials invalid or expired!");
    return logout();
  }
}

/* ------------ LOAD USERS ----------- */
async function loadUsers(){
  const res = await fetch(`${API}/admin/users`);
  const users = await res.json();
  tbl.innerHTML = "";

  users.forEach(u=>{
    const expiry = new Date(u.expiry).toLocaleDateString();

    // remove null/empty junk
    const cleanDevices = (u.devicesUsed || []).filter(d => d && typeof d === "string");

    // shorten display
    const devs = cleanDevices.length
      ? cleanDevices.map(d => `<span title="${d}">${d.slice(0,8)}...${d.slice(-8)}</span>`).join("<br>")
      : "—";

    tbl.innerHTML += `
      <tr>
        <td>${u.username}</td>
        <td>${u.accessKey}</td>
        <td>${expiry}</td>
        <td>${u.devicesAllowed}</td>
        <td>${cleanDevices.length}</td>
        <td style="font-size:12px">${devs}</td>
        <td>
          <button class="small" onclick="editUser('${u.username}')">Edit</button>
          <button class="small danger" onclick="deleteUser('${u.username}')">Delete</button>
          <button class="small" onclick="clearUser('${u.username}')">Clear</button>
        </td>
      </tr>
    `;
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

  await fetch(`${API}/admin/add`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({username,accessKey,expiry:finalExp,devicesAllowed:allowed})
  });

  await verifyReseller();
loadUsers();
}

/* ------------ EDIT USER ----------- */
async function editUser(username){
  const newKey=prompt("New key?");
  const newExp=prompt("New expiry (YYYY-MM-DD)?");
  const newLimit=prompt("New limit? (number/unlimited)");

  let expiry=newExp?new Date(newExp+"T23:59:59Z").toISOString():null;

  await fetch(`${API}/admin/edit`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({username,accessKey:newKey,expiry,devicesAllowed:newLimit})
  });

  await verifyReseller();
loadUsers();
}

/* ------------ DELETE USER ----------- */
async function deleteUser(username){
  if(!confirm(`Delete ${username}?`))return;

  await fetch(`${API}/admin/delete`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({username})
  });
  await verifyReseller();
loadUsers();
}

/* ------------ CLEAR USER (DEVICE IDs) ----------- */
async function clearUser(username){
  if(!confirm(`Clear devices for ${username}?`))return;

  await fetch(`${API}/admin/clear`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({username})
  });

  await verifyReseller();
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