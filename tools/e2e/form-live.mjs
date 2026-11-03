import puppeteer from 'puppeteer-core';
import {mkdir,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
if(process.env.LIVE_FORM_SUBMIT!=='1')throw Error('Real submissions require explicit LIVE_FORM_SUBMIT=1 authorization; check existing API receipts before retrying.');
const out='tools/e2e/out';await mkdir(out,{recursive:true});
const r={started:new Date().toISOString(),forms:[],errors:[],failed:[],cleanup:false};let browser,profile;
const base='https://anastasialekasova-hub.github.io/url-builder-pages/';
try{profile=await mkdtemp(path.join(tmpdir(),'url-builder-forms-'));browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:true,userDataDir:profile,args:['--no-first-run','--no-default-browser-check']});r.browser=await browser.version();
const page=await browser.newPage();await page.setViewport({width:1280,height:1000});await page.setCacheEnabled(false);
page.on('pageerror',e=>r.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')r.errors.push(m.text())});page.on('requestfailed',q=>r.failed.push({url:q.url(),error:q.failure()?.errorText}));
for(const name of ['uninstall','feedback']){
 const item={name,marker:`test from Codex (setup check) URL Builder published ${name} 2026-11-03 v1`,posts:[]};r.forms.push(item);
 const onRequest=q=>{if(q.url().includes('/formResponse'))item.posts.push({url:q.url(),method:q.method(),payload:q.postData()});};page.on('request',onRequest);
 const response=await page.goto(base+name+'/',{waitUntil:'networkidle0',timeout:45000});item.http=response.status();if(item.http!==200)throw Error('Page HTTP '+name);
 await page.reload({waitUntil:'networkidle0',timeout:45000});
 item.config=await page.evaluate(async()=>{const res=await fetch('../assets/forms-config.js',{cache:'reload'});return {status:res.status,text:await res.text()};});item.configSha256=createHash('sha256').update(item.config.text).digest('hex');
 await page.waitForFunction(()=>!document.querySelector('button[type=submit]').disabled,{timeout:15000});
 if(name==='uninstall')await page.click('input[name=reason]');
 await page.type('textarea[name=comment]',item.marker);await page.click('button[type=submit]');
 await page.waitForFunction(()=>{const t=document.querySelector('.status').textContent;return t.includes('cannot confirm')||t.includes('could not be sent')},{timeout:25000});
 item.status=await page.$eval('.status',e=>e.textContent);item.finalUrl=page.url();item.buttonEnabled=await page.$eval('button[type=submit]',e=>!e.disabled);await page.screenshot({path:`${out}/${name}-published.png`,fullPage:true});page.off('request',onRequest);
 if(item.posts.length!==1||item.posts[0].method!=='POST'||!item.status.includes('cannot confirm')||item.finalUrl!==base+name+'/')throw Error('Submission transport '+name);
}
r.status='TRANSPORT_PASS_API_READBACK_REQUIRED';
}catch(e){r.status='FAIL';r.failure=e.stack;process.exitCode=1;}finally{if(browser)await browser.close();if(profile)await rm(profile,{recursive:true,force:true});r.cleanup=true;r.finished=new Date().toISOString();await writeFile(`${out}/form-live-receipt.json`,JSON.stringify(r,null,2));console.log(JSON.stringify(r));}
