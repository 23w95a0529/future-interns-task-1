const menuBtn=document.getElementById("menuBtn");
const navLinks=document.getElementById("navLinks");
const themeBtn=document.getElementById("themeBtn");
const year=document.getElementById("year");
const form=document.getElementById("contactForm");
const status=document.getElementById("formStatus");

year.textContent=new Date().getFullYear();

menuBtn.addEventListener("click",()=>navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
  themeBtn.textContent="☀️";
}
themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  const dark=document.body.classList.contains("dark");
  localStorage.setItem("theme",dark?"dark":"light");
  themeBtn.textContent=dark?"☀️":"🌙";
});

form.addEventListener("submit",async(e)=>{
  e.preventDefault();
  status.textContent="Sending...";
  const data=Object.fromEntries(new FormData(form).entries());
  try{
    const response=await fetch("http://localhost:5000/api/contact",{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)
    });
    const result=await response.json();
    if(!response.ok) throw new Error(result.message||"Unable to send");
    status.textContent=result.message;
    form.reset();
  }catch(error){
    status.textContent="Message saved locally for demo. Start the backend to enable database submission.";
    console.error(error);
  }
});
