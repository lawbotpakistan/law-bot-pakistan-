"use strict";(()=>{var e={};e.id=405,e.ids=[405,888,660],e.modules={262:(e,t,r)=>{r.r(t),r.d(t,{config:()=>m,default:()=>c,getServerSideProps:()=>h,getStaticPaths:()=>g,getStaticProps:()=>x,reportWebVitals:()=>b,routeModule:()=>f,unstable_getServerProps:()=>_,unstable_getServerSideProps:()=>P,unstable_getStaticParams:()=>y,unstable_getStaticPaths:()=>w,unstable_getStaticProps:()=>S});var s={};r.r(s),r.d(s,{default:()=>Home});var a=r(93),n=r(244),o=r(323),i=r(209),l=r.n(i),p=r(337),u=r.n(p);let d=require("react/jsx-runtime");function Home(){return(0,d.jsxs)("div",{style:{fontFamily:"Arial, sans-serif",padding:"40px",textAlign:"center"},children:[d.jsx("h1",{children:"⚖️ LawBot Pakistan"}),d.jsx("p",{children:"Get instant legal help, documents, and video resources."}),d.jsx("textarea",{id:"userQuery",rows:"4",cols:"50",placeholder:"Type your question here...",style:{padding:"10px",width:"80%",borderRadius:"8px"}}),d.jsx("br",{}),d.jsx("button",{style:{marginTop:"10px",padding:"10px 20px",borderRadius:"6px",backgroundColor:"#0070f3",color:"white",border:"none",cursor:"pointer"},onClick:()=>askLawBot(),children:"Ask LawBot"}),d.jsx("p",{id:"responseBox",style:{marginTop:"20px"},children:"Answer will appear here..."}),(0,d.jsxs)("p",{children:["\uD83D\uDCC4 Related Legal Docs:"," ",d.jsx("a",{href:"https://www.pakistanlawsite.com/",target:"_blank",rel:"noopener noreferrer",children:"PakistanLawSite"})]}),(0,d.jsxs)("p",{children:["\uD83C\uDFA5 Related Videos:"," ",d.jsx("a",{href:"https://www.youtube.com/results?search_query=pakistan+law+explanation",target:"_blank",rel:"noopener noreferrer",children:"Watch on YouTube"})]}),d.jsx("script",{dangerouslySetInnerHTML:{__html:`
            async function askLawBot() {
              const query = document.getElementById('userQuery').value.trim();
              const responseBox = document.getElementById('responseBox');
              if (!query) {
                responseBox.textContent = '⚠️ Please type a question first.';
                return;
              }
              responseBox.textContent = '⏳ Thinking... please wait.';
              try {
                const res = await fetch('/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ query })
                });
                const data = await res.json();
                responseBox.textContent = data.reply || '⚠️ No response from AI.';
              } catch (err) {
                console.error(err);
                responseBox.textContent = '💥 Server error, please try again later.';
              }
            }
          `}})]})}let c=(0,o.l)(s,"default"),x=(0,o.l)(s,"getStaticProps"),g=(0,o.l)(s,"getStaticPaths"),h=(0,o.l)(s,"getServerSideProps"),m=(0,o.l)(s,"config"),b=(0,o.l)(s,"reportWebVitals"),S=(0,o.l)(s,"unstable_getStaticProps"),w=(0,o.l)(s,"unstable_getStaticPaths"),y=(0,o.l)(s,"unstable_getStaticParams"),_=(0,o.l)(s,"unstable_getServerProps"),P=(0,o.l)(s,"unstable_getServerSideProps"),f=new a.PagesRouteModule({definition:{kind:n.x.PAGES,page:"/index",pathname:"/",bundlePath:"",filename:""},components:{App:u(),Document:l()},userland:s})},785:e=>{e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},689:e=>{e.exports=require("react")},17:e=>{e.exports=require("path")}};var t=require("../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[514,209,337,450],()=>__webpack_exec__(262));module.exports=r})();