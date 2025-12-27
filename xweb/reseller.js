//const API="http://localhost:8888";
const API="https://proxyweb-pgev.onrender.com";

async function login(){
  const username=u.value.trim();
  const accessKey=k.value.trim();

  const res=await fetch(`${API}/reseller/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({username,accessKey})
  });

  const data=await res.json();
  if(data.success){
    localStorage.setItem("rs_user",username);
    localStorage.setItem("rs_key",accessKey);
    window.location.href="reseller_panel.html"; // next page
  } else alert(data.message);
}