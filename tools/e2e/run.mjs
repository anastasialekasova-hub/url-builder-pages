import puppeteer from 'puppeteer-core';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=process.cwd(),out=path.join(root,'tools/e2e/out');await mkdir(out,{recursive:true});
const receipt={started:new Date().toISOString(),source:{},screens:[],forms:[],errors:[],failedRequests:[],externalRequests:[],externalResponses:[],cleanup:false};
for(const f of ['welcome/index.html','uninstall/index.html','feedback/index.html','assets/pages.css','assets/forms.js','assets/forms-config.js','assets/icon128.png','assets/newsletter-copy.png'])receipt.source[f]=createHash('sha256').update(await readFile(f)).digest('hex');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png'};
const server=http.createServer(async(req,res)=>{try{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,'.'+rel);if(!file.startsWith(root+path.sep))throw Error('path');const b=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(b);}catch{res.writeHead(404);res.end('missing');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
let browser,profile;
const assert=(b,m)=>{if(!b)throw Error(m)};
try{
 assert(process.env.CHROME_PATH,'CHROME_PATH required');profile=await mkdtemp(path.join(os.tmpdir(),'url-builder-pages-build-'));
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:true,userDataDir:profile,args:['--no-first-run','--no-default-browser-check']});receipt.browser=await browser.version();receipt.platform=os.platform()+' '+os.release();
 const page=await browser.newPage();
 // One real online probe, never silently replace a blocked third-party script.
 await page.setRequestInterception(true);let offline=false;
 page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')){receipt.externalRequests.push({url:r.url(),phase:offline?'isolated':'online'});if(offline)return r.respond({status:200,contentType:'application/javascript',body:'/* Explicit offline analytics fixture; not a live Umami verification. */'});}r.continue();});
 page.on('requestfailed',r=>receipt.failedRequests.push({url:r.url(),error:r.failure()?.errorText,phase:offline?'isolated':'online'}));
 page.on('response',r=>{if(!r.url().startsWith(base))receipt.externalResponses.push({url:r.url(),status:r.status(),phase:offline?'isolated':'online'});if(r.status()>=400)receipt.errors.push({message:r.status()+' '+r.url(),phase:offline?'isolated':'online'});});
 page.on('pageerror',e=>receipt.errors.push({message:e.message,phase:offline?'isolated':'online'}));page.on('console',m=>{if(m.type()==='error')receipt.errors.push({message:m.text(),phase:offline?'isolated':'online'});});
 try {await page.goto(base+'/welcome/',{waitUntil:'networkidle0',timeout:18000});receipt.onlineProbe='loaded';}catch(e){receipt.onlineProbe=e.message;}
 await page.goto('about:blank',{waitUntil:'load'});offline=true;
 for(const name of ['welcome','uninstall','feedback'])for(const [size,width,height] of [['desktop',1280,1000],['mobile',390,844]]){
  const response=await page.goto(base+'/'+name+'/',{waitUntil:'networkidle0',timeout:15000});await page.setViewport({width,height,deviceScaleFactor:1});await page.evaluate(()=>document.fonts.ready);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),lang:document.documentElement.lang,h1:document.querySelector('h1').innerText,links:[...document.querySelectorAll('a')].map(a=>a.href)}));
  assert(response.status()===200&&layout.scrollWidth<=width&&layout.images&&layout.lang==='en','layout '+name+' '+size);await page.screenshot({path:path.join(out,`${name}-${size}.png`),fullPage:true});receipt.screens.push({name,size,http:response.status(),...layout});
 }
 for(const name of ['uninstall','feedback']){
  await page.goto(base+'/'+name+'/',{waitUntil:'networkidle0'});
  const unavailable=await page.evaluate(()=>({disabled:document.querySelector('button').disabled,note:document.querySelector('.form-note').textContent,required:document.querySelector('textarea').required}));assert(unavailable.disabled&&unavailable.note.includes('Nothing will be sent'),'unavailable '+name);
  const branches=await page.evaluate(async(name)=>{
   const {bindFeedback}=await import('/assets/forms.js');const original=document.querySelector('form');const form=original.cloneNode(true);original.replaceWith(form);
   const mock={formId:'LOCAL_TEST_ONLY',commentEntry:'entry.123',...(name==='uninstall'?{reasonEntry:'entry.456'}:{})};let mode='success',calls=[];
   bindFeedback(form,mock,async(url,options)=>{calls.push({url,body:String(options.body),method:options.method,mode:options.mode,credentials:options.credentials});if(mode==='failure')throw Error('Injected local transport failure');return {type:'opaque'};});
   const textarea=form.querySelector('textarea'),button=form.querySelector('button');const emptyInvalid=!form.checkValidity();
   if(name==='feedback'){form.requestSubmit();if(calls.length)throw Error('Required field submitted');}
   textarea.value='Make newsletter channels easier to reuse.';if(name==='uninstall')form.querySelector('input').checked=true;
   form.requestSubmit();await new Promise(r=>setTimeout(r,0));const success=form.querySelector('.status').textContent;
   mode='failure';form.requestSubmit();await new Promise(r=>setTimeout(r,0));const failure=form.querySelector('.status').textContent;
   return {emptyInvalid,success,failure,calls,enabledAfterFailure:!button.disabled,fields:{textareas:form.querySelectorAll('textarea').length,inputs:form.querySelectorAll('input').length}};
  },name);
  assert(branches.success.includes('cannot confirm')&&branches.failure.includes('could not be sent')&&branches.calls.length===2&&branches.enabledAfterFailure,'mock branches '+name);
  if(name==='feedback')assert(branches.emptyInvalid&&branches.fields.inputs===0&&branches.fields.textareas===1,'feedback required/shape');
  receipt.forms.push({name,unavailable,mockOnly:true,...branches});await page.screenshot({path:path.join(out,`${name}-mock-failure.png`),fullPage:true});
 }
 assert(!receipt.failedRequests.some(x=>x.phase==='isolated')&&!receipt.errors.some(x=>x.phase==='isolated'),'isolated errors');
 assert(!receipt.externalRequests.some(x=>x.url.includes('docs.google.com')),'real feedback request forbidden');
 receipt.status='PASS';receipt.onlineAnalytics=receipt.failedRequests.some(x=>x.phase==='online')||receipt.errors.some(x=>x.phase==='online')?'LIMITED: real online probe failed; isolated render uses an explicit script fixture.':'PASS: online script request completed; analytics dashboard/event persistence not verified.';
}catch(e){receipt.status='FAIL';receipt.failure=e.stack;process.exitCode=1;}finally{
 if(browser)await browser.close();if(profile)await rm(profile,{recursive:true,force:true});await new Promise(r=>server.close(r));receipt.cleanup=true;receipt.finished=new Date().toISOString();await writeFile(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify({status:receipt.status,screens:receipt.screens.length,forms:receipt.forms.length,errors:receipt.errors,failedRequests:receipt.failedRequests,onlineAnalytics:receipt.onlineAnalytics,cleanup:receipt.cleanup,failure:receipt.failure}));
}
