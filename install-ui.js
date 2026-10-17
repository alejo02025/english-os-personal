let installPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;document.querySelector('#install-app')?.classList.add('install-ready')});
window.addEventListener('appinstalled',()=>{installPrompt=null;document.querySelector('#install-dialog')?.remove()});
function installInstructions(){
 const apple=/iPhone|iPad|iPod/i.test(navigator.userAgent);
 const text=apple?'<p><strong>iPhone / iPad:</strong> Open this page in Safari, tap the Share button, then choose “Add to Home Screen”.</p><p><small>Abrí esta página en Safari, tocá Compartir y elegí “Agregar a pantalla de inicio”.</small></p>':'<p><strong>Chrome / Edge:</strong> Open the browser menu and choose “Install app” or “Add to Home Screen”.</p><p><small>Abrí el menú del navegador y elegí “Instalar aplicación” o “Agregar a pantalla de inicio”.</small></p>';
 document.querySelector('#install-dialog')?.remove();
 const wrap=document.createElement('div');wrap.id='install-dialog';wrap.className='install-dialog';wrap.innerHTML='<div class="install-content" role="dialog" aria-modal="true" aria-labelledby="install-title"><button class="install-close" aria-label="Close">×</button><img src="./icon.svg" alt="" width="62" height="62"><h2 id="install-title">Install English OS <small>Instalar English OS</small></h2>'+text+'<p class="install-warning">Your study data stays in this browser profile. Installing the app does not create cloud sync. <small>Tus datos se guardan en este navegador. Instalarla no agrega sincronización entre dispositivos.</small></p><button class="btn secondary install-dismiss">Got it <small>Entendido</small></button></div>';
 document.body.appendChild(wrap);wrap.querySelector('.install-close').onclick=()=>wrap.remove();wrap.querySelector('.install-dismiss').onclick=()=>wrap.remove();wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove()});
}
export function setupInstall(){
 if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('PWA offline cache unavailable:',error))}
 if(window.__englishInstallBound)return;
 window.__englishInstallBound=true;
 document.addEventListener('click',async e=>{if(!e.target.closest('#install-app'))return;if(window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone){installInstructions();return}if(installPrompt){const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();await prompt.userChoice}catch{installInstructions()}}else installInstructions()});
}
