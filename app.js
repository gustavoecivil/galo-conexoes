(()=>{"use strict";
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const onGitHubPreview=location.hostname.endsWith("github.io");const backdrop=$("#modalBackdrop"),modalTitle=$("#modalTitle"),modalDescription=$("#modalDescription"),modalKicker=$("#modalKicker");
const forms={signup:$("#signupForm"),post:$("#postForm"),partner:$("#partnerForm")},privacy=$("#privacyPanel"),result=$("#formResult");
let lastFocus=null,pendingPost=null,activeMode=null;
const TITLES={cadeiras:"Galo Cadeiras",camisas:"Galo Camisas",caronas:"Carona Alvinegra",metro:"Conexão Metrô",caravanas:"Caravanas & Viagens",bares:"O Jogo no Bar",servicos:"Atleticano Contrata Atleticano",canais:"Canais & Lives"};
const ACTIONS={oferecer:"oferecer",procurar:"procurar",organizar:"organizar",anunciar:"anunciar"};
function profile(){try{return JSON.parse(localStorage.getItem("gc_profile")||"null")}catch{return null}}
function randomId(){return window.crypto?.randomUUID?.()||"gc-"+Date.now()+"-"+Math.random().toString(16).slice(2)}
function setProfile(obj){localStorage.setItem("gc_profile",JSON.stringify(obj))}
function toast(message){const el=$("#toast");el.textContent=message;el.hidden=false;clearTimeout(window.__toastTimeout);window.__toastTimeout=setTimeout(()=>{el.hidden=true},4000)}
function setMode(mode){activeMode=mode;Object.values(forms).forEach(f=>f.hidden=true);privacy.hidden=true;result.hidden=true;
 if(mode==="signup"){modalKicker.textContent="FAÇA PARTE DA MASSA";modalTitle.textContent="Entre para as conexões.";modalDescription.textContent="Seu cadastro abre caminho para encontrar e oferecer oportunidades. Esta etapa coleta uma solicitação; ainda não valida sua identidade.";forms.signup.hidden=false;}
 if(mode==="post"){const m=$("#postModule").value,a=$("#postAction").value;modalKicker.textContent="UMA NOVA CONEXÃO";modalTitle.textContent=TITLES[m]||"Sua conexão";modalDescription.textContent="Você está prestes a "+(ACTIONS[a]||"registrar")+" uma conexão. A divulgação depende de revisão; esta versão recebe solicitações, mas ainda não exibe um mural público de anúncios.";forms.post.hidden=false;
 const note=m==="cadeiras"?"Cadeira: o valor será conferido com o maior preço integral de ingresso de cadeira divulgado oficialmente para o jogo (sem descontos e sem camarotes). A plataforma não aprova valores acima do teto. Nenhuma transferência de ingresso acontece por aqui.":m==="metro"?"Combine encontros em local público. Uber dividido é uma combinação entre passageiros; transporte remunerado exige verificações e autorizações aplicáveis.":m==="caronas"?"Carona gratuita ou com rateio de combustível/estacionamento. Não realizamos pagamentos nem validamos motoristas nesta versão.":m==="bares"?"Experiências de bares parceiros ainda não estão disponíveis para reserva e pagamento direto. Você pode registrar seu interesse.":"Seu pedido ficará pendente de moderação. Não envie dados sensíveis ou comprovantes financeiros.";$("#postNotice").textContent=note;
 }
 if(mode==="partner"){modalKicker.textContent="OPORTUNIDADE PARA NEGÓCIOS";modalTitle.textContent="Faça parte da rede.";modalDescription.textContent="Conte sobre seu estabelecimento ou empresa. Entraremos em contato para discutir condições comerciais e experiências.";forms.partner.hidden=false;}
 if(mode==="privacy"){modalKicker.textContent="TRANSPARÊNCIA E SEGURANÇA";modalTitle.textContent="Sua confiança vem primeiro.";modalDescription.textContent="Leia antes de divulgar dados ou realizar acordos.";privacy.hidden=false;}
}
function show(mode){lastFocus=document.activeElement;setMode(mode);backdrop.hidden=false;document.body.classList.add("modal-open");$("#closeModal").focus()}
function close(){backdrop.hidden=true;document.body.classList.remove("modal-open");lastFocus?.focus?.()}
function post(module,action){pendingPost={module,action};if(!profile()){toast("Para fazer uma conexão, registre-se primeiro.");show("signup");return}openPost(module,action)}
function openPost(module,action){$("#postModule").value=module;$("#postAction").value=action;forms.post.reset();$("#postModule").value=module;$("#postAction").value=action;show("post")}
function partner(type){if(type){$("#partnerType").value=type}show("partner")}
function cpfValid(value){let s=String(value).replace(/\D/g,"");if(s.length!==11||/^(\d)\1+$/.test(s))return false;for(let t=9;t<11;t++){let sum=0;for(let i=0;i<t;i++)sum+=Number(s[i])*(t+1-i);let d=(sum*10)%11;if(d===10)d=0;if(d!==Number(s[t]))return false}return true}
const cpfInput=$('input[name="cpf"]',forms.signup);
cpfInput.addEventListener("input",()=>{const s=cpfInput.value.replace(/\D/g,"").slice(0,11);cpfInput.value=s.replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");cpfInput.setCustomValidity("")});
cpfInput.addEventListener("blur",()=>{cpfInput.setCustomValidity(cpfInput.value&&!cpfValid(cpfInput.value)?"Informe um CPF válido.":"")});
async function digest(text){if(!crypto?.subtle)return "PROTOCOLO-"+randomId();const bytes=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-256",bytes);return Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,"0")).join("")}
async function submitForm(form){if(onGitHubPreview){toast("Prévia visual: formulários não enviam dados no GitHub Pages. O Netlify está bloqueado por limite de créditos.");return}const send=$('button[type="submit"]',form),oldText=send.textContent;send.disabled=true;send.textContent="Enviando...";
 try{
   const fd=new FormData(form),name=fd.get("form-name"),visitorId=profile()?.id||randomId();fd.set("visitor_id",visitorId);if(name==="torcedores"&&!cpfValid(fd.get("cpf"))){cpfInput.setCustomValidity("CPF inválido");cpfInput.reportValidity();throw new Error("Revise o CPF informado.")}
   let receipt="";if(name==="conexoes"){receipt=await digest([Date.now(),fd.get("modulo"),fd.get("titulo"),randomId()].join("|"));fd.set("comprovante",receipt)}
   fd.set("registrado_em",new Date().toISOString());
   const res=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(fd).toString()});
   if(!res.ok)throw new Error("O servidor retornou "+res.status+". Tente novamente.");
   Object.values(forms).forEach(f=>f.hidden=true);privacy.hidden=true;result.hidden=false;
   if(name==="torcedores"){const first=String(fd.get("nome")).trim().split(" ")[0];setProfile({id:visitorId,nome:first,analytics:fd.has("consent_analytics"),cadastro:new Date().toISOString()});$("#accountBtn").textContent="Olá, "+first;result.innerHTML='<h3>Você já começou a conectar.</h3><p>Seu pré-cadastro foi recebido. Nenhum CPF foi salvo neste dispositivo. Entraremos em contato conforme as permissões escolhidas.</p><button id="resultNext" type="button">Continuar →</button>';$("#resultNext").addEventListener("click",()=>{if(pendingPost){const p=pendingPost;pendingPost=null;openPost(p.module,p.action)}else close()});}
   else if(name==="conexoes"){result.innerHTML='<h3>Solicitação recebida.</h3><p>Seu anúncio ou pedido foi encaminhado para revisão. Isso não significa publicação automática ou confirmação de venda. As condições serão conferidas antes da divulgação.</p><p class="hash-note">Protocolo SHA-256 (não é registro em blockchain): <code id="receiptCode"></code></p><button id="copyReceipt" type="button">Copiar protocolo</button>';$("#receiptCode").textContent=receipt.slice(0,24)+"…";$("#copyReceipt").onclick=()=>{navigator.clipboard?.writeText(receipt).then(()=>toast("Protocolo copiado")).catch(()=>toast("Não foi possível copiar"))};}
   else{result.innerHTML='<h3>Contato recebido.</h3><p>A proposta comercial foi enviada para análise. Não há taxa cobrada ou parceria ativa até um acordo específico.</p>'}
   form.reset();toast("Enviado com sucesso.");
 }catch(e){toast(e.message||"Falha no envio. Tente novamente.");console.error("Falha no formulário",e)}
 finally{send.disabled=false;send.textContent=oldText}
}
$$("[data-open]").forEach(btn=>btn.addEventListener("click",()=>{let mode=btn.dataset.open;if(mode==="partner")partner(btn.dataset.partner);else if(mode==="signup"&&profile()){show("signup")}else show(mode)}));
$$("[data-post]").forEach(btn=>btn.addEventListener("click",()=>{const [m,a]=btn.dataset.post.split("|");post(m,a)}));
Object.values(forms).forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();if(f.reportValidity())submitForm(f)}));
$("#accountBtn").addEventListener("click",()=>show("signup"));
$("#closeModal").addEventListener("click",close);
backdrop.addEventListener("click",e=>{if(e.target===backdrop)close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!backdrop.hidden)close();if(e.key==="Tab"&&!backdrop.hidden){const focusables=$$('button:not([disabled]),input:not([disabled]),select,textarea,a[href]',backdrop).filter(el=>el.offsetParent!==null);if(!focusables.length)return;let first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}});
const search=$("#moduleSearch");function doSearch(){const query=search.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");let hits=0;$$(".module-card").forEach(card=>{const s=card.dataset.search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");const show=s.includes(query);card.hidden=!show;if(show)hits++});$("#emptyModules").hidden=hits>0}search.addEventListener("input",doSearch);$("#clearSearch").addEventListener("click",()=>{search.value="";doSearch();search.focus()});
$("#menuBtn").addEventListener("click",()=>{const nav=$("#mobileNav");nav.hidden=!nav.hidden;$("#menuBtn").setAttribute("aria-expanded",String(!nav.hidden))});
$$(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>{$("#mobileNav").hidden=true;$("#menuBtn").setAttribute("aria-expanded","false")}));
function logClick(target){const p=profile();if(onGitHubPreview||!p||!p.analytics)return;const obj=new URLSearchParams({"form-name":"eventos","visitor_id":p.id,"acao":"clique_link","destino":target,"quando":new Date().toISOString(),"bot-field":""});fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:obj.toString(),keepalive:true}).catch(()=>{});}
$$("a[data-track]").forEach(a=>a.addEventListener("click",()=>logClick(a.dataset.track)));
const p=profile();if(p)$("#accountBtn").textContent="Olá, "+p.nome;
if(onGitHubPreview){const alert=document.createElement("div");alert.style.cssText="background:#fff4d4;color:#262019;padding:12px 24px;text-align:center;font-size:12px;border-bottom:1px solid #d8bd80";alert.textContent="PRÉVIA VISUAL · Cadastro e anúncios ainda não recebem dados. Publicação Netlify aguarda liberação de créditos.";document.body.insertBefore(alert,document.body.firstChild)}if("serviceWorker" in navigator&&location.protocol==="https:")window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();