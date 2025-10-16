"use strict";(()=>{var e={};e.id=621,e.ids=[621],e.modules={885:e=>{e.exports=require("@supabase/supabase-js")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},644:(e,a,t)=>{t.r(a),t.d(a,{config:()=>p,default:()=>i,routeModule:()=>l});var r={};t.r(r),t.d(r,{default:()=>handler});var s=t(802),n=t(44),o=t(249),d=t(885);let u=(0,d.createClient)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);async function handler(e,a){if("GET"!==e.method)return a.status(405).json({error:"Method not allowed"});let{data:t,error:r}=await u.from("payments").select(`
    id,
    user_id,
    amount,
    payment_proof_url,
    status,
    created_at
  `).order("created_at",{ascending:!1});return r?a.status(500).json({error:r.message}):a.status(200).json({payments:t})}let i=(0,o.l)(r,"default"),p=(0,o.l)(r,"config"),l=new s.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/payments",pathname:"/api/payments",bundlePath:"",filename:""},userland:r})}};var a=require("../../webpack-api-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),t=a.X(0,[222],()=>__webpack_exec__(644));module.exports=t})();