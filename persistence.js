/* Local-first English OS data durability and manual transfer. No cloud sync. */
const DB_NAME='english-os-durable-v1', STORE='snapshots';
const STUDY_KEYS=[
  'english-os-v1',
  'english-os-foundations-a1a2',
  'english-os-foundation-writing',
  'english-os-words',
  'english-os-roadmap-v2'
];
function accountEmail(){try{return String(JSON.parse(localStorage.getItem('english-os-local-profile')||'{}').email||'').trim().toLowerCase()}catch{return ''}}
function accountKey(key){return accountEmail()+'::'+key}
function database(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(Error('IndexedDB unavailable'));const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function snapshotPut(key,value){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,accountKey(key));tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function snapshotGet(key){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(accountKey(key));req.onsuccess=()=>{db.close();resolve(req.result)};req.onerror=()=>{db.close();reject(req.error)}})}
export function persistStudyKey(key,value){localStorage.setItem(key,String(value));if(STUDY_KEYS.includes(key)&&accountEmail())void snapshotPut(key,String(value)).catch(()=>{})}
export async function initializeStudyData(){
 if(!accountEmail())return;
 for(const key of STUDY_KEYS){
  try{
   const current=localStorage.getItem(key);
   if(current===null){const previous=await snapshotGet(key);if(typeof previous==='string')localStorage.setItem(key,previous)}
   else await snapshotPut(key,current);
  }catch(err){console.warn('English OS local mirror unavailable',err)}
 }
 try{await navigator.storage?.persist?.()}catch{}
}
function pdfDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open('english-os-pdf-library',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('files'))req.result.createObjectStore('files',{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function getPdfs(){const db=await pdfDb();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readonly'),q=tx.objectStore('files').getAll();q.onsuccess=()=>{db.close();resolve(q.result||[])};q.onerror=()=>{db.close();reject(q.error)}})}
async function restorePdfs(records){const db=await pdfDb();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite'),store=tx.objectStore('files');for(const d of records){if(!d||typeof d.id!=='string'||!Array.isArray(d.pages)||typeof d.name!=='string')continue;store.put({id:d.id,name:d.name,pages:d.pages,created:d.created||'',notes:d.notes||''})}tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
export async function dataStatus(){
 const keys=STUDY_KEYS.filter(k=>localStorage.getItem(k)!==null);
 let documents=0;try{documents=(await getPdfs()).length}catch{}
 let persistent='unknown';try{persistent=await navigator.storage?.persisted?.()?'granted':'not guaranteed'}catch{}
 return {email:accountEmail(),keys:keys.length,documents,persistent};
}
export async function exportStudyBackup(){
 const records={};for(const key of STUDY_KEYS){const value=localStorage.getItem(key);if(value!==null)records[key]=value}
 const documents=await getPdfs().catch(()=>[]);
 const backup={format:'english-os-local-backup',version:3,exportedAt:new Date().toISOString(),email:accountEmail(),records,documents};
 const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download='english-os-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
 return {documents:documents.length,keys:Object.keys(records).length};
}
export async function importStudyBackup(file){
 if(!file||file.size>100*1024*1024)throw Error('Backup file is missing or too large. · Falta el archivo o es demasiado grande.');
 const data=JSON.parse(await file.text());
 if(data?.format!=='english-os-local-backup'||data.version!==3||!data.records||typeof data.records!=='object'||!Array.isArray(data.documents))throw Error('Invalid English OS backup. · El respaldo no tiene un formato válido.');
 if(data.email&&accountEmail()&&data.email.toLowerCase()!==accountEmail())throw Error('Backup email does not match this local profile. · El correo del respaldo no coincide con el del perfil.');
 const entries=Object.entries(data.records).filter(([key,val])=>STUDY_KEYS.includes(key)&&typeof val==='string');
 for(const [key,val] of entries){if(key!=='english-os-foundation-writing'){JSON.parse(val)}} 
 for(const [key,val] of entries)persistStudyKey(key,val);
 await restorePdfs(data.documents);
 return {keys:entries.length,documents:data.documents.length};
}
