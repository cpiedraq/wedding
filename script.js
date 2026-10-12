// ✏️ Edita aquí los datos de la boda. También puedes personalizar el enlace: ?para=Nombre&cupos=3
const BODA={novia:"Priscilla",novio:"Nelson",fecha:"2027-04-17",limite:"2027-04-17",whatsapp:"50600000000",cupos:2,
 agenda:[["14:30","Ceremonia",0],["15:30","Recepción",1],["16:30","Brindis",2],["17:00","Almuerzo",3],["18:30","Fiesta",4]]};
const $=id=>document.getElementById(id), q=new URLSearchParams(location.search);
const [y,m,d]=BODA.fecha.split("-").map(Number);
const cupos=Math.max(1,parseInt(q.get("cupos"))||BODA.cupos);
const fmtH=t=>{const[h,mi]=t.split(":").map(Number);return `${((h+11)%12)+1}:${String(mi).padStart(2,"0")} ${h<12?"a. m.":"p. m."}`};
const fmtF=(Y,M,D)=>new Date(Y,M-1,D).toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});
$("n1").textContent=BODA.novia;$("n2").textContent=BODA.novio;
$("m1").textContent=BODA.novia[0];$("m2").textContent=BODA.novio[0];
document.title=`${BODA.novia} y ${BODA.novio} · Nuestra boda`;
$("fechaTxt").textContent=fmtF(y,m,d);
$("hCer").textContent=fmtH(BODA.agenda[0][0]);$("hRec").textContent=fmtH(BODA.agenda[1][0]);
const[ly,lm,ld]=BODA.limite.split("-").map(Number);$("limite").textContent=fmtF(ly,lm,ld);
$("cupos").textContent=cupos;$("acomp").max=cupos-1;$("gAcomp").hidden=cupos<2;
if(q.get("para"))$("nombre").value=q.get("para");
$("tl").innerHTML=BODA.agenda.map(([t,n,i],k)=>`<li class="${k%2?"r":""}"><svg class="ic" viewBox="0 0 44 44" aria-hidden="true"><use href="#i${i}"/></svg><span class="nd" aria-hidden="true">♥</span><div class="tx"><b>${fmtH(t)}</b>${n}</div></li>`).join("");

// Sobre de entrada
const intro=$("intro");document.documentElement.classList.add("lock");
$("seal").addEventListener("click",()=>{intro.classList.add("open");document.documentElement.classList.remove("lock");setTimeout(()=>intro.hidden=true,1300)});

// Cuenta regresiva
const[hh,mm]=BODA.agenda[0][0].split(":").map(Number),target=new Date(y,m-1,d,hh,mm);
function tick(){const now=new Date();
 if(now>=target){["cM","cD","cH","cMin","cS"].forEach(i=>$(i).textContent="0");$("done").hidden=false;return}
 let mo=(target.getFullYear()-now.getFullYear())*12+target.getMonth()-now.getMonth(),b=new Date(now);b.setMonth(b.getMonth()+mo);
 if(b>target){mo--;b=new Date(now);b.setMonth(b.getMonth()+mo)}
 let df=target-b;const dd=Math.floor(df/864e5);df-=dd*864e5;const h=Math.floor(df/36e5);df-=h*36e5;const mi=Math.floor(df/6e4);df-=mi*6e4;
 $("cM").textContent=mo;$("cD").textContent=dd;$("cH").textContent=h;$("cMin").textContent=mi;$("cS").textContent=Math.floor(df/1000)}
tick();setInterval(tick,1000);

// Formulario
document.querySelectorAll('input[name="asiste"]').forEach(r=>r.addEventListener("change",()=>{if(cupos>1)$("gAcomp").hidden=r.value.startsWith("No")&&r.checked}));
$("rsvp").addEventListener("submit",e=>{e.preventDefault();
 const nombre=$("nombre").value.trim(),sel=document.querySelector('input[name="asiste"]:checked');
 $("eNombre").textContent=nombre?"":"Escribe tu nombre completo.";$("eAsiste").textContent=sel?"":"Elige una opción.";
 if(!nombre||!sel)return;
 const va=sel.value.startsWith("Sí"),ac=va&&cupos>1?Math.min($("acomp").value||0,cupos-1):0,resp=$("resp").value.trim(),msg=$("msg").value.trim();
 try{localStorage.setItem("rsvp-boda",JSON.stringify({nombre,asiste:sel.value,ac,resp,msg}))}catch(_){}
 const t=`Hola, soy ${nombre}. ${sel.value}.`+(va?` Acompañantes: ${ac}.`:"")+(resp?` Restricciones: ${resp}.`:"")+(msg?` Mensaje: ${msg}`:"");
 $("wa").href=`https://wa.me/${BODA.whatsapp}?text=${encodeURIComponent(t)}`;
 $("tNombre").textContent=nombre.split(" ")[0];
 $("tTxt").textContent=va?"Nos hace muy felices que nos acompañes. Envía tu confirmación por WhatsApp para que la recibamos.":"Lamentamos que no puedas venir. Envía tu respuesta por WhatsApp para avisarnos.";
 $("rsvp").hidden=true;$("thanks").hidden=false;$("thanks").scrollIntoView({behavior:"smooth",block:"center"})});