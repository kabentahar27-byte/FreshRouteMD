// Census documents JSONP because the public geocoder does not support CORS.
// Keep third-party executable JSONP in an opaque-origin sandbox, not the app DOM.
export type AddressMatch={address:string;coordinates:[number,number]};
export function locateAddress(address:string):Promise<AddressMatch[]>{return new Promise((resolve,reject)=>{
 const frame=document.createElement('iframe');frame.hidden=true;frame.setAttribute('sandbox','allow-scripts');frame.title='Optional Census address lookup';
 const token=crypto.randomUUID();const u=new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress');u.search=new URLSearchParams({address,benchmark:'Public_AR_Current',format:'jsonp',callback:'freshrouteCallback'}).toString();
 let timer:ReturnType<typeof setTimeout>;
 const cleanup=()=>{clearTimeout(timer);window.removeEventListener('message',receive);frame.remove()};
 const receive=(event:MessageEvent)=>{if(event.source!==frame.contentWindow||event.data?.token!==token)return;cleanup();if(event.data.error){reject(new Error('Address service unavailable. Try a ZIP code or browser location.'));return}const matches=event.data.matches;if(!Array.isArray(matches)){reject(new Error('Invalid address response.'));return}resolve(matches.filter(m=>typeof m.address==='string'&&Array.isArray(m.coordinates)&&m.coordinates.length===2&&m.coordinates.every(Number.isFinite)&&m.coordinates[0]>37.8&&m.coordinates[0]<39.8&&m.coordinates[1]>-79.6&&m.coordinates[1]<-75));};
 window.addEventListener('message',receive);timer=setTimeout(()=>{cleanup();reject(new Error('Address lookup timed out. Try a ZIP code or browser location.'))},15000);
 const script=`window.freshrouteCallback=function(data){parent.postMessage({token:${JSON.stringify(token)},matches:(data.result?.addressMatches||[]).map(m=>({address:m.matchedAddress,coordinates:[m.coordinates.y,m.coordinates.x]}))},'*')};var s=document.createElement('script');s.src=${JSON.stringify(u.href)};s.onerror=function(){parent.postMessage({token:${JSON.stringify(token)},error:true},'*')};document.body.appendChild(s);`;
 frame.srcdoc=`<!doctype html><html><body><script>${script.replace(/<\//g,'<\\/')}<\/script></body></html>`;document.body.appendChild(frame);
});}
