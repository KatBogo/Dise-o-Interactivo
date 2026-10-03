(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jh="174",Gg=0,sd=1,Wg=2,lm=1,Xg=2,nr=3,Fr=0,On=1,Ti=2,Dr=0,ho=1,od=2,ad=3,ld=4,Yg=5,os=100,qg=101,$g=102,Zg=103,Jg=104,Kg=200,jg=201,Qg=202,t0=203,Ru=204,Pu=205,e0=206,n0=207,i0=208,r0=209,s0=210,o0=211,a0=212,l0=213,c0=214,Du=0,Lu=1,Iu=2,Eo=3,Uu=4,Nu=5,Fu=6,Ou=7,cm=0,u0=1,h0=2,Lr=0,f0=1,d0=2,p0=3,m0=4,_0=5,g0=6,v0=7,um=300,To=301,bo=302,Bu=303,zu=304,pc=306,ku=1e3,cs=1001,Hu=1002,Bn=1003,x0=1004,Ya=1005,Gi=1006,Pc=1007,us=1008,hr=1009,hm=1010,fm=1011,Ma=1012,Qh=1013,Es=1014,or=1015,Fa=1016,tf=1017,ef=1018,wo=1020,dm=35902,pm=1021,mm=1022,Ni=1023,_m=1024,gm=1025,fo=1026,Ao=1027,nf=1028,rf=1029,vm=1030,sf=1031,of=1033,Il=33776,Ul=33777,Nl=33778,Fl=33779,Vu=35840,Gu=35841,Wu=35842,Xu=35843,Yu=36196,qu=37492,$u=37496,Zu=37808,Ju=37809,Ku=37810,ju=37811,Qu=37812,th=37813,eh=37814,nh=37815,ih=37816,rh=37817,sh=37818,oh=37819,ah=37820,lh=37821,Ol=36492,ch=36494,uh=36495,xm=36283,hh=36284,fh=36285,dh=36286,M0=3200,y0=3201,Mm=0,S0=1,Tr="",Mi="srgb",Co="srgb-linear",$l="linear",Se="srgb",Us=7680,cd=519,E0=512,T0=513,b0=514,ym=515,w0=516,A0=517,C0=518,R0=519,ud=35044,hd="300 es",ar=2e3,Zl=2001;class Oo{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}}const mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let fd=1234567;const ia=Math.PI/180,ya=180/Math.PI;function Ps(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(mn[r&255]+mn[r>>8&255]+mn[r>>16&255]+mn[r>>24&255]+"-"+mn[t&255]+mn[t>>8&255]+"-"+mn[t>>16&15|64]+mn[t>>24&255]+"-"+mn[e&63|128]+mn[e>>8&255]+"-"+mn[e>>16&255]+mn[e>>24&255]+mn[n&255]+mn[n>>8&255]+mn[n>>16&255]+mn[n>>24&255]).toLowerCase()}function ie(r,t,e){return Math.max(t,Math.min(e,r))}function af(r,t){return(r%t+t)%t}function P0(r,t,e,n,i){return n+(r-t)*(i-n)/(e-t)}function D0(r,t,e){return r!==t?(e-r)/(t-r):0}function ra(r,t,e){return(1-e)*r+e*t}function L0(r,t,e,n){return ra(r,t,1-Math.exp(-e*n))}function I0(r,t=1){return t-Math.abs(af(r,t*2)-t)}function U0(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function N0(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function F0(r,t){return r+Math.floor(Math.random()*(t-r+1))}function O0(r,t){return r+Math.random()*(t-r)}function B0(r){return r*(.5-Math.random())}function z0(r){r!==void 0&&(fd=r);let t=fd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function k0(r){return r*ia}function H0(r){return r*ya}function V0(r){return(r&r-1)===0&&r!==0}function G0(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function W0(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function X0(r,t,e,n,i){const s=Math.cos,o=Math.sin,a=s(e/2),l=o(e/2),c=s((t+n)/2),u=o((t+n)/2),h=s((t-n)/2),d=o((t-n)/2),f=s((n-t)/2),_=o((n-t)/2);switch(i){case"XYX":r.set(a*u,l*h,l*d,a*c);break;case"YZY":r.set(l*d,a*u,l*h,a*c);break;case"ZXZ":r.set(l*h,l*d,a*u,a*c);break;case"XZX":r.set(a*u,l*_,l*f,a*c);break;case"YXY":r.set(l*f,a*u,l*_,a*c);break;case"ZYZ":r.set(l*_,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Qs(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Rn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const mc={DEG2RAD:ia,RAD2DEG:ya,generateUUID:Ps,clamp:ie,euclideanModulo:af,mapLinear:P0,inverseLerp:D0,lerp:ra,damp:L0,pingpong:I0,smoothstep:U0,smootherstep:N0,randInt:F0,randFloat:O0,randFloatSpread:B0,seededRandom:z0,degToRad:k0,radToDeg:H0,isPowerOfTwo:V0,ceilPowerOfTwo:G0,floorPowerOfTwo:W0,setQuaternionFromProperEuler:X0,normalize:Rn,denormalize:Qs};class xt{constructor(t=0,e=0){xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ie(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class jt{constructor(t,e,n,i,s,o,a,l,c){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c)}set(t,e,n,i,s,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],_=n[8],g=i[0],m=i[3],p=i[6],M=i[1],x=i[4],v=i[7],b=i[2],A=i[5],E=i[8];return s[0]=o*g+a*M+l*b,s[3]=o*m+a*x+l*A,s[6]=o*p+a*v+l*E,s[1]=c*g+u*M+h*b,s[4]=c*m+u*x+h*A,s[7]=c*p+u*v+h*E,s[2]=d*g+f*M+_*b,s[5]=d*m+f*x+_*A,s[8]=d*p+f*v+_*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*s*u+n*a*l+i*s*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,_=e*h+n*d+i*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=h*g,t[1]=(i*c-u*n)*g,t[2]=(a*n-i*o)*g,t[3]=d*g,t[4]=(u*e-i*l)*g,t[5]=(i*s-a*e)*g,t[6]=f*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*s)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Dc.makeScale(t,e)),this}rotate(t){return this.premultiply(Dc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Dc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Dc=new jt;function Sm(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function Jl(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Y0(){const r=Jl("canvas");return r.style.display="block",r}const dd={};function ts(r){r in dd||(dd[r]=!0,console.warn(r))}function q0(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function $0(r){const t=r.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Z0(r){const t=r.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const pd=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),md=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function J0(){const r={enabled:!0,workingColorSpace:Co,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Se&&(i.r=cr(i.r),i.g=cr(i.g),i.b=cr(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Se&&(i.r=po(i.r),i.g=po(i.g),i.b=po(i.b))),i},fromWorkingColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},toWorkingColorSpace:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Tr?$l:this.spaces[i].transfer},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Co]:{primaries:t,whitePoint:n,transfer:$l,toXYZ:pd,fromXYZ:md,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Mi},outputColorSpaceConfig:{drawingBufferColorSpace:Mi}},[Mi]:{primaries:t,whitePoint:n,transfer:Se,toXYZ:pd,fromXYZ:md,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Mi}}}),r}const _e=J0();function cr(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function po(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ns;class K0{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ns===void 0&&(Ns=Jl("canvas")),Ns.width=t.width,Ns.height=t.height;const n=Ns.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ns}return e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Jl("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=cr(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(cr(e[n]/255)*255):e[n]=cr(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let j0=0;class lf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=Ps(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Lc(i[o].image)):s.push(Lc(i[o]))}else s=Lc(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function Lc(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?K0.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Q0=0;class zn extends Oo{constructor(t=zn.DEFAULT_IMAGE,e=zn.DEFAULT_MAPPING,n=cs,i=cs,s=Gi,o=us,a=Ni,l=hr,c=zn.DEFAULT_ANISOTROPY,u=Tr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=Ps(),this.name="",this.source=new lf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==um)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ku:t.x=t.x-Math.floor(t.x);break;case cs:t.x=t.x<0?0:1;break;case Hu:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ku:t.y=t.y-Math.floor(t.y);break;case cs:t.y=t.y<0?0:1;break;case Hu:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}zn.DEFAULT_IMAGE=null;zn.DEFAULT_MAPPING=um;zn.DEFAULT_ANISOTROPY=1;class He{constructor(t=0,e=0,n=0,i=1){He.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],_=l[9],g=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+g)<.1&&Math.abs(_+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(f+1)/2,b=(p+1)/2,A=(u+d)/4,E=(h+g)/4,C=(_+m)/4;return x>v&&x>b?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=A/n,s=E/n):v>b?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=A/i,s=C/i):b<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(b),n=E/s,i=C/s),this.set(n,i,s,e),this}let M=Math.sqrt((m-_)*(m-_)+(h-g)*(h-g)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(m-_)/M,this.y=(h-g)/M,this.z=(d-u)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this.w=ie(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this.w=ie(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ie(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tv extends Oo{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new He(0,0,t,e),this.scissorTest=!1,this.viewport=new He(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new zn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new lf(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ts extends tv{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Em extends zn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ev extends zn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oa{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3];const d=s[o+0],f=s[o+1],_=s[o+2],g=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=_,t[e+3]=g;return}if(h!==g||l!==d||c!==f||u!==_){let m=1-a;const p=l*d+c*f+u*_+h*g,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const b=Math.sqrt(x),A=Math.atan2(b,p*M);m=Math.sin(m*A)/b,a=Math.sin(a*A)/b}const v=a*M;if(l=l*m+d*v,c=c*m+f*v,u=u*m+_*v,h=h*m+g*v,m===1-a){const b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=s[o],d=s[o+1],f=s[o+2],_=s[o+3];return t[e]=a*_+u*h+l*f-c*d,t[e+1]=l*_+u*d+c*h-a*f,t[e+2]=c*_+u*f+a*d-l*h,t[e+3]=u*_-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(i/2),h=a(s/2),d=l(n/2),f=l(i/2),_=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*_,this._y=c*f*h-d*u*_,this._z=c*u*_+d*f*h,this._w=c*u*h-d*f*_;break;case"YXZ":this._x=d*u*h+c*f*_,this._y=c*f*h-d*u*_,this._z=c*u*_-d*f*h,this._w=c*u*h+d*f*_;break;case"ZXY":this._x=d*u*h-c*f*_,this._y=c*f*h+d*u*_,this._z=c*u*_+d*f*h,this._w=c*u*h-d*f*_;break;case"ZYX":this._x=d*u*h-c*f*_,this._y=c*f*h+d*u*_,this._z=c*u*_-d*f*h,this._w=c*u*h+d*f*_;break;case"YZX":this._x=d*u*h+c*f*_,this._y=c*f*h+d*u*_,this._z=c*u*_-d*f*h,this._w=c*u*h-d*f*_;break;case"XZY":this._x=d*u*h-c*f*_,this._y=c*f*h-d*u*_,this._z=c*u*_+d*f*h,this._w=c*u*h+d*f*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+i*c-s*l,this._y=i*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-i*a,this._w=o*u-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=i*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(_d.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(_d.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),u=2*(a*e-s*i),h=2*(s*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-s*h,this.z=i+l*h+s*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ie(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ic.copy(this).projectOnVector(t),this.sub(Ic)}reflect(t){return this.sub(Ic.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ic=new N,_d=new Oa;class Ba{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ri.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ri.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ri.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Ri):Ri.fromBufferAttribute(s,o),Ri.applyMatrix4(t.matrixWorld),this.expandByPoint(Ri);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qa.copy(n.boundingBox)),qa.applyMatrix4(t.matrixWorld),this.union(qa)}const i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ri),Ri.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ko),$a.subVectors(this.max,ko),Fs.subVectors(t.a,ko),Os.subVectors(t.b,ko),Bs.subVectors(t.c,ko),_r.subVectors(Os,Fs),gr.subVectors(Bs,Os),Wr.subVectors(Fs,Bs);let e=[0,-_r.z,_r.y,0,-gr.z,gr.y,0,-Wr.z,Wr.y,_r.z,0,-_r.x,gr.z,0,-gr.x,Wr.z,0,-Wr.x,-_r.y,_r.x,0,-gr.y,gr.x,0,-Wr.y,Wr.x,0];return!Uc(e,Fs,Os,Bs,$a)||(e=[1,0,0,0,1,0,0,0,1],!Uc(e,Fs,Os,Bs,$a))?!1:(Za.crossVectors(_r,gr),e=[Za.x,Za.y,Za.z],Uc(e,Fs,Os,Bs,$a))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ri).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ri).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ki[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ki[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ki[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ki[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ki[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ki[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ki[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ki[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ki),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ki=[new N,new N,new N,new N,new N,new N,new N,new N],Ri=new N,qa=new Ba,Fs=new N,Os=new N,Bs=new N,_r=new N,gr=new N,Wr=new N,ko=new N,$a=new N,Za=new N,Xr=new N;function Uc(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Xr.fromArray(r,s);const a=i.x*Math.abs(Xr.x)+i.y*Math.abs(Xr.y)+i.z*Math.abs(Xr.z),l=t.dot(Xr),c=e.dot(Xr),u=n.dot(Xr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const nv=new Ba,Ho=new N,Nc=new N;class cf{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):nv.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ho.subVectors(t,this.center);const e=Ho.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ho,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Nc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ho.copy(t.center).add(Nc)),this.expandByPoint(Ho.copy(t.center).sub(Nc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ji=new N,Fc=new N,Ja=new N,vr=new N,Oc=new N,Ka=new N,Bc=new N;class Tm{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ji)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ji.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ji.copy(this.origin).addScaledVector(this.direction,e),ji.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Fc.copy(t).add(e).multiplyScalar(.5),Ja.copy(e).sub(t).normalize(),vr.copy(this.origin).sub(Fc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Ja),a=vr.dot(this.direction),l=-vr.dot(Ja),c=vr.lengthSq(),u=Math.abs(1-o*o);let h,d,f,_;if(u>0)if(h=o*l-a,d=o*a-l,_=s*u,h>=0)if(d>=-_)if(d<=_){const g=1/u;h*=g,d*=g,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-_?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=_?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Fc).addScaledVector(Ja,d),f}intersectSphere(t,e){ji.subVectors(t.center,this.origin);const n=ji.dot(this.direction),i=ji.dot(ji)-n*n,s=t.radius*t.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),u>=0?(s=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(s=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ji)!==null}intersectTriangle(t,e,n,i,s){Oc.subVectors(e,t),Ka.subVectors(n,t),Bc.crossVectors(Oc,Ka);let o=this.direction.dot(Bc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;vr.subVectors(this.origin,t);const l=a*this.direction.dot(Ka.crossVectors(vr,Ka));if(l<0)return null;const c=a*this.direction.dot(Oc.cross(vr));if(c<0||l+c>o)return null;const u=-a*vr.dot(Bc);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ue{constructor(t,e,n,i,s,o,a,l,c,u,h,d,f,_,g,m){Ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c,u,h,d,f,_,g,m)}set(t,e,n,i,s,o,a,l,c,u,h,d,f,_,g,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=_,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/zs.setFromMatrixColumn(t,0).length(),s=1/zs.setFromMatrixColumn(t,1).length(),o=1/zs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const d=o*u,f=o*h,_=a*u,g=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+_*c,e[5]=d-g*c,e[9]=-a*l,e[2]=g-d*c,e[6]=_+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,_=c*u,g=c*h;e[0]=d+g*a,e[4]=_*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-_,e[6]=g+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,_=c*u,g=c*h;e[0]=d-g*a,e[4]=-o*h,e[8]=_+f*a,e[1]=f+_*a,e[5]=o*u,e[9]=g-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,_=a*u,g=a*h;e[0]=l*u,e[4]=_*c-f,e[8]=d*c+g,e[1]=l*h,e[5]=g*c+d,e[9]=f*c-_,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,_=a*l,g=a*c;e[0]=l*u,e[4]=g-d*h,e[8]=_*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+_,e[10]=d-g*h}else if(t.order==="XZY"){const d=o*l,f=o*c,_=a*l,g=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+g,e[5]=o*u,e[9]=f*h-_,e[2]=_*h-f,e[6]=a*u,e[10]=g*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(iv,t,rv)}lookAt(t,e,n){const i=this.elements;return Qn.subVectors(t,e),Qn.lengthSq()===0&&(Qn.z=1),Qn.normalize(),xr.crossVectors(n,Qn),xr.lengthSq()===0&&(Math.abs(n.z)===1?Qn.x+=1e-4:Qn.z+=1e-4,Qn.normalize(),xr.crossVectors(n,Qn)),xr.normalize(),ja.crossVectors(Qn,xr),i[0]=xr.x,i[4]=ja.x,i[8]=Qn.x,i[1]=xr.y,i[5]=ja.y,i[9]=Qn.y,i[2]=xr.z,i[6]=ja.z,i[10]=Qn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],_=n[2],g=n[6],m=n[10],p=n[14],M=n[3],x=n[7],v=n[11],b=n[15],A=i[0],E=i[4],C=i[8],S=i[12],y=i[1],D=i[5],U=i[9],z=i[13],B=i[2],k=i[6],H=i[10],q=i[14],G=i[3],nt=i[7],R=i[11],K=i[15];return s[0]=o*A+a*y+l*B+c*G,s[4]=o*E+a*D+l*k+c*nt,s[8]=o*C+a*U+l*H+c*R,s[12]=o*S+a*z+l*q+c*K,s[1]=u*A+h*y+d*B+f*G,s[5]=u*E+h*D+d*k+f*nt,s[9]=u*C+h*U+d*H+f*R,s[13]=u*S+h*z+d*q+f*K,s[2]=_*A+g*y+m*B+p*G,s[6]=_*E+g*D+m*k+p*nt,s[10]=_*C+g*U+m*H+p*R,s[14]=_*S+g*z+m*q+p*K,s[3]=M*A+x*y+v*B+b*G,s[7]=M*E+x*D+v*k+b*nt,s[11]=M*C+x*U+v*H+b*R,s[15]=M*S+x*z+v*q+b*K,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],_=t[3],g=t[7],m=t[11],p=t[15];return _*(+s*l*h-i*c*h-s*a*d+n*c*d+i*a*f-n*l*f)+g*(+e*l*f-e*c*d+s*o*d-i*o*f+i*c*u-s*l*u)+m*(+e*c*h-e*a*f-s*o*h+n*o*f+s*a*u-n*c*u)+p*(-i*a*u-e*l*h+e*a*d+i*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],_=t[12],g=t[13],m=t[14],p=t[15],M=h*m*c-g*d*c+g*l*f-a*m*f-h*l*p+a*d*p,x=_*d*c-u*m*c-_*l*f+o*m*f+u*l*p-o*d*p,v=u*g*c-_*h*c+_*a*f-o*g*f-u*a*p+o*h*p,b=_*h*l-u*g*l-_*a*d+o*g*d+u*a*m-o*h*m,A=e*M+n*x+i*v+s*b;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/A;return t[0]=M*E,t[1]=(g*d*s-h*m*s-g*i*f+n*m*f+h*i*p-n*d*p)*E,t[2]=(a*m*s-g*l*s+g*i*c-n*m*c-a*i*p+n*l*p)*E,t[3]=(h*l*s-a*d*s-h*i*c+n*d*c+a*i*f-n*l*f)*E,t[4]=x*E,t[5]=(u*m*s-_*d*s+_*i*f-e*m*f-u*i*p+e*d*p)*E,t[6]=(_*l*s-o*m*s-_*i*c+e*m*c+o*i*p-e*l*p)*E,t[7]=(o*d*s-u*l*s+u*i*c-e*d*c-o*i*f+e*l*f)*E,t[8]=v*E,t[9]=(_*h*s-u*g*s-_*n*f+e*g*f+u*n*p-e*h*p)*E,t[10]=(o*g*s-_*a*s+_*n*c-e*g*c-o*n*p+e*a*p)*E,t[11]=(u*a*s-o*h*s-u*n*c+e*h*c+o*n*f-e*a*f)*E,t[12]=b*E,t[13]=(u*g*i-_*h*i+_*n*d-e*g*d-u*n*m+e*h*m)*E,t[14]=(_*a*i-o*g*i-_*n*l+e*g*l+o*n*m-e*a*m)*E,t[15]=(o*h*i-u*a*i+u*n*l-e*h*l-o*n*d+e*a*d)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,u*a+n,u*l-i*o,0,c*l-i*a,u*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,_=s*h,g=o*u,m=o*h,p=a*h,M=l*c,x=l*u,v=l*h,b=n.x,A=n.y,E=n.z;return i[0]=(1-(g+p))*b,i[1]=(f+v)*b,i[2]=(_-x)*b,i[3]=0,i[4]=(f-v)*A,i[5]=(1-(d+p))*A,i[6]=(m+M)*A,i[7]=0,i[8]=(_+x)*E,i[9]=(m-M)*E,i[10]=(1-(d+g))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=zs.set(i[0],i[1],i[2]).length();const o=zs.set(i[4],i[5],i[6]).length(),a=zs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],Pi.copy(this);const c=1/s,u=1/o,h=1/a;return Pi.elements[0]*=c,Pi.elements[1]*=c,Pi.elements[2]*=c,Pi.elements[4]*=u,Pi.elements[5]*=u,Pi.elements[6]*=u,Pi.elements[8]*=h,Pi.elements[9]*=h,Pi.elements[10]*=h,e.setFromRotationMatrix(Pi),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,i,s,o,a=ar){const l=this.elements,c=2*s/(e-t),u=2*s/(n-i),h=(e+t)/(e-t),d=(n+i)/(n-i);let f,_;if(a===ar)f=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Zl)f=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=ar){const l=this.elements,c=1/(e-t),u=1/(n-i),h=1/(o-s),d=(e+t)*c,f=(n+i)*u;let _,g;if(a===ar)_=(o+s)*h,g=-2*h;else if(a===Zl)_=s*h,g=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const zs=new N,Pi=new Ue,iv=new N(0,0,0),rv=new N(1,1,1),xr=new N,ja=new N,Qn=new N,gd=new Ue,vd=new Oa;class fr{constructor(t=0,e=0,n=0,i=fr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ie(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ie(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ie(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return gd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(gd,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vd.setFromEuler(this),this.setFromQuaternion(vd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fr.DEFAULT_ORDER="XYZ";class uf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let sv=0;const xd=new N,ks=new Oa,Qi=new Ue,Qa=new N,Vo=new N,ov=new N,av=new Oa,Md=new N(1,0,0),yd=new N(0,1,0),Sd=new N(0,0,1),Ed={type:"added"},lv={type:"removed"},Hs={type:"childadded",child:null},zc={type:"childremoved",child:null};class dn extends Oo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sv++}),this.uuid=Ps(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=dn.DEFAULT_UP.clone();const t=new N,e=new fr,n=new Oa,i=new N(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ue},normalMatrix:{value:new jt}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=dn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ks.setFromAxisAngle(t,e),this.quaternion.multiply(ks),this}rotateOnWorldAxis(t,e){return ks.setFromAxisAngle(t,e),this.quaternion.premultiply(ks),this}rotateX(t){return this.rotateOnAxis(Md,t)}rotateY(t){return this.rotateOnAxis(yd,t)}rotateZ(t){return this.rotateOnAxis(Sd,t)}translateOnAxis(t,e){return xd.copy(t).applyQuaternion(this.quaternion),this.position.add(xd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Md,t)}translateY(t){return this.translateOnAxis(yd,t)}translateZ(t){return this.translateOnAxis(Sd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Qi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Qa.copy(t):Qa.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Vo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qi.lookAt(Vo,Qa,this.up):Qi.lookAt(Qa,Vo,this.up),this.quaternion.setFromRotationMatrix(Qi),i&&(Qi.extractRotation(i.matrixWorld),ks.setFromRotationMatrix(Qi),this.quaternion.premultiply(ks.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ed),Hs.child=t,this.dispatchEvent(Hs),Hs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(lv),zc.child=t,this.dispatchEvent(zc),zc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Qi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Qi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Qi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ed),Hs.child=t,this.dispatchEvent(Hs),Hs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vo,t,ov),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vo,av,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),_=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),_.length>0&&(n.nodes=_)}return n.object=i,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}dn.DEFAULT_UP=new N(0,1,0);dn.DEFAULT_MATRIX_AUTO_UPDATE=!0;dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Di=new N,tr=new N,kc=new N,er=new N,Vs=new N,Gs=new N,Td=new N,Hc=new N,Vc=new N,Gc=new N,Wc=new He,Xc=new He,Yc=new He;class Ii{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Di.subVectors(t,e),i.cross(Di);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Di.subVectors(i,e),tr.subVectors(n,e),kc.subVectors(t,e);const o=Di.dot(Di),a=Di.dot(tr),l=Di.dot(kc),c=tr.dot(tr),u=tr.dot(kc),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,_=(o*u-a*l)*d;return s.set(1-f-_,_,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,er)===null?!1:er.x>=0&&er.y>=0&&er.x+er.y<=1}static getInterpolation(t,e,n,i,s,o,a,l){return this.getBarycoord(t,e,n,i,er)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,er.x),l.addScaledVector(o,er.y),l.addScaledVector(a,er.z),l)}static getInterpolatedAttribute(t,e,n,i,s,o){return Wc.setScalar(0),Xc.setScalar(0),Yc.setScalar(0),Wc.fromBufferAttribute(t,e),Xc.fromBufferAttribute(t,n),Yc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Wc,s.x),o.addScaledVector(Xc,s.y),o.addScaledVector(Yc,s.z),o}static isFrontFacing(t,e,n,i){return Di.subVectors(n,e),tr.subVectors(t,e),Di.cross(tr).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Di.subVectors(this.c,this.b),tr.subVectors(this.a,this.b),Di.cross(tr).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ii.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ii.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return Ii.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return Ii.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ii.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let o,a;Vs.subVectors(i,n),Gs.subVectors(s,n),Hc.subVectors(t,n);const l=Vs.dot(Hc),c=Gs.dot(Hc);if(l<=0&&c<=0)return e.copy(n);Vc.subVectors(t,i);const u=Vs.dot(Vc),h=Gs.dot(Vc);if(u>=0&&h<=u)return e.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Vs,o);Gc.subVectors(t,s);const f=Vs.dot(Gc),_=Gs.dot(Gc);if(_>=0&&f<=_)return e.copy(s);const g=f*c-l*_;if(g<=0&&c>=0&&_<=0)return a=c/(c-_),e.copy(n).addScaledVector(Gs,a);const m=u*_-f*h;if(m<=0&&h-u>=0&&f-_>=0)return Td.subVectors(s,i),a=(h-u)/(h-u+(f-_)),e.copy(i).addScaledVector(Td,a);const p=1/(m+g+d);return o=g*p,a=d*p,e.copy(n).addScaledVector(Vs,o).addScaledVector(Gs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const bm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mr={h:0,s:0,l:0},tl={h:0,s:0,l:0};function qc(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class ce{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Mi){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,_e.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=_e.workingColorSpace){return this.r=t,this.g=e,this.b=n,_e.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=_e.workingColorSpace){if(t=af(t,1),e=ie(e,0,1),n=ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=qc(o,s,t+1/3),this.g=qc(o,s,t),this.b=qc(o,s,t-1/3)}return _e.toWorkingColorSpace(this,i),this}setStyle(t,e=Mi){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Mi){const n=bm[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}copyLinearToSRGB(t){return this.r=po(t.r),this.g=po(t.g),this.b=po(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Mi){return _e.fromWorkingColorSpace(_n.copy(this),t),Math.round(ie(_n.r*255,0,255))*65536+Math.round(ie(_n.g*255,0,255))*256+Math.round(ie(_n.b*255,0,255))}getHexString(t=Mi){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=_e.workingColorSpace){_e.fromWorkingColorSpace(_n.copy(this),e);const n=_n.r,i=_n.g,s=_n.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(i-s)/h+(i<s?6:0);break;case i:l=(s-n)/h+2;break;case s:l=(n-i)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=_e.workingColorSpace){return _e.fromWorkingColorSpace(_n.copy(this),e),t.r=_n.r,t.g=_n.g,t.b=_n.b,t}getStyle(t=Mi){_e.fromWorkingColorSpace(_n.copy(this),t);const e=_n.r,n=_n.g,i=_n.b;return t!==Mi?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Mr),this.setHSL(Mr.h+t,Mr.s+e,Mr.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Mr),t.getHSL(tl);const n=ra(Mr.h,tl.h,e),i=ra(Mr.s,tl.s,e),s=ra(Mr.l,tl.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _n=new ce;ce.NAMES=bm;let cv=0;class za extends Oo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cv++}),this.uuid=Ps(),this.name="",this.type="Material",this.blending=ho,this.side=Fr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ru,this.blendDst=Pu,this.blendEquation=os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ce(0,0,0),this.blendAlpha=0,this.depthFunc=Eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Us,this.stencilZFail=Us,this.stencilZPass=Us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ho&&(n.blending=this.blending),this.side!==Fr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ru&&(n.blendSrc=this.blendSrc),this.blendDst!==Pu&&(n.blendDst=this.blendDst),this.blendEquation!==os&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Eo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Us&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Us&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Us&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Fi extends za{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fr,this.combine=cm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const qe=new N,el=new xt;let uv=0;class Oi{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:uv++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ud,this.updateRanges=[],this.gpuType=or,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)el.fromBufferAttribute(this,e),el.applyMatrix3(t),this.setXY(e,el.x,el.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix3(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyMatrix4(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.applyNormalMatrix(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)qe.fromBufferAttribute(this,e),qe.transformDirection(t),this.setXYZ(e,qe.x,qe.y,qe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Qs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Rn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Qs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Rn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Qs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Rn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Qs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Rn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Qs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Rn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Rn(e,this.array),n=Rn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Rn(e,this.array),n=Rn(n,this.array),i=Rn(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Rn(e,this.array),n=Rn(n,this.array),i=Rn(i,this.array),s=Rn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ud&&(t.usage=this.usage),t}}class wm extends Oi{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Am extends Oi{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class de extends Oi{constructor(t,e,n){super(new Float32Array(t),e,n)}}let hv=0;const gi=new Ue,$c=new dn,Ws=new N,ti=new Ba,Go=new Ba,on=new N;class bn extends Oo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hv++}),this.uuid=Ps(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Sm(t)?Am:wm)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new jt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return gi.makeRotationFromQuaternion(t),this.applyMatrix4(gi),this}rotateX(t){return gi.makeRotationX(t),this.applyMatrix4(gi),this}rotateY(t){return gi.makeRotationY(t),this.applyMatrix4(gi),this}rotateZ(t){return gi.makeRotationZ(t),this.applyMatrix4(gi),this}translate(t,e,n){return gi.makeTranslation(t,e,n),this.applyMatrix4(gi),this}scale(t,e,n){return gi.makeScale(t,e,n),this.applyMatrix4(gi),this}lookAt(t){return $c.lookAt(t),$c.updateMatrix(),this.applyMatrix4($c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ws).negate(),this.translate(Ws.x,Ws.y,Ws.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new de(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ba);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];ti.setFromBufferAttribute(s),this.morphTargetsRelative?(on.addVectors(this.boundingBox.min,ti.min),this.boundingBox.expandByPoint(on),on.addVectors(this.boundingBox.max,ti.max),this.boundingBox.expandByPoint(on)):(this.boundingBox.expandByPoint(ti.min),this.boundingBox.expandByPoint(ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cf);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(ti.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Go.setFromBufferAttribute(a),this.morphTargetsRelative?(on.addVectors(ti.min,Go.min),ti.expandByPoint(on),on.addVectors(ti.max,Go.max),ti.expandByPoint(on)):(ti.expandByPoint(Go.min),ti.expandByPoint(Go.max))}ti.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)on.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(on));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)on.fromBufferAttribute(a,c),l&&(Ws.fromBufferAttribute(t,c),on.add(Ws)),i=Math.max(i,n.distanceToSquared(on))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Oi(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new N,l[C]=new N;const c=new N,u=new N,h=new N,d=new xt,f=new xt,_=new xt,g=new N,m=new N;function p(C,S,y){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,y),d.fromBufferAttribute(s,C),f.fromBufferAttribute(s,S),_.fromBufferAttribute(s,y),u.sub(c),h.sub(c),f.sub(d),_.sub(d);const D=1/(f.x*_.y-_.x*f.y);isFinite(D)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(h,-f.y).multiplyScalar(D),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-_.x).multiplyScalar(D),a[C].add(g),a[S].add(g),a[y].add(g),l[C].add(m),l[S].add(m),l[y].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let C=0,S=M.length;C<S;++C){const y=M[C],D=y.start,U=y.count;for(let z=D,B=D+U;z<B;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const x=new N,v=new N,b=new N,A=new N;function E(C){b.fromBufferAttribute(i,C),A.copy(b);const S=a[C];x.copy(S),x.sub(b.multiplyScalar(b.dot(S))).normalize(),v.crossVectors(A,S);const D=v.dot(l[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,D)}for(let C=0,S=M.length;C<S;++C){const y=M[C],D=y.start,U=y.count;for(let z=D,B=D+U;z<B;z+=3)E(t.getX(z+0)),E(t.getX(z+1)),E(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Oi(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new N,s=new N,o=new N,a=new N,l=new N,c=new N,u=new N,h=new N;if(t)for(let d=0,f=t.count;d<f;d+=3){const _=t.getX(d+0),g=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,_),s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),u.subVectors(o,s),h.subVectors(i,s),u.cross(h),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,s),h.subVectors(i,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)on.fromBufferAttribute(t,e),on.normalize(),t.setXYZ(e,on.x,on.y,on.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,_=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*u;for(let p=0;p<u;p++)d[_++]=c[f++]}return new Oi(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new bn,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(i[l]=u,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bd=new Ue,Yr=new Tm,nl=new cf,wd=new N,il=new N,rl=new N,sl=new N,Zc=new N,ol=new N,Ad=new N,al=new N;class At extends dn{constructor(t=new bn,e=new Fi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(s&&a){ol.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Zc.fromBufferAttribute(h,t),o?ol.addScaledVector(Zc,u):ol.addScaledVector(Zc.sub(e),u))}e.add(ol)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nl.copy(n.boundingSphere),nl.applyMatrix4(s),Yr.copy(t.ray).recast(t.near),!(nl.containsPoint(Yr.origin)===!1&&(Yr.intersectSphere(nl,wd)===null||Yr.origin.distanceToSquared(wd)>(t.far-t.near)**2))&&(bd.copy(s).invert(),Yr.copy(t.ray).applyMatrix4(bd),!(n.boundingBox!==null&&Yr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yr)))}_computeIntersections(t,e,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,g=d.length;_<g;_++){const m=d[_],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=M,b=x;v<b;v+=3){const A=a.getX(v),E=a.getX(v+1),C=a.getX(v+2);i=ll(this,p,t,n,c,u,h,A,E,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const _=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let m=_,p=g;m<p;m+=3){const M=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);i=ll(this,o,t,n,c,u,h,M,x,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,g=d.length;_<g;_++){const m=d[_],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=M,b=x;v<b;v+=3){const A=v,E=v+1,C=v+2;i=ll(this,p,t,n,c,u,h,A,E,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const _=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let m=_,p=g;m<p;m+=3){const M=m,x=m+1,v=m+2;i=ll(this,o,t,n,c,u,h,M,x,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function fv(r,t,e,n,i,s,o,a){let l;if(t.side===On?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,t.side===Fr,a),l===null)return null;al.copy(a),al.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(al);return c<e.near||c>e.far?null:{distance:c,point:al.clone(),object:r}}function ll(r,t,e,n,i,s,o,a,l,c){r.getVertexPosition(a,il),r.getVertexPosition(l,rl),r.getVertexPosition(c,sl);const u=fv(r,t,e,n,il,rl,sl,Ad);if(u){const h=new N;Ii.getBarycoord(Ad,il,rl,sl,h),i&&(u.uv=Ii.getInterpolatedAttribute(i,a,l,c,h,new xt)),s&&(u.uv1=Ii.getInterpolatedAttribute(s,a,l,c,h,new xt)),o&&(u.normal=Ii.getInterpolatedAttribute(o,a,l,c,h,new N),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new N,materialIndex:0};Ii.getNormal(il,rl,sl,d.normal),u.face=d,u.barycoord=h}return u}class yn extends bn{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;_("z","y","x",-1,-1,n,e,t,o,s,0),_("z","y","x",1,-1,n,e,-t,o,s,1),_("x","z","y",1,1,t,n,e,i,o,2),_("x","z","y",1,-1,t,n,-e,i,o,3),_("x","y","z",1,-1,t,e,n,i,s,4),_("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(u,3)),this.setAttribute("uv",new de(h,2));function _(g,m,p,M,x,v,b,A,E,C,S){const y=v/E,D=b/C,U=v/2,z=b/2,B=A/2,k=E+1,H=C+1;let q=0,G=0;const nt=new N;for(let R=0;R<H;R++){const K=R*D-z;for(let pt=0;pt<k;pt++){const Ft=pt*y-U;nt[g]=Ft*M,nt[m]=K*x,nt[p]=B,c.push(nt.x,nt.y,nt.z),nt[g]=0,nt[m]=0,nt[p]=A>0?1:-1,u.push(nt.x,nt.y,nt.z),h.push(pt/E),h.push(1-R/C),q+=1}}for(let R=0;R<C;R++)for(let K=0;K<E;K++){const pt=d+K+k*R,Ft=d+K+k*(R+1),$=d+(K+1)+k*(R+1),et=d+(K+1)+k*R;l.push(pt,Ft,et),l.push(Ft,$,et),G+=6}a.addGroup(f,G,S),f+=G,d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ro(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ln(r){const t={};for(let e=0;e<r.length;e++){const n=Ro(r[e]);for(const i in n)t[i]=n[i]}return t}function dv(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function Cm(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:_e.workingColorSpace}const pv={clone:Ro,merge:Ln};var mv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_v=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Or extends za{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mv,this.fragmentShader=_v,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ro(t.uniforms),this.uniformsGroups=dv(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Rm extends dn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=ar}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yr=new N,Cd=new xt,Rd=new xt;class yi extends Rm{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ya*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ia*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ya*2*Math.atan(Math.tan(ia*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){yr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(yr.x,yr.y).multiplyScalar(-t/yr.z),yr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yr.x,yr.y).multiplyScalar(-t/yr.z)}getViewSize(t,e){return this.getViewBounds(t,Cd,Rd),e.subVectors(Rd,Cd)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ia*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Xs=-90,Ys=1;class gv extends dn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new yi(Xs,Ys,t,e);i.layers=this.layers,this.add(i);const s=new yi(Xs,Ys,t,e);s.layers=this.layers,this.add(s);const o=new yi(Xs,Ys,t,e);o.layers=this.layers,this.add(o);const a=new yi(Xs,Ys,t,e);a.layers=this.layers,this.add(a);const l=new yi(Xs,Ys,t,e);l.layers=this.layers,this.add(l);const c=new yi(Xs,Ys,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===ar)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Zl)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Pm extends zn{constructor(t,e,n,i,s,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:To,super(t,e,n,i,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class vv extends Ts{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Pm(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Gi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new yn(5,5,5),s=new Or({name:"CubemapFromEquirect",uniforms:Ro(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:On,blending:Dr});s.uniforms.tEquirect.value=e;const o=new At(i,s),a=e.minFilter;return e.minFilter===us&&(e.minFilter=Gi),new gv(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}}class Pe extends dn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xv={type:"move"};class Jc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),p=this._getHandJoint(c,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,_=.005;c.inputState.pinching&&d>f+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(xv)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Pe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class hf{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new ce(t),this.near=e,this.far=n}clone(){return new hf(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Mv extends dn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fr,this.environmentIntensity=1,this.environmentRotation=new fr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class yv extends zn{constructor(t=null,e=1,n=1,i,s,o,a,l,c=Bn,u=Bn,h,d){super(null,o,a,l,c,u,i,s,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Kc=new N,Sv=new N,Ev=new jt;class es{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Kc.subVectors(n,e).cross(Sv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Kc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ev.getNormalMatrix(t),i=this.coplanarPoint(Kc).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qr=new cf,cl=new N;class ff{constructor(t=new es,e=new es,n=new es,i=new es,s=new es,o=new es){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ar){const n=this.planes,i=t.elements,s=i[0],o=i[1],a=i[2],l=i[3],c=i[4],u=i[5],h=i[6],d=i[7],f=i[8],_=i[9],g=i[10],m=i[11],p=i[12],M=i[13],x=i[14],v=i[15];if(n[0].setComponents(l-s,d-c,m-f,v-p).normalize(),n[1].setComponents(l+s,d+c,m+f,v+p).normalize(),n[2].setComponents(l+o,d+u,m+_,v+M).normalize(),n[3].setComponents(l-o,d-u,m-_,v-M).normalize(),n[4].setComponents(l-a,d-h,m-g,v-x).normalize(),e===ar)n[5].setComponents(l+a,d+h,m+g,v+x).normalize();else if(e===Zl)n[5].setComponents(a,h,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qr)}intersectsSprite(t){return qr.center.set(0,0,0),qr.radius=.7071067811865476,qr.applyMatrix4(t.matrixWorld),this.intersectsSphere(qr)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(cl.x=i.normal.x>0?t.max.x:t.min.x,cl.y=i.normal.y>0?t.max.y:t.min.y,cl.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(cl)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Dm extends zn{constructor(t,e,n,i,s,o,a,l,c,u=fo){if(u!==fo&&u!==Ao)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===fo&&(n=Es),n===void 0&&u===Ao&&(n=wo),super(null,i,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Bn,this.minFilter=l!==void 0?l:Bn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new lf(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ji{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(i),e.push(s),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(s-1);const u=n[i],d=n[i+1]-u,f=(o-u)/d;return(i+f)/(s-1)}getTangent(t,e){let i=t-1e-4,s=t+1e-4;i<0&&(i=0),s>1&&(s=1);const o=this.getPoint(i),a=this.getPoint(s),l=e||(o.isVector2?new xt:new N);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new N,i=[],s=[],o=[],a=new N,l=new Ue;for(let f=0;f<=t;f++){const _=f/t;i[f]=this.getTangentAt(_,new N)}s[0]=new N,o[0]=new N;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),h=Math.abs(i[0].y),d=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const _=Math.acos(ie(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,_))}o[f].crossVectors(i[f],s[f])}if(e===!0){let f=Math.acos(ie(s[0].dot(s[t]),-1,1));f/=t,i[0].dot(a.crossVectors(s[0],s[t]))>0&&(f=-f);for(let _=1;_<=t;_++)s[_].applyMatrix4(l.makeRotationAxis(i[_],f*_)),o[_].crossVectors(i[_],s[_])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class df extends Ji{constructor(t=0,e=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new xt){const n=e,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);const a=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Tv extends df{constructor(t,e,n,i,s,o){super(t,e,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function pf(){let r=0,t=0,e=0,n=0;function i(s,o,a,l){r=s,t=a,e=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){i(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let d=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,i(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return r+t*s+e*o+n*a}}}const ul=new N,jc=new pf,Qc=new pf,tu=new pf;class mf extends Ji{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new N){const n=e,i=this.points,s=i.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=i[(a-1)%s]:(ul.subVectors(i[0],i[1]).add(i[0]),c=ul);const h=i[a%s],d=i[(a+1)%s];if(this.closed||a+2<s?u=i[(a+2)%s]:(ul.subVectors(i[s-1],i[s-2]).add(i[s-1]),u=ul),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);g<1e-4&&(g=1),_<1e-4&&(_=g),m<1e-4&&(m=g),jc.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,_,g,m),Qc.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,_,g,m),tu.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,_,g,m)}else this.curveType==="catmullrom"&&(jc.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Qc.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),tu.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(jc.calc(l),Qc.calc(l),tu.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new N().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Pd(r,t,e,n,i){const s=(n-t)*.5,o=(i-e)*.5,a=r*r,l=r*a;return(2*e-2*n+s+o)*l+(-3*e+3*n-2*s-o)*a+s*r+e}function bv(r,t){const e=1-r;return e*e*t}function wv(r,t){return 2*(1-r)*r*t}function Av(r,t){return r*r*t}function sa(r,t,e,n){return bv(r,t)+wv(r,e)+Av(r,n)}function Cv(r,t){const e=1-r;return e*e*e*t}function Rv(r,t){const e=1-r;return 3*e*e*r*t}function Pv(r,t){return 3*(1-r)*r*r*t}function Dv(r,t){return r*r*r*t}function oa(r,t,e,n,i){return Cv(r,t)+Rv(r,e)+Pv(r,n)+Dv(r,i)}class Lm extends Ji{constructor(t=new xt,e=new xt,n=new xt,i=new xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new xt){const n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(oa(t,i.x,s.x,o.x,a.x),oa(t,i.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Lv extends Ji{constructor(t=new N,e=new N,n=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new N){const n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(oa(t,i.x,s.x,o.x,a.x),oa(t,i.y,s.y,o.y,a.y),oa(t,i.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Im extends Ji{constructor(t=new xt,e=new xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new xt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Iv extends Ji{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Um extends Ji{constructor(t=new xt,e=new xt,n=new xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new xt){const n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(sa(t,i.x,s.x,o.x),sa(t,i.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nm extends Ji{constructor(t=new N,e=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new N){const n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(sa(t,i.x,s.x,o.x),sa(t,i.y,s.y,o.y),sa(t,i.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fm extends Ji{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new xt){const n=e,i=this.points,s=(i.length-1)*t,o=Math.floor(s),a=s-o,l=i[o===0?o:o-1],c=i[o],u=i[o>i.length-2?i.length-1:o+1],h=i[o>i.length-3?i.length-1:o+2];return n.set(Pd(a,l.x,c.x,u.x,h.x),Pd(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new xt().fromArray(i))}return this}}var ph=Object.freeze({__proto__:null,ArcCurve:Tv,CatmullRomCurve3:mf,CubicBezierCurve:Lm,CubicBezierCurve3:Lv,EllipseCurve:df,LineCurve:Im,LineCurve3:Iv,QuadraticBezierCurve:Um,QuadraticBezierCurve3:Nm,SplineCurve:Fm});class Uv extends Ji{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ph[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const o=i[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const o=s[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new ph[i.type]().fromJSON(i))}return this}}class mh extends Uv{constructor(t){super(),this.type="Path",this.currentPoint=new xt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Im(this.currentPoint.clone(),new xt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const s=new Um(this.currentPoint.clone(),new xt(t,e),new xt(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,s,o){const a=new Lm(this.currentPoint.clone(),new xt(t,e),new xt(n,i),new xt(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Fm(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,s,o),this}absarc(t,e,n,i,s,o){return this.absellipse(t,e,n,n,i,s,o),this}ellipse(t,e,n,i,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,i,s,o,a,l),this}absellipse(t,e,n,i,s,o,a,l){const c=new df(t,e,n,i,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class _c extends bn{constructor(t=[new xt(0,-.5),new xt(.5,0),new xt(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=ie(i,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],u=1/e,h=new N,d=new xt,f=new N,_=new N,g=new N;let m=0,p=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:m=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(g.x,g.y,g.z);break;default:m=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.x+=g.x,f.y+=g.y,f.z+=g.z,f.normalize(),l.push(f.x,f.y,f.z),g.copy(_)}for(let M=0;M<=e;M++){const x=n+M*u*i,v=Math.sin(x),b=Math.cos(x);for(let A=0;A<=t.length-1;A++){h.x=t[A].x*v,h.y=t[A].y,h.z=t[A].x*b,o.push(h.x,h.y,h.z),d.x=M/e,d.y=A/(t.length-1),a.push(d.x,d.y);const E=l[3*A+0]*v,C=l[3*A+1],S=l[3*A+0]*b;c.push(E,C,S)}}for(let M=0;M<e;M++)for(let x=0;x<t.length-1;x++){const v=x+M*t.length,b=v,A=v+t.length,E=v+t.length+1,C=v+1;s.push(b,A,C),s.push(E,C,A)}this.setIndex(s),this.setAttribute("position",new de(o,3)),this.setAttribute("uv",new de(a,2)),this.setAttribute("normal",new de(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _c(t.points,t.segments,t.phiStart,t.phiLength)}}class no extends _c{constructor(t=1,e=1,n=4,i=8){const s=new mh;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new no(t.radius,t.length,t.capSegments,t.radialSegments)}}class ka extends bn{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const s=[],o=[],a=[],l=[],c=new N,u=new xt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=n+h/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new de(o,3)),this.setAttribute("normal",new de(a,3)),this.setAttribute("uv",new de(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ka(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Xn extends bn{constructor(t=1,e=1,n=1,i=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const u=[],h=[],d=[],f=[];let _=0;const g=[],m=n/2;let p=0;M(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new de(h,3)),this.setAttribute("normal",new de(d,3)),this.setAttribute("uv",new de(f,2));function M(){const v=new N,b=new N;let A=0;const E=(e-t)/n;for(let C=0;C<=s;C++){const S=[],y=C/s,D=y*(e-t)+t;for(let U=0;U<=i;U++){const z=U/i,B=z*l+a,k=Math.sin(B),H=Math.cos(B);b.x=D*k,b.y=-y*n+m,b.z=D*H,h.push(b.x,b.y,b.z),v.set(k,E,H).normalize(),d.push(v.x,v.y,v.z),f.push(z,1-y),S.push(_++)}g.push(S)}for(let C=0;C<i;C++)for(let S=0;S<s;S++){const y=g[S][C],D=g[S+1][C],U=g[S+1][C+1],z=g[S][C+1];(t>0||S!==0)&&(u.push(y,D,z),A+=3),(e>0||S!==s-1)&&(u.push(D,U,z),A+=3)}c.addGroup(p,A,0),p+=A}function x(v){const b=_,A=new xt,E=new N;let C=0;const S=v===!0?t:e,y=v===!0?1:-1;for(let U=1;U<=i;U++)h.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),_++;const D=_;for(let U=0;U<=i;U++){const B=U/i*l+a,k=Math.cos(B),H=Math.sin(B);E.x=S*H,E.y=m*y,E.z=S*k,h.push(E.x,E.y,E.z),d.push(0,y,0),A.x=k*.5+.5,A.y=H*.5*y+.5,f.push(A.x,A.y),_++}for(let U=0;U<i;U++){const z=b+U,B=D+U;v===!0?u.push(B,B+1,z):u.push(B+1,B,z),C+=3}c.addGroup(p,C,v===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yi extends Xn{constructor(t=1,e=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Yi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class gc extends bn{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const s=[],o=[];a(i),c(n),u(),this.setAttribute("position",new de(s,3)),this.setAttribute("normal",new de(s.slice(),3)),this.setAttribute("uv",new de(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const x=new N,v=new N,b=new N;for(let A=0;A<e.length;A+=3)f(e[A+0],x),f(e[A+1],v),f(e[A+2],b),l(x,v,b,M)}function l(M,x,v,b){const A=b+1,E=[];for(let C=0;C<=A;C++){E[C]=[];const S=M.clone().lerp(v,C/A),y=x.clone().lerp(v,C/A),D=A-C;for(let U=0;U<=D;U++)U===0&&C===A?E[C][U]=S:E[C][U]=S.clone().lerp(y,U/D)}for(let C=0;C<A;C++)for(let S=0;S<2*(A-C)-1;S++){const y=Math.floor(S/2);S%2===0?(d(E[C][y+1]),d(E[C+1][y]),d(E[C][y])):(d(E[C][y+1]),d(E[C+1][y+1]),d(E[C+1][y]))}}function c(M){const x=new N;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(M),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function u(){const M=new N;for(let x=0;x<s.length;x+=3){M.x=s[x+0],M.y=s[x+1],M.z=s[x+2];const v=m(M)/2/Math.PI+.5,b=p(M)/Math.PI+.5;o.push(v,1-b)}_(),h()}function h(){for(let M=0;M<o.length;M+=6){const x=o[M+0],v=o[M+2],b=o[M+4],A=Math.max(x,v,b),E=Math.min(x,v,b);A>.9&&E<.1&&(x<.2&&(o[M+0]+=1),v<.2&&(o[M+2]+=1),b<.2&&(o[M+4]+=1))}}function d(M){s.push(M.x,M.y,M.z)}function f(M,x){const v=M*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function _(){const M=new N,x=new N,v=new N,b=new N,A=new xt,E=new xt,C=new xt;for(let S=0,y=0;S<s.length;S+=9,y+=6){M.set(s[S+0],s[S+1],s[S+2]),x.set(s[S+3],s[S+4],s[S+5]),v.set(s[S+6],s[S+7],s[S+8]),A.set(o[y+0],o[y+1]),E.set(o[y+2],o[y+3]),C.set(o[y+4],o[y+5]),b.copy(M).add(x).add(v).divideScalar(3);const D=m(b);g(A,y+0,M,D),g(E,y+2,x,D),g(C,y+4,v,D)}}function g(M,x,v,b){b<0&&M.x===1&&(o[x]=M.x-1),v.x===0&&v.z===0&&(o[x]=b/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gc(t.vertices,t.indices,t.radius,t.details)}}class Om extends mh{constructor(t){super(t),this.uuid=Ps(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new mh().fromJSON(i))}return this}}class Nv{static triangulate(t,e,n=2){const i=e&&e.length,s=i?e[0]*n:t.length;let o=Bm(t,0,s,n,!0);const a=[];if(!o||o.next===o.prev)return a;let l,c,u,h,d,f,_;if(i&&(o=kv(t,e,o,n)),t.length>80*n){l=u=t[0],c=h=t[1];for(let g=n;g<s;g+=n)d=t[g],f=t[g+1],d<l&&(l=d),f<c&&(c=f),d>u&&(u=d),f>h&&(h=f);_=Math.max(u-l,h-c),_=_!==0?32767/_:0}return Sa(o,a,n,l,c,_,0),a}}function Bm(r,t,e,n,i){let s,o;if(i===Kv(r,t,e,n)>0)for(s=t;s<e;s+=n)o=Dd(s,r[s],r[s+1],o);else for(s=e-n;s>=t;s-=n)o=Dd(s,r[s],r[s+1],o);return o&&vc(o,o.next)&&(Ta(o),o=o.next),o}function bs(r,t){if(!r)return r;t||(t=r);let e=r,n;do if(n=!1,!e.steiner&&(vc(e,e.next)||Oe(e.prev,e,e.next)===0)){if(Ta(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Sa(r,t,e,n,i,s,o){if(!r)return;!o&&s&&Xv(r,n,i,s);let a=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?Ov(r,n,i,s):Fv(r)){t.push(l.i/e|0),t.push(r.i/e|0),t.push(c.i/e|0),Ta(r),r=c.next,a=c.next;continue}if(r=c,r===a){o?o===1?(r=Bv(bs(r),t,e),Sa(r,t,e,n,i,s,2)):o===2&&zv(r,t,e,n,i,s):Sa(bs(r),t,e,n,i,s,1);break}}}function Fv(r){const t=r.prev,e=r,n=r.next;if(Oe(t,e,n)>=0)return!1;const i=t.x,s=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=i<s?i<o?i:o:s<o?s:o,h=a<l?a<c?a:c:l<c?l:c,d=i>s?i>o?i:o:s>o?s:o,f=a>l?a>c?a:c:l>c?l:c;let _=n.next;for(;_!==t;){if(_.x>=u&&_.x<=d&&_.y>=h&&_.y<=f&&io(i,a,s,l,o,c,_.x,_.y)&&Oe(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Ov(r,t,e,n){const i=r.prev,s=r,o=r.next;if(Oe(i,s,o)>=0)return!1;const a=i.x,l=s.x,c=o.x,u=i.y,h=s.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,_=u<h?u<d?u:d:h<d?h:d,g=a>l?a>c?a:c:l>c?l:c,m=u>h?u>d?u:d:h>d?h:d,p=_h(f,_,t,e,n),M=_h(g,m,t,e,n);let x=r.prevZ,v=r.nextZ;for(;x&&x.z>=p&&v&&v.z<=M;){if(x.x>=f&&x.x<=g&&x.y>=_&&x.y<=m&&x!==i&&x!==o&&io(a,u,l,h,c,d,x.x,x.y)&&Oe(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=g&&v.y>=_&&v.y<=m&&v!==i&&v!==o&&io(a,u,l,h,c,d,v.x,v.y)&&Oe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=g&&x.y>=_&&x.y<=m&&x!==i&&x!==o&&io(a,u,l,h,c,d,x.x,x.y)&&Oe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=M;){if(v.x>=f&&v.x<=g&&v.y>=_&&v.y<=m&&v!==i&&v!==o&&io(a,u,l,h,c,d,v.x,v.y)&&Oe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Bv(r,t,e){let n=r;do{const i=n.prev,s=n.next.next;!vc(i,s)&&zm(i,n,n.next,s)&&Ea(i,s)&&Ea(s,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),Ta(n),Ta(n.next),n=r=s),n=n.next}while(n!==r);return bs(n)}function zv(r,t,e,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&$v(o,a)){let l=km(o,a);o=bs(o,o.next),l=bs(l,l.next),Sa(o,t,e,n,i,s,0),Sa(l,t,e,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function kv(r,t,e,n){const i=[];let s,o,a,l,c;for(s=0,o=t.length;s<o;s++)a=t[s]*n,l=s<o-1?t[s+1]*n:r.length,c=Bm(r,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(qv(c));for(i.sort(Hv),s=0;s<i.length;s++)e=Vv(i[s],e);return e}function Hv(r,t){return r.x-t.x}function Vv(r,t){const e=Gv(r,t);if(!e)return t;const n=km(e,r);return bs(n,n.next),bs(e,e.next)}function Gv(r,t){let e=t,n=-1/0,i;const s=r.x,o=r.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===s))return i}e=e.next}while(e!==t);if(!i)return null;const a=i,l=i.x,c=i.y;let u=1/0,h;e=i;do s>=e.x&&e.x>=l&&s!==e.x&&io(o<c?s:n,o,l,c,o<c?n:s,o,e.x,e.y)&&(h=Math.abs(o-e.y)/(s-e.x),Ea(e,r)&&(h<u||h===u&&(e.x>i.x||e.x===i.x&&Wv(i,e)))&&(i=e,u=h)),e=e.next;while(e!==a);return i}function Wv(r,t){return Oe(r.prev,r,t.prev)<0&&Oe(t.next,r,r.next)<0}function Xv(r,t,e,n){let i=r;do i.z===0&&(i.z=_h(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Yv(i)}function Yv(r){let t,e,n,i,s,o,a,l,c=1;do{for(e=r,r=null,s=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;e=n}s.nextZ=null,c*=2}while(o>1);return r}function _h(r,t,e,n,i){return r=(r-e)*i|0,t=(t-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function qv(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function io(r,t,e,n,i,s,o,a){return(i-o)*(t-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(i-o)*(n-a)}function $v(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!Zv(r,t)&&(Ea(r,t)&&Ea(t,r)&&Jv(r,t)&&(Oe(r.prev,r,t.prev)||Oe(r,t.prev,t))||vc(r,t)&&Oe(r.prev,r,r.next)>0&&Oe(t.prev,t,t.next)>0)}function Oe(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function vc(r,t){return r.x===t.x&&r.y===t.y}function zm(r,t,e,n){const i=fl(Oe(r,t,e)),s=fl(Oe(r,t,n)),o=fl(Oe(e,n,r)),a=fl(Oe(e,n,t));return!!(i!==s&&o!==a||i===0&&hl(r,e,t)||s===0&&hl(r,n,t)||o===0&&hl(e,r,n)||a===0&&hl(e,t,n))}function hl(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function fl(r){return r>0?1:r<0?-1:0}function Zv(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&zm(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function Ea(r,t){return Oe(r.prev,r,r.next)<0?Oe(r,t,r.next)>=0&&Oe(r,r.prev,t)>=0:Oe(r,t,r.prev)<0||Oe(r,r.next,t)<0}function Jv(r,t){let e=r,n=!1;const i=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==r);return n}function km(r,t){const e=new gh(r.i,r.x,r.y),n=new gh(t.i,t.x,t.y),i=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Dd(r,t,e,n){const i=new gh(r,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ta(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function gh(r,t,e){this.i=r,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Kv(r,t,e,n){let i=0;for(let s=t,o=e-n;s<e;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}class aa{static area(t){const e=t.length;let n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return aa.area(t)<0}static triangulateShape(t,e){const n=[],i=[],s=[];Ld(t),Id(n,t);let o=t.length;e.forEach(Ld);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,Id(n,e[l]);const a=Nv.triangulate(n,i);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function Ld(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function Id(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}class _f extends gc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new _f(t.radius,t.detail)}}class gf extends gc{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new gf(t.radius,t.detail)}}class xc extends bn{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,u=l+1,h=t/a,d=e/l,f=[],_=[],g=[],m=[];for(let p=0;p<u;p++){const M=p*d-o;for(let x=0;x<c;x++){const v=x*h-s;_.push(v,-M,0),g.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){const x=M+c*p,v=M+c*(p+1),b=M+1+c*(p+1),A=M+1+c*p;f.push(x,v,A),f.push(v,b,A)}this.setIndex(f),this.setAttribute("position",new de(_,3)),this.setAttribute("normal",new de(g,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xc(t.width,t.height,t.widthSegments,t.heightSegments)}}class vf extends bn{constructor(t=.5,e=1,n=32,i=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],u=[];let h=t;const d=(e-t)/i,f=new N,_=new xt;for(let g=0;g<=i;g++){for(let m=0;m<=n;m++){const p=s+m/n*o;f.x=h*Math.cos(p),f.y=h*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),_.x=(f.x/e+1)/2,_.y=(f.y/e+1)/2,u.push(_.x,_.y)}h+=d}for(let g=0;g<i;g++){const m=g*(n+1);for(let p=0;p<n;p++){const M=p+m,x=M,v=M+n+1,b=M+n+2,A=M+1;a.push(x,v,A),a.push(v,b,A)}}this.setIndex(a),this.setAttribute("position",new de(l,3)),this.setAttribute("normal",new de(c,3)),this.setAttribute("uv",new de(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vf(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class xf extends bn{constructor(t=new Om([new xt(0,.5),new xt(-.5,-.5),new xt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],i=[],s=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let u=0;u<t.length;u++)c(t[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new de(i,3)),this.setAttribute("normal",new de(s,3)),this.setAttribute("uv",new de(o,2));function c(u){const h=i.length/3,d=u.extractPoints(e);let f=d.shape;const _=d.holes;aa.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=_.length;m<p;m++){const M=_[m];aa.isClockWise(M)===!0&&(_[m]=M.reverse())}const g=aa.triangulateShape(f,_);for(let m=0,p=_.length;m<p;m++){const M=_[m];f=f.concat(M)}for(let m=0,p=f.length;m<p;m++){const M=f[m];i.push(M.x,M.y,0),s.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=g.length;m<p;m++){const M=g[m],x=M[0]+h,v=M[1]+h,b=M[2]+h;n.push(x,v,b),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return jv(e,t)}static fromJSON(t,e){const n=[];for(let i=0,s=t.shapes.length;i<s;i++){const o=e[t.shapes[i]];n.push(o)}return new xf(n,t.curveSegments)}}function jv(r,t){if(t.shapes=[],Array.isArray(r))for(let e=0,n=r.length;e<n;e++){const i=r[e];t.shapes.push(i.uuid)}else t.shapes.push(r.uuid);return t}class Bi extends bn{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new N,d=new N,f=[],_=[],g=[],m=[];for(let p=0;p<=n;p++){const M=[],x=p/n;let v=0;p===0&&o===0?v=.5/e:p===n&&l===Math.PI&&(v=-.5/e);for(let b=0;b<=e;b++){const A=b/e;h.x=-t*Math.cos(i+A*s)*Math.sin(o+x*a),h.y=t*Math.cos(o+x*a),h.z=t*Math.sin(i+A*s)*Math.sin(o+x*a),_.push(h.x,h.y,h.z),d.copy(h).normalize(),g.push(d.x,d.y,d.z),m.push(A+v,1-x),M.push(c++)}u.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){const x=u[p][M+1],v=u[p][M],b=u[p+1][M],A=u[p+1][M+1];(p!==0||o>0)&&f.push(x,v,A),(p!==n-1||l<Math.PI)&&f.push(v,b,A)}this.setIndex(f),this.setAttribute("position",new de(_,3)),this.setAttribute("normal",new de(g,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Mf extends bn{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],u=new N,h=new N,d=new N;for(let f=0;f<=n;f++)for(let _=0;_<=i;_++){const g=_/i*s,m=f/n*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(g),h.y=(t+e*Math.cos(m))*Math.sin(g),h.z=e*Math.sin(m),a.push(h.x,h.y,h.z),u.x=t*Math.cos(g),u.y=t*Math.sin(g),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(_/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let _=1;_<=i;_++){const g=(i+1)*f+_-1,m=(i+1)*(f-1)+_-1,p=(i+1)*(f-1)+_,M=(i+1)*f+_;o.push(g,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new de(a,3)),this.setAttribute("normal",new de(l,3)),this.setAttribute("uv",new de(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mf(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Mc extends bn{constructor(t=new Nm(new N(-1,-1,0),new N(-1,1,0),new N(1,1,0)),e=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:s};const o=t.computeFrenetFrames(e,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new N,l=new N,c=new xt;let u=new N;const h=[],d=[],f=[],_=[];g(),this.setIndex(_),this.setAttribute("position",new de(h,3)),this.setAttribute("normal",new de(d,3)),this.setAttribute("uv",new de(f,2));function g(){for(let x=0;x<e;x++)m(x);m(s===!1?e:0),M(),p()}function m(x){u=t.getPointAt(x/e,u);const v=o.normals[x],b=o.binormals[x];for(let A=0;A<=i;A++){const E=A/i*Math.PI*2,C=Math.sin(E),S=-Math.cos(E);l.x=S*v.x+C*b.x,l.y=S*v.y+C*b.y,l.z=S*v.z+C*b.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=e;x++)for(let v=1;v<=i;v++){const b=(i+1)*(x-1)+(v-1),A=(i+1)*x+(v-1),E=(i+1)*x+v,C=(i+1)*(x-1)+v;_.push(b,A,C),_.push(A,E,C)}}function M(){for(let x=0;x<=e;x++)for(let v=0;v<=i;v++)c.x=x/e,c.y=v/i,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Mc(new ph[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Qv extends za{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ce(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mm,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class tx extends za{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=M0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ex extends za{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Hm extends dn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ce(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class nx extends Hm{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(dn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ce(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const eu=new Ue,Ud=new N,Nd=new N;class ix{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ff,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new He(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ud.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ud),Nd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Nd),e.updateMatrixWorld(),eu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eu),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(eu)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Vm extends Rm{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class rx extends ix{constructor(){super(new Vm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sx extends Hm{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(dn.DEFAULT_UP),this.updateMatrix(),this.target=new dn,this.shadow=new rx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ox extends yi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t,this.index=0}}class ax{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Fd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Fd();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Fd(){return performance.now()}const Od=new Ue;class lx{constructor(t,e,n=0,i=1/0){this.ray=new Tm(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new uf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Od.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Od),this}intersectObject(t,e=!0,n=[]){return vh(t,this,n,e),n.sort(Bd),n}intersectObjects(t,e=!0,n=[]){for(let i=0,s=t.length;i<s;i++)vh(t[i],this,n,e);return n.sort(Bd),n}}function Bd(r,t){return r.distance-t.distance}function vh(r,t,e,n){let i=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let o=0,a=s.length;o<a;o++)vh(s[o],t,e,!0)}}function zd(r,t,e,n){const i=cx(n);switch(e){case pm:return r*t;case _m:return r*t;case gm:return r*t*2;case nf:return r*t/i.components*i.byteLength;case rf:return r*t/i.components*i.byteLength;case vm:return r*t*2/i.components*i.byteLength;case sf:return r*t*2/i.components*i.byteLength;case mm:return r*t*3/i.components*i.byteLength;case Ni:return r*t*4/i.components*i.byteLength;case of:return r*t*4/i.components*i.byteLength;case Il:case Ul:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Nl:case Fl:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Gu:case Xu:return Math.max(r,16)*Math.max(t,8)/4;case Vu:case Wu:return Math.max(r,8)*Math.max(t,8)/2;case Yu:case qu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case $u:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Zu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Ju:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Ku:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case ju:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Qu:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case th:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case eh:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case nh:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case ih:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case rh:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case sh:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case oh:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case ah:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case lh:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Ol:case ch:case uh:return Math.ceil(r/4)*Math.ceil(t/4)*16;case xm:case hh:return Math.ceil(r/4)*Math.ceil(t/4)*8;case fh:case dh:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cx(r){switch(r){case hr:case hm:return{byteLength:1,components:1};case Ma:case fm:case Fa:return{byteLength:2,components:1};case tf:case ef:return{byteLength:2,components:4};case Es:case Qh:case or:return{byteLength:4,components:1};case dm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jh);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Gm(){let r=null,t=!1,e=null,n=null;function i(s,o){e(s,o),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function ux(r){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(r.bindBuffer(c,a),h.length===0)r.bufferSubData(c,0,u);else{h.sort((f,_)=>f.start-_.start);let d=0;for(let f=1;f<h.length;f++){const _=h[d],g=h[f];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++d,h[d]=g)}h.length=d+1;for(let f=0,_=h.length;f<_;f++){const g=h[f];r.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(r.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}var hx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,dx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,px=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_x=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Mx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ex=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Tx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ax=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Px=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Dx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ix=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ux=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ox=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Yx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$x=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,eM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,iM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,rM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,oM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,aM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,uM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,fM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_M=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,MM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,SM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,EM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,TM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,AM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,CM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,RM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,PM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,DM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,LM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,IM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,UM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,NM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,FM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,OM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,BM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,kM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,HM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,VM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,GM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,WM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,XM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,YM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,qM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$M=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ZM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,JM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,KM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,jM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,QM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ty=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ey=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ny=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,iy=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ry=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,sy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,oy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ay=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ly=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const uy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dy=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,py=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,my=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_y=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gy=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vy=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,My=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ey=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ty=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,by=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ay=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ry=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Py=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Dy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ly=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Iy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ny=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Oy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,By=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,zy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ky=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Qt={alphahash_fragment:hx,alphahash_pars_fragment:fx,alphamap_fragment:dx,alphamap_pars_fragment:px,alphatest_fragment:mx,alphatest_pars_fragment:_x,aomap_fragment:gx,aomap_pars_fragment:vx,batching_pars_vertex:xx,batching_vertex:Mx,begin_vertex:yx,beginnormal_vertex:Sx,bsdfs:Ex,iridescence_fragment:Tx,bumpmap_pars_fragment:bx,clipping_planes_fragment:wx,clipping_planes_pars_fragment:Ax,clipping_planes_pars_vertex:Cx,clipping_planes_vertex:Rx,color_fragment:Px,color_pars_fragment:Dx,color_pars_vertex:Lx,color_vertex:Ix,common:Ux,cube_uv_reflection_fragment:Nx,defaultnormal_vertex:Fx,displacementmap_pars_vertex:Ox,displacementmap_vertex:Bx,emissivemap_fragment:zx,emissivemap_pars_fragment:kx,colorspace_fragment:Hx,colorspace_pars_fragment:Vx,envmap_fragment:Gx,envmap_common_pars_fragment:Wx,envmap_pars_fragment:Xx,envmap_pars_vertex:Yx,envmap_physical_pars_fragment:iM,envmap_vertex:qx,fog_vertex:$x,fog_pars_vertex:Zx,fog_fragment:Jx,fog_pars_fragment:Kx,gradientmap_pars_fragment:jx,lightmap_pars_fragment:Qx,lights_lambert_fragment:tM,lights_lambert_pars_fragment:eM,lights_pars_begin:nM,lights_toon_fragment:rM,lights_toon_pars_fragment:sM,lights_phong_fragment:oM,lights_phong_pars_fragment:aM,lights_physical_fragment:lM,lights_physical_pars_fragment:cM,lights_fragment_begin:uM,lights_fragment_maps:hM,lights_fragment_end:fM,logdepthbuf_fragment:dM,logdepthbuf_pars_fragment:pM,logdepthbuf_pars_vertex:mM,logdepthbuf_vertex:_M,map_fragment:gM,map_pars_fragment:vM,map_particle_fragment:xM,map_particle_pars_fragment:MM,metalnessmap_fragment:yM,metalnessmap_pars_fragment:SM,morphinstance_vertex:EM,morphcolor_vertex:TM,morphnormal_vertex:bM,morphtarget_pars_vertex:wM,morphtarget_vertex:AM,normal_fragment_begin:CM,normal_fragment_maps:RM,normal_pars_fragment:PM,normal_pars_vertex:DM,normal_vertex:LM,normalmap_pars_fragment:IM,clearcoat_normal_fragment_begin:UM,clearcoat_normal_fragment_maps:NM,clearcoat_pars_fragment:FM,iridescence_pars_fragment:OM,opaque_fragment:BM,packing:zM,premultiplied_alpha_fragment:kM,project_vertex:HM,dithering_fragment:VM,dithering_pars_fragment:GM,roughnessmap_fragment:WM,roughnessmap_pars_fragment:XM,shadowmap_pars_fragment:YM,shadowmap_pars_vertex:qM,shadowmap_vertex:$M,shadowmask_pars_fragment:ZM,skinbase_vertex:JM,skinning_pars_vertex:KM,skinning_vertex:jM,skinnormal_vertex:QM,specularmap_fragment:ty,specularmap_pars_fragment:ey,tonemapping_fragment:ny,tonemapping_pars_fragment:iy,transmission_fragment:ry,transmission_pars_fragment:sy,uv_pars_fragment:oy,uv_pars_vertex:ay,uv_vertex:ly,worldpos_vertex:cy,background_vert:uy,background_frag:hy,backgroundCube_vert:fy,backgroundCube_frag:dy,cube_vert:py,cube_frag:my,depth_vert:_y,depth_frag:gy,distanceRGBA_vert:vy,distanceRGBA_frag:xy,equirect_vert:My,equirect_frag:yy,linedashed_vert:Sy,linedashed_frag:Ey,meshbasic_vert:Ty,meshbasic_frag:by,meshlambert_vert:wy,meshlambert_frag:Ay,meshmatcap_vert:Cy,meshmatcap_frag:Ry,meshnormal_vert:Py,meshnormal_frag:Dy,meshphong_vert:Ly,meshphong_frag:Iy,meshphysical_vert:Uy,meshphysical_frag:Ny,meshtoon_vert:Fy,meshtoon_frag:Oy,points_vert:By,points_frag:zy,shadow_vert:ky,shadow_frag:Hy,sprite_vert:Vy,sprite_frag:Gy},gt={common:{diffuse:{value:new ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new ce(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},Hi={basic:{uniforms:Ln([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Ln([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new ce(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Ln([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new ce(0)},specular:{value:new ce(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Ln([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Ln([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new ce(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Ln([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Ln([gt.points,gt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Ln([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Ln([gt.common,gt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Ln([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Ln([gt.sprite,gt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Ln([gt.common,gt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Ln([gt.lights,gt.fog,{color:{value:new ce(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};Hi.physical={uniforms:Ln([Hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new ce(0)},specularColor:{value:new ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const dl={r:0,b:0,g:0},$r=new fr,Wy=new Ue;function Xy(r,t,e,n,i,s,o){const a=new ce(0);let l=s===!0?0:1,c,u,h=null,d=0,f=null;function _(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function g(x){let v=!1;const b=_(x);b===null?p(a,l):b&&b.isColor&&(p(b,1),v=!0);const A=r.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(x,v){const b=_(v);b&&(b.isCubeTexture||b.mapping===pc)?(u===void 0&&(u=new At(new yn(1,1,1),new Or({name:"BackgroundCubeMaterial",uniforms:Ro(Hi.backgroundCube.uniforms),vertexShader:Hi.backgroundCube.vertexShader,fragmentShader:Hi.backgroundCube.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),$r.copy(v.backgroundRotation),$r.x*=-1,$r.y*=-1,$r.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&($r.y*=-1,$r.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Wy.makeRotationFromEuler($r)),u.material.toneMapped=_e.getTransfer(b.colorSpace)!==Se,(h!==b||d!==b.version||f!==r.toneMapping)&&(u.material.needsUpdate=!0,h=b,d=b.version,f=r.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new At(new xc(2,2),new Or({name:"BackgroundMaterial",uniforms:Ro(Hi.background.uniforms),vertexShader:Hi.background.vertexShader,fragmentShader:Hi.background.fragmentShader,side:Fr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=_e.getTransfer(b.colorSpace)!==Se,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||d!==b.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,h=b,d=b.version,f=r.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,v){x.getRGB(dl,Cm(r)),n.buffers.color.setClear(dl.r,dl.g,dl.b,v,o)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(a,l)},render:g,addToRenderList:m,dispose:M}}function Yy(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null);let s=i,o=!1;function a(y,D,U,z,B){let k=!1;const H=h(z,U,D);s!==H&&(s=H,c(s.object)),k=f(y,z,U,B),k&&_(y,z,U,B),B!==null&&t.update(B,r.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,v(y,D,U,z),B!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return r.createVertexArray()}function c(y){return r.bindVertexArray(y)}function u(y){return r.deleteVertexArray(y)}function h(y,D,U){const z=U.wireframe===!0;let B=n[y.id];B===void 0&&(B={},n[y.id]=B);let k=B[D.id];k===void 0&&(k={},B[D.id]=k);let H=k[z];return H===void 0&&(H=d(l()),k[z]=H),H}function d(y){const D=[],U=[],z=[];for(let B=0;B<e;B++)D[B]=0,U[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:U,attributeDivisors:z,object:y,attributes:{},index:null}}function f(y,D,U,z){const B=s.attributes,k=D.attributes;let H=0;const q=U.getAttributes();for(const G in q)if(q[G].location>=0){const R=B[G];let K=k[G];if(K===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(K=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(K=y.instanceColor)),R===void 0||R.attribute!==K||K&&R.data!==K.data)return!0;H++}return s.attributesNum!==H||s.index!==z}function _(y,D,U,z){const B={},k=D.attributes;let H=0;const q=U.getAttributes();for(const G in q)if(q[G].location>=0){let R=k[G];R===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(R=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(R=y.instanceColor));const K={};K.attribute=R,R&&R.data&&(K.data=R.data),B[G]=K,H++}s.attributes=B,s.attributesNum=H,s.index=z}function g(){const y=s.newAttributes;for(let D=0,U=y.length;D<U;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const U=s.newAttributes,z=s.enabledAttributes,B=s.attributeDivisors;U[y]=1,z[y]===0&&(r.enableVertexAttribArray(y),z[y]=1),B[y]!==D&&(r.vertexAttribDivisor(y,D),B[y]=D)}function M(){const y=s.newAttributes,D=s.enabledAttributes;for(let U=0,z=D.length;U<z;U++)D[U]!==y[U]&&(r.disableVertexAttribArray(U),D[U]=0)}function x(y,D,U,z,B,k,H){H===!0?r.vertexAttribIPointer(y,D,U,B,k):r.vertexAttribPointer(y,D,U,z,B,k)}function v(y,D,U,z){g();const B=z.attributes,k=U.getAttributes(),H=D.defaultAttributeValues;for(const q in k){const G=k[q];if(G.location>=0){let nt=B[q];if(nt===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(nt=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(nt=y.instanceColor)),nt!==void 0){const R=nt.normalized,K=nt.itemSize,pt=t.get(nt);if(pt===void 0)continue;const Ft=pt.buffer,$=pt.type,et=pt.bytesPerElement,ot=$===r.INT||$===r.UNSIGNED_INT||nt.gpuType===Qh;if(nt.isInterleavedBufferAttribute){const rt=nt.data,wt=rt.stride,Ht=nt.offset;if(rt.isInstancedInterleavedBuffer){for(let Ut=0;Ut<G.locationSize;Ut++)p(G.location+Ut,rt.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ut=0;Ut<G.locationSize;Ut++)m(G.location+Ut);r.bindBuffer(r.ARRAY_BUFFER,Ft);for(let Ut=0;Ut<G.locationSize;Ut++)x(G.location+Ut,K/G.locationSize,$,R,wt*et,(Ht+K/G.locationSize*Ut)*et,ot)}else{if(nt.isInstancedBufferAttribute){for(let rt=0;rt<G.locationSize;rt++)p(G.location+rt,nt.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let rt=0;rt<G.locationSize;rt++)m(G.location+rt);r.bindBuffer(r.ARRAY_BUFFER,Ft);for(let rt=0;rt<G.locationSize;rt++)x(G.location+rt,K/G.locationSize,$,R,K*et,K/G.locationSize*rt*et,ot)}}else if(H!==void 0){const R=H[q];if(R!==void 0)switch(R.length){case 2:r.vertexAttrib2fv(G.location,R);break;case 3:r.vertexAttrib3fv(G.location,R);break;case 4:r.vertexAttrib4fv(G.location,R);break;default:r.vertexAttrib1fv(G.location,R)}}}}M()}function b(){C();for(const y in n){const D=n[y];for(const U in D){const z=D[U];for(const B in z)u(z[B].object),delete z[B];delete D[U]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;const D=n[y.id];for(const U in D){const z=D[U];for(const B in z)u(z[B].object),delete z[B];delete D[U]}delete n[y.id]}function E(y){for(const D in n){const U=n[D];if(U[y.id]===void 0)continue;const z=U[y.id];for(const B in z)u(z[B].object),delete z[B];delete U[y.id]}}function C(){S(),o=!0,s!==i&&(s=i,c(s.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:b,releaseStatesOfGeometry:A,releaseStatesOfProgram:E,initAttributes:g,enableAttribute:m,disableUnusedAttributes:M}}function qy(r,t,e){let n;function i(c){n=c}function s(c,u){r.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(r.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let _=0;_<h;_++)f+=u[_];e.update(f,n,1)}function l(c,u,h,d){if(h===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let _=0;_<c.length;_++)o(c[_],u[_],d[_]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let _=0;for(let g=0;g<h;g++)_+=u[g]*d[g];e.update(_,n,1)}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function $y(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(E){return!(E!==Ni&&n.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const C=E===Fa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==hr&&n.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==or&&!C)}function l(E){if(E==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),M=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),x=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),b=_>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:b,maxSamples:A}}function Zy(r){const t=this;let e=null,n=0,i=!1,s=!1;const o=new es,a=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||i;return i=d,n=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const _=h.clippingPlanes,g=h.clipIntersection,m=h.clipShadows,p=r.get(h);if(!i||_===null||_.length===0||s&&!m)s?u(null):c();else{const M=s?0:n,x=M*4;let v=p.clippingState||null;l.value=v,v=u(_,d,x,f);for(let b=0;b!==x;++b)v[b]=e[b];p.clippingState=v,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,_){const g=h!==null?h.length:0;let m=null;if(g!==0){if(m=l.value,_!==!0||m===null){const p=f+g*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=f;x!==g;++x,v+=4)o.copy(h[x]).applyMatrix4(M,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function Jy(r){let t=new WeakMap;function e(o,a){return a===Bu?o.mapping=To:a===zu&&(o.mapping=bo),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Bu||a===zu)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new vv(l.height);return c.fromEquirectangularTexture(r,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const ro=4,kd=[.125,.215,.35,.446,.526,.582],as=20,nu=new Vm,Hd=new ce;let iu=null,ru=0,su=0,ou=!1;const ns=(1+Math.sqrt(5))/2,qs=1/ns,Vd=[new N(-ns,qs,0),new N(ns,qs,0),new N(-qs,0,ns),new N(qs,0,ns),new N(0,ns,-qs),new N(0,ns,qs),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Ky=new N;class Gd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,s={}){const{size:o=256,position:a=Ky}=s;iu=this._renderer.getRenderTarget(),ru=this._renderer.getActiveCubeFace(),su=this._renderer.getActiveMipmapLevel(),ou=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(iu,ru,su),this._renderer.xr.enabled=ou,t.scissorTest=!1,pl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===To||t.mapping===bo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),iu=this._renderer.getRenderTarget(),ru=this._renderer.getActiveCubeFace(),su=this._renderer.getActiveMipmapLevel(),ou=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Gi,minFilter:Gi,generateMipmaps:!1,type:Fa,format:Ni,colorSpace:Co,depthBuffer:!1},i=Wd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wd(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jy(s)),this._blurMaterial=Qy(s,t,e)}return i}_compileMaterial(t){const e=new At(this._lodPlanes[0],t);this._renderer.compile(e,nu)}_sceneToCubeUV(t,e,n,i,s){const l=new yi(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Hd),h.toneMapping=Lr,h.autoClear=!1;const _=new Fi({name:"PMREM.Background",side:On,depthWrite:!1,depthTest:!1}),g=new At(new yn,_);let m=!1;const p=t.background;p?p.isColor&&(_.color.copy(p),t.background=null,m=!0):(_.color.copy(Hd),m=!0);for(let M=0;M<6;M++){const x=M%3;x===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[M],s.y,s.z)):x===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[M]));const v=this._cubeSize;pl(i,x*v,M>2?v:0,v,v),h.setRenderTarget(i),m&&h.render(g,l),h.render(t,l)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===To||t.mapping===bo;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xd());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new At(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;pl(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,nu)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Vd[(i-s-1)%Vd.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",s),this._halfBlur(o,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new At(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,_=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*as-1),g=s/_,m=isFinite(s)?1+Math.floor(u*g):as;m>as&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${as}`);const p=[];let M=0;for(let E=0;E<as;++E){const C=E/g,S=Math.exp(-C*C/2);p.push(S),E===0?M+=S:E<m&&(M+=2*S)}for(let E=0;E<p.length;E++)p[E]=p[E]/M;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=_,d.mipInt.value=x-n;const v=this._sizeLods[i],b=3*v*(i>x-ro?i-x+ro:0),A=4*(this._cubeSize-v);pl(e,b,A,3*v,2*v),l.setRenderTarget(e),l.render(h,nu)}}function jy(r){const t=[],e=[],n=[];let i=r;const s=r-ro+1+kd.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>r-ro?l=kd[o-r+ro-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,_=6,g=3,m=2,p=1,M=new Float32Array(g*_*f),x=new Float32Array(m*_*f),v=new Float32Array(p*_*f);for(let A=0;A<f;A++){const E=A%3*2/3-1,C=A>2?0:-1,S=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];M.set(S,g*_*A),x.set(d,m*_*A);const y=[A,A,A,A,A,A];v.set(y,p*_*A)}const b=new bn;b.setAttribute("position",new Oi(M,g)),b.setAttribute("uv",new Oi(x,m)),b.setAttribute("faceIndex",new Oi(v,p)),t.push(b),i>ro&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Wd(r,t,e){const n=new Ts(r,t,e);return n.texture.mapping=pc,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function pl(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function Qy(r,t,e){const n=new Float32Array(as),i=new N(0,1,0);return new Or({name:"SphericalGaussianBlur",defines:{n:as,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Dr,depthTest:!1,depthWrite:!1})}function Xd(){return new Or({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Dr,depthTest:!1,depthWrite:!1})}function Yd(){return new Or({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dr,depthTest:!1,depthWrite:!1})}function yf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function tS(r){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Bu||l===zu,u=l===To||l===bo;if(c||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Gd(r)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&i(f)?(e===null&&(e=new Gd(r)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function i(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function eS(r){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&ts("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function nS(r,t,e,n){const i={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);d.removeEventListener("dispose",o),delete i[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],r.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,_=h.attributes.position;let g=0;if(f!==null){const M=f.array;g=f.version;for(let x=0,v=M.length;x<v;x+=3){const b=M[x+0],A=M[x+1],E=M[x+2];d.push(b,A,A,E,E,b)}}else if(_!==void 0){const M=_.array;g=_.version;for(let x=0,v=M.length/3-1;x<v;x+=3){const b=x+0,A=x+1,E=x+2;d.push(b,A,A,E,E,b)}}else return;const m=new(Sm(d)?Am:wm)(d,1);m.version=g;const p=s.get(h);p&&t.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function iS(r,t,e){let n;function i(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){r.drawElements(n,f,s,d*o),e.update(f,n,1)}function c(d,f,_){_!==0&&(r.drawElementsInstanced(n,f,s,d*o,_),e.update(f,n,_))}function u(d,f,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,_);let m=0;for(let p=0;p<_;p++)m+=f[p];e.update(m,n,1)}function h(d,f,_,g){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],g[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,g,0,_);let p=0;for(let M=0;M<_;M++)p+=f[M]*g[M];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function rS(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function sS(r,t,e){const n=new WeakMap,i=new He;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let y=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var f=y;d!==void 0&&d.texture.dispose();const _=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let v=0;_===!0&&(v=1),g===!0&&(v=2),m===!0&&(v=3);let b=a.attributes.position.count*v,A=1;b>t.maxTextureSize&&(A=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const E=new Float32Array(b*A*4*h),C=new Em(E,b,A,h);C.type=or,C.needsUpdate=!0;const S=v*4;for(let D=0;D<h;D++){const U=p[D],z=M[D],B=x[D],k=b*A*4*D;for(let H=0;H<U.count;H++){const q=H*S;_===!0&&(i.fromBufferAttribute(U,H),E[k+q+0]=i.x,E[k+q+1]=i.y,E[k+q+2]=i.z,E[k+q+3]=0),g===!0&&(i.fromBufferAttribute(z,H),E[k+q+4]=i.x,E[k+q+5]=i.y,E[k+q+6]=i.z,E[k+q+7]=0),m===!0&&(i.fromBufferAttribute(B,H),E[k+q+8]=i.x,E[k+q+9]=i.y,E[k+q+10]=i.z,E[k+q+11]=B.itemSize===4?i.w:1)}}d={count:h,texture:C,size:new xt(b,A)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const g=a.morphTargetsRelative?1:1-_;l.getUniforms().setValue(r,"morphTargetBaseInfluence",g),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function oS(r,t,e,n){let i=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(i.get(h)!==c&&(t.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return h}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}const Wm=new zn,qd=new Dm(1,1),Xm=new Em,Ym=new ev,qm=new Pm,$d=[],Zd=[],Jd=new Float32Array(16),Kd=new Float32Array(9),jd=new Float32Array(4);function Bo(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=$d[i];if(s===void 0&&(s=new Float32Array(i),$d[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function rn(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function sn(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function yc(r,t){let e=Zd[t];e===void 0&&(e=new Int32Array(t),Zd[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function aS(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function lS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;r.uniform2fv(this.addr,t),sn(e,t)}}function cS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;r.uniform3fv(this.addr,t),sn(e,t)}}function uS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;r.uniform4fv(this.addr,t),sn(e,t)}}function hS(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(rn(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),sn(e,t)}else{if(rn(e,n))return;jd.set(n),r.uniformMatrix2fv(this.addr,!1,jd),sn(e,n)}}function fS(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(rn(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),sn(e,t)}else{if(rn(e,n))return;Kd.set(n),r.uniformMatrix3fv(this.addr,!1,Kd),sn(e,n)}}function dS(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(rn(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),sn(e,t)}else{if(rn(e,n))return;Jd.set(n),r.uniformMatrix4fv(this.addr,!1,Jd),sn(e,n)}}function pS(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function mS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;r.uniform2iv(this.addr,t),sn(e,t)}}function _S(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;r.uniform3iv(this.addr,t),sn(e,t)}}function gS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;r.uniform4iv(this.addr,t),sn(e,t)}}function vS(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function xS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;r.uniform2uiv(this.addr,t),sn(e,t)}}function MS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;r.uniform3uiv(this.addr,t),sn(e,t)}}function yS(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;r.uniform4uiv(this.addr,t),sn(e,t)}}function SS(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(qd.compareFunction=ym,s=qd):s=Wm,e.setTexture2D(t||s,i)}function ES(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Ym,i)}function TS(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||qm,i)}function bS(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Xm,i)}function wS(r){switch(r){case 5126:return aS;case 35664:return lS;case 35665:return cS;case 35666:return uS;case 35674:return hS;case 35675:return fS;case 35676:return dS;case 5124:case 35670:return pS;case 35667:case 35671:return mS;case 35668:case 35672:return _S;case 35669:case 35673:return gS;case 5125:return vS;case 36294:return xS;case 36295:return MS;case 36296:return yS;case 35678:case 36198:case 36298:case 36306:case 35682:return SS;case 35679:case 36299:case 36307:return ES;case 35680:case 36300:case 36308:case 36293:return TS;case 36289:case 36303:case 36311:case 36292:return bS}}function AS(r,t){r.uniform1fv(this.addr,t)}function CS(r,t){const e=Bo(t,this.size,2);r.uniform2fv(this.addr,e)}function RS(r,t){const e=Bo(t,this.size,3);r.uniform3fv(this.addr,e)}function PS(r,t){const e=Bo(t,this.size,4);r.uniform4fv(this.addr,e)}function DS(r,t){const e=Bo(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function LS(r,t){const e=Bo(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function IS(r,t){const e=Bo(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function US(r,t){r.uniform1iv(this.addr,t)}function NS(r,t){r.uniform2iv(this.addr,t)}function FS(r,t){r.uniform3iv(this.addr,t)}function OS(r,t){r.uniform4iv(this.addr,t)}function BS(r,t){r.uniform1uiv(this.addr,t)}function zS(r,t){r.uniform2uiv(this.addr,t)}function kS(r,t){r.uniform3uiv(this.addr,t)}function HS(r,t){r.uniform4uiv(this.addr,t)}function VS(r,t,e){const n=this.cache,i=t.length,s=yc(e,i);rn(n,s)||(r.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Wm,s[o])}function GS(r,t,e){const n=this.cache,i=t.length,s=yc(e,i);rn(n,s)||(r.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Ym,s[o])}function WS(r,t,e){const n=this.cache,i=t.length,s=yc(e,i);rn(n,s)||(r.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||qm,s[o])}function XS(r,t,e){const n=this.cache,i=t.length,s=yc(e,i);rn(n,s)||(r.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Xm,s[o])}function YS(r){switch(r){case 5126:return AS;case 35664:return CS;case 35665:return RS;case 35666:return PS;case 35674:return DS;case 35675:return LS;case 35676:return IS;case 5124:case 35670:return US;case 35667:case 35671:return NS;case 35668:case 35672:return FS;case 35669:case 35673:return OS;case 5125:return BS;case 36294:return zS;case 36295:return kS;case 36296:return HS;case 35678:case 36198:case 36298:case 36306:case 35682:return VS;case 35679:case 36299:case 36307:return GS;case 35680:case 36300:case 36308:case 36293:return WS;case 36289:case 36303:case 36311:case 36292:return XS}}class qS{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=wS(e.type)}}class $S{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=YS(e.type)}}class ZS{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(t,e[a.id],n)}}}const au=/(\w+)(\])?(\[|\.)?/g;function Qd(r,t){r.seq.push(t),r.map[t.id]=t}function JS(r,t,e){const n=r.name,i=n.length;for(au.lastIndex=0;;){const s=au.exec(n),o=au.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Qd(e,c===void 0?new qS(a,r,t):new $S(a,r,t));break}else{let h=e.map[a];h===void 0&&(h=new ZS(a),Qd(e,h)),e=h}}}class Bl{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),o=t.getUniformLocation(e,s.name);JS(s,o,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function tp(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const KS=37297;let jS=0;function QS(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const ep=new jt;function tE(r){_e._getMatrix(ep,_e.workingColorSpace,r);const t=`mat3( ${ep.elements.map(e=>e.toFixed(4))} )`;switch(_e.getTransfer(r)){case $l:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function np(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),i=r.getShaderInfoLog(t).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+i+`

`+QS(r.getShaderSource(t),o)}else return i}function eE(r,t){const e=tE(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function nE(r,t){let e;switch(t){case f0:e="Linear";break;case d0:e="Reinhard";break;case p0:e="Cineon";break;case m0:e="ACESFilmic";break;case g0:e="AgX";break;case v0:e="Neutral";break;case _0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ml=new N;function iE(){_e.getLuminanceCoefficients(ml);const r=ml.x.toFixed(4),t=ml.y.toFixed(4),e=ml.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rE(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qo).join(`
`)}function sE(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function oE(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function qo(r){return r!==""}function ip(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rp(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const aE=/^[ \t]*#include +<([\w\d./]+)>/gm;function xh(r){return r.replace(aE,cE)}const lE=new Map;function cE(r,t){let e=Qt[t];if(e===void 0){const n=lE.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return xh(e)}const uE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sp(r){return r.replace(uE,hE)}function hE(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function op(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function fE(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===lm?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Xg?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===nr&&(t="SHADOWMAP_TYPE_VSM"),t}function dE(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case To:case bo:t="ENVMAP_TYPE_CUBE";break;case pc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function pE(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case bo:t="ENVMAP_MODE_REFRACTION";break}return t}function mE(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case cm:t="ENVMAP_BLENDING_MULTIPLY";break;case u0:t="ENVMAP_BLENDING_MIX";break;case h0:t="ENVMAP_BLENDING_ADD";break}return t}function _E(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function gE(r,t,e,n){const i=r.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=fE(e),c=dE(e),u=pE(e),h=mE(e),d=_E(e),f=rE(e),_=sE(s),g=i.createProgram();let m,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(qo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(qo).join(`
`),p.length>0&&(p+=`
`)):(m=[op(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qo).join(`
`),p=[op(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Lr?"#define TONE_MAPPING":"",e.toneMapping!==Lr?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Lr?nE("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,eE("linearToOutputTexel",e.outputColorSpace),iE(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qo).join(`
`)),o=xh(o),o=ip(o,e),o=rp(o,e),a=xh(a),a=ip(a,e),a=rp(a,e),o=sp(o),a=sp(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===hd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===hd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=M+m+o,v=M+p+a,b=tp(i,i.VERTEX_SHADER,x),A=tp(i,i.FRAGMENT_SHADER,v);i.attachShader(g,b),i.attachShader(g,A),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function E(D){if(r.debug.checkShaderErrors){const U=i.getProgramInfoLog(g).trim(),z=i.getShaderInfoLog(b).trim(),B=i.getShaderInfoLog(A).trim();let k=!0,H=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(k=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,g,b,A);else{const q=np(i,b,"vertex"),G=np(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+U+`
`+q+`
`+G)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(z===""||B==="")&&(H=!1);H&&(D.diagnostics={runnable:k,programLog:U,vertexShader:{log:z,prefix:m},fragmentShader:{log:B,prefix:p}})}i.deleteShader(b),i.deleteShader(A),C=new Bl(i,g),S=oE(i,g)}let C;this.getUniforms=function(){return C===void 0&&E(this),C};let S;this.getAttributes=function(){return S===void 0&&E(this),S};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(g,KS)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jS++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=b,this.fragmentShader=A,this}let vE=0;class xE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new ME(t),e.set(t,n)),n}}class ME{constructor(t){this.id=vE++,this.code=t,this.usedTimes=0}}function yE(r,t,e,n,i,s,o){const a=new uf,l=new xE,c=new Set,u=[],h=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,y,D,U,z){const B=U.fog,k=z.geometry,H=S.isMeshStandardMaterial?U.environment:null,q=(S.isMeshStandardMaterial?e:t).get(S.envMap||H),G=q&&q.mapping===pc?q.image.height:null,nt=_[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const R=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,K=R!==void 0?R.length:0;let pt=0;k.morphAttributes.position!==void 0&&(pt=1),k.morphAttributes.normal!==void 0&&(pt=2),k.morphAttributes.color!==void 0&&(pt=3);let Ft,$,et,ot;if(nt){const vt=Hi[nt];Ft=vt.vertexShader,$=vt.fragmentShader}else Ft=S.vertexShader,$=S.fragmentShader,l.update(S),et=l.getVertexShaderID(S),ot=l.getFragmentShaderID(S);const rt=r.getRenderTarget(),wt=r.state.buffers.depth.getReversed(),Ht=z.isInstancedMesh===!0,Ut=z.isBatchedMesh===!0,le=!!S.map,ee=!!S.matcap,St=!!q,L=!!S.aoMap,Ee=!!S.lightMap,Vt=!!S.bumpMap,V=!!S.normalMap,Tt=!!S.displacementMap,ue=!!S.emissiveMap,Ct=!!S.metalnessMap,P=!!S.roughnessMap,T=S.anisotropy>0,W=S.clearcoat>0,tt=S.dispersion>0,Q=S.iridescence>0,J=S.sheen>0,ht=S.transmission>0,lt=T&&!!S.anisotropyMap,dt=W&&!!S.clearcoatMap,$t=W&&!!S.clearcoatNormalMap,st=W&&!!S.clearcoatRoughnessMap,at=Q&&!!S.iridescenceMap,Ot=Q&&!!S.iridescenceThicknessMap,Nt=J&&!!S.sheenColorMap,Mt=J&&!!S.sheenRoughnessMap,Jt=!!S.specularMap,kt=!!S.specularColorMap,fe=!!S.specularIntensityMap,I=ht&&!!S.transmissionMap,ut=ht&&!!S.thicknessMap,Z=!!S.gradientMap,j=!!S.alphaMap,ct=S.alphaTest>0,ft=!!S.alphaHash,Gt=!!S.extensions;let pe=Lr;S.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(pe=r.toneMapping);const ze={shaderID:nt,shaderType:S.type,shaderName:S.name,vertexShader:Ft,fragmentShader:$,defines:S.defines,customVertexShaderID:et,customFragmentShaderID:ot,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Ut,batchingColor:Ut&&z._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&z.instanceColor!==null,instancingMorph:Ht&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:rt===null?r.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Co,alphaToCoverage:!!S.alphaToCoverage,map:le,matcap:ee,envMap:St,envMapMode:St&&q.mapping,envMapCubeUVHeight:G,aoMap:L,lightMap:Ee,bumpMap:Vt,normalMap:V,displacementMap:d&&Tt,emissiveMap:ue,normalMapObjectSpace:V&&S.normalMapType===S0,normalMapTangentSpace:V&&S.normalMapType===Mm,metalnessMap:Ct,roughnessMap:P,anisotropy:T,anisotropyMap:lt,clearcoat:W,clearcoatMap:dt,clearcoatNormalMap:$t,clearcoatRoughnessMap:st,dispersion:tt,iridescence:Q,iridescenceMap:at,iridescenceThicknessMap:Ot,sheen:J,sheenColorMap:Nt,sheenRoughnessMap:Mt,specularMap:Jt,specularColorMap:kt,specularIntensityMap:fe,transmission:ht,transmissionMap:I,thicknessMap:ut,gradientMap:Z,opaque:S.transparent===!1&&S.blending===ho&&S.alphaToCoverage===!1,alphaMap:j,alphaTest:ct,alphaHash:ft,combine:S.combine,mapUv:le&&g(S.map.channel),aoMapUv:L&&g(S.aoMap.channel),lightMapUv:Ee&&g(S.lightMap.channel),bumpMapUv:Vt&&g(S.bumpMap.channel),normalMapUv:V&&g(S.normalMap.channel),displacementMapUv:Tt&&g(S.displacementMap.channel),emissiveMapUv:ue&&g(S.emissiveMap.channel),metalnessMapUv:Ct&&g(S.metalnessMap.channel),roughnessMapUv:P&&g(S.roughnessMap.channel),anisotropyMapUv:lt&&g(S.anisotropyMap.channel),clearcoatMapUv:dt&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:$t&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ot&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Nt&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&g(S.sheenRoughnessMap.channel),specularMapUv:Jt&&g(S.specularMap.channel),specularColorMapUv:kt&&g(S.specularColorMap.channel),specularIntensityMapUv:fe&&g(S.specularIntensityMap.channel),transmissionMapUv:I&&g(S.transmissionMap.channel),thicknessMapUv:ut&&g(S.thicknessMap.channel),alphaMapUv:j&&g(S.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(V||T),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!k.attributes.uv&&(le||j),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:wt,skinning:z.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:pt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:r.shadowMap.enabled&&D.length>0,shadowMapType:r.shadowMap.type,toneMapping:pe,decodeVideoTexture:le&&S.map.isVideoTexture===!0&&_e.getTransfer(S.map.colorSpace)===Se,decodeVideoTextureEmissive:ue&&S.emissiveMap.isVideoTexture===!0&&_e.getTransfer(S.emissiveMap.colorSpace)===Se,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ti,flipSided:S.side===On,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Gt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&S.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function p(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const D in S.defines)y.push(D),y.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(M(y,S),x(y,S),y.push(r.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function M(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function x(S,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),S.push(a.mask)}function v(S){const y=_[S.type];let D;if(y){const U=Hi[y];D=pv.clone(U.uniforms)}else D=S.uniforms;return D}function b(S,y){let D;for(let U=0,z=u.length;U<z;U++){const B=u[U];if(B.cacheKey===y){D=B,++D.usedTimes;break}}return D===void 0&&(D=new gE(r,y,S,s),u.push(D)),D}function A(S){if(--S.usedTimes===0){const y=u.indexOf(S);u[y]=u[u.length-1],u.pop(),S.destroy()}}function E(S){l.remove(S)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:b,releaseProgram:A,releaseShaderCache:E,programs:u,dispose:C}}function SE(){let r=new WeakMap;function t(o){return r.has(o)}function e(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,l){r.get(o)[a]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function EE(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function ap(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function lp(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(h,d,f,_,g,m){let p=r[t];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:_,renderOrder:h.renderOrder,z:g,group:m},r[t]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=_,p.renderOrder=h.renderOrder,p.z=g,p.group=m),t++,p}function a(h,d,f,_,g,m){const p=o(h,d,f,_,g,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(h,d,f,_,g,m){const p=o(h,d,f,_,g,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(h,d){e.length>1&&e.sort(h||EE),n.length>1&&n.sort(d||ap),i.length>1&&i.sort(d||ap)}function u(){for(let h=t,d=r.length;h<d;h++){const f=r[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:a,unshift:l,finish:u,sort:c}}function TE(){let r=new WeakMap;function t(n,i){const s=r.get(n);let o;return s===void 0?(o=new lp,r.set(n,[o])):i>=s.length?(o=new lp,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function bE(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new ce};break;case"SpotLight":e={position:new N,direction:new N,color:new ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new ce,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new ce,groundColor:new ce};break;case"RectAreaLight":e={color:new ce,position:new N,halfWidth:new N,halfHeight:new N};break}return r[t.id]=e,e}}}function wE(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let AE=0;function CE(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function RE(r){const t=new bE,e=wE(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);const i=new N,s=new Ue,o=new Ue;function a(c){let u=0,h=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,_=0,g=0,m=0,p=0,M=0,x=0,v=0,b=0,A=0,E=0;c.sort(CE);for(let S=0,y=c.length;S<y;S++){const D=c[S],U=D.color,z=D.intensity,B=D.distance,k=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=U.r*z,h+=U.g*z,d+=U.b*z;else if(D.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(D.sh.coefficients[H],z);E++}else if(D.isDirectionalLight){const H=t.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const q=D.shadow,G=e.get(D);G.shadowIntensity=q.intensity,G.shadowBias=q.bias,G.shadowNormalBias=q.normalBias,G.shadowRadius=q.radius,G.shadowMapSize=q.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=D.shadow.matrix,M++}n.directional[f]=H,f++}else if(D.isSpotLight){const H=t.get(D);H.position.setFromMatrixPosition(D.matrixWorld),H.color.copy(U).multiplyScalar(z),H.distance=B,H.coneCos=Math.cos(D.angle),H.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),H.decay=D.decay,n.spot[g]=H;const q=D.shadow;if(D.map&&(n.spotLightMap[b]=D.map,b++,q.updateMatrices(D),D.castShadow&&A++),n.spotLightMatrix[g]=q.matrix,D.castShadow){const G=e.get(D);G.shadowIntensity=q.intensity,G.shadowBias=q.bias,G.shadowNormalBias=q.normalBias,G.shadowRadius=q.radius,G.shadowMapSize=q.mapSize,n.spotShadow[g]=G,n.spotShadowMap[g]=k,v++}g++}else if(D.isRectAreaLight){const H=t.get(D);H.color.copy(U).multiplyScalar(z),H.halfWidth.set(D.width*.5,0,0),H.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=H,m++}else if(D.isPointLight){const H=t.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),H.distance=D.distance,H.decay=D.decay,D.castShadow){const q=D.shadow,G=e.get(D);G.shadowIntensity=q.intensity,G.shadowBias=q.bias,G.shadowNormalBias=q.normalBias,G.shadowRadius=q.radius,G.shadowMapSize=q.mapSize,G.shadowCameraNear=q.camera.near,G.shadowCameraFar=q.camera.far,n.pointShadow[_]=G,n.pointShadowMap[_]=k,n.pointShadowMatrix[_]=D.shadow.matrix,x++}n.point[_]=H,_++}else if(D.isHemisphereLight){const H=t.get(D);H.skyColor.copy(D.color).multiplyScalar(z),H.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[p]=H,p++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==_||C.spotLength!==g||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==M||C.numPointShadows!==x||C.numSpotShadows!==v||C.numSpotMaps!==b||C.numLightProbes!==E)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=m,n.point.length=_,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+b-A,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=E,C.directionalLength=f,C.pointLength=_,C.spotLength=g,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=M,C.numPointShadows=x,C.numSpotShadows=v,C.numSpotMaps=b,C.numLightProbes=E,n.version=AE++)}function l(c,u){let h=0,d=0,f=0,_=0,g=0;const m=u.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const x=c[p];if(x.isDirectionalLight){const v=n.directional[h];v.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),h++}else if(x.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const v=n.rectArea[_];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const v=n.hemi[g];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function cp(r){const t=new RE(r),e=[],n=[];function i(u){c.camera=u,e.length=0,n.length=0}function s(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function PE(r){let t=new WeakMap;function e(i,s=0){const o=t.get(i);let a;return o===void 0?(a=new cp(r),t.set(i,[a])):s>=o.length?(a=new cp(r),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const DE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,LE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function IE(r,t,e){let n=new ff;const i=new xt,s=new xt,o=new He,a=new tx({depthPacking:y0}),l=new ex,c={},u=e.maxTextureSize,h={[Fr]:On,[On]:Fr,[Ti]:Ti},d=new Or({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:DE,fragmentShader:LE}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const _=new bn;_.setAttribute("position",new Oi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new At(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lm;let p=this.type;this.render=function(A,E,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const S=r.getRenderTarget(),y=r.getActiveCubeFace(),D=r.getActiveMipmapLevel(),U=r.state;U.setBlending(Dr),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const z=p!==nr&&this.type===nr,B=p===nr&&this.type!==nr;for(let k=0,H=A.length;k<H;k++){const q=A[k],G=q.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const nt=G.getFrameExtents();if(i.multiply(nt),s.copy(G.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/nt.x),i.x=s.x*nt.x,G.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/nt.y),i.y=s.y*nt.y,G.mapSize.y=s.y)),G.map===null||z===!0||B===!0){const K=this.type!==nr?{minFilter:Bn,magFilter:Bn}:{};G.map!==null&&G.map.dispose(),G.map=new Ts(i.x,i.y,K),G.map.texture.name=q.name+".shadowMap",G.camera.updateProjectionMatrix()}r.setRenderTarget(G.map),r.clear();const R=G.getViewportCount();for(let K=0;K<R;K++){const pt=G.getViewport(K);o.set(s.x*pt.x,s.y*pt.y,s.x*pt.z,s.y*pt.w),U.viewport(o),G.updateMatrices(q,K),n=G.getFrustum(),v(E,C,G.camera,q,this.type)}G.isPointLightShadow!==!0&&this.type===nr&&M(G,C),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,r.setRenderTarget(S,y,D)};function M(A,E){const C=t.update(g);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Ts(i.x,i.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(E,null,C,d,g,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(E,null,C,f,g,null)}function x(A,E,C,S){let y=null;const D=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)y=D;else if(y=C.isPointLight===!0?l:a,r.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const U=y.uuid,z=E.uuid;let B=c[U];B===void 0&&(B={},c[U]=B);let k=B[z];k===void 0&&(k=y.clone(),B[z]=k,E.addEventListener("dispose",b)),y=k}if(y.visible=E.visible,y.wireframe=E.wireframe,S===nr?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:h[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const U=r.properties.get(y);U.light=C}return y}function v(A,E,C,S,y){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===nr)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const z=t.update(A),B=A.material;if(Array.isArray(B)){const k=z.groups;for(let H=0,q=k.length;H<q;H++){const G=k[H],nt=B[G.materialIndex];if(nt&&nt.visible){const R=x(A,nt,S,y);A.onBeforeShadow(r,A,E,C,z,R,G),r.renderBufferDirect(C,null,z,R,A,G),A.onAfterShadow(r,A,E,C,z,R,G)}}}else if(B.visible){const k=x(A,B,S,y);A.onBeforeShadow(r,A,E,C,z,k,null),r.renderBufferDirect(C,null,z,k,A,null),A.onAfterShadow(r,A,E,C,z,k,null)}}const U=A.children;for(let z=0,B=U.length;z<B;z++)v(U[z],E,C,S,y)}function b(A){A.target.removeEventListener("dispose",b);for(const C in c){const S=c[C],y=A.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const UE={[Du]:Lu,[Iu]:Fu,[Uu]:Ou,[Eo]:Nu,[Lu]:Du,[Fu]:Iu,[Ou]:Uu,[Nu]:Eo};function NE(r,t){function e(){let I=!1;const ut=new He;let Z=null;const j=new He(0,0,0,0);return{setMask:function(ct){Z!==ct&&!I&&(r.colorMask(ct,ct,ct,ct),Z=ct)},setLocked:function(ct){I=ct},setClear:function(ct,ft,Gt,pe,ze){ze===!0&&(ct*=pe,ft*=pe,Gt*=pe),ut.set(ct,ft,Gt,pe),j.equals(ut)===!1&&(r.clearColor(ct,ft,Gt,pe),j.copy(ut))},reset:function(){I=!1,Z=null,j.set(-1,0,0,0)}}}function n(){let I=!1,ut=!1,Z=null,j=null,ct=null;return{setReversed:function(ft){if(ut!==ft){const Gt=t.get("EXT_clip_control");ut?Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.ZERO_TO_ONE_EXT):Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.NEGATIVE_ONE_TO_ONE_EXT);const pe=ct;ct=null,this.setClear(pe)}ut=ft},getReversed:function(){return ut},setTest:function(ft){ft?rt(r.DEPTH_TEST):wt(r.DEPTH_TEST)},setMask:function(ft){Z!==ft&&!I&&(r.depthMask(ft),Z=ft)},setFunc:function(ft){if(ut&&(ft=UE[ft]),j!==ft){switch(ft){case Du:r.depthFunc(r.NEVER);break;case Lu:r.depthFunc(r.ALWAYS);break;case Iu:r.depthFunc(r.LESS);break;case Eo:r.depthFunc(r.LEQUAL);break;case Uu:r.depthFunc(r.EQUAL);break;case Nu:r.depthFunc(r.GEQUAL);break;case Fu:r.depthFunc(r.GREATER);break;case Ou:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}j=ft}},setLocked:function(ft){I=ft},setClear:function(ft){ct!==ft&&(ut&&(ft=1-ft),r.clearDepth(ft),ct=ft)},reset:function(){I=!1,Z=null,j=null,ct=null,ut=!1}}}function i(){let I=!1,ut=null,Z=null,j=null,ct=null,ft=null,Gt=null,pe=null,ze=null;return{setTest:function(vt){I||(vt?rt(r.STENCIL_TEST):wt(r.STENCIL_TEST))},setMask:function(vt){ut!==vt&&!I&&(r.stencilMask(vt),ut=vt)},setFunc:function(vt,Rt,Kt){(Z!==vt||j!==Rt||ct!==Kt)&&(r.stencilFunc(vt,Rt,Kt),Z=vt,j=Rt,ct=Kt)},setOp:function(vt,Rt,Kt){(ft!==vt||Gt!==Rt||pe!==Kt)&&(r.stencilOp(vt,Rt,Kt),ft=vt,Gt=Rt,pe=Kt)},setLocked:function(vt){I=vt},setClear:function(vt){ze!==vt&&(r.clearStencil(vt),ze=vt)},reset:function(){I=!1,ut=null,Z=null,j=null,ct=null,ft=null,Gt=null,pe=null,ze=null}}}const s=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],_=null,g=!1,m=null,p=null,M=null,x=null,v=null,b=null,A=null,E=new ce(0,0,0),C=0,S=!1,y=null,D=null,U=null,z=null,B=null;const k=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,q=0;const G=r.getParameter(r.VERSION);G.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(G)[1]),H=q>=1):G.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),H=q>=2);let nt=null,R={};const K=r.getParameter(r.SCISSOR_BOX),pt=r.getParameter(r.VIEWPORT),Ft=new He().fromArray(K),$=new He().fromArray(pt);function et(I,ut,Z,j){const ct=new Uint8Array(4),ft=r.createTexture();r.bindTexture(I,ft),r.texParameteri(I,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(I,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Gt=0;Gt<Z;Gt++)I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY?r.texImage3D(ut,0,r.RGBA,1,1,j,0,r.RGBA,r.UNSIGNED_BYTE,ct):r.texImage2D(ut+Gt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ct);return ft}const ot={};ot[r.TEXTURE_2D]=et(r.TEXTURE_2D,r.TEXTURE_2D,1),ot[r.TEXTURE_CUBE_MAP]=et(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ot[r.TEXTURE_2D_ARRAY]=et(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ot[r.TEXTURE_3D]=et(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),rt(r.DEPTH_TEST),o.setFunc(Eo),Vt(!1),V(sd),rt(r.CULL_FACE),L(Dr);function rt(I){u[I]!==!0&&(r.enable(I),u[I]=!0)}function wt(I){u[I]!==!1&&(r.disable(I),u[I]=!1)}function Ht(I,ut){return h[I]!==ut?(r.bindFramebuffer(I,ut),h[I]=ut,I===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=ut),I===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=ut),!0):!1}function Ut(I,ut){let Z=f,j=!1;if(I){Z=d.get(ut),Z===void 0&&(Z=[],d.set(ut,Z));const ct=I.textures;if(Z.length!==ct.length||Z[0]!==r.COLOR_ATTACHMENT0){for(let ft=0,Gt=ct.length;ft<Gt;ft++)Z[ft]=r.COLOR_ATTACHMENT0+ft;Z.length=ct.length,j=!0}}else Z[0]!==r.BACK&&(Z[0]=r.BACK,j=!0);j&&r.drawBuffers(Z)}function le(I){return _!==I?(r.useProgram(I),_=I,!0):!1}const ee={[os]:r.FUNC_ADD,[qg]:r.FUNC_SUBTRACT,[$g]:r.FUNC_REVERSE_SUBTRACT};ee[Zg]=r.MIN,ee[Jg]=r.MAX;const St={[Kg]:r.ZERO,[jg]:r.ONE,[Qg]:r.SRC_COLOR,[Ru]:r.SRC_ALPHA,[s0]:r.SRC_ALPHA_SATURATE,[i0]:r.DST_COLOR,[e0]:r.DST_ALPHA,[t0]:r.ONE_MINUS_SRC_COLOR,[Pu]:r.ONE_MINUS_SRC_ALPHA,[r0]:r.ONE_MINUS_DST_COLOR,[n0]:r.ONE_MINUS_DST_ALPHA,[o0]:r.CONSTANT_COLOR,[a0]:r.ONE_MINUS_CONSTANT_COLOR,[l0]:r.CONSTANT_ALPHA,[c0]:r.ONE_MINUS_CONSTANT_ALPHA};function L(I,ut,Z,j,ct,ft,Gt,pe,ze,vt){if(I===Dr){g===!0&&(wt(r.BLEND),g=!1);return}if(g===!1&&(rt(r.BLEND),g=!0),I!==Yg){if(I!==m||vt!==S){if((p!==os||v!==os)&&(r.blendEquation(r.FUNC_ADD),p=os,v=os),vt)switch(I){case ho:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case od:r.blendFunc(r.ONE,r.ONE);break;case ad:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ld:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ho:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case od:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case ad:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ld:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}M=null,x=null,b=null,A=null,E.set(0,0,0),C=0,m=I,S=vt}return}ct=ct||ut,ft=ft||Z,Gt=Gt||j,(ut!==p||ct!==v)&&(r.blendEquationSeparate(ee[ut],ee[ct]),p=ut,v=ct),(Z!==M||j!==x||ft!==b||Gt!==A)&&(r.blendFuncSeparate(St[Z],St[j],St[ft],St[Gt]),M=Z,x=j,b=ft,A=Gt),(pe.equals(E)===!1||ze!==C)&&(r.blendColor(pe.r,pe.g,pe.b,ze),E.copy(pe),C=ze),m=I,S=!1}function Ee(I,ut){I.side===Ti?wt(r.CULL_FACE):rt(r.CULL_FACE);let Z=I.side===On;ut&&(Z=!Z),Vt(Z),I.blending===ho&&I.transparent===!1?L(Dr):L(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),s.setMask(I.colorWrite);const j=I.stencilWrite;a.setTest(j),j&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ue(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?rt(r.SAMPLE_ALPHA_TO_COVERAGE):wt(r.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(I){y!==I&&(I?r.frontFace(r.CW):r.frontFace(r.CCW),y=I)}function V(I){I!==Gg?(rt(r.CULL_FACE),I!==D&&(I===sd?r.cullFace(r.BACK):I===Wg?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):wt(r.CULL_FACE),D=I}function Tt(I){I!==U&&(H&&r.lineWidth(I),U=I)}function ue(I,ut,Z){I?(rt(r.POLYGON_OFFSET_FILL),(z!==ut||B!==Z)&&(r.polygonOffset(ut,Z),z=ut,B=Z)):wt(r.POLYGON_OFFSET_FILL)}function Ct(I){I?rt(r.SCISSOR_TEST):wt(r.SCISSOR_TEST)}function P(I){I===void 0&&(I=r.TEXTURE0+k-1),nt!==I&&(r.activeTexture(I),nt=I)}function T(I,ut,Z){Z===void 0&&(nt===null?Z=r.TEXTURE0+k-1:Z=nt);let j=R[Z];j===void 0&&(j={type:void 0,texture:void 0},R[Z]=j),(j.type!==I||j.texture!==ut)&&(nt!==Z&&(r.activeTexture(Z),nt=Z),r.bindTexture(I,ut||ot[I]),j.type=I,j.texture=ut)}function W(){const I=R[nt];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function tt(){try{r.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{r.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{r.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ht(){try{r.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function lt(){try{r.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function dt(){try{r.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $t(){try{r.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function st(){try{r.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function at(){try{r.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ot(){try{r.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Nt(I){Ft.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),Ft.copy(I))}function Mt(I){$.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),$.copy(I))}function Jt(I,ut){let Z=c.get(ut);Z===void 0&&(Z=new WeakMap,c.set(ut,Z));let j=Z.get(I);j===void 0&&(j=r.getUniformBlockIndex(ut,I.name),Z.set(I,j))}function kt(I,ut){const j=c.get(ut).get(I);l.get(ut)!==j&&(r.uniformBlockBinding(ut,j,I.__bindingPointIndex),l.set(ut,j))}function fe(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),u={},nt=null,R={},h={},d=new WeakMap,f=[],_=null,g=!1,m=null,p=null,M=null,x=null,v=null,b=null,A=null,E=new ce(0,0,0),C=0,S=!1,y=null,D=null,U=null,z=null,B=null,Ft.set(0,0,r.canvas.width,r.canvas.height),$.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:rt,disable:wt,bindFramebuffer:Ht,drawBuffers:Ut,useProgram:le,setBlending:L,setMaterial:Ee,setFlipSided:Vt,setCullFace:V,setLineWidth:Tt,setPolygonOffset:ue,setScissorTest:Ct,activeTexture:P,bindTexture:T,unbindTexture:W,compressedTexImage2D:tt,compressedTexImage3D:Q,texImage2D:at,texImage3D:Ot,updateUBOMapping:Jt,uniformBlockBinding:kt,texStorage2D:$t,texStorage3D:st,texSubImage2D:J,texSubImage3D:ht,compressedTexSubImage2D:lt,compressedTexSubImage3D:dt,scissor:Nt,viewport:Mt,reset:fe}}function FE(r,t,e,n,i,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xt,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,T){return f?new OffscreenCanvas(P,T):Jl("canvas")}function g(P,T,W){let tt=1;const Q=Ct(P);if((Q.width>W||Q.height>W)&&(tt=W/Math.max(Q.width,Q.height)),tt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const J=Math.floor(tt*Q.width),ht=Math.floor(tt*Q.height);h===void 0&&(h=_(J,ht));const lt=T?_(J,ht):h;return lt.width=J,lt.height=ht,lt.getContext("2d").drawImage(P,0,0,J,ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+J+"x"+ht+")."),lt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){r.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(P,T,W,tt,Q=!1){if(P!==null){if(r[P]!==void 0)return r[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let J=T;if(T===r.RED&&(W===r.FLOAT&&(J=r.R32F),W===r.HALF_FLOAT&&(J=r.R16F),W===r.UNSIGNED_BYTE&&(J=r.R8)),T===r.RED_INTEGER&&(W===r.UNSIGNED_BYTE&&(J=r.R8UI),W===r.UNSIGNED_SHORT&&(J=r.R16UI),W===r.UNSIGNED_INT&&(J=r.R32UI),W===r.BYTE&&(J=r.R8I),W===r.SHORT&&(J=r.R16I),W===r.INT&&(J=r.R32I)),T===r.RG&&(W===r.FLOAT&&(J=r.RG32F),W===r.HALF_FLOAT&&(J=r.RG16F),W===r.UNSIGNED_BYTE&&(J=r.RG8)),T===r.RG_INTEGER&&(W===r.UNSIGNED_BYTE&&(J=r.RG8UI),W===r.UNSIGNED_SHORT&&(J=r.RG16UI),W===r.UNSIGNED_INT&&(J=r.RG32UI),W===r.BYTE&&(J=r.RG8I),W===r.SHORT&&(J=r.RG16I),W===r.INT&&(J=r.RG32I)),T===r.RGB_INTEGER&&(W===r.UNSIGNED_BYTE&&(J=r.RGB8UI),W===r.UNSIGNED_SHORT&&(J=r.RGB16UI),W===r.UNSIGNED_INT&&(J=r.RGB32UI),W===r.BYTE&&(J=r.RGB8I),W===r.SHORT&&(J=r.RGB16I),W===r.INT&&(J=r.RGB32I)),T===r.RGBA_INTEGER&&(W===r.UNSIGNED_BYTE&&(J=r.RGBA8UI),W===r.UNSIGNED_SHORT&&(J=r.RGBA16UI),W===r.UNSIGNED_INT&&(J=r.RGBA32UI),W===r.BYTE&&(J=r.RGBA8I),W===r.SHORT&&(J=r.RGBA16I),W===r.INT&&(J=r.RGBA32I)),T===r.RGB&&W===r.UNSIGNED_INT_5_9_9_9_REV&&(J=r.RGB9_E5),T===r.RGBA){const ht=Q?$l:_e.getTransfer(tt);W===r.FLOAT&&(J=r.RGBA32F),W===r.HALF_FLOAT&&(J=r.RGBA16F),W===r.UNSIGNED_BYTE&&(J=ht===Se?r.SRGB8_ALPHA8:r.RGBA8),W===r.UNSIGNED_SHORT_4_4_4_4&&(J=r.RGBA4),W===r.UNSIGNED_SHORT_5_5_5_1&&(J=r.RGB5_A1)}return(J===r.R16F||J===r.R32F||J===r.RG16F||J===r.RG32F||J===r.RGBA16F||J===r.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function v(P,T){let W;return P?T===null||T===Es||T===wo?W=r.DEPTH24_STENCIL8:T===or?W=r.DEPTH32F_STENCIL8:T===Ma&&(W=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Es||T===wo?W=r.DEPTH_COMPONENT24:T===or?W=r.DEPTH_COMPONENT32F:T===Ma&&(W=r.DEPTH_COMPONENT16),W}function b(P,T){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Bn&&P.minFilter!==Gi?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function A(P){const T=P.target;T.removeEventListener("dispose",A),C(T),T.isVideoTexture&&u.delete(T)}function E(P){const T=P.target;T.removeEventListener("dispose",E),y(T)}function C(P){const T=n.get(P);if(T.__webglInit===void 0)return;const W=P.source,tt=d.get(W);if(tt){const Q=tt[T.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(P),Object.keys(tt).length===0&&d.delete(W)}n.remove(P)}function S(P){const T=n.get(P);r.deleteTexture(T.__webglTexture);const W=P.source,tt=d.get(W);delete tt[T.__cacheKey],o.memory.textures--}function y(P){const T=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(T.__webglFramebuffer[tt]))for(let Q=0;Q<T.__webglFramebuffer[tt].length;Q++)r.deleteFramebuffer(T.__webglFramebuffer[tt][Q]);else r.deleteFramebuffer(T.__webglFramebuffer[tt]);T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer[tt])}else{if(Array.isArray(T.__webglFramebuffer))for(let tt=0;tt<T.__webglFramebuffer.length;tt++)r.deleteFramebuffer(T.__webglFramebuffer[tt]);else r.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&r.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let tt=0;tt<T.__webglColorRenderbuffer.length;tt++)T.__webglColorRenderbuffer[tt]&&r.deleteRenderbuffer(T.__webglColorRenderbuffer[tt]);T.__webglDepthRenderbuffer&&r.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const W=P.textures;for(let tt=0,Q=W.length;tt<Q;tt++){const J=n.get(W[tt]);J.__webglTexture&&(r.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(W[tt])}n.remove(P)}let D=0;function U(){D=0}function z(){const P=D;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),D+=1,P}function B(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function k(P,T){const W=n.get(P);if(P.isVideoTexture&&Tt(P),P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){const tt=P.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(W,P,T);return}}e.bindTexture(r.TEXTURE_2D,W.__webglTexture,r.TEXTURE0+T)}function H(P,T){const W=n.get(P);if(P.version>0&&W.__version!==P.version){$(W,P,T);return}e.bindTexture(r.TEXTURE_2D_ARRAY,W.__webglTexture,r.TEXTURE0+T)}function q(P,T){const W=n.get(P);if(P.version>0&&W.__version!==P.version){$(W,P,T);return}e.bindTexture(r.TEXTURE_3D,W.__webglTexture,r.TEXTURE0+T)}function G(P,T){const W=n.get(P);if(P.version>0&&W.__version!==P.version){et(W,P,T);return}e.bindTexture(r.TEXTURE_CUBE_MAP,W.__webglTexture,r.TEXTURE0+T)}const nt={[ku]:r.REPEAT,[cs]:r.CLAMP_TO_EDGE,[Hu]:r.MIRRORED_REPEAT},R={[Bn]:r.NEAREST,[x0]:r.NEAREST_MIPMAP_NEAREST,[Ya]:r.NEAREST_MIPMAP_LINEAR,[Gi]:r.LINEAR,[Pc]:r.LINEAR_MIPMAP_NEAREST,[us]:r.LINEAR_MIPMAP_LINEAR},K={[E0]:r.NEVER,[R0]:r.ALWAYS,[T0]:r.LESS,[ym]:r.LEQUAL,[b0]:r.EQUAL,[C0]:r.GEQUAL,[w0]:r.GREATER,[A0]:r.NOTEQUAL};function pt(P,T){if(T.type===or&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Gi||T.magFilter===Pc||T.magFilter===Ya||T.magFilter===us||T.minFilter===Gi||T.minFilter===Pc||T.minFilter===Ya||T.minFilter===us)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,nt[T.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,nt[T.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,nt[T.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,R[T.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,R[T.minFilter]),T.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,K[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Bn||T.minFilter!==Ya&&T.minFilter!==us||T.type===or&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");r.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Ft(P,T){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",A));const tt=T.source;let Q=d.get(tt);Q===void 0&&(Q={},d.set(tt,Q));const J=B(T);if(J!==P.__cacheKey){Q[J]===void 0&&(Q[J]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,W=!0),Q[J].usedTimes++;const ht=Q[P.__cacheKey];ht!==void 0&&(Q[P.__cacheKey].usedTimes--,ht.usedTimes===0&&S(T)),P.__cacheKey=J,P.__webglTexture=Q[J].texture}return W}function $(P,T,W){let tt=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(tt=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(tt=r.TEXTURE_3D);const Q=Ft(P,T),J=T.source;e.bindTexture(tt,P.__webglTexture,r.TEXTURE0+W);const ht=n.get(J);if(J.version!==ht.__version||Q===!0){e.activeTexture(r.TEXTURE0+W);const lt=_e.getPrimaries(_e.workingColorSpace),dt=T.colorSpace===Tr?null:_e.getPrimaries(T.colorSpace),$t=T.colorSpace===Tr||lt===dt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);let st=g(T.image,!1,i.maxTextureSize);st=ue(T,st);const at=s.convert(T.format,T.colorSpace),Ot=s.convert(T.type);let Nt=x(T.internalFormat,at,Ot,T.colorSpace,T.isVideoTexture);pt(tt,T);let Mt;const Jt=T.mipmaps,kt=T.isVideoTexture!==!0,fe=ht.__version===void 0||Q===!0,I=J.dataReady,ut=b(T,st);if(T.isDepthTexture)Nt=v(T.format===Ao,T.type),fe&&(kt?e.texStorage2D(r.TEXTURE_2D,1,Nt,st.width,st.height):e.texImage2D(r.TEXTURE_2D,0,Nt,st.width,st.height,0,at,Ot,null));else if(T.isDataTexture)if(Jt.length>0){kt&&fe&&e.texStorage2D(r.TEXTURE_2D,ut,Nt,Jt[0].width,Jt[0].height);for(let Z=0,j=Jt.length;Z<j;Z++)Mt=Jt[Z],kt?I&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,Mt.width,Mt.height,at,Ot,Mt.data):e.texImage2D(r.TEXTURE_2D,Z,Nt,Mt.width,Mt.height,0,at,Ot,Mt.data);T.generateMipmaps=!1}else kt?(fe&&e.texStorage2D(r.TEXTURE_2D,ut,Nt,st.width,st.height),I&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,st.width,st.height,at,Ot,st.data)):e.texImage2D(r.TEXTURE_2D,0,Nt,st.width,st.height,0,at,Ot,st.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){kt&&fe&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ut,Nt,Jt[0].width,Jt[0].height,st.depth);for(let Z=0,j=Jt.length;Z<j;Z++)if(Mt=Jt[Z],T.format!==Ni)if(at!==null)if(kt){if(I)if(T.layerUpdates.size>0){const ct=zd(Mt.width,Mt.height,T.format,T.type);for(const ft of T.layerUpdates){const Gt=Mt.data.subarray(ft*ct/Mt.data.BYTES_PER_ELEMENT,(ft+1)*ct/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,ft,Mt.width,Mt.height,1,at,Gt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,Mt.width,Mt.height,st.depth,at,Mt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,Nt,Mt.width,Mt.height,st.depth,0,Mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?I&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,Mt.width,Mt.height,st.depth,at,Ot,Mt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Z,Nt,Mt.width,Mt.height,st.depth,0,at,Ot,Mt.data)}else{kt&&fe&&e.texStorage2D(r.TEXTURE_2D,ut,Nt,Jt[0].width,Jt[0].height);for(let Z=0,j=Jt.length;Z<j;Z++)Mt=Jt[Z],T.format!==Ni?at!==null?kt?I&&e.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,Mt.width,Mt.height,at,Mt.data):e.compressedTexImage2D(r.TEXTURE_2D,Z,Nt,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?I&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,Mt.width,Mt.height,at,Ot,Mt.data):e.texImage2D(r.TEXTURE_2D,Z,Nt,Mt.width,Mt.height,0,at,Ot,Mt.data)}else if(T.isDataArrayTexture)if(kt){if(fe&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ut,Nt,st.width,st.height,st.depth),I)if(T.layerUpdates.size>0){const Z=zd(st.width,st.height,T.format,T.type);for(const j of T.layerUpdates){const ct=st.data.subarray(j*Z/st.data.BYTES_PER_ELEMENT,(j+1)*Z/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,j,st.width,st.height,1,at,Ot,ct)}T.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,at,Ot,st.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Nt,st.width,st.height,st.depth,0,at,Ot,st.data);else if(T.isData3DTexture)kt?(fe&&e.texStorage3D(r.TEXTURE_3D,ut,Nt,st.width,st.height,st.depth),I&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,at,Ot,st.data)):e.texImage3D(r.TEXTURE_3D,0,Nt,st.width,st.height,st.depth,0,at,Ot,st.data);else if(T.isFramebufferTexture){if(fe)if(kt)e.texStorage2D(r.TEXTURE_2D,ut,Nt,st.width,st.height);else{let Z=st.width,j=st.height;for(let ct=0;ct<ut;ct++)e.texImage2D(r.TEXTURE_2D,ct,Nt,Z,j,0,at,Ot,null),Z>>=1,j>>=1}}else if(Jt.length>0){if(kt&&fe){const Z=Ct(Jt[0]);e.texStorage2D(r.TEXTURE_2D,ut,Nt,Z.width,Z.height)}for(let Z=0,j=Jt.length;Z<j;Z++)Mt=Jt[Z],kt?I&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,at,Ot,Mt):e.texImage2D(r.TEXTURE_2D,Z,Nt,at,Ot,Mt);T.generateMipmaps=!1}else if(kt){if(fe){const Z=Ct(st);e.texStorage2D(r.TEXTURE_2D,ut,Nt,Z.width,Z.height)}I&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,at,Ot,st)}else e.texImage2D(r.TEXTURE_2D,0,Nt,at,Ot,st);m(T)&&p(tt),ht.__version=J.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function et(P,T,W){if(T.image.length!==6)return;const tt=Ft(P,T),Q=T.source;e.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+W);const J=n.get(Q);if(Q.version!==J.__version||tt===!0){e.activeTexture(r.TEXTURE0+W);const ht=_e.getPrimaries(_e.workingColorSpace),lt=T.colorSpace===Tr?null:_e.getPrimaries(T.colorSpace),dt=T.colorSpace===Tr||ht===lt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const $t=T.isCompressedTexture||T.image[0].isCompressedTexture,st=T.image[0]&&T.image[0].isDataTexture,at=[];for(let j=0;j<6;j++)!$t&&!st?at[j]=g(T.image[j],!0,i.maxCubemapSize):at[j]=st?T.image[j].image:T.image[j],at[j]=ue(T,at[j]);const Ot=at[0],Nt=s.convert(T.format,T.colorSpace),Mt=s.convert(T.type),Jt=x(T.internalFormat,Nt,Mt,T.colorSpace),kt=T.isVideoTexture!==!0,fe=J.__version===void 0||tt===!0,I=Q.dataReady;let ut=b(T,Ot);pt(r.TEXTURE_CUBE_MAP,T);let Z;if($t){kt&&fe&&e.texStorage2D(r.TEXTURE_CUBE_MAP,ut,Jt,Ot.width,Ot.height);for(let j=0;j<6;j++){Z=at[j].mipmaps;for(let ct=0;ct<Z.length;ct++){const ft=Z[ct];T.format!==Ni?Nt!==null?kt?I&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct,0,0,ft.width,ft.height,Nt,ft.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct,Jt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?I&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct,0,0,ft.width,ft.height,Nt,Mt,ft.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct,Jt,ft.width,ft.height,0,Nt,Mt,ft.data)}}}else{if(Z=T.mipmaps,kt&&fe){Z.length>0&&ut++;const j=Ct(at[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,ut,Jt,j.width,j.height)}for(let j=0;j<6;j++)if(st){kt?I&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,at[j].width,at[j].height,Nt,Mt,at[j].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Jt,at[j].width,at[j].height,0,Nt,Mt,at[j].data);for(let ct=0;ct<Z.length;ct++){const Gt=Z[ct].image[j].image;kt?I&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct+1,0,0,Gt.width,Gt.height,Nt,Mt,Gt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct+1,Jt,Gt.width,Gt.height,0,Nt,Mt,Gt.data)}}else{kt?I&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Nt,Mt,at[j]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Jt,Nt,Mt,at[j]);for(let ct=0;ct<Z.length;ct++){const ft=Z[ct];kt?I&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct+1,0,0,Nt,Mt,ft.image[j]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ct+1,Jt,Nt,Mt,ft.image[j])}}}m(T)&&p(r.TEXTURE_CUBE_MAP),J.__version=Q.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function ot(P,T,W,tt,Q,J){const ht=s.convert(W.format,W.colorSpace),lt=s.convert(W.type),dt=x(W.internalFormat,ht,lt,W.colorSpace),$t=n.get(T),st=n.get(W);if(st.__renderTarget=T,!$t.__hasExternalTextures){const at=Math.max(1,T.width>>J),Ot=Math.max(1,T.height>>J);Q===r.TEXTURE_3D||Q===r.TEXTURE_2D_ARRAY?e.texImage3D(Q,J,dt,at,Ot,T.depth,0,ht,lt,null):e.texImage2D(Q,J,dt,at,Ot,0,ht,lt,null)}e.bindFramebuffer(r.FRAMEBUFFER,P),V(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,tt,Q,st.__webglTexture,0,Vt(T)):(Q===r.TEXTURE_2D||Q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,tt,Q,st.__webglTexture,J),e.bindFramebuffer(r.FRAMEBUFFER,null)}function rt(P,T,W){if(r.bindRenderbuffer(r.RENDERBUFFER,P),T.depthBuffer){const tt=T.depthTexture,Q=tt&&tt.isDepthTexture?tt.type:null,J=v(T.stencilBuffer,Q),ht=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,lt=Vt(T);V(T)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,lt,J,T.width,T.height):W?r.renderbufferStorageMultisample(r.RENDERBUFFER,lt,J,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,J,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ht,r.RENDERBUFFER,P)}else{const tt=T.textures;for(let Q=0;Q<tt.length;Q++){const J=tt[Q],ht=s.convert(J.format,J.colorSpace),lt=s.convert(J.type),dt=x(J.internalFormat,ht,lt,J.colorSpace),$t=Vt(T);W&&V(T)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,$t,dt,T.width,T.height):V(T)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,$t,dt,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,dt,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function wt(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=n.get(T.depthTexture);tt.__renderTarget=T,(!tt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),k(T.depthTexture,0);const Q=tt.__webglTexture,J=Vt(T);if(T.depthTexture.format===fo)V(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0,J):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0);else if(T.depthTexture.format===Ao)V(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0,J):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ht(P){const T=n.get(P),W=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const tt=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),tt){const Q=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,tt.removeEventListener("dispose",Q)};tt.addEventListener("dispose",Q),T.__depthDisposeCallback=Q}T.__boundDepthTexture=tt}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");wt(T.__webglFramebuffer,P)}else if(W){T.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[tt]),T.__webglDepthbuffer[tt]===void 0)T.__webglDepthbuffer[tt]=r.createRenderbuffer(),rt(T.__webglDepthbuffer[tt],P,!1);else{const Q=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,J=T.__webglDepthbuffer[tt];r.bindRenderbuffer(r.RENDERBUFFER,J),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,J)}}else if(e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=r.createRenderbuffer(),rt(T.__webglDepthbuffer,P,!1);else{const tt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Q=T.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Q),r.framebufferRenderbuffer(r.FRAMEBUFFER,tt,r.RENDERBUFFER,Q)}e.bindFramebuffer(r.FRAMEBUFFER,null)}function Ut(P,T,W){const tt=n.get(P);T!==void 0&&ot(tt.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),W!==void 0&&Ht(P)}function le(P){const T=P.texture,W=n.get(P),tt=n.get(T);P.addEventListener("dispose",E);const Q=P.textures,J=P.isWebGLCubeRenderTarget===!0,ht=Q.length>1;if(ht||(tt.__webglTexture===void 0&&(tt.__webglTexture=r.createTexture()),tt.__version=T.version,o.memory.textures++),J){W.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[lt]=[];for(let dt=0;dt<T.mipmaps.length;dt++)W.__webglFramebuffer[lt][dt]=r.createFramebuffer()}else W.__webglFramebuffer[lt]=r.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let lt=0;lt<T.mipmaps.length;lt++)W.__webglFramebuffer[lt]=r.createFramebuffer()}else W.__webglFramebuffer=r.createFramebuffer();if(ht)for(let lt=0,dt=Q.length;lt<dt;lt++){const $t=n.get(Q[lt]);$t.__webglTexture===void 0&&($t.__webglTexture=r.createTexture(),o.memory.textures++)}if(P.samples>0&&V(P)===!1){W.__webglMultisampledFramebuffer=r.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let lt=0;lt<Q.length;lt++){const dt=Q[lt];W.__webglColorRenderbuffer[lt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,W.__webglColorRenderbuffer[lt]);const $t=s.convert(dt.format,dt.colorSpace),st=s.convert(dt.type),at=x(dt.internalFormat,$t,st,dt.colorSpace,P.isXRRenderTarget===!0),Ot=Vt(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ot,at,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+lt,r.RENDERBUFFER,W.__webglColorRenderbuffer[lt])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=r.createRenderbuffer(),rt(W.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(J){e.bindTexture(r.TEXTURE_CUBE_MAP,tt.__webglTexture),pt(r.TEXTURE_CUBE_MAP,T);for(let lt=0;lt<6;lt++)if(T.mipmaps&&T.mipmaps.length>0)for(let dt=0;dt<T.mipmaps.length;dt++)ot(W.__webglFramebuffer[lt][dt],P,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+lt,dt);else ot(W.__webglFramebuffer[lt],P,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(T)&&p(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let lt=0,dt=Q.length;lt<dt;lt++){const $t=Q[lt],st=n.get($t);e.bindTexture(r.TEXTURE_2D,st.__webglTexture),pt(r.TEXTURE_2D,$t),ot(W.__webglFramebuffer,P,$t,r.COLOR_ATTACHMENT0+lt,r.TEXTURE_2D,0),m($t)&&p(r.TEXTURE_2D)}e.unbindTexture()}else{let lt=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(lt=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(lt,tt.__webglTexture),pt(lt,T),T.mipmaps&&T.mipmaps.length>0)for(let dt=0;dt<T.mipmaps.length;dt++)ot(W.__webglFramebuffer[dt],P,T,r.COLOR_ATTACHMENT0,lt,dt);else ot(W.__webglFramebuffer,P,T,r.COLOR_ATTACHMENT0,lt,0);m(T)&&p(lt),e.unbindTexture()}P.depthBuffer&&Ht(P)}function ee(P){const T=P.textures;for(let W=0,tt=T.length;W<tt;W++){const Q=T[W];if(m(Q)){const J=M(P),ht=n.get(Q).__webglTexture;e.bindTexture(J,ht),p(J),e.unbindTexture()}}}const St=[],L=[];function Ee(P){if(P.samples>0){if(V(P)===!1){const T=P.textures,W=P.width,tt=P.height;let Q=r.COLOR_BUFFER_BIT;const J=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ht=n.get(P),lt=T.length>1;if(lt)for(let dt=0;dt<T.length;dt++)e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let dt=0;dt<T.length;dt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Q|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Q|=r.STENCIL_BUFFER_BIT)),lt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ht.__webglColorRenderbuffer[dt]);const $t=n.get(T[dt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,$t,0)}r.blitFramebuffer(0,0,W,tt,0,0,W,tt,Q,r.NEAREST),l===!0&&(St.length=0,L.length=0,St.push(r.COLOR_ATTACHMENT0+dt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(St.push(J),L.push(J),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,L)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,St))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),lt)for(let dt=0;dt<T.length;dt++){e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.RENDERBUFFER,ht.__webglColorRenderbuffer[dt]);const $t=n.get(T[dt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+dt,r.TEXTURE_2D,$t,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[T])}}}function Vt(P){return Math.min(i.maxSamples,P.samples)}function V(P){const T=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Tt(P){const T=o.render.frame;u.get(P)!==T&&(u.set(P,T),P.update())}function ue(P,T){const W=P.colorSpace,tt=P.format,Q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==Co&&W!==Tr&&(_e.getTransfer(W)===Se?(tt!==Ni||Q!==hr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),T}function Ct(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=U,this.setTexture2D=k,this.setTexture2DArray=H,this.setTexture3D=q,this.setTextureCube=G,this.rebindTextures=Ut,this.setupRenderTarget=le,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=V}function OE(r,t){function e(n,i=Tr){let s;const o=_e.getTransfer(i);if(n===hr)return r.UNSIGNED_BYTE;if(n===tf)return r.UNSIGNED_SHORT_4_4_4_4;if(n===ef)return r.UNSIGNED_SHORT_5_5_5_1;if(n===dm)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===hm)return r.BYTE;if(n===fm)return r.SHORT;if(n===Ma)return r.UNSIGNED_SHORT;if(n===Qh)return r.INT;if(n===Es)return r.UNSIGNED_INT;if(n===or)return r.FLOAT;if(n===Fa)return r.HALF_FLOAT;if(n===pm)return r.ALPHA;if(n===mm)return r.RGB;if(n===Ni)return r.RGBA;if(n===_m)return r.LUMINANCE;if(n===gm)return r.LUMINANCE_ALPHA;if(n===fo)return r.DEPTH_COMPONENT;if(n===Ao)return r.DEPTH_STENCIL;if(n===nf)return r.RED;if(n===rf)return r.RED_INTEGER;if(n===vm)return r.RG;if(n===sf)return r.RG_INTEGER;if(n===of)return r.RGBA_INTEGER;if(n===Il||n===Ul||n===Nl||n===Fl)if(o===Se)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Il)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ul)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Nl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Il)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ul)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Nl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Vu||n===Gu||n===Wu||n===Xu)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Vu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Gu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Xu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Yu||n===qu||n===$u)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Yu||n===qu)return o===Se?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===$u)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Zu||n===Ju||n===Ku||n===ju||n===Qu||n===th||n===eh||n===nh||n===ih||n===rh||n===sh||n===oh||n===ah||n===lh)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Zu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ju)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ku)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ju)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Qu)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===th)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===eh)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===nh)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ih)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===rh)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===sh)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===oh)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ah)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===lh)return o===Se?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ol||n===ch||n===uh)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Ol)return o===Se?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ch)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===uh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xm||n===hh||n===fh||n===dh)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ol)return s.COMPRESSED_RED_RGTC1_EXT;if(n===hh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===dh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===wo?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}const BE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class kE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new zn,s=t.properties.get(i);s.__webglTexture=e.texture,(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Or({vertexShader:BE,fragmentShader:zE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new At(new xc(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class HE extends Oo{constructor(t,e){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,_=null;const g=new kE,m=e.getContextAttributes();let p=null,M=null;const x=[],v=[],b=new xt;let A=null;const E=new yi;E.viewport=new He;const C=new yi;C.viewport=new He;const S=[E,C],y=new ox;let D=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let et=x[$];return et===void 0&&(et=new Jc,x[$]=et),et.getTargetRaySpace()},this.getControllerGrip=function($){let et=x[$];return et===void 0&&(et=new Jc,x[$]=et),et.getGripSpace()},this.getHand=function($){let et=x[$];return et===void 0&&(et=new Jc,x[$]=et),et.getHandSpace()};function z($){const et=v.indexOf($.inputSource);if(et===-1)return;const ot=x[et];ot!==void 0&&(ot.update($.inputSource,$.frame,c||o),ot.dispatchEvent({type:$.type,data:$.inputSource}))}function B(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",k);for(let $=0;$<x.length;$++){const et=v[$];et!==null&&(v[$]=null,x[$].disconnect(et))}D=null,U=null,g.reset(),t.setRenderTarget(p),f=null,d=null,h=null,i=null,M=null,Ft.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",B),i.addEventListener("inputsourceschange",k),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(b),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let ot=null,rt=null,wt=null;m.depth&&(wt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=m.stencil?Ao:fo,rt=m.stencil?wo:Es);const Ht={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:s};h=new XRWebGLBinding(i,e),d=h.createProjectionLayer(Ht),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new Ts(d.textureWidth,d.textureHeight,{format:Ni,type:hr,depthTexture:new Dm(d.textureWidth,d.textureHeight,rt,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ot={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,e,ot),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Ts(f.framebufferWidth,f.framebufferHeight,{format:Ni,type:hr,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Ft.setContext(i),Ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function k($){for(let et=0;et<$.removed.length;et++){const ot=$.removed[et],rt=v.indexOf(ot);rt>=0&&(v[rt]=null,x[rt].disconnect(ot))}for(let et=0;et<$.added.length;et++){const ot=$.added[et];let rt=v.indexOf(ot);if(rt===-1){for(let Ht=0;Ht<x.length;Ht++)if(Ht>=v.length){v.push(ot),rt=Ht;break}else if(v[Ht]===null){v[Ht]=ot,rt=Ht;break}if(rt===-1)break}const wt=x[rt];wt&&wt.connect(ot)}}const H=new N,q=new N;function G($,et,ot){H.setFromMatrixPosition(et.matrixWorld),q.setFromMatrixPosition(ot.matrixWorld);const rt=H.distanceTo(q),wt=et.projectionMatrix.elements,Ht=ot.projectionMatrix.elements,Ut=wt[14]/(wt[10]-1),le=wt[14]/(wt[10]+1),ee=(wt[9]+1)/wt[5],St=(wt[9]-1)/wt[5],L=(wt[8]-1)/wt[0],Ee=(Ht[8]+1)/Ht[0],Vt=Ut*L,V=Ut*Ee,Tt=rt/(-L+Ee),ue=Tt*-L;if(et.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ue),$.translateZ(Tt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),wt[10]===-1)$.projectionMatrix.copy(et.projectionMatrix),$.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Ct=Ut+Tt,P=le+Tt,T=Vt-ue,W=V+(rt-ue),tt=ee*le/P*Ct,Q=St*le/P*Ct;$.projectionMatrix.makePerspective(T,W,tt,Q,Ct,P),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function nt($,et){et===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(et.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let et=$.near,ot=$.far;g.texture!==null&&(g.depthNear>0&&(et=g.depthNear),g.depthFar>0&&(ot=g.depthFar)),y.near=C.near=E.near=et,y.far=C.far=E.far=ot,(D!==y.near||U!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,U=y.far),E.layers.mask=$.layers.mask|2,C.layers.mask=$.layers.mask|4,y.layers.mask=E.layers.mask|C.layers.mask;const rt=$.parent,wt=y.cameras;nt(y,rt);for(let Ht=0;Ht<wt.length;Ht++)nt(wt[Ht],rt);wt.length===2?G(y,E,C):y.projectionMatrix.copy(E.projectionMatrix),R($,y,rt)};function R($,et,ot){ot===null?$.matrix.copy(et.matrixWorld):($.matrix.copy(ot.matrixWorld),$.matrix.invert(),$.matrix.multiply(et.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(et.projectionMatrix),$.projectionMatrixInverse.copy(et.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ya*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)};let K=null;function pt($,et){if(u=et.getViewerPose(c||o),_=et,u!==null){const ot=u.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let rt=!1;ot.length!==y.cameras.length&&(y.cameras.length=0,rt=!0);for(let Ut=0;Ut<ot.length;Ut++){const le=ot[Ut];let ee=null;if(f!==null)ee=f.getViewport(le);else{const L=h.getViewSubImage(d,le);ee=L.viewport,Ut===0&&(t.setRenderTargetTextures(M,L.colorTexture,d.ignoreDepthValues?void 0:L.depthStencilTexture),t.setRenderTarget(M))}let St=S[Ut];St===void 0&&(St=new yi,St.layers.enable(Ut),St.viewport=new He,S[Ut]=St),St.matrix.fromArray(le.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(le.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(ee.x,ee.y,ee.width,ee.height),Ut===0&&(y.matrix.copy(St.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),rt===!0&&y.cameras.push(St)}const wt=i.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&h){const Ut=h.getDepthInformation(ot[0]);Ut&&Ut.isValid&&Ut.texture&&g.init(t,Ut,i.renderState)}}for(let ot=0;ot<x.length;ot++){const rt=v[ot],wt=x[ot];rt!==null&&wt!==void 0&&wt.update(rt,et,c||o)}K&&K($,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),_=null}const Ft=new Gm;Ft.setAnimationLoop(pt),this.setAnimationLoop=function($){K=$},this.dispose=function(){}}}const Zr=new fr,VE=new Ue;function GE(r,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Cm(r)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),_(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),g(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===On&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===On&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=t.get(p),x=M.envMap,v=M.envMapRotation;x&&(m.envMap.value=x,Zr.copy(v),Zr.x*=-1,Zr.y*=-1,Zr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Zr.y*=-1,Zr.z*=-1),m.envMapRotation.value.setFromMatrix4(VE.makeRotationFromEuler(Zr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===On&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const M=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function WE(r,t,e,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,x){const v=x.program;n.uniformBlockBinding(M,v)}function c(M,x){let v=i[M.id];v===void 0&&(_(M),v=u(M),i[M.id]=v,M.addEventListener("dispose",m));const b=x.program;n.updateUBOMapping(M,b);const A=t.render.frame;s[M.id]!==A&&(d(M),s[M.id]=A)}function u(M){const x=h();M.__bindingPointIndex=x;const v=r.createBuffer(),b=M.__size,A=M.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,b,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,x,v),v}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const x=i[M.id],v=M.uniforms,b=M.__cache;r.bindBuffer(r.UNIFORM_BUFFER,x);for(let A=0,E=v.length;A<E;A++){const C=Array.isArray(v[A])?v[A]:[v[A]];for(let S=0,y=C.length;S<y;S++){const D=C[S];if(f(D,A,S,b)===!0){const U=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let B=0;for(let k=0;k<z.length;k++){const H=z[k],q=g(H);typeof H=="number"||typeof H=="boolean"?(D.__data[0]=H,r.bufferSubData(r.UNIFORM_BUFFER,U+B,D.__data)):H.isMatrix3?(D.__data[0]=H.elements[0],D.__data[1]=H.elements[1],D.__data[2]=H.elements[2],D.__data[3]=0,D.__data[4]=H.elements[3],D.__data[5]=H.elements[4],D.__data[6]=H.elements[5],D.__data[7]=0,D.__data[8]=H.elements[6],D.__data[9]=H.elements[7],D.__data[10]=H.elements[8],D.__data[11]=0):(H.toArray(D.__data,B),B+=q.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,U,D.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(M,x,v,b){const A=M.value,E=x+"_"+v;if(b[E]===void 0)return typeof A=="number"||typeof A=="boolean"?b[E]=A:b[E]=A.clone(),!0;{const C=b[E];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return b[E]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function _(M){const x=M.uniforms;let v=0;const b=16;for(let E=0,C=x.length;E<C;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let y=0,D=S.length;y<D;y++){const U=S[y],z=Array.isArray(U.value)?U.value:[U.value];for(let B=0,k=z.length;B<k;B++){const H=z[B],q=g(H),G=v%b,nt=G%q.boundary,R=G+nt;v+=nt,R!==0&&b-R<q.storage&&(v+=b-R),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=q.storage}}}const A=v%b;return A>0&&(v+=b-A),M.__size=v,M.__cache={},this}function g(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),r.deleteBuffer(i[x.id]),delete i[x.id],delete s[x.id]}function p(){for(const M in i)r.deleteBuffer(i[M]);o=[],i={},s={}}return{bind:l,update:c,dispose:p}}class XE{constructor(t={}){const{canvas:e=Y0(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const _=new Uint32Array(4),g=new Int32Array(4);let m=null,p=null;const M=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mi,this.toneMapping=Lr,this.toneMappingExposure=1;const v=this;let b=!1,A=0,E=0,C=null,S=-1,y=null;const D=new He,U=new He;let z=null;const B=new ce(0);let k=0,H=e.width,q=e.height,G=1,nt=null,R=null;const K=new He(0,0,H,q),pt=new He(0,0,H,q);let Ft=!1;const $=new ff;let et=!1,ot=!1;this.transmissionResolutionScale=1;const rt=new Ue,wt=new Ue,Ht=new N,Ut=new He,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ee=!1;function St(){return C===null?G:1}let L=n;function Ee(w,O){return e.getContext(w,O)}try{const w={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${jh}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",ct,!1),e.addEventListener("webglcontextcreationerror",ft,!1),L===null){const O="webgl2";if(L=Ee(O,w),L===null)throw Ee(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Vt,V,Tt,ue,Ct,P,T,W,tt,Q,J,ht,lt,dt,$t,st,at,Ot,Nt,Mt,Jt,kt,fe,I;function ut(){Vt=new eS(L),Vt.init(),kt=new OE(L,Vt),V=new $y(L,Vt,t,kt),Tt=new NE(L,Vt),V.reverseDepthBuffer&&d&&Tt.buffers.depth.setReversed(!0),ue=new rS(L),Ct=new SE,P=new FE(L,Vt,Tt,Ct,V,kt,ue),T=new Jy(v),W=new tS(v),tt=new ux(L),fe=new Yy(L,tt),Q=new nS(L,tt,ue,fe),J=new oS(L,Q,tt,ue),Nt=new sS(L,V,P),st=new Zy(Ct),ht=new yE(v,T,W,Vt,V,fe,st),lt=new GE(v,Ct),dt=new TE,$t=new PE(Vt),Ot=new Xy(v,T,W,Tt,J,f,l),at=new IE(v,J,V),I=new WE(L,ue,V,Tt),Mt=new qy(L,Vt,ue),Jt=new iS(L,Vt,ue),ue.programs=ht.programs,v.capabilities=V,v.extensions=Vt,v.properties=Ct,v.renderLists=dt,v.shadowMap=at,v.state=Tt,v.info=ue}ut();const Z=new HE(v,L);this.xr=Z,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const w=Vt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Vt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(w){w!==void 0&&(G=w,this.setSize(H,q,!1))},this.getSize=function(w){return w.set(H,q)},this.setSize=function(w,O,Y=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=w,q=O,e.width=Math.floor(w*G),e.height=Math.floor(O*G),Y===!0&&(e.style.width=w+"px",e.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(H*G,q*G).floor()},this.setDrawingBufferSize=function(w,O,Y){H=w,q=O,G=Y,e.width=Math.floor(w*Y),e.height=Math.floor(O*Y),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(D)},this.getViewport=function(w){return w.copy(K)},this.setViewport=function(w,O,Y,X){w.isVector4?K.set(w.x,w.y,w.z,w.w):K.set(w,O,Y,X),Tt.viewport(D.copy(K).multiplyScalar(G).round())},this.getScissor=function(w){return w.copy(pt)},this.setScissor=function(w,O,Y,X){w.isVector4?pt.set(w.x,w.y,w.z,w.w):pt.set(w,O,Y,X),Tt.scissor(U.copy(pt).multiplyScalar(G).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(w){Tt.setScissorTest(Ft=w)},this.setOpaqueSort=function(w){nt=w},this.setTransparentSort=function(w){R=w},this.getClearColor=function(w){return w.copy(Ot.getClearColor())},this.setClearColor=function(){Ot.setClearColor(...arguments)},this.getClearAlpha=function(){return Ot.getClearAlpha()},this.setClearAlpha=function(){Ot.setClearAlpha(...arguments)},this.clear=function(w=!0,O=!0,Y=!0){let X=0;if(w){let F=!1;if(C!==null){const it=C.texture.format;F=it===of||it===sf||it===rf}if(F){const it=C.texture.type,_t=it===hr||it===Es||it===Ma||it===wo||it===tf||it===ef,Et=Ot.getClearColor(),yt=Ot.getClearAlpha(),It=Et.r,zt=Et.g,Lt=Et.b;_t?(_[0]=It,_[1]=zt,_[2]=Lt,_[3]=yt,L.clearBufferuiv(L.COLOR,0,_)):(g[0]=It,g[1]=zt,g[2]=Lt,g[3]=yt,L.clearBufferiv(L.COLOR,0,g))}else X|=L.COLOR_BUFFER_BIT}O&&(X|=L.DEPTH_BUFFER_BIT),Y&&(X|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",ct,!1),e.removeEventListener("webglcontextcreationerror",ft,!1),Ot.dispose(),dt.dispose(),$t.dispose(),Ct.dispose(),T.dispose(),W.dispose(),J.dispose(),fe.dispose(),I.dispose(),ht.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",mt),Z.removeEventListener("sessionend",Yt),Pt.stop()};function j(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function ct(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const w=ue.autoReset,O=at.enabled,Y=at.autoUpdate,X=at.needsUpdate,F=at.type;ut(),ue.autoReset=w,at.enabled=O,at.autoUpdate=Y,at.needsUpdate=X,at.type=F}function ft(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Gt(w){const O=w.target;O.removeEventListener("dispose",Gt),pe(O)}function pe(w){ze(w),Ct.remove(w)}function ze(w){const O=Ct.get(w).programs;O!==void 0&&(O.forEach(function(Y){ht.releaseProgram(Y)}),w.isShaderMaterial&&ht.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,Y,X,F,it){O===null&&(O=le);const _t=F.isMesh&&F.matrixWorld.determinant()<0,Et=Kn(w,O,Y,X,F);Tt.setMaterial(X,_t);let yt=Y.index,It=1;if(X.wireframe===!0){if(yt=Q.getWireframeAttribute(Y),yt===void 0)return;It=2}const zt=Y.drawRange,Lt=Y.attributes.position;let Zt=zt.start*It,ve=(zt.start+zt.count)*It;it!==null&&(Zt=Math.max(Zt,it.start*It),ve=Math.min(ve,(it.start+it.count)*It)),yt!==null?(Zt=Math.max(Zt,0),ve=Math.min(ve,yt.count)):Lt!=null&&(Zt=Math.max(Zt,0),ve=Math.min(ve,Lt.count));const Ye=ve-Zt;if(Ye<0||Ye===1/0)return;fe.setup(F,X,Et,Y,yt);let ke,me=Mt;if(yt!==null&&(ke=tt.get(yt),me=Jt,me.setIndex(ke)),F.isMesh)X.wireframe===!0?(Tt.setLineWidth(X.wireframeLinewidth*St()),me.setMode(L.LINES)):me.setMode(L.TRIANGLES);else if(F.isLine){let Bt=X.linewidth;Bt===void 0&&(Bt=1),Tt.setLineWidth(Bt*St()),F.isLineSegments?me.setMode(L.LINES):F.isLineLoop?me.setMode(L.LINE_LOOP):me.setMode(L.LINE_STRIP)}else F.isPoints?me.setMode(L.POINTS):F.isSprite&&me.setMode(L.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)ts("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),me.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Vt.get("WEBGL_multi_draw"))me.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Bt=F._multiDrawStarts,un=F._multiDrawCounts,xe=F._multiDrawCount,Ci=yt?tt.get(yt).bytesPerElement:1,Is=Ct.get(X).currentProgram.getUniforms();for(let jn=0;jn<xe;jn++)Is.setValue(L,"_gl_DrawID",jn),me.render(Bt[jn]/Ci,un[jn])}else if(F.isInstancedMesh)me.renderInstances(Zt,Ye,F.count);else if(Y.isInstancedBufferGeometry){const Bt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,un=Math.min(Y.instanceCount,Bt);me.renderInstances(Zt,Ye,un)}else me.render(Zt,Ye)};function vt(w,O,Y){w.transparent===!0&&w.side===Ti&&w.forceSinglePass===!1?(w.side=On,w.needsUpdate=!0,Te(w,O,Y),w.side=Fr,w.needsUpdate=!0,Te(w,O,Y),w.side=Ti):Te(w,O,Y)}this.compile=function(w,O,Y=null){Y===null&&(Y=w),p=$t.get(Y),p.init(O),x.push(p),Y.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),w!==Y&&w.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights();const X=new Set;return w.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const it=F.material;if(it)if(Array.isArray(it))for(let _t=0;_t<it.length;_t++){const Et=it[_t];vt(Et,Y,F),X.add(Et)}else vt(it,Y,F),X.add(it)}),p=x.pop(),X},this.compileAsync=function(w,O,Y=null){const X=this.compile(w,O,Y);return new Promise(F=>{function it(){if(X.forEach(function(_t){Ct.get(_t).currentProgram.isReady()&&X.delete(_t)}),X.size===0){F(w);return}setTimeout(it,10)}Vt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let Rt=null;function Kt(w){Rt&&Rt(w)}function mt(){Pt.stop()}function Yt(){Pt.start()}const Pt=new Gm;Pt.setAnimationLoop(Kt),typeof self<"u"&&Pt.setContext(self),this.setAnimationLoop=function(w){Rt=w,Z.setAnimationLoop(w),w===null?Pt.stop():Pt.start()},Z.addEventListener("sessionstart",mt),Z.addEventListener("sessionend",Yt),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(O),O=Z.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,O,C),p=$t.get(w,x.length),p.init(O),x.push(p),wt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),$.setFromProjectionMatrix(wt),ot=this.localClippingEnabled,et=st.init(this.clippingPlanes,ot),m=dt.get(w,M.length),m.init(),M.push(m),Z.enabled===!0&&Z.isPresenting===!0){const it=v.xr.getDepthSensingMesh();it!==null&&Wt(it,O,-1/0,v.sortObjects)}Wt(w,O,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(nt,R),ee=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,ee&&Ot.addToRenderList(m,w),this.info.render.frame++,et===!0&&st.beginShadows();const Y=p.state.shadowsArray;at.render(Y,w,O),et===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=m.opaque,F=m.transmissive;if(p.setupLights(),O.isArrayCamera){const it=O.cameras;if(F.length>0)for(let _t=0,Et=it.length;_t<Et;_t++){const yt=it[_t];re(X,F,w,yt)}ee&&Ot.render(w);for(let _t=0,Et=it.length;_t<Et;_t++){const yt=it[_t];Ge(m,w,yt,yt.viewport)}}else F.length>0&&re(X,F,w,O),ee&&Ot.render(w),Ge(m,w,O);C!==null&&E===0&&(P.updateMultisampleRenderTarget(C),P.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(v,w,O),fe.resetDefaultState(),S=-1,y=null,x.pop(),x.length>0?(p=x[x.length-1],et===!0&&st.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function Wt(w,O,Y,X){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$.intersectsSprite(w)){X&&Ut.setFromMatrixPosition(w.matrixWorld).applyMatrix4(wt);const _t=J.update(w),Et=w.material;Et.visible&&m.push(w,_t,Et,Y,Ut.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$.intersectsObject(w))){const _t=J.update(w),Et=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ut.copy(w.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),Ut.copy(_t.boundingSphere.center)),Ut.applyMatrix4(w.matrixWorld).applyMatrix4(wt)),Array.isArray(Et)){const yt=_t.groups;for(let It=0,zt=yt.length;It<zt;It++){const Lt=yt[It],Zt=Et[Lt.materialIndex];Zt&&Zt.visible&&m.push(w,_t,Zt,Y,Ut.z,Lt)}}else Et.visible&&m.push(w,_t,Et,Y,Ut.z,null)}}const it=w.children;for(let _t=0,Et=it.length;_t<Et;_t++)Wt(it[_t],O,Y,X)}function Ge(w,O,Y,X){const F=w.opaque,it=w.transmissive,_t=w.transparent;p.setupLightsView(Y),et===!0&&st.setGlobalState(v.clippingPlanes,Y),X&&Tt.viewport(D.copy(X)),F.length>0&&Ce(F,O,Y),it.length>0&&Ce(it,O,Y),_t.length>0&&Ce(_t,O,Y),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function re(w,O,Y,X){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new Ts(1,1,{generateMipmaps:!0,type:Vt.has("EXT_color_buffer_half_float")||Vt.has("EXT_color_buffer_float")?Fa:hr,minFilter:us,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:_e.workingColorSpace}));const it=p.state.transmissionRenderTarget[X.id],_t=X.viewport||D;it.setSize(_t.z*v.transmissionResolutionScale,_t.w*v.transmissionResolutionScale);const Et=v.getRenderTarget();v.setRenderTarget(it),v.getClearColor(B),k=v.getClearAlpha(),k<1&&v.setClearColor(16777215,.5),v.clear(),ee&&Ot.render(Y);const yt=v.toneMapping;v.toneMapping=Lr;const It=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),et===!0&&st.setGlobalState(v.clippingPlanes,X),Ce(w,Y,X),P.updateMultisampleRenderTarget(it),P.updateRenderTargetMipmap(it),Vt.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let Lt=0,Zt=O.length;Lt<Zt;Lt++){const ve=O[Lt],Ye=ve.object,ke=ve.geometry,me=ve.material,Bt=ve.group;if(me.side===Ti&&Ye.layers.test(X.layers)){const un=me.side;me.side=On,me.needsUpdate=!0,Je(Ye,Y,X,ke,me,Bt),me.side=un,me.needsUpdate=!0,zt=!0}}zt===!0&&(P.updateMultisampleRenderTarget(it),P.updateRenderTargetMipmap(it))}v.setRenderTarget(Et),v.setClearColor(B,k),It!==void 0&&(X.viewport=It),v.toneMapping=yt}function Ce(w,O,Y){const X=O.isScene===!0?O.overrideMaterial:null;for(let F=0,it=w.length;F<it;F++){const _t=w[F],Et=_t.object,yt=_t.geometry,It=X===null?_t.material:X,zt=_t.group;Et.layers.test(Y.layers)&&Je(Et,O,Y,yt,It,zt)}}function Je(w,O,Y,X,F,it){w.onBeforeRender(v,O,Y,X,F,it),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),F.onBeforeRender(v,O,Y,X,w,it),F.transparent===!0&&F.side===Ti&&F.forceSinglePass===!1?(F.side=On,F.needsUpdate=!0,v.renderBufferDirect(Y,O,X,F,w,it),F.side=Fr,F.needsUpdate=!0,v.renderBufferDirect(Y,O,X,F,w,it),F.side=Ti):v.renderBufferDirect(Y,O,X,F,w,it),w.onAfterRender(v,O,Y,X,F,it)}function Te(w,O,Y){O.isScene!==!0&&(O=le);const X=Ct.get(w),F=p.state.lights,it=p.state.shadowsArray,_t=F.state.version,Et=ht.getParameters(w,F.state,it,O,Y),yt=ht.getProgramCacheKey(Et);let It=X.programs;X.environment=w.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(w.isMeshStandardMaterial?W:T).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,It===void 0&&(w.addEventListener("dispose",Gt),It=new Map,X.programs=It);let zt=It.get(yt);if(zt!==void 0){if(X.currentProgram===zt&&X.lightsStateVersion===_t)return ge(w,Et),zt}else Et.uniforms=ht.getUniforms(w),w.onBeforeCompile(Et,v),zt=ht.acquireProgram(Et,yt),It.set(yt,zt),X.uniforms=Et.uniforms;const Lt=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Lt.clippingPlanes=st.uniform),ge(w,Et),X.needsLights=wn(w),X.lightsStateVersion=_t,X.needsLights&&(Lt.ambientLightColor.value=F.state.ambient,Lt.lightProbe.value=F.state.probe,Lt.directionalLights.value=F.state.directional,Lt.directionalLightShadows.value=F.state.directionalShadow,Lt.spotLights.value=F.state.spot,Lt.spotLightShadows.value=F.state.spotShadow,Lt.rectAreaLights.value=F.state.rectArea,Lt.ltc_1.value=F.state.rectAreaLTC1,Lt.ltc_2.value=F.state.rectAreaLTC2,Lt.pointLights.value=F.state.point,Lt.pointLightShadows.value=F.state.pointShadow,Lt.hemisphereLights.value=F.state.hemi,Lt.directionalShadowMap.value=F.state.directionalShadowMap,Lt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Lt.spotShadowMap.value=F.state.spotShadowMap,Lt.spotLightMatrix.value=F.state.spotLightMatrix,Lt.spotLightMap.value=F.state.spotLightMap,Lt.pointShadowMap.value=F.state.pointShadowMap,Lt.pointShadowMatrix.value=F.state.pointShadowMatrix),X.currentProgram=zt,X.uniformsList=null,zt}function be(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=Bl.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function ge(w,O){const Y=Ct.get(w);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function Kn(w,O,Y,X,F){O.isScene!==!0&&(O=le),P.resetTextureUnits();const it=O.fog,_t=X.isMeshStandardMaterial?O.environment:null,Et=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Co,yt=(X.isMeshStandardMaterial?W:T).get(X.envMap||_t),It=X.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,zt=!!Y.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Lt=!!Y.morphAttributes.position,Zt=!!Y.morphAttributes.normal,ve=!!Y.morphAttributes.color;let Ye=Lr;X.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ye=v.toneMapping);const ke=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,me=ke!==void 0?ke.length:0,Bt=Ct.get(X),un=p.state.lights;if(et===!0&&(ot===!0||w!==y)){const An=w===y&&X.id===S;st.setState(X,w,An)}let xe=!1;X.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==un.state.version||Bt.outputColorSpace!==Et||F.isBatchedMesh&&Bt.batching===!1||!F.isBatchedMesh&&Bt.batching===!0||F.isBatchedMesh&&Bt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Bt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Bt.instancing===!1||!F.isInstancedMesh&&Bt.instancing===!0||F.isSkinnedMesh&&Bt.skinning===!1||!F.isSkinnedMesh&&Bt.skinning===!0||F.isInstancedMesh&&Bt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Bt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Bt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Bt.instancingMorph===!1&&F.morphTexture!==null||Bt.envMap!==yt||X.fog===!0&&Bt.fog!==it||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==st.numPlanes||Bt.numIntersection!==st.numIntersection)||Bt.vertexAlphas!==It||Bt.vertexTangents!==zt||Bt.morphTargets!==Lt||Bt.morphNormals!==Zt||Bt.morphColors!==ve||Bt.toneMapping!==Ye||Bt.morphTargetsCount!==me)&&(xe=!0):(xe=!0,Bt.__version=X.version);let Ci=Bt.currentProgram;xe===!0&&(Ci=Te(X,O,F));let Is=!1,jn=!1,zo=!1;const De=Ci.getUniforms(),mi=Bt.uniforms;if(Tt.useProgram(Ci.program)&&(Is=!0,jn=!0,zo=!0),X.id!==S&&(S=X.id,jn=!0),Is||y!==w){Tt.buffers.depth.getReversed()?(rt.copy(w.projectionMatrix),$0(rt),Z0(rt),De.setValue(L,"projectionMatrix",rt)):De.setValue(L,"projectionMatrix",w.projectionMatrix),De.setValue(L,"viewMatrix",w.matrixWorldInverse);const Hn=De.map.cameraPosition;Hn!==void 0&&Hn.setValue(L,Ht.setFromMatrixPosition(w.matrixWorld)),V.logarithmicDepthBuffer&&De.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&De.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,jn=!0,zo=!0)}if(F.isSkinnedMesh){De.setOptional(L,F,"bindMatrix"),De.setOptional(L,F,"bindMatrixInverse");const An=F.skeleton;An&&(An.boneTexture===null&&An.computeBoneTexture(),De.setValue(L,"boneTexture",An.boneTexture,P))}F.isBatchedMesh&&(De.setOptional(L,F,"batchingTexture"),De.setValue(L,"batchingTexture",F._matricesTexture,P),De.setOptional(L,F,"batchingIdTexture"),De.setValue(L,"batchingIdTexture",F._indirectTexture,P),De.setOptional(L,F,"batchingColorTexture"),F._colorsTexture!==null&&De.setValue(L,"batchingColorTexture",F._colorsTexture,P));const _i=Y.morphAttributes;if((_i.position!==void 0||_i.normal!==void 0||_i.color!==void 0)&&Nt.update(F,Y,Ci),(jn||Bt.receiveShadow!==F.receiveShadow)&&(Bt.receiveShadow=F.receiveShadow,De.setValue(L,"receiveShadow",F.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(mi.envMap.value=yt,mi.flipEnvMap.value=yt.isCubeTexture&&yt.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&O.environment!==null&&(mi.envMapIntensity.value=O.environmentIntensity),jn&&(De.setValue(L,"toneMappingExposure",v.toneMappingExposure),Bt.needsLights&&Re(mi,zo),it&&X.fog===!0&&lt.refreshFogUniforms(mi,it),lt.refreshMaterialUniforms(mi,X,G,q,p.state.transmissionRenderTarget[w.id]),Bl.upload(L,be(Bt),mi,P)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Bl.upload(L,be(Bt),mi,P),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&De.setValue(L,"center",F.center),De.setValue(L,"modelViewMatrix",F.modelViewMatrix),De.setValue(L,"normalMatrix",F.normalMatrix),De.setValue(L,"modelMatrix",F.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const An=X.uniformsGroups;for(let Hn=0,Rc=An.length;Hn<Rc;Hn++){const Gr=An[Hn];I.update(Gr,Ci),I.bind(Gr,Ci)}}return Ci}function Re(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function wn(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,O,Y){Ct.get(w.texture).__webglTexture=O,Ct.get(w.depthTexture).__webglTexture=Y;const X=Ct.get(w);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=Y===void 0,X.__autoAllocateDepthBuffer||Vt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,O){const Y=Ct.get(w);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0};const pi=L.createFramebuffer();this.setRenderTarget=function(w,O=0,Y=0){C=w,A=O,E=Y;let X=!0,F=null,it=!1,_t=!1;if(w){const yt=Ct.get(w);if(yt.__useDefaultFramebuffer!==void 0)Tt.bindFramebuffer(L.FRAMEBUFFER,null),X=!1;else if(yt.__webglFramebuffer===void 0)P.setupRenderTarget(w);else if(yt.__hasExternalTextures)P.rebindTextures(w,Ct.get(w.texture).__webglTexture,Ct.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Lt=w.depthTexture;if(yt.__boundDepthTexture!==Lt){if(Lt!==null&&Ct.has(Lt)&&(w.width!==Lt.image.width||w.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(w)}}const It=w.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(_t=!0);const zt=Ct.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(zt[O])?F=zt[O][Y]:F=zt[O],it=!0):w.samples>0&&P.useMultisampledRTT(w)===!1?F=Ct.get(w).__webglMultisampledFramebuffer:Array.isArray(zt)?F=zt[Y]:F=zt,D.copy(w.viewport),U.copy(w.scissor),z=w.scissorTest}else D.copy(K).multiplyScalar(G).floor(),U.copy(pt).multiplyScalar(G).floor(),z=Ft;if(Y!==0&&(F=pi),Tt.bindFramebuffer(L.FRAMEBUFFER,F)&&X&&Tt.drawBuffers(w,F),Tt.viewport(D),Tt.scissor(U),Tt.setScissorTest(z),it){const yt=Ct.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+O,yt.__webglTexture,Y)}else if(_t){const yt=Ct.get(w.texture),It=O;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,yt.__webglTexture,Y,It)}else if(w!==null&&Y!==0){const yt=Ct.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,yt.__webglTexture,Y)}S=-1},this.readRenderTargetPixels=function(w,O,Y,X,F,it,_t){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=Ct.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&_t!==void 0&&(Et=Et[_t]),Et){Tt.bindFramebuffer(L.FRAMEBUFFER,Et);try{const yt=w.texture,It=yt.format,zt=yt.type;if(!V.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!V.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-X&&Y>=0&&Y<=w.height-F&&L.readPixels(O,Y,X,F,kt.convert(It),kt.convert(zt),it)}finally{const yt=C!==null?Ct.get(C).__webglFramebuffer:null;Tt.bindFramebuffer(L.FRAMEBUFFER,yt)}}},this.readRenderTargetPixelsAsync=async function(w,O,Y,X,F,it,_t){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=Ct.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&_t!==void 0&&(Et=Et[_t]),Et){const yt=w.texture,It=yt.format,zt=yt.type;if(!V.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!V.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=w.width-X&&Y>=0&&Y<=w.height-F){Tt.bindFramebuffer(L.FRAMEBUFFER,Et);const Lt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Lt),L.bufferData(L.PIXEL_PACK_BUFFER,it.byteLength,L.STREAM_READ),L.readPixels(O,Y,X,F,kt.convert(It),kt.convert(zt),0);const Zt=C!==null?Ct.get(C).__webglFramebuffer:null;Tt.bindFramebuffer(L.FRAMEBUFFER,Zt);const ve=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await q0(L,ve,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Lt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,it),L.deleteBuffer(Lt),L.deleteSync(ve),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,O=null,Y=0){w.isTexture!==!0&&(ts("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,w=arguments[1]);const X=Math.pow(2,-Y),F=Math.floor(w.image.width*X),it=Math.floor(w.image.height*X),_t=O!==null?O.x:0,Et=O!==null?O.y:0;P.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,Y,0,0,_t,Et,F,it),Tt.unbindTexture()};const Ke=L.createFramebuffer(),je=L.createFramebuffer();this.copyTextureToTexture=function(w,O,Y=null,X=null,F=0,it=null){w.isTexture!==!0&&(ts("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,w=arguments[1],O=arguments[2],it=arguments[3]||0,Y=null),it===null&&(F!==0?(ts("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),it=F,F=0):it=0);let _t,Et,yt,It,zt,Lt,Zt,ve,Ye;const ke=w.isCompressedTexture?w.mipmaps[it]:w.image;if(Y!==null)_t=Y.max.x-Y.min.x,Et=Y.max.y-Y.min.y,yt=Y.isBox3?Y.max.z-Y.min.z:1,It=Y.min.x,zt=Y.min.y,Lt=Y.isBox3?Y.min.z:0;else{const _i=Math.pow(2,-F);_t=Math.floor(ke.width*_i),Et=Math.floor(ke.height*_i),w.isDataArrayTexture?yt=ke.depth:w.isData3DTexture?yt=Math.floor(ke.depth*_i):yt=1,It=0,zt=0,Lt=0}X!==null?(Zt=X.x,ve=X.y,Ye=X.z):(Zt=0,ve=0,Ye=0);const me=kt.convert(O.format),Bt=kt.convert(O.type);let un;O.isData3DTexture?(P.setTexture3D(O,0),un=L.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(P.setTexture2DArray(O,0),un=L.TEXTURE_2D_ARRAY):(P.setTexture2D(O,0),un=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,O.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,O.unpackAlignment);const xe=L.getParameter(L.UNPACK_ROW_LENGTH),Ci=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Is=L.getParameter(L.UNPACK_SKIP_PIXELS),jn=L.getParameter(L.UNPACK_SKIP_ROWS),zo=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,ke.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ke.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,It),L.pixelStorei(L.UNPACK_SKIP_ROWS,zt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Lt);const De=w.isDataArrayTexture||w.isData3DTexture,mi=O.isDataArrayTexture||O.isData3DTexture;if(w.isDepthTexture){const _i=Ct.get(w),An=Ct.get(O),Hn=Ct.get(_i.__renderTarget),Rc=Ct.get(An.__renderTarget);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,Hn.__webglFramebuffer),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,Rc.__webglFramebuffer);for(let Gr=0;Gr<yt;Gr++)De&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ct.get(w).__webglTexture,F,Lt+Gr),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ct.get(O).__webglTexture,it,Ye+Gr)),L.blitFramebuffer(It,zt,_t,Et,Zt,ve,_t,Et,L.DEPTH_BUFFER_BIT,L.NEAREST);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(F!==0||w.isRenderTargetTexture||Ct.has(w)){const _i=Ct.get(w),An=Ct.get(O);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,Ke),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,je);for(let Hn=0;Hn<yt;Hn++)De?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_i.__webglTexture,F,Lt+Hn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,_i.__webglTexture,F),mi?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,An.__webglTexture,it,Ye+Hn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,An.__webglTexture,it),F!==0?L.blitFramebuffer(It,zt,_t,Et,Zt,ve,_t,Et,L.COLOR_BUFFER_BIT,L.NEAREST):mi?L.copyTexSubImage3D(un,it,Zt,ve,Ye+Hn,It,zt,_t,Et):L.copyTexSubImage2D(un,it,Zt,ve,It,zt,_t,Et);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else mi?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(un,it,Zt,ve,Ye,_t,Et,yt,me,Bt,ke.data):O.isCompressedArrayTexture?L.compressedTexSubImage3D(un,it,Zt,ve,Ye,_t,Et,yt,me,ke.data):L.texSubImage3D(un,it,Zt,ve,Ye,_t,Et,yt,me,Bt,ke):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,it,Zt,ve,_t,Et,me,Bt,ke.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,it,Zt,ve,ke.width,ke.height,me,ke.data):L.texSubImage2D(L.TEXTURE_2D,it,Zt,ve,_t,Et,me,Bt,ke);L.pixelStorei(L.UNPACK_ROW_LENGTH,xe),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ci),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Is),L.pixelStorei(L.UNPACK_SKIP_ROWS,jn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,zo),it===0&&O.generateMipmaps&&L.generateMipmap(un),Tt.unbindTexture()},this.copyTextureToTexture3D=function(w,O,Y=null,X=null,F=0){return w.isTexture!==!0&&(ts("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,X=arguments[1]||null,w=arguments[2],O=arguments[3],F=arguments[4]||0),ts('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,O,Y,X,F)},this.initRenderTarget=function(w){Ct.get(w).__webglFramebuffer===void 0&&P.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?P.setTextureCube(w,0):w.isData3DTexture?P.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?P.setTexture2DArray(w,0):P.setTexture2D(w,0),Tt.unbindTexture()},this.resetState=function(){A=0,E=0,C=null,Tt.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ar}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=_e._getDrawingBufferColorSpace(t),e.unpackColorSpace=_e._getUnpackColorSpace()}}function ir(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function $m(r,t){r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.__proto__=t}/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var ui={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},ba={duration:.5,overwrite:!1,delay:0},Sf,pn,Ie,bi=1e8,Ae=1/bi,Mh=Math.PI*2,YE=Mh/4,qE=0,Zm=Math.sqrt,$E=Math.cos,ZE=Math.sin,cn=function(t){return typeof t=="string"},Ve=function(t){return typeof t=="function"},dr=function(t){return typeof t=="number"},Ef=function(t){return typeof t>"u"},$i=function(t){return typeof t=="object"},Yn=function(t){return t!==!1},Tf=function(){return typeof window<"u"},_l=function(t){return Ve(t)||cn(t)},Jm=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Tn=Array.isArray,JE=/random\([^)]+\)/g,KE=/,\s*/g,up=/(?:-?\.?\d|\.)+/gi,Km=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,so=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,lu=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,jm=/[+-]=-?[.\d]+/,jE=/[^,'"\[\]\s]+/gi,QE=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Fe,zi,yh,bf,fi={},Kl={},Qm,t_=function(t){return(Kl=Po(t,fi))&&Jn},wf=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},wa=function(t,e){return!e&&console.warn(t)},e_=function(t,e){return t&&(fi[t]=e)&&Kl&&(Kl[t]=e)||fi},Aa=function(){return 0},t1={suppressEvents:!0,isStart:!0,kill:!1},zl={suppressEvents:!0,kill:!1},e1={suppressEvents:!0},Af={},Ir=[],Sh={},n_,ii={},cu={},hp=30,kl=[],Cf="",Rf=function(t){var e=t[0],n,i;if($i(e)||Ve(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=kl.length;i--&&!kl[i].targetTest(e););n=kl[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new T_(t[i],n)))||t.splice(i,1);return t},ms=function(t){return t._gsap||Rf(wi(t))[0]._gsap},i_=function(t,e,n){return(n=t[e])&&Ve(n)?t[e]():Ef(n)&&t.getAttribute&&t.getAttribute(e)||n},qn=function(t,e){return(t=t.split(",")).forEach(e)||t},We=function(t){return Math.round(t*1e5)/1e5||0},Ne=function(t){return Math.round(t*1e7)/1e7||0},mo=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},n1=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},jl=function(){var t=Ir.length,e=Ir.slice(0),n,i;for(Sh={},Ir.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Pf=function(t){return!!(t._initted||t._startAt||t.add)},r_=function(t,e,n,i){Ir.length&&!pn&&jl(),t.render(e,n,!!(pn&&e<0&&Pf(t))),Ir.length&&!pn&&jl()},s_=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(jE).length<2?e:cn(t)?t.trim():t},o_=function(t){return t},di=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},i1=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},Po=function(t,e){for(var n in e)t[n]=e[n];return t},fp=function r(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=$i(e[n])?r(t[n]||(t[n]={}),e[n]):e[n]);return t},Ql=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},la=function(t){var e=t.parent||Fe,n=t.keyframes?i1(Tn(t.keyframes)):di;if(Yn(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},r1=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},a_=function(t,e,n,i,s){var o=t[i],a;if(s)for(a=e[s];o&&o[s]>a;)o=o._prev;return o?(e._next=o._next,o._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=o,e.parent=e._dp=t,e},Sc=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=e._prev,o=e._next;s?s._next=o:t[n]===e&&(t[n]=o),o?o._prev=s:t[i]===e&&(t[i]=s),e._next=e._prev=e.parent=null},Br=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},_s=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},s1=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},Eh=function(t,e,n,i){return t._startAt&&(pn?t._startAt.revert(zl):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},o1=function r(t){return!t||t._ts&&r(t.parent)},dp=function(t){return t._repeat?Do(t._tTime,t=t.duration()+t._rDelay)*t:0},Do=function(t,e){var n=Math.floor(t=Ne(t/e));return t&&n===t?n-1:n},tc=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},Ec=function(t){return t._end=Ne(t._start+(t._tDur/Math.abs(t._ts||t._rts||Ae)||0))},Tc=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=Ne(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ec(t),n._dirty||_s(n,t)),t},l_=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=tc(t.rawTime(),e),(!e._dur||Ha(0,e.totalDuration(),n)-e._tTime>Ae)&&e.render(n,!0)),_s(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-Ae}},Vi=function(t,e,n,i){return e.parent&&Br(e),e._start=Ne((dr(n)?n:n||t!==Fe?vi(t,n,e):t._time)+e._delay),e._end=Ne(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),a_(t,e,"_first","_last",t._sort?"_start":0),Th(e)||(t._recent=e),i||l_(t,e),t._ts<0&&Tc(t,t._tTime),t},c_=function(t,e){return(fi.ScrollTrigger||wf("scrollTrigger",e))&&fi.ScrollTrigger.create(e,t)},u_=function(t,e,n,i,s){if(Lf(t,e,s),!t._initted)return 1;if(!n&&t._pt&&!pn&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&n_!==oi.frame)return Ir.push(t),t._lazy=[s,i],1},a1=function r(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||r(e))},Th=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},l1=function(t,e,n,i){var s=t.ratio,o=e<0||!e&&(!t._start&&a1(t)&&!(!t._initted&&Th(t))||(t._ts<0||t._dp._ts<0)&&!Th(t))?0:1,a=t._rDelay,l=0,c,u,h;if(a&&t._repeat&&(l=Ha(0,t._tDur,e),u=Do(l,a),t._yoyo&&u&1&&(o=1-o),u!==Do(t._tTime,a)&&(s=1-o,t.vars.repeatRefresh&&t._initted&&t.invalidate())),o!==s||pn||i||t._zTime===Ae||!e&&t._zTime){if(!t._initted&&u_(t,e,i,n,l))return;for(h=t._zTime,t._zTime=e||(n?Ae:0),n||(n=e&&!h),t.ratio=o,t._from&&(o=1-o),t._time=0,t._tTime=l,c=t._pt;c;)c.r(o,c.d),c=c._next;e<0&&Eh(t,e,n,!0),t._onUpdate&&!n&&li(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&li(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===o&&(o&&Br(t,1),!n&&!pn&&(li(t,o?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},c1=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},Lo=function(t,e,n,i){var s=t._repeat,o=Ne(e)||0,a=t._tTime/t._tDur;return a&&!i&&(t._time*=o/t._dur),t._dur=o,t._tDur=s?s<0?1e10:Ne(o*(s+1)+t._rDelay*s):o,a>0&&!i&&Tc(t,t._tTime=t._tDur*a),t.parent&&Ec(t),n||_s(t.parent,t),t},pp=function(t){return t instanceof Gn?_s(t):Lo(t,t._dur)},u1={_start:0,endTime:Aa,totalDuration:Aa},vi=function r(t,e,n){var i=t.labels,s=t._recent||u1,o=t.duration()>=bi?s.endTime(!1):t._dur,a,l,c;return cn(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",a=e.indexOf("="),l==="<"||l===">"?(a>=0&&(e=e.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(a<0?s:n).totalDuration()/100:1)):a<0?(e in i||(i[e]=o),i[e]):(l=parseFloat(e.charAt(a-1)+e.substr(a+1)),c&&n&&(l=l/100*(Tn(n)?n[0]:n).totalDuration()),a>1?r(t,e.substr(0,a-1),n)+l:o+l)):e==null?o:+e},ca=function(t,e,n){var i=dr(e[1]),s=(i?2:1)+(t<2?0:1),o=e[s],a,l;if(i&&(o.duration=e[1]),o.parent=n,t){for(a=o,l=n;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=Yn(l.vars.inherit)&&l.parent;o.immediateRender=Yn(a.immediateRender),t<2?o.runBackwards=1:o.startAt=e[s-1]}return new Ze(e[0],o,e[s+1])},Vr=function(t,e){return t||t===0?e(t):e},Ha=function(t,e,n){return n<t?t:n>e?e:n},Sn=function(t,e){return!cn(t)||!(e=QE.exec(t))?"":e[1]},h1=function(t,e,n){return Vr(n,function(i){return Ha(t,e,i)})},bh=[].slice,h_=function(t,e){return t&&$i(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&$i(t[0]))&&!t.nodeType&&t!==zi},f1=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var s;return cn(i)&&!e||h_(i,1)?(s=n).push.apply(s,wi(i)):n.push(i)})||n},wi=function(t,e,n){return Ie&&!e&&Ie.selector?Ie.selector(t):cn(t)&&!n&&(yh||!Io())?bh.call((e||bf).querySelectorAll(t),0):Tn(t)?f1(t,n):h_(t)?bh.call(t,0):t?[t]:[]},wh=function(t){return t=wi(t)[0]||wa("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return wi(e,n.querySelectorAll?n:n===t?wa("Invalid scope")||bf.createElement("div"):t)}},f_=function(t){return t.sort(function(){return .5-Math.random()})},d_=function(t){if(Ve(t))return t;var e=$i(t)?t:{each:t},n=gs(e.ease),i=e.from||0,s=parseFloat(e.base)||0,o={},a=i>0&&i<1,l=isNaN(i)||a,c=e.axis,u=i,h=i;return cn(i)?u=h={center:.5,edges:.5,end:1}[i]||0:!a&&l&&(u=i[0],h=i[1]),function(d,f,_){var g=(_||e).length,m=o[g],p,M,x,v,b,A,E,C,S;if(!m){if(S=e.grid==="auto"?0:(e.grid||[1,bi])[1],!S){for(E=-bi;E<(E=_[S++].getBoundingClientRect().left)&&S<g;);S<g&&S--}for(m=o[g]=[],p=l?Math.min(S,g)*u-.5:i%S,M=S===bi?0:l?g*h/S-.5:i/S|0,E=0,C=bi,A=0;A<g;A++)x=A%S-p,v=M-(A/S|0),m[A]=b=c?Math.abs(c==="y"?v:x):Zm(x*x+v*v),b>E&&(E=b),b<C&&(C=b);i==="random"&&f_(m),m.max=E-C,m.min=C,m.v=g=(parseFloat(e.amount)||parseFloat(e.each)*(S>g?g-1:c?c==="y"?g/S:S:Math.max(S,g/S))||0)*(i==="edges"?-1:1),m.b=g<0?s-g:s,m.u=Sn(e.amount||e.each)||0,n=n&&g<0?b1(n):n}return g=(m[d]-m.min)/m.max||0,Ne(m.b+(n?n(g):g)*m.v)+m.u}},Ah=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=Ne(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(dr(n)?0:Sn(n))}},p_=function(t,e){var n=Tn(t),i,s;return!n&&$i(t)&&(i=n=t.radius||bi,t.values?(t=wi(t.values),(s=!dr(t[0]))&&(i*=i)):t=Ah(t.increment)),Vr(e,n?Ve(t)?function(o){return s=t(o),Math.abs(s-o)<=i?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=bi,u=0,h=t.length,d,f;h--;)s?(d=t[h].x-a,f=t[h].y-l,d=d*d+f*f):d=Math.abs(t[h]-a),d<c&&(c=d,u=h);return u=!i||c<=i?t[u]:o,s||u===o||dr(o)?u:u+Sn(o)}:Ah(t))},m_=function(t,e,n,i){return Vr(Tn(t)?!e:n===!0?!!(n=0):!i,function(){return Tn(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},d1=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(s,o){return o(s)},i)}},p1=function(t,e){return function(n){return t(parseFloat(n))+(e||Sn(n))}},m1=function(t,e,n){return g_(t,e,0,1,n)},__=function(t,e,n){return Vr(n,function(i){return t[~~e(i)]})},_1=function r(t,e,n){var i=e-t;return Tn(t)?__(t,r(0,t.length),e):Vr(n,function(s){return(i+(s-t)%i)%i+t})},g1=function r(t,e,n){var i=e-t,s=i*2;return Tn(t)?__(t,r(0,t.length-1),e):Vr(n,function(o){return o=(s+(o-t)%s)%s||0,t+(o>i?s-o:o)})},Ca=function(t){return t.replace(JE,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(KE);return m_(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},g_=function(t,e,n,i,s){var o=e-t,a=i-n;return Vr(s,function(l){return n+((l-t)/o*a||0)})},v1=function r(t,e,n,i){var s=isNaN(t+e)?0:function(f){return(1-f)*t+f*e};if(!s){var o=cn(t),a={},l,c,u,h,d;if(n===!0&&(i=1)&&(n=null),o)t={p:t},e={p:e};else if(Tn(t)&&!Tn(e)){for(u=[],h=t.length,d=h-2,c=1;c<h;c++)u.push(r(t[c-1],t[c]));h--,s=function(_){_*=h;var g=Math.min(d,~~_);return u[g](_-g)},n=e}else i||(t=Po(Tn(t)?[]:{},t));if(!u){for(l in e)Df.call(a,t,l,"get",e[l]);s=function(_){return Nf(_,a)||(o?t.p:t)}}}return Vr(n,s)},mp=function(t,e,n){var i=t.labels,s=bi,o,a,l;for(o in i)a=i[o]-e,a<0==!!n&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},li=function(t,e,n){var i=t.vars,s=i[e],o=Ie,a=t._ctx,l,c,u;if(s)return l=i[e+"Params"],c=i.callbackScope||t,n&&Ir.length&&jl(),a&&(Ie=a),u=l?s.apply(c,l):s.call(c),Ie=o,u},$o=function(t){return Br(t),t.scrollTrigger&&t.scrollTrigger.kill(!!pn),t.progress()<1&&li(t,"onInterrupt"),t},oo,v_=[],x_=function(t){if(t)if(t=!t.name&&t.default||t,Tf()||t.headless){var e=t.name,n=Ve(t),i=e&&!n&&t.init?function(){this._props=[]}:t,s={init:Aa,render:Nf,add:Df,kill:N1,modifier:U1,rawVars:0},o={targetTest:0,get:0,getSetter:Uf,aliases:{},register:0};if(Io(),t!==i){if(ii[e])return;di(i,di(Ql(t,s),o)),Po(i.prototype,Po(s,Ql(t,o))),ii[i.prop=e]=i,t.targetTest&&(kl.push(i),Af[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}e_(e,i),t.register&&t.register(Jn,i,$n)}else v_.push(t)},we=255,Zo={aqua:[0,we,we],lime:[0,we,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,we],navy:[0,0,128],white:[we,we,we],olive:[128,128,0],yellow:[we,we,0],orange:[we,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[we,0,0],pink:[we,192,203],cyan:[0,we,we],transparent:[we,we,we,0]},uu=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*we+.5|0},M_=function(t,e,n){var i=t?dr(t)?[t>>16,t>>8&we,t&we]:0:Zo.black,s,o,a,l,c,u,h,d,f,_;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),Zo[t])i=Zo[t];else if(t.charAt(0)==="#"){if(t.length<6&&(s=t.charAt(1),o=t.charAt(2),a=t.charAt(3),t="#"+s+s+o+o+a+a+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&we,i&we,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&we,t&we]}else if(t.substr(0,3)==="hsl"){if(i=_=t.match(up),!e)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,o=u<=.5?u*(c+1):u+c-u*c,s=u*2-o,i.length>3&&(i[3]*=1),i[0]=uu(l+1/3,s,o),i[1]=uu(l,s,o),i[2]=uu(l-1/3,s,o);else if(~t.indexOf("="))return i=t.match(Km),n&&i.length<4&&(i[3]=1),i}else i=t.match(up)||Zo.transparent;i=i.map(Number)}return e&&!_&&(s=i[0]/we,o=i[1]/we,a=i[2]/we,h=Math.max(s,o,a),d=Math.min(s,o,a),u=(h+d)/2,h===d?l=c=0:(f=h-d,c=u>.5?f/(2-h-d):f/(h+d),l=h===s?(o-a)/f+(o<a?6:0):h===o?(a-s)/f+2:(s-o)/f+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},y_=function(t){var e=[],n=[],i=-1;return t.split(Ur).forEach(function(s){var o=s.match(so)||[];e.push.apply(e,o),n.push(i+=o.length+1)}),e.c=n,e},_p=function(t,e,n){var i="",s=(t+i).match(Ur),o=e?"hsla(":"rgba(",a=0,l,c,u,h;if(!s)return t;if(s=s.map(function(d){return(d=M_(d,e,1))&&o+(e?d[0]+","+d[1]+"%,"+d[2]+"%,"+d[3]:d.join(","))+")"}),n&&(u=y_(t),l=n.c,l.join(i)!==u.c.join(i)))for(c=t.replace(Ur,"1").split(so),h=c.length-1;a<h;a++)i+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(u.length?u:s.length?s:n).shift());if(!c)for(c=t.split(Ur),h=c.length-1;a<h;a++)i+=c[a]+s[a];return i+c[h]},Ur=(function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in Zo)r+="|"+t+"\\b";return new RegExp(r+")","gi")})(),x1=/hsl[a]?\(/,S_=function(t){var e=t.join(" "),n;if(Ur.lastIndex=0,Ur.test(e))return n=x1.test(e),t[1]=_p(t[1],n),t[0]=_p(t[0],n,y_(t[1])),!0},Ra,oi=(function(){var r=Date.now,t=500,e=33,n=r(),i=n,s=1e3/240,o=s,a=[],l,c,u,h,d,f,_=function g(m){var p=r()-i,M=m===!0,x,v,b,A;if((p>t||p<0)&&(n+=p-e),i+=p,b=i-n,x=b-o,(x>0||M)&&(A=++h.frame,d=b-h.time*1e3,h.time=b=b/1e3,o+=x+(x>=s?4:s-x),v=1),M||(l=c(g)),v)for(f=0;f<a.length;f++)a[f](b,d,A,m)};return h={time:0,frame:0,tick:function(){_(!0)},deltaRatio:function(m){return d/(1e3/(m||60))},wake:function(){Qm&&(!yh&&Tf()&&(zi=yh=window,bf=zi.document||{},fi.gsap=Jn,(zi.gsapVersions||(zi.gsapVersions=[])).push(Jn.version),t_(Kl||zi.GreenSockGlobals||!zi.gsap&&zi||{}),v_.forEach(x_)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&h.sleep(),c=u||function(m){return setTimeout(m,o-h.time*1e3+1|0)},Ra=1,_(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),Ra=0,c=Aa},lagSmoothing:function(m,p){t=m||1/0,e=Math.min(p||33,t)},fps:function(m){s=1e3/(m||240),o=h.time*1e3+s},add:function(m,p,M){var x=p?function(v,b,A,E){m(v,b,A,E),h.remove(x)}:m;return h.remove(m),a[M?"unshift":"push"](x),Io(),x},remove:function(m,p){~(p=a.indexOf(m))&&a.splice(p,1)&&f>=p&&f--},_listeners:a},h})(),Io=function(){return!Ra&&oi.wake()},he={},M1=/^[\d.\-M][\d.\-,\s]/,y1=/["']/g,S1=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],s=1,o=n.length,a,l,c;s<o;s++)l=n[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),e[i]=isNaN(c)?c.replace(y1,"").trim():+c,i=l.substr(a+1).trim();return e},E1=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},T1=function(t){var e=(t+"").split("("),n=he[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[S1(e[1])]:E1(t).split(",").map(s_)):he._CE&&M1.test(t)?he._CE("",t):n},b1=function(t){return function(e){return 1-t(1-e)}},gs=function(t,e){return t&&(Ve(t)?t:he[t]||T1(t))||e},Ds=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var s={easeIn:e,easeOut:n,easeInOut:i},o;return qn(t,function(a){he[a]=fi[a]=s,he[o=a.toLowerCase()]=n;for(var l in s)he[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=he[a+"."+l]=s[l]}),s},E_=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},hu=function r(t,e,n){var i=e>=1?e:1,s=(n||(t?.3:.45))/(e<1?e:1),o=s/Mh*(Math.asin(1/i)||0),a=function(u){return u===1?1:i*Math.pow(2,-10*u)*ZE((u-o)*s)+1},l=t==="out"?a:t==="in"?function(c){return 1-a(1-c)}:E_(a);return s=Mh/s,l.config=function(c,u){return r(t,c,u)},l},fu=function r(t,e){e===void 0&&(e=1.70158);var n=function(o){return o?--o*o*((e+1)*o+e)+1:0},i=t==="out"?n:t==="in"?function(s){return 1-n(1-s)}:E_(n);return i.config=function(s){return r(t,s)},i};qn("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,t){var e=t<5?t+1:t;Ds(r+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});he.Linear.easeNone=he.none=he.Linear.easeIn;Ds("Elastic",hu("in"),hu("out"),hu());(function(r,t){var e=1/t,n=2*e,i=2.5*e,s=function(a){return a<e?r*a*a:a<n?r*Math.pow(a-1.5/t,2)+.75:a<i?r*(a-=2.25/t)*a+.9375:r*Math.pow(a-2.625/t,2)+.984375};Ds("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);Ds("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});Ds("Circ",function(r){return-(Zm(1-r*r)-1)});Ds("Sine",function(r){return r===1?1:-$E(r*YE)+1});Ds("Back",fu("in"),fu("out"),fu());he.SteppedEase=he.steps=fi.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),s=e?1:0,o=1-Ae;return function(a){return((i*Ha(0,o,a)|0)+s)*n}}};ba.ease=he["quad.out"];qn("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return Cf+=r+","+r+"Params,"});var T_=function(t,e){this.id=qE++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:i_,this.set=e?e.getSetter:Uf},Pa=(function(){function r(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,Lo(this,+e.duration,1,1),this.data=e.data,Ie&&(this._ctx=Ie,Ie.data.push(this)),Ra||oi.wake()}var t=r.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,Lo(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(Io(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Tc(this,n),!s._dp||s.parent||l_(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&Vi(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===Ae||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),r_(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+dp(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+dp(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?Do(this._tTime,s)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-Ae?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?tc(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-Ae?0:this._rts,this.totalTime(Ha(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),Ec(this),s1(this)},t.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Io(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Ae&&(this._tTime-=Ae)))),this):this._ps},t.startTime=function(n){if(arguments.length){this._start=Ne(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&Vi(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(Yn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?tc(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=e1);var i=pn;return pn=n,Pf(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),pn=i,this},t.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,pp(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,pp(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(vi(this,n),Yn(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,Yn(i)),this._dur||(this._zTime=-Ae),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Ae:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-Ae,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-Ae)},t.eventCallback=function(n,i,s){var o=this.vars;return arguments.length>1?(i?(o[n]=i,s&&(o[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete o[n],this):o[n]},t.then=function(n){var i=this,s=i._prom;return new Promise(function(o){var a=Ve(n)?n:o_,l=function(){var u=i.then;i.then=null,s&&s(),Ve(a)&&(a=a(i))&&(a.then||a===i)&&(i.then=u),o(a),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){$o(this)},r})();di(Pa.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Ae,_prom:0,_ps:!1,_rts:1});var Gn=(function(r){$m(t,r);function t(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Yn(n.sortChildren),Fe&&Vi(n.parent||Fe,ir(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&c_(ir(s),n.scrollTrigger),s}var e=t.prototype;return e.to=function(i,s,o){return ca(0,arguments,this),this},e.from=function(i,s,o){return ca(1,arguments,this),this},e.fromTo=function(i,s,o,a){return ca(2,arguments,this),this},e.set=function(i,s,o){return s.duration=0,s.parent=this,la(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Ze(i,s,vi(this,o),1),this},e.call=function(i,s,o){return Vi(this,Ze.delayedCall(0,i,s),o)},e.staggerTo=function(i,s,o,a,l,c,u){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=u,o.parent=this,new Ze(i,o,vi(this,l)),this},e.staggerFrom=function(i,s,o,a,l,c,u){return o.runBackwards=1,la(o).immediateRender=Yn(o.immediateRender),this.staggerTo(i,s,o,a,l,c,u)},e.staggerFromTo=function(i,s,o,a,l,c,u,h){return a.startAt=o,la(a).immediateRender=Yn(a.immediateRender),this.staggerTo(i,s,a,l,c,u,h)},e.render=function(i,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:Ne(i),h=this._zTime<0!=i<0&&(this._initted||!c),d,f,_,g,m,p,M,x,v,b,A,E;if(this!==Fe&&u>l&&i>=0&&(u=l),u!==this._tTime||o||h){if(a!==this._time&&c&&(u+=this._time-a,i+=this._time-a),d=u,v=this._start,x=this._ts,p=!x,h&&(c||(a=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(A=this._yoyo,m=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(m*100+i,s,o);if(d=Ne(u%m),u===l?(g=this._repeat,d=c):(b=Ne(u/m),g=~~b,g&&g===b&&(d=c,g--),d>c&&(d=c)),b=Do(this._tTime,m),!a&&this._tTime&&b!==g&&this._tTime-b*m-this._dur<=0&&(b=g),A&&g&1&&(d=c-d,E=1),g!==b&&!this._lock){var C=A&&b&1,S=C===(A&&g&1);if(g<b&&(C=!C),a=C?0:u%c?c:u,this._lock=1,this.render(a||(E?0:Ne(g*m)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&li(this,"onRepeat"),this.vars.repeatRefresh&&!E&&(this.invalidate()._lock=1,b=g),a&&a!==this._time||p!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,S&&(this._lock=2,a=C?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!E&&this.invalidate()),this._lock=0,!this._ts&&!p)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(M=c1(this,Ne(a),Ne(d)),M&&(u-=d-(d=M._start))),this._tTime=u,this._time=d,this._act=!!x,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,a=0),!a&&u&&c&&!s&&!b&&(li(this,"onStart"),this._tTime!==u))return this;if(d>=a&&i>=0)for(f=this._first;f;){if(_=f._next,(f._act||d>=f._start)&&f._ts&&M!==f){if(f.parent!==this)return this.render(i,s,o);if(f.render(f._ts>0?(d-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(d-f._start)*f._ts,s,o),d!==this._time||!this._ts&&!p){M=0,_&&(u+=this._zTime=-Ae);break}}f=_}else{f=this._last;for(var y=i<0?i:d;f;){if(_=f._prev,(f._act||y<=f._end)&&f._ts&&M!==f){if(f.parent!==this)return this.render(i,s,o);if(f.render(f._ts>0?(y-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(y-f._start)*f._ts,s,o||pn&&Pf(f)),d!==this._time||!this._ts&&!p){M=0,_&&(u+=this._zTime=y?-Ae:Ae);break}}f=_}}if(M&&!s&&(this.pause(),M.render(d>=a?0:-Ae)._zTime=d>=a?1:-1,this._ts))return this._start=v,Ec(this),this.render(i,s,o);this._onUpdate&&!s&&li(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&a)&&(v===this._start||Math.abs(x)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Br(this,1),!s&&!(i<0&&!a)&&(u||a||!l)&&(li(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,s){var o=this;if(dr(s)||(s=vi(this,s,i)),!(i instanceof Pa)){if(Tn(i))return i.forEach(function(a){return o.add(a,s)}),this;if(cn(i))return this.addLabel(i,s);if(Ve(i))i=Ze.delayedCall(0,i);else return this}return this!==i?Vi(this,i,s):this},e.getChildren=function(i,s,o,a){i===void 0&&(i=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-bi);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof Ze?s&&l.push(c):(o&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},e.getById=function(i){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===i)return s[o]},e.remove=function(i){return cn(i)?this.removeLabel(i):Ve(i)?this.killTweensOf(i):(i.parent===this&&Sc(this,i),i===this._recent&&(this._recent=this._last),_s(this))},e.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Ne(oi.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},e.addLabel=function(i,s){return this.labels[i]=vi(this,s),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,s,o){var a=Ze.delayedCall(0,s||Aa,o);return a.data="isPause",this._hasPause=1,Vi(this,a,vi(this,i))},e.removePause=function(i){var s=this._first;for(i=vi(this,i);s;)s._start===i&&s.data==="isPause"&&Br(s),s=s._next},e.killTweensOf=function(i,s,o){for(var a=this.getTweensOf(i,o),l=a.length;l--;)br!==a[l]&&a[l].kill(i,s);return this},e.getTweensOf=function(i,s){for(var o=[],a=wi(i),l=this._first,c=dr(s),u;l;)l instanceof Ze?n1(l._targets,a)&&(c?(!br||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(u=l.getTweensOf(a,s)).length&&o.push.apply(o,u),l=l._next;return o},e.tweenTo=function(i,s){s=s||{};var o=this,a=vi(o,i),l=s,c=l.startAt,u=l.onStart,h=l.onStartParams,d=l.immediateRender,f,_=Ze.to(o,di({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||Ae,onStart:function(){if(o.pause(),!f){var m=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());_._dur!==m&&Lo(_,m,0,1).render(_._time,!0,!0),f=1}u&&u.apply(_,h||[])}},s));return d?_.render(0):_},e.tweenFromTo=function(i,s,o){return this.tweenTo(s,di({startAt:{time:vi(this,i)}},o))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),mp(this,vi(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),mp(this,vi(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+Ae)},e.shiftChildren=function(i,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(i=Ne(i);a;)a._start>=o&&(a._start+=i,a._end+=i),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=i);return _s(this)},e.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),_s(this)},e.totalDuration=function(i){var s=0,o=this,a=o._last,l=bi,c,u,h;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-i:i));if(o._dirty){for(h=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,Vi(o,a,u-a._delay,1)._lock=0):l=u,u<0&&a._ts&&(s-=u,(!h&&!o._dp||h&&h.smoothChildTiming)&&(o._start+=Ne(u/o._ts),o._time-=u,o._tTime-=u),o.shiftChildren(-u,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;Lo(o,o===Fe&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},t.updateRoot=function(i){if(Fe._ts&&(r_(Fe,tc(i,Fe)),n_=oi.frame),oi.frame>=hp){hp+=ui.autoSleep||120;var s=Fe._first;if((!s||!s._ts)&&ui.autoSleep&&oi._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||oi.sleep()}}},t})(Pa);di(Gn.prototype,{_lock:0,_hasPause:0,_forcing:0});var w1=function(t,e,n,i,s,o,a){var l=new $n(this._pt,t,e,0,1,P_,null,s),c=0,u=0,h,d,f,_,g,m,p,M;for(l.b=n,l.e=i,n+="",i+="",(p=~i.indexOf("random("))&&(i=Ca(i)),o&&(M=[n,i],o(M,t,e),n=M[0],i=M[1]),d=n.match(lu)||[];h=lu.exec(i);)_=h[0],g=i.substring(c,h.index),f?f=(f+1)%5:g.substr(-5)==="rgba("&&(f=1),_!==d[u++]&&(m=parseFloat(d[u-1])||0,l._pt={_next:l._pt,p:g||u===1?g:",",s:m,c:_.charAt(1)==="="?mo(m,_)-m:parseFloat(_)-m,m:f&&f<4?Math.round:0},c=lu.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=a,(jm.test(i)||p)&&(l.e=0),this._pt=l,l},Df=function(t,e,n,i,s,o,a,l,c,u){Ve(i)&&(i=i(s||0,t,o));var h=t[e],d=n!=="get"?n:Ve(h)?c?t[e.indexOf("set")||!Ve(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():h,f=Ve(h)?c?D1:C_:If,_;if(cn(i)&&(~i.indexOf("random(")&&(i=Ca(i)),i.charAt(1)==="="&&(_=mo(d,i)+(Sn(d)||0),(_||_===0)&&(i=_))),!u||d!==i||Ch)return!isNaN(d*i)&&i!==""?(_=new $n(this._pt,t,e,+d||0,i-(d||0),typeof h=="boolean"?I1:R_,0,f),c&&(_.fp=c),a&&_.modifier(a,this,t),this._pt=_):(!h&&!(e in t)&&wf(e,i),w1.call(this,t,e,d,i,f,l||ui.stringFilter,c))},A1=function(t,e,n,i,s){if(Ve(t)&&(t=ua(t,s,e,n,i)),!$i(t)||t.style&&t.nodeType||Tn(t)||Jm(t))return cn(t)?ua(t,s,e,n,i):t;var o={},a;for(a in t)o[a]=ua(t[a],s,e,n,i);return o},b_=function(t,e,n,i,s,o){var a,l,c,u;if(ii[t]&&(a=new ii[t]).init(s,a.rawVars?e[t]:A1(e[t],i,s,o,n),n,i,o)!==!1&&(n._pt=l=new $n(n._pt,s,t,0,1,a.render,a,0,a.priority),n!==oo))for(c=n._ptLookup[n._targets.indexOf(s)],u=a._props.length;u--;)c[a._props[u]]=l;return a},br,Ch,Lf=function r(t,e,n){var i=t.vars,s=i.ease,o=i.startAt,a=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,h=i.yoyoEase,d=i.keyframes,f=i.autoRevert,_=t._dur,g=t._startAt,m=t._targets,p=t.parent,M=p&&p.data==="nested"?p.vars.targets:m,x=t._overwrite==="auto"&&!Sf,v=t.timeline,b=i.easeReverse||h,A,E,C,S,y,D,U,z,B,k,H,q,G;if(v&&(!d||!s)&&(s="none"),t._ease=gs(s,ba.ease),t._rEase=b&&(gs(b)||t._ease),t._from=!v&&!!i.runBackwards,t._from&&(t.ratio=1),!v||d&&!i.stagger){if(z=m[0]?ms(m[0]).harness:0,q=z&&i[z.prop],A=Ql(i,Af),g&&(g._zTime<0&&g.progress(1),e<0&&u&&a&&!f?g.render(-1,!0):g.revert(u&&_?zl:t1),g._lazy=0),o){if(Br(t._startAt=Ze.set(m,di({data:"isStart",overwrite:!1,parent:p,immediateRender:!0,lazy:!g&&Yn(l),startAt:null,delay:0,onUpdate:c&&function(){return li(t,"onUpdate")},stagger:0},o))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(pn||!a&&!f)&&t._startAt.revert(zl),a&&_&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(u&&_&&!g){if(e&&(a=!1),C=di({overwrite:!1,data:"isFromStart",lazy:a&&!g&&Yn(l),immediateRender:a,stagger:0,parent:p},A),q&&(C[z.prop]=q),Br(t._startAt=Ze.set(m,C)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(pn?t._startAt.revert(zl):t._startAt.render(-1,!0)),t._zTime=e,!a)r(t._startAt,Ae,Ae);else if(!e)return}for(t._pt=t._ptCache=0,l=_&&Yn(l)||l&&!_,E=0;E<m.length;E++){if(y=m[E],U=y._gsap||Rf(m)[E]._gsap,t._ptLookup[E]=k={},Sh[U.id]&&Ir.length&&jl(),H=M===m?E:M.indexOf(y),z&&(B=new z).init(y,q||A,t,H,M)!==!1&&(t._pt=S=new $n(t._pt,y,B.name,0,1,B.render,B,0,B.priority),B._props.forEach(function(nt){k[nt]=S}),B.priority&&(D=1)),!z||q)for(C in A)ii[C]&&(B=b_(C,A,t,H,y,M))?B.priority&&(D=1):k[C]=S=Df.call(t,y,C,"get",A[C],H,M,0,i.stringFilter);t._op&&t._op[E]&&t.kill(y,t._op[E]),x&&t._pt&&(br=t,Fe.killTweensOf(y,k,t.globalTime(e)),G=!t.parent,br=0),t._pt&&l&&(Sh[U.id]=1)}D&&D_(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!G,d&&e<=0&&v.render(bi,!0,!0)},C1=function(t,e,n,i,s,o,a,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],u,h,d,f;if(!c)for(c=t._ptCache[e]=[],d=t._ptLookup,f=t._targets.length;f--;){if(u=d[f][e],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return Ch=1,t.vars[e]="+=0",Lf(t,a),Ch=0,l?wa(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(f=c.length;f--;)h=c[f],u=h._pt||h,u.s=(i||i===0)&&!s?i:u.s+(i||0)+o*u.c,u.c=n-u.s,h.e&&(h.e=We(n)+Sn(h.e)),h.b&&(h.b=u.s+Sn(h.b))},R1=function(t,e){var n=t[0]?ms(t[0]).harness:0,i=n&&n.aliases,s,o,a,l;if(!i)return e;s=Po({},e);for(o in i)if(o in s)for(l=i[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},P1=function(t,e,n,i){var s=e.ease||i||"power1.inOut",o,a;if(Tn(e))a=n[t]||(n[t]=[]),e.forEach(function(l,c){return a.push({t:c/(e.length-1)*100,v:l,e:s})});else for(o in e)a=n[o]||(n[o]=[]),o==="ease"||a.push({t:parseFloat(t),v:e[o],e:s})},ua=function(t,e,n,i,s){return Ve(t)?t.call(e,n,i,s):cn(t)&&~t.indexOf("random(")?Ca(t):t},w_=Cf+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",A_={};qn(w_+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return A_[r]=1});var Ze=(function(r){$m(t,r);function t(n,i,s,o){var a;typeof i=="number"&&(s.duration=i,i=s,s=null),a=r.call(this,o?i:la(i))||this;var l=a.vars,c=l.duration,u=l.delay,h=l.immediateRender,d=l.stagger,f=l.overwrite,_=l.keyframes,g=l.defaults,m=l.scrollTrigger,p=i.parent||Fe,M=(Tn(n)||Jm(n)?dr(n[0]):"length"in i)?[n]:wi(n),x,v,b,A,E,C,S,y;if(a._targets=M.length?Rf(M):wa("GSAP target "+n+" not found. https://gsap.com",!ui.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=f,_||d||_l(c)||_l(u)){i=a.vars;var D=i.easeReverse||i.yoyoEase;if(x=a.timeline=new Gn({data:"nested",defaults:g||{},targets:p&&p.data==="nested"?p.vars.targets:M}),x.kill(),x.parent=x._dp=ir(a),x._start=0,d||_l(c)||_l(u)){if(A=M.length,S=d&&d_(d),$i(d))for(E in d)~w_.indexOf(E)&&(y||(y={}),y[E]=d[E]);for(v=0;v<A;v++)b=Ql(i,A_),b.stagger=0,D&&(b.easeReverse=D),y&&Po(b,y),C=M[v],b.duration=+ua(c,ir(a),v,C,M),b.delay=(+ua(u,ir(a),v,C,M)||0)-a._delay,!d&&A===1&&b.delay&&(a._delay=u=b.delay,a._start+=u,b.delay=0),x.to(C,b,S?S(v,C,M):0),x._ease=he.none;x.duration()?c=u=0:a.timeline=0}else if(_){la(di(x.vars.defaults,{ease:"none"})),x._ease=gs(_.ease||i.ease||"none");var U=0,z,B,k;if(Tn(_))_.forEach(function(H){return x.to(M,H,">")}),x.duration();else{b={};for(E in _)E==="ease"||E==="easeEach"||P1(E,_[E],b,_.easeEach);for(E in b)for(z=b[E].sort(function(H,q){return H.t-q.t}),U=0,v=0;v<z.length;v++)B=z[v],k={ease:B.e,duration:(B.t-(v?z[v-1].t:0))/100*c},k[E]=B.v,x.to(M,k,U),U+=k.duration;x.duration()<c&&x.to({},{duration:c-x.duration()})}}c||a.duration(c=x.duration())}else a.timeline=0;return f===!0&&!Sf&&(br=ir(a),Fe.killTweensOf(M),br=0),Vi(p,ir(a),s),i.reversed&&a.reverse(),i.paused&&a.paused(!0),(h||!c&&!_&&a._start===Ne(p._time)&&Yn(h)&&o1(ir(a))&&p.data!=="nested")&&(a._tTime=-Ae,a.render(Math.max(0,-u)||0)),m&&c_(ir(a),m),a}var e=t.prototype;return e.render=function(i,s,o){var a=this._time,l=this._tDur,c=this._dur,u=i<0,h=i>l-Ae&&!u?l:i<Ae?0:i,d,f,_,g,m,p,M,x;if(!c)l1(this,i,s,o);else if(h!==this._tTime||!i||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(d=h,x=this.timeline,this._repeat){if(g=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(g*100+i,s,o);if(d=Ne(h%g),h===l?(_=this._repeat,d=c):(m=Ne(h/g),_=~~m,_&&_===m?(d=c,_--):d>c&&(d=c)),p=this._yoyo&&_&1,p&&(d=c-d),m=Do(this._tTime,g),d===a&&!o&&this._initted&&_===m)return this._tTime=h,this;_!==m&&this.vars.repeatRefresh&&!p&&!this._lock&&d!==g&&this._initted&&(this._lock=o=1,this.render(Ne(g*_),!0).invalidate()._lock=0)}if(!this._initted){if(u_(this,u?i:d,o,s,h))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&_!==m))return this;if(c!==this._dur)return this.render(i,s,o)}if(this._rEase){var v=d<a;if(v!==this._inv){var b=v?a:c-a;this._inv=v,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=b?(v?-1:1)/b:0,this._invScale=v?-this.ratio:1-this.ratio,this._invEase=v?this._rEase:this._ease}this.ratio=M=this._invRatio+this._invScale*this._invEase((d-this._invTime)*this._invRecip)}else this.ratio=M=this._ease(d/c);if(this._from&&(this.ratio=M=1-M),this._tTime=h,this._time=d,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&h&&!s&&!m&&(li(this,"onStart"),this._tTime!==h))return this;for(f=this._pt;f;)f.r(M,f.d),f=f._next;x&&x.render(i<0?i:x._dur*x._ease(d/this._dur),s,o)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(u&&Eh(this,i,s,o),li(this,"onUpdate")),this._repeat&&_!==m&&this.vars.onRepeat&&!s&&this.parent&&li(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(u&&!this._onUpdate&&Eh(this,i,!0,!0),(i||!c)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&Br(this,1),!s&&!(u&&!a)&&(h||a||p)&&(li(this,h===l?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},e.resetTo=function(i,s,o,a,l){Ra||oi.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||Lf(this,c),u=this._ease(c/this._dur),C1(this,i,s,o,a,u,c,l)?this.resetTo(i,s,o,a,1):(Tc(this,0),this.parent||a_(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?$o(this):this.scrollTrigger&&this.scrollTrigger.kill(!!pn),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,br&&br.vars.overwrite!==!0)._first||$o(this),this.parent&&o!==this.timeline.totalDuration()&&Lo(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=i?wi(i):a,c=this._ptLookup,u=this._pt,h,d,f,_,g,m,p;if((!s||s==="all")&&r1(a,l))return s==="all"&&(this._pt=0),$o(this);for(h=this._op=this._op||[],s!=="all"&&(cn(s)&&(g={},qn(s,function(M){return g[M]=1}),s=g),s=R1(a,s)),p=a.length;p--;)if(~l.indexOf(a[p])){d=c[p],s==="all"?(h[p]=s,_=d,f={}):(f=h[p]=h[p]||{},_=s);for(g in _)m=d&&d[g],m&&((!("kill"in m.d)||m.d.kill(g)===!0)&&Sc(this,m,"_pt"),delete d[g]),f!=="all"&&(f[g]=1)}return this._initted&&!this._pt&&u&&$o(this),this},t.to=function(i,s){return new t(i,s,arguments[2])},t.from=function(i,s){return ca(1,arguments)},t.delayedCall=function(i,s,o,a){return new t(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},t.fromTo=function(i,s,o){return ca(2,arguments)},t.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new t(i,s)},t.killTweensOf=function(i,s,o){return Fe.killTweensOf(i,s,o)},t})(Pa);di(Ze.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});qn("staggerTo,staggerFrom,staggerFromTo",function(r){Ze[r]=function(){var t=new Gn,e=bh.call(arguments,0);return e.splice(r==="staggerFromTo"?5:4,0,0),t[r].apply(t,e)}});var If=function(t,e,n){return t[e]=n},C_=function(t,e,n){return t[e](n)},D1=function(t,e,n,i){return t[e](i.fp,n)},L1=function(t,e,n){return t.setAttribute(e,n)},Uf=function(t,e){return Ve(t[e])?C_:Ef(t[e])&&t.setAttribute?L1:If},R_=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},I1=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},P_=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Nf=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},U1=function(t,e,n,i){for(var s=this._pt,o;s;)o=s._next,s.p===i&&s.modifier(t,e,n),s=o},N1=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?Sc(this,e,"_pt"):e.dep||(n=1),e=i;return!n},F1=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},D_=function(t){for(var e=t._pt,n,i,s,o;e;){for(n=e._next,i=s;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:o)?e._prev._next=e:s=e,(e._next=i)?i._prev=e:o=e,e=n}t._pt=s},$n=(function(){function r(e,n,i,s,o,a,l,c,u){this.t=n,this.s=s,this.c=o,this.p=i,this.r=a||R_,this.d=l||this,this.set=c||If,this.pr=u||0,this._next=e,e&&(e._prev=this)}var t=r.prototype;return t.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=F1,this.m=n,this.mt=s,this.tween=i},r})();qn(Cf+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return Af[r]=1});fi.TweenMax=fi.TweenLite=Ze;fi.TimelineLite=fi.TimelineMax=Gn;Fe=new Gn({sortChildren:!1,defaults:ba,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});ui.stringFilter=S_;var vs=[],Hl={},O1=[],gp=0,B1=0,du=function(t){return(Hl[t]||O1).map(function(e){return e()})},Rh=function(){var t=Date.now(),e=[];t-gp>2&&(du("matchMediaInit"),vs.forEach(function(n){var i=n.queries,s=n.conditions,o,a,l,c;for(a in i)o=zi.matchMedia(i[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(n.revert(),l&&e.push(n))}),du("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),gp=t,du("matchMedia"))},L_=(function(){function r(e,n){this.selector=n&&wh(n),this.data=[],this._r=[],this.isReverted=!1,this.id=B1++,e&&this.add(e)}var t=r.prototype;return t.add=function(n,i,s){Ve(n)&&(s=i,i=n,n=Ve);var o=this,a=function(){var c=Ie,u=o.selector,h;return c&&c!==o&&c.data.push(o),s&&(o.selector=wh(s)),Ie=o,h=i.apply(o,arguments),Ve(h)&&o._r.push(h),Ie=c,o.selector=u,o.isReverted=!1,h};return o.last=a,n===Ve?a(o,function(l){return o.add(null,l)}):n?o[n]=a:a},t.ignore=function(n){var i=Ie;Ie=null,n(this),Ie=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof Ze&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var s=this;if(n?(function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,h){return h.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Gn?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Ze)&&c.revert&&c.revert(n);s._r.forEach(function(u){return u(n,s)}),s.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),i)for(var o=vs.length;o--;)vs[o].id===this.id&&vs.splice(o,1)},t.revert=function(n){this.kill(n||{})},r})(),z1=(function(){function r(e){this.contexts=[],this.scope=e,Ie&&Ie.data.push(this)}var t=r.prototype;return t.add=function(n,i,s){$i(n)||(n={matches:n});var o=new L_(0,s||this.scope),a=o.conditions={},l,c,u;Ie&&!o.selector&&(o.selector=Ie.selector),this.contexts.push(o),i=o.add("onMatch",i),o.queries=n;for(c in n)c==="all"?u=1:(l=zi.matchMedia(n[c]),l&&(vs.indexOf(o)<0&&vs.push(o),(a[c]=l.matches)&&(u=1),l.addListener?l.addListener(Rh):l.addEventListener("change",Rh)));return u&&i(o,function(h){return o.add(null,h)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r})(),ec={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return x_(i)})},timeline:function(t){return new Gn(t)},getTweensOf:function(t,e){return Fe.getTweensOf(t,e)},getProperty:function(t,e,n,i){cn(t)&&(t=wi(t)[0]);var s=ms(t||{}).get,o=n?o_:s_;return n==="native"&&(n=""),t&&(e?o((ii[e]&&ii[e].get||s)(t,e,n,i)):function(a,l,c){return o((ii[a]&&ii[a].get||s)(t,a,l,c))})},quickSetter:function(t,e,n){if(t=wi(t),t.length>1){var i=t.map(function(u){return Jn.quickSetter(u,e,n)}),s=i.length;return function(u){for(var h=s;h--;)i[h](u)}}t=t[0]||{};var o=ii[e],a=ms(t),l=a.harness&&(a.harness.aliases||{})[e]||e,c=o?function(u){var h=new o;oo._pt=0,h.init(t,n?u+n:u,oo,0,[t]),h.render(1,h),oo._pt&&Nf(1,oo)}:a.set(t,l);return o?c:function(u){return c(t,l,n?u+n:u,a,1)}},quickTo:function(t,e,n){var i,s=Jn.to(t,di((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),o=function(l,c,u){return s.resetTo(e,l,c,u)};return o.tween=s,o},isTweening:function(t){return Fe.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=gs(t.ease,ba.ease)),fp(ba,t||{})},config:function(t){return fp(ui,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,s=t.defaults,o=t.extendTimeline;(i||"").split(",").forEach(function(a){return a&&!ii[a]&&!fi[a]&&wa(e+" effect requires "+a+" plugin.")}),cu[e]=function(a,l,c){return n(wi(a),di(l||{},s),c)},o&&(Gn.prototype[e]=function(a,l,c){return this.add(cu[e](a,$i(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){he[t]=gs(e)},parseEase:function(t,e){return arguments.length?gs(t,e):he},getById:function(t){return Fe.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new Gn(t),i,s;for(n.smoothChildTiming=Yn(t.smoothChildTiming),Fe.remove(n),n._dp=0,n._time=n._tTime=Fe._time,i=Fe._first;i;)s=i._next,(e||!(!i._dur&&i instanceof Ze&&i.vars.onComplete===i._targets[0]))&&Vi(n,i,i._start-i._delay),i=s;return Vi(Fe,n,0),n},context:function(t,e){return t?new L_(t,e):Ie},matchMedia:function(t){return new z1(t)},matchMediaRefresh:function(){return vs.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||Rh()},addEventListener:function(t,e){var n=Hl[t]||(Hl[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=Hl[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:_1,wrapYoyo:g1,distribute:d_,random:m_,snap:p_,normalize:m1,getUnit:Sn,clamp:h1,splitColor:M_,toArray:wi,selector:wh,mapRange:g_,pipe:d1,unitize:p1,interpolate:v1,shuffle:f_},install:t_,effects:cu,ticker:oi,updateRoot:Gn.updateRoot,plugins:ii,globalTimeline:Fe,core:{PropTween:$n,globals:e_,Tween:Ze,Timeline:Gn,Animation:Pa,getCache:ms,_removeLinkedListItem:Sc,reverting:function(){return pn},context:function(t){return t&&Ie&&(Ie.data.push(t),t._ctx=Ie),Ie},suppressOverwrites:function(t){return Sf=t}}};qn("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return ec[r]=Ze[r]});oi.add(Gn.updateRoot);oo=ec.to({},{duration:0});var k1=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},H1=function(t,e){var n=t._targets,i,s,o;for(i in e)for(s=n.length;s--;)o=t._ptLookup[s][i],o&&(o=o.d)&&(o._pt&&(o=k1(o,i)),o&&o.modifier&&o.modifier(e[i],t,n[s],i))},pu=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,s,o){o._onInit=function(a){var l,c;if(cn(s)&&(l={},qn(s,function(u){return l[u]=1}),s=l),e){l={};for(c in s)l[c]=e(s[c]);s=l}H1(a,s)}}}},Jn=ec.registerPlugin({name:"attr",init:function(t,e,n,i,s){var o,a,l;this.tween=n;for(o in e)l=t.getAttribute(o)||"",a=this.add(t,"setAttribute",(l||0)+"",e[o],i,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(t,e){for(var n=e._pt;n;)pn?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},pu("roundProps",Ah),pu("modifiers"),pu("snap",p_))||ec;Ze.version=Gn.version=Jn.version="3.15.0";Qm=1;Tf()&&Io();he.Power0;he.Power1;he.Power2;he.Power3;he.Power4;he.Linear;he.Quad;he.Cubic;he.Quart;he.Quint;he.Strong;he.Elastic;he.Back;he.SteppedEase;he.Bounce;he.Sine;he.Expo;he.Circ;/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var vp,wr,_o,Ff,hs,xp,Of,V1=function(){return typeof window<"u"},pr={},is=180/Math.PI,go=Math.PI/180,$s=Math.atan2,Mp=1e8,Bf=/([A-Z])/g,G1=/(left|right|width|margin|padding|x)/i,W1=/[\s,\(]\S/,Wi={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Ph=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},X1=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Y1=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},q1=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},$1=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},I_=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},U_=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Z1=function(t,e,n){return t.style[e]=n},J1=function(t,e,n){return t.style.setProperty(e,n)},K1=function(t,e,n){return t._gsap[e]=n},j1=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},Q1=function(t,e,n,i,s){var o=t._gsap;o.scaleX=o.scaleY=n,o.renderTransform(s,o)},tT=function(t,e,n,i,s){var o=t._gsap;o[e]=n,o.renderTransform(s,o)},Be="transform",Zn=Be+"Origin",eT=function r(t,e){var n=this,i=this.target,s=i.style,o=i._gsap;if(t in pr&&s){if(this.tfm=this.tfm||{},t!=="transform")t=Wi[t]||t,~t.indexOf(",")?t.split(",").forEach(function(a){return n.tfm[a]=rr(i,a)}):this.tfm[t]=o.x?o[t]:rr(i,t),t===Zn&&(this.tfm.zOrigin=o.zOrigin);else return Wi.transform.split(",").forEach(function(a){return r.call(n,a,e)});if(this.props.indexOf(Be)>=0)return;o.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(Zn,e,"")),t=Be}(s||e)&&this.props.push(t,e,s[t])},N_=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},nT=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,s,o;for(s=0;s<t.length;s+=3)t[s+1]?t[s+1]===2?e[t[s]](t[s+2]):e[t[s]]=t[s+2]:t[s+2]?n[t[s]]=t[s+2]:n.removeProperty(t[s].substr(0,2)==="--"?t[s]:t[s].replace(Bf,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)i[o]=this.tfm[o];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),s=Of(),(!s||!s.isStart)&&!n[Be]&&(N_(n),i.zOrigin&&n[Zn]&&(n[Zn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},F_=function(t,e){var n={target:t,props:[],revert:nT,save:eT};return t._gsap||Jn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},O_,Dh=function(t,e){var n=wr.createElementNS?wr.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):wr.createElement(t);return n&&n.style?n:wr.createElement(t)},ci=function r(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Bf,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&r(t,Uo(e)||e,1)||""},yp="O,Moz,ms,Ms,Webkit".split(","),Uo=function(t,e,n){var i=e||hs,s=i.style,o=5;if(t in s&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);o--&&!(yp[o]+t in s););return o<0?null:(o===3?"ms":o>=0?yp[o]:"")+t},Lh=function(){V1()&&window.document&&(vp=window,wr=vp.document,_o=wr.documentElement,hs=Dh("div")||{style:{}},Dh("div"),Be=Uo(Be),Zn=Be+"Origin",hs.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",O_=!!Uo("perspective"),Of=Jn.core.reverting,Ff=1)},Sp=function(t){var e=t.ownerSVGElement,n=Dh("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),s;i.style.display="block",n.appendChild(i),_o.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),_o.removeChild(n),s},Ep=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},B_=function(t){var e,n;try{e=t.getBBox()}catch{e=Sp(t),n=1}return e&&(e.width||e.height)||n||(e=Sp(t)),e&&!e.width&&!e.x&&!e.y?{x:+Ep(t,["x","cx","x1"])||0,y:+Ep(t,["y","cy","y1"])||0,width:0,height:0}:e},z_=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&B_(t))},zr=function(t,e){if(e){var n=t.style,i;e in pr&&e!==Zn&&(e=Be),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Bf,"-$1").toLowerCase())):n.removeAttribute(e)}},Ar=function(t,e,n,i,s,o){var a=new $n(t._pt,e,n,0,1,o?U_:I_);return t._pt=a,a.b=i,a.e=s,t._props.push(n),a},Tp={deg:1,rad:1,turn:1},iT={grid:1,flex:1},kr=function r(t,e,n,i){var s=parseFloat(n)||0,o=(n+"").trim().substr((s+"").length)||"px",a=hs.style,l=G1.test(e),c=t.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),h=100,d=i==="px",f=i==="%",_,g,m,p;if(i===o||!s||Tp[i]||Tp[o])return s;if(o!=="px"&&!d&&(s=r(t,e,n,"px")),p=t.getCTM&&z_(t),(f||o==="%")&&(pr[e]||~e.indexOf("adius")))return _=p?t.getBBox()[l?"width":"height"]:t[u],We(f?s/_*h:s/100*_);if(a[l?"width":"height"]=h+(d?o:i),g=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,p&&(g=(t.ownerSVGElement||{}).parentNode),(!g||g===wr||!g.appendChild)&&(g=wr.body),m=g._gsap,m&&f&&m.width&&l&&m.time===oi.time&&!m.uncache)return We(s/m.width*h);if(f&&(e==="height"||e==="width")){var M=t.style[e];t.style[e]=h+i,_=t[u],M?t.style[e]=M:zr(t,e)}else(f||o==="%")&&!iT[ci(g,"display")]&&(a.position=ci(t,"position")),g===t&&(a.position="static"),g.appendChild(hs),_=hs[u],g.removeChild(hs),a.position="absolute";return l&&f&&(m=ms(g),m.time=oi.time,m.width=g[u]),We(d?_*s/h:_&&s?h/_*s:0)},rr=function(t,e,n,i){var s;return Ff||Lh(),e in Wi&&e!=="transform"&&(e=Wi[e],~e.indexOf(",")&&(e=e.split(",")[0])),pr[e]&&e!=="transform"?(s=La(t,i),s=e!=="transformOrigin"?s[e]:s.svg?s.origin:ic(ci(t,Zn))+" "+s.zOrigin+"px"):(s=t.style[e],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=nc[e]&&nc[e](t,e,n)||ci(t,e)||i_(t,e)||(e==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?kr(t,e,s,n)+n:s},rT=function(t,e,n,i){if(!n||n==="none"){var s=Uo(e,t,1),o=s&&ci(t,s,1);o&&o!==n?(e=s,n=o):e==="borderColor"&&(n=ci(t,"borderTopColor"))}var a=new $n(this._pt,t.style,e,0,1,P_),l=0,c=0,u,h,d,f,_,g,m,p,M,x,v,b;if(a.b=n,a.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=ci(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(g=t.style[e],t.style[e]=i,i=ci(t,e)||i,g?t.style[e]=g:zr(t,e)),u=[n,i],S_(u),n=u[0],i=u[1],d=n.match(so)||[],b=i.match(so)||[],b.length){for(;h=so.exec(i);)m=h[0],M=i.substring(l,h.index),_?_=(_+1)%5:(M.substr(-5)==="rgba("||M.substr(-5)==="hsla(")&&(_=1),m!==(g=d[c++]||"")&&(f=parseFloat(g)||0,v=g.substr((f+"").length),m.charAt(1)==="="&&(m=mo(f,m)+v),p=parseFloat(m),x=m.substr((p+"").length),l=so.lastIndex-x.length,x||(x=x||ui.units[e]||v,l===i.length&&(i+=x,a.e+=x)),v!==x&&(f=kr(t,e,g,x)||0),a._pt={_next:a._pt,p:M||c===1?M:",",s:f,c:p-f,m:_&&_<4||e==="zIndex"?Math.round:0});a.c=l<i.length?i.substring(l,i.length):""}else a.r=e==="display"&&i==="none"?U_:I_;return jm.test(i)&&(a.e=0),this._pt=a,a},bp={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},sT=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=bp[n]||n,e[1]=bp[i]||i,e.join(" ")},oT=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,s=e.u,o=n._gsap,a,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],pr[a]&&(l=1,a=a==="transformOrigin"?Zn:Be),zr(n,a);l&&(zr(n,Be),o&&(o.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",La(n,1),o.uncache=1,N_(i)))}},nc={clearProps:function(t,e,n,i,s){if(s.data!=="isFromStart"){var o=t._pt=new $n(t._pt,e,n,0,0,oT);return o.u=i,o.pr=-10,o.tween=s,t._props.push(n),1}}},Da=[1,0,0,1,0,0],k_={},H_=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},wp=function(t){var e=ci(t,Be);return H_(e)?Da:e.substr(7).match(Km).map(We)},zf=function(t,e){var n=t._gsap||ms(t),i=t.style,s=wp(t),o,a,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Da:s):(s===Da&&!t.offsetParent&&t!==_o&&!n.svg&&(l=i.display,i.display="block",o=t.parentNode,(!o||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,a=t.nextElementSibling,_o.appendChild(t)),s=wp(t),l?i.display=l:zr(t,"display"),c&&(a?o.insertBefore(t,a):o?o.appendChild(t):_o.removeChild(t))),e&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Ih=function(t,e,n,i,s,o){var a=t._gsap,l=s||zf(t,!0),c=a.xOrigin||0,u=a.yOrigin||0,h=a.xOffset||0,d=a.yOffset||0,f=l[0],_=l[1],g=l[2],m=l[3],p=l[4],M=l[5],x=e.split(" "),v=parseFloat(x[0])||0,b=parseFloat(x[1])||0,A,E,C,S;n?l!==Da&&(E=f*m-_*g)&&(C=v*(m/E)+b*(-g/E)+(g*M-m*p)/E,S=v*(-_/E)+b*(f/E)-(f*M-_*p)/E,v=C,b=S):(A=B_(t),v=A.x+(~x[0].indexOf("%")?v/100*A.width:v),b=A.y+(~(x[1]||x[0]).indexOf("%")?b/100*A.height:b)),i||i!==!1&&a.smooth?(p=v-c,M=b-u,a.xOffset=h+(p*f+M*g)-p,a.yOffset=d+(p*_+M*m)-M):a.xOffset=a.yOffset=0,a.xOrigin=v,a.yOrigin=b,a.smooth=!!i,a.origin=e,a.originIsAbsolute=!!n,t.style[Zn]="0px 0px",o&&(Ar(o,a,"xOrigin",c,v),Ar(o,a,"yOrigin",u,b),Ar(o,a,"xOffset",h,a.xOffset),Ar(o,a,"yOffset",d,a.yOffset)),t.setAttribute("data-svg-origin",v+" "+b)},La=function(t,e){var n=t._gsap||new T_(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,s=n.scaleX<0,o="px",a="deg",l=getComputedStyle(t),c=ci(t,Zn)||"0",u,h,d,f,_,g,m,p,M,x,v,b,A,E,C,S,y,D,U,z,B,k,H,q,G,nt,R,K,pt,Ft,$,et;return u=h=d=g=m=p=M=x=v=0,f=_=1,n.svg=!!(t.getCTM&&z_(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Be]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Be]!=="none"?l[Be]:"")),i.scale=i.rotate=i.translate="none"),E=zf(t,n.svg),n.svg&&(n.uncache?(G=t.getBBox(),c=n.xOrigin-G.x+"px "+(n.yOrigin-G.y)+"px",q=""):q=!e&&t.getAttribute("data-svg-origin"),Ih(t,q||c,!!q||n.originIsAbsolute,n.smooth!==!1,E)),b=n.xOrigin||0,A=n.yOrigin||0,E!==Da&&(D=E[0],U=E[1],z=E[2],B=E[3],u=k=E[4],h=H=E[5],E.length===6?(f=Math.sqrt(D*D+U*U),_=Math.sqrt(B*B+z*z),g=D||U?$s(U,D)*is:0,M=z||B?$s(z,B)*is+g:0,M&&(_*=Math.abs(Math.cos(M*go))),n.svg&&(u-=b-(b*D+A*z),h-=A-(b*U+A*B))):(et=E[6],Ft=E[7],R=E[8],K=E[9],pt=E[10],$=E[11],u=E[12],h=E[13],d=E[14],C=$s(et,pt),m=C*is,C&&(S=Math.cos(-C),y=Math.sin(-C),q=k*S+R*y,G=H*S+K*y,nt=et*S+pt*y,R=k*-y+R*S,K=H*-y+K*S,pt=et*-y+pt*S,$=Ft*-y+$*S,k=q,H=G,et=nt),C=$s(-z,pt),p=C*is,C&&(S=Math.cos(-C),y=Math.sin(-C),q=D*S-R*y,G=U*S-K*y,nt=z*S-pt*y,$=B*y+$*S,D=q,U=G,z=nt),C=$s(U,D),g=C*is,C&&(S=Math.cos(C),y=Math.sin(C),q=D*S+U*y,G=k*S+H*y,U=U*S-D*y,H=H*S-k*y,D=q,k=G),m&&Math.abs(m)+Math.abs(g)>359.9&&(m=g=0,p=180-p),f=We(Math.sqrt(D*D+U*U+z*z)),_=We(Math.sqrt(H*H+et*et)),C=$s(k,H),M=Math.abs(C)>2e-4?C*is:0,v=$?1/($<0?-$:$):0),n.svg&&(q=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!H_(ci(t,Be)),q&&t.setAttribute("transform",q))),Math.abs(M)>90&&Math.abs(M)<270&&(s?(f*=-1,M+=g<=0?180:-180,g+=g<=0?180:-180):(_*=-1,M+=M<=0?180:-180)),e=e||n.uncache,n.x=u-((n.xPercent=u&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-u)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+o,n.y=h-((n.yPercent=h&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-h)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+o,n.z=d+o,n.scaleX=We(f),n.scaleY=We(_),n.rotation=We(g)+a,n.rotationX=We(m)+a,n.rotationY=We(p)+a,n.skewX=M+a,n.skewY=x+a,n.transformPerspective=v+o,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[Zn]=ic(c)),n.xOffset=n.yOffset=0,n.force3D=ui.force3D,n.renderTransform=n.svg?lT:O_?V_:aT,n.uncache=0,n},ic=function(t){return(t=t.split(" "))[0]+" "+t[1]},mu=function(t,e,n){var i=Sn(e);return We(parseFloat(e)+parseFloat(kr(t,"x",n+"px",i)))+i},aT=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,V_(t,e)},Jr="0deg",Wo="0px",Kr=") ",V_=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.z,c=n.rotation,u=n.rotationY,h=n.rotationX,d=n.skewX,f=n.skewY,_=n.scaleX,g=n.scaleY,m=n.transformPerspective,p=n.force3D,M=n.target,x=n.zOrigin,v="",b=p==="auto"&&t&&t!==1||p===!0;if(x&&(h!==Jr||u!==Jr)){var A=parseFloat(u)*go,E=Math.sin(A),C=Math.cos(A),S;A=parseFloat(h)*go,S=Math.cos(A),o=mu(M,o,E*S*-x),a=mu(M,a,-Math.sin(A)*-x),l=mu(M,l,C*S*-x+x)}m!==Wo&&(v+="perspective("+m+Kr),(i||s)&&(v+="translate("+i+"%, "+s+"%) "),(b||o!==Wo||a!==Wo||l!==Wo)&&(v+=l!==Wo||b?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+Kr),c!==Jr&&(v+="rotate("+c+Kr),u!==Jr&&(v+="rotateY("+u+Kr),h!==Jr&&(v+="rotateX("+h+Kr),(d!==Jr||f!==Jr)&&(v+="skew("+d+", "+f+Kr),(_!==1||g!==1)&&(v+="scale("+_+", "+g+Kr),M.style[Be]=v||"translate(0, 0)"},lT=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.rotation,c=n.skewX,u=n.skewY,h=n.scaleX,d=n.scaleY,f=n.target,_=n.xOrigin,g=n.yOrigin,m=n.xOffset,p=n.yOffset,M=n.forceCSS,x=parseFloat(o),v=parseFloat(a),b,A,E,C,S;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=go,c*=go,b=Math.cos(l)*h,A=Math.sin(l)*h,E=Math.sin(l-c)*-d,C=Math.cos(l-c)*d,c&&(u*=go,S=Math.tan(c-u),S=Math.sqrt(1+S*S),E*=S,C*=S,u&&(S=Math.tan(u),S=Math.sqrt(1+S*S),b*=S,A*=S)),b=We(b),A=We(A),E=We(E),C=We(C)):(b=h,C=d,A=E=0),(x&&!~(o+"").indexOf("px")||v&&!~(a+"").indexOf("px"))&&(x=kr(f,"x",o,"px"),v=kr(f,"y",a,"px")),(_||g||m||p)&&(x=We(x+_-(_*b+g*E)+m),v=We(v+g-(_*A+g*C)+p)),(i||s)&&(S=f.getBBox(),x=We(x+i/100*S.width),v=We(v+s/100*S.height)),S="matrix("+b+","+A+","+E+","+C+","+x+","+v+")",f.setAttribute("transform",S),M&&(f.style[Be]=S)},cT=function(t,e,n,i,s){var o=360,a=cn(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?is:1),c=l-i,u=i+c+"deg",h,d;return a&&(h=s.split("_")[1],h==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),h==="cw"&&c<0?c=(c+o*Mp)%o-~~(c/o)*o:h==="ccw"&&c>0&&(c=(c-o*Mp)%o-~~(c/o)*o)),t._pt=d=new $n(t._pt,e,n,i,c,X1),d.e=u,d.u="deg",t._props.push(n),d},Ap=function(t,e){for(var n in e)t[n]=e[n];return t},uT=function(t,e,n){var i=Ap({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=n.style,a,l,c,u,h,d,f,_;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),o[Be]=e,a=La(n,1),zr(n,Be),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Be],o[Be]=e,a=La(n,1),o[Be]=c);for(l in pr)c=i[l],u=a[l],c!==u&&s.indexOf(l)<0&&(f=Sn(c),_=Sn(u),h=f!==_?kr(n,l,c,_):parseFloat(c),d=parseFloat(u),t._pt=new $n(t._pt,a,l,h,d-h,Ph),t._pt.u=_||0,t._props.push(l));Ap(a,i)};qn("padding,margin,Width,Radius",function(r,t){var e="Top",n="Right",i="Bottom",s="Left",o=(t<3?[e,n,i,s]:[e+s,e+n,i+n,i+s]).map(function(a){return t<2?r+a:"border"+a+r});nc[t>1?"border"+r:r]=function(a,l,c,u,h){var d,f;if(arguments.length<4)return d=o.map(function(_){return rr(a,_,c)}),f=d.join(" "),f.split(d[0]).length===5?d[0]:f;d=(u+"").split(" "),f={},o.forEach(function(_,g){return f[_]=d[g]=d[g]||d[(g-1)/2|0]}),a.init(l,f,h)}});var G_={name:"css",register:Lh,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,s){var o=this._props,a=t.style,l=n.vars.startAt,c,u,h,d,f,_,g,m,p,M,x,v,b,A,E,C,S;Ff||Lh(),this.styles=this.styles||F_(t),C=this.styles.props,this.tween=n;for(g in e)if(g!=="autoRound"&&(u=e[g],!(ii[g]&&b_(g,e,n,i,t,s)))){if(f=typeof u,_=nc[g],f==="function"&&(u=u.call(n,i,t,s),f=typeof u),f==="string"&&~u.indexOf("random(")&&(u=Ca(u)),_)_(this,t,g,u,n)&&(E=1);else if(g.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(g)+"").trim(),u+="",Ur.lastIndex=0,Ur.test(c)||(m=Sn(c),p=Sn(u),p?m!==p&&(c=kr(t,g,c,p)+p):m&&(u+=m)),this.add(a,"setProperty",c,u,i,s,0,0,g),o.push(g),C.push(g,0,a[g]);else if(f!=="undefined"){if(l&&g in l?(c=typeof l[g]=="function"?l[g].call(n,i,t,s):l[g],cn(c)&&~c.indexOf("random(")&&(c=Ca(c)),Sn(c+"")||c==="auto"||(c+=ui.units[g]||Sn(rr(t,g))||""),(c+"").charAt(1)==="="&&(c=rr(t,g))):c=rr(t,g),d=parseFloat(c),M=f==="string"&&u.charAt(1)==="="&&u.substr(0,2),M&&(u=u.substr(2)),h=parseFloat(u),g in Wi&&(g==="autoAlpha"&&(d===1&&rr(t,"visibility")==="hidden"&&h&&(d=0),C.push("visibility",0,a.visibility),Ar(this,a,"visibility",d?"inherit":"hidden",h?"inherit":"hidden",!h)),g!=="scale"&&g!=="transform"&&(g=Wi[g],~g.indexOf(",")&&(g=g.split(",")[0]))),x=g in pr,x){if(this.styles.save(g),S=u,f==="string"&&u.substring(0,6)==="var(--"){if(u=ci(t,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var y=t.style.perspective;t.style.perspective=u,u=ci(t,"perspective"),y?t.style.perspective=y:zr(t,"perspective")}h=parseFloat(u)}if(v||(b=t._gsap,b.renderTransform&&!e.parseTransform||La(t,e.parseTransform),A=e.smoothOrigin!==!1&&b.smooth,v=this._pt=new $n(this._pt,a,Be,0,1,b.renderTransform,b,0,-1),v.dep=1),g==="scale")this._pt=new $n(this._pt,b,"scaleY",b.scaleY,(M?mo(b.scaleY,M+h):h)-b.scaleY||0,Ph),this._pt.u=0,o.push("scaleY",g),g+="X";else if(g==="transformOrigin"){C.push(Zn,0,a[Zn]),u=sT(u),b.svg?Ih(t,u,0,A,0,this):(p=parseFloat(u.split(" ")[2])||0,p!==b.zOrigin&&Ar(this,b,"zOrigin",b.zOrigin,p),Ar(this,a,g,ic(c),ic(u)));continue}else if(g==="svgOrigin"){Ih(t,u,1,A,0,this);continue}else if(g in k_){cT(this,b,g,d,M?mo(d,M+u):u);continue}else if(g==="smoothOrigin"){Ar(this,b,"smooth",b.smooth,u);continue}else if(g==="force3D"){b[g]=u;continue}else if(g==="transform"){uT(this,u,t);continue}}else g in a||(g=Uo(g)||g);if(x||(h||h===0)&&(d||d===0)&&!W1.test(u)&&g in a)m=(c+"").substr((d+"").length),h||(h=0),p=Sn(u)||(g in ui.units?ui.units[g]:m),m!==p&&(d=kr(t,g,c,p)),this._pt=new $n(this._pt,x?b:a,g,d,(M?mo(d,M+h):h)-d,!x&&(p==="px"||g==="zIndex")&&e.autoRound!==!1?$1:Ph),this._pt.u=p||0,x&&S!==u?(this._pt.b=c,this._pt.e=S,this._pt.r=q1):m!==p&&p!=="%"&&(this._pt.b=c,this._pt.r=Y1);else if(g in a)rT.call(this,t,g,c,M?M+u:u);else if(g in t)this.add(t,g,c||t[g],M?M+u:u,i,s);else if(g!=="parseTransform"){wf(g,u);continue}x||(g in a?C.push(g,0,a[g]):typeof t[g]=="function"?C.push(g,2,t[g]()):C.push(g,1,c||t[g])),o.push(g)}}E&&D_(this)},render:function(t,e){if(e.tween._time||!Of())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:rr,aliases:Wi,getSetter:function(t,e,n){var i=Wi[e];return i&&i.indexOf(",")<0&&(e=i),e in pr&&e!==Zn&&(t._gsap.x||rr(t,"x"))?n&&xp===n?e==="scale"?j1:K1:(xp=n||{})&&(e==="scale"?Q1:tT):t.style&&!Ef(t.style[e])?Z1:~e.indexOf("-")?J1:Uf(t,e)},core:{_removeProperty:zr,_getMatrix:zf}};Jn.utils.checkPrefix=Uo;Jn.core.getStyleSaver=F_;(function(r,t,e,n){var i=qn(r+","+t+","+e,function(s){pr[s]=1});qn(t,function(s){ui.units[s]="deg",k_[s]=1}),Wi[i[13]]=r+","+t,qn(n,function(s){var o=s.split(":");Wi[o[1]]=i[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");qn("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){ui.units[r]="px"});Jn.registerPlugin(G_);var Wn=Jn.registerPlugin(G_)||Jn;Wn.core.Tween;function hT(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function fT(r,t,e){return t&&hT(r.prototype,t),r}/*!
 * Observer 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var fn,Vl,ai,Cr,Rr,vo,W_,rs,xo,X_,lr,Li,Y_,q_=function(){return fn||typeof window<"u"&&(fn=window.gsap)&&fn.registerPlugin&&fn},$_=1,ao=[],oe=[],qi=[],ha=Date.now,Uh=function(t,e){return e},dT=function(){var t=xo.core,e=t.bridge||{},n=t._scrollers,i=t._proxies;n.push.apply(n,oe),i.push.apply(i,qi),oe=n,qi=i,Uh=function(o,a){return e[o](a)}},Nr=function(t,e){return~qi.indexOf(t)&&qi[qi.indexOf(t)+1][e]},fa=function(t){return!!~X_.indexOf(t)},Pn=function(t,e,n,i,s){return t.addEventListener(e,n,{passive:i!==!1,capture:!!s})},Cn=function(t,e,n,i){return t.removeEventListener(e,n,!!i)},gl="scrollLeft",vl="scrollTop",Nh=function(){return lr&&lr.isPressed||oe.cache++},rc=function(t,e){var n=function i(s){if(s||s===0){$_&&(ai.history.scrollRestoration="manual");var o=lr&&lr.isPressed;s=i.v=Math.round(s)||(lr&&lr.iOS?1:0),t(s),i.cacheID=oe.cache,o&&Uh("ss",s)}else(e||oe.cache!==i.cacheID||Uh("ref"))&&(i.cacheID=oe.cache,i.v=t());return i.v+i.offset};return n.offset=0,t&&n},Fn={s:gl,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:rc(function(r){return arguments.length?ai.scrollTo(r,tn.sc()):ai.pageXOffset||Cr[gl]||Rr[gl]||vo[gl]||0})},tn={s:vl,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:Fn,sc:rc(function(r){return arguments.length?ai.scrollTo(Fn.sc(),r):ai.pageYOffset||Cr[vl]||Rr[vl]||vo[vl]||0})},Vn=function(t,e){return(e&&e._ctx&&e._ctx.selector||fn.utils.toArray)(t)[0]||(typeof t=="string"&&fn.config().nullTargetWarn!==!1?console.warn("Element not found:",t):null)},pT=function(t,e){for(var n=e.length;n--;)if(e[n]===t||e[n].contains(t))return!0;return!1},Hr=function(t,e){var n=e.s,i=e.sc;fa(t)&&(t=Cr.scrollingElement||Rr);var s=oe.indexOf(t),o=i===tn.sc?1:2;!~s&&(s=oe.push(t)-1),oe[s+o]||Pn(t,"scroll",Nh);var a=oe[s+o],l=a||(oe[s+o]=rc(Nr(t,n),!0)||(fa(t)?i:rc(function(c){return arguments.length?t[n]=c:t[n]})));return l.target=t,a||(l.smooth=fn.getProperty(t,"scrollBehavior")==="smooth"),l},Fh=function(t,e,n){var i=t,s=t,o=ha(),a=o,l=e||50,c=Math.max(500,l*3),u=function(_,g){var m=ha();g||m-o>l?(s=i,i=_,a=o,o=m):n?i+=_:i=s+(_-s)/(m-a)*(o-a)},h=function(){s=i=n?0:i,a=o=0},d=function(_){var g=a,m=s,p=ha();return(_||_===0)&&_!==i&&u(_),o===a||p-a>c?0:(i+(n?m:-m))/((n?p:o)-g)*1e3};return{update:u,reset:h,getVelocity:d}},Xo=function(t,e){return e&&!t._gsapAllow&&t.cancelable!==!1&&t.preventDefault(),t.changedTouches?t.changedTouches[0]:t},Cp=function(t){var e=Math.max.apply(Math,t),n=Math.min.apply(Math,t);return Math.abs(e)>=Math.abs(n)?e:n},Z_=function(){xo=fn.core.globals().ScrollTrigger,xo&&xo.core&&dT()},J_=function(t){return fn=t||q_(),!Vl&&fn&&typeof document<"u"&&document.body&&(ai=window,Cr=document,Rr=Cr.documentElement,vo=Cr.body,X_=[ai,Cr,Rr,vo],fn.utils.clamp,Y_=fn.core.context||function(){},rs="onpointerenter"in vo?"pointer":"mouse",W_=Xe.isTouch=ai.matchMedia&&ai.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in ai||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,Li=Xe.eventTypes=("ontouchstart"in Rr?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in Rr?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return $_=0},500),Vl=1),xo||Z_(),Vl};Fn.op=tn;oe.cache=0;var Xe=(function(){function r(e){this.init(e)}var t=r.prototype;return t.init=function(n){Vl||J_(fn)||console.warn("Please gsap.registerPlugin(Observer)"),xo||Z_();var i=n.tolerance,s=n.dragMinimum,o=n.type,a=n.target,l=n.lineHeight,c=n.debounce,u=n.preventDefault,h=n.onStop,d=n.onStopDelay,f=n.ignore,_=n.wheelSpeed,g=n.event,m=n.onDragStart,p=n.onDragEnd,M=n.onDrag,x=n.onPress,v=n.onRelease,b=n.onRight,A=n.onLeft,E=n.onUp,C=n.onDown,S=n.onChangeX,y=n.onChangeY,D=n.onChange,U=n.onToggleX,z=n.onToggleY,B=n.onHover,k=n.onHoverEnd,H=n.onMove,q=n.ignoreCheck,G=n.isNormalizer,nt=n.onGestureStart,R=n.onGestureEnd,K=n.onWheel,pt=n.onEnable,Ft=n.onDisable,$=n.onClick,et=n.scrollSpeed,ot=n.capture,rt=n.allowClicks,wt=n.lockAxis,Ht=n.onLockAxis;this.target=a=Vn(a)||Rr,this.vars=n,f&&(f=fn.utils.toArray(f)),i=i||1e-9,s=s||0,_=_||1,et=et||1,o=o||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(ai.getComputedStyle(vo).lineHeight)||22);var Ut,le,ee,St,L,Ee,Vt,V=this,Tt=0,ue=0,Ct=n.passive||!u&&n.passive!==!1,P=Hr(a,Fn),T=Hr(a,tn),W=P(),tt=T(),Q=~o.indexOf("touch")&&!~o.indexOf("pointer")&&Li[0]==="pointerdown",J=fa(a),ht=a.ownerDocument||Cr,lt=[0,0,0],dt=[0,0,0],$t=0,st=function(){return $t=ha()},at=function(Rt,Kt){return(V.event=Rt)&&f&&pT(Rt.target,f)||Kt&&Q&&Rt.pointerType!=="touch"||q&&q(Rt,Kt)},Ot=function(){V._vx.reset(),V._vy.reset(),le.pause(),h&&h(V)},Nt=function(){var Rt=V.deltaX=Cp(lt),Kt=V.deltaY=Cp(dt),mt=Math.abs(Rt)>=i,Yt=Math.abs(Kt)>=i;D&&(mt||Yt)&&D(V,Rt,Kt,lt,dt),mt&&(b&&V.deltaX>0&&b(V),A&&V.deltaX<0&&A(V),S&&S(V),U&&V.deltaX<0!=Tt<0&&U(V),Tt=V.deltaX,lt[0]=lt[1]=lt[2]=0),Yt&&(C&&V.deltaY>0&&C(V),E&&V.deltaY<0&&E(V),y&&y(V),z&&V.deltaY<0!=ue<0&&z(V),ue=V.deltaY,dt[0]=dt[1]=dt[2]=0),(St||ee)&&(H&&H(V),ee&&(m&&ee===1&&m(V),M&&M(V),ee=0),St=!1),Ee&&!(Ee=!1)&&Ht&&Ht(V),L&&(K(V),L=!1),Ut=0},Mt=function(Rt,Kt,mt){lt[mt]+=Rt,dt[mt]+=Kt,V._vx.update(Rt),V._vy.update(Kt),c?Ut||(Ut=requestAnimationFrame(Nt)):Nt()},Jt=function(Rt,Kt){wt&&!Vt&&(V.axis=Vt=Math.abs(Rt)>Math.abs(Kt)?"x":"y",Ee=!0),Vt!=="y"&&(lt[2]+=Rt,V._vx.update(Rt,!0)),Vt!=="x"&&(dt[2]+=Kt,V._vy.update(Kt,!0)),c?Ut||(Ut=requestAnimationFrame(Nt)):Nt()},kt=function(Rt){if(!at(Rt,1)){Rt=Xo(Rt,u);var Kt=Rt.clientX,mt=Rt.clientY,Yt=Kt-V.x,Pt=mt-V.y,Wt=V.isDragging;V.x=Kt,V.y=mt,(Wt||(Yt||Pt)&&(Math.abs(V.startX-Kt)>=s||Math.abs(V.startY-mt)>=s))&&(ee||(ee=Wt?2:1),Wt||(V.isDragging=!0),Jt(Yt,Pt))}},fe=V.onPress=function(vt){at(vt,1)||vt&&vt.button||(V.axis=Vt=null,le.pause(),V.isPressed=!0,vt=Xo(vt),Tt=ue=0,V.startX=V.x=vt.clientX,V.startY=V.y=vt.clientY,V._vx.reset(),V._vy.reset(),Pn(G?a:ht,Li[1],kt,Ct,!0),V.deltaX=V.deltaY=0,x&&x(V))},I=V.onRelease=function(vt){if(!at(vt,1)){Cn(G?a:ht,Li[1],kt,!0);var Rt=!isNaN(V.y-V.startY),Kt=V.isDragging,mt=Kt&&(Math.abs(V.x-V.startX)>3||Math.abs(V.y-V.startY)>3),Yt=Xo(vt);!mt&&Rt&&(V._vx.reset(),V._vy.reset(),u&&rt&&fn.delayedCall(.08,function(){if(ha()-$t>300&&!vt.defaultPrevented){if(vt.target.click)vt.target.click();else if(ht.createEvent){var Pt=ht.createEvent("MouseEvents");Pt.initMouseEvent("click",!0,!0,ai,1,Yt.screenX,Yt.screenY,Yt.clientX,Yt.clientY,!1,!1,!1,!1,0,null),vt.target.dispatchEvent(Pt)}}})),V.isDragging=V.isGesturing=V.isPressed=!1,h&&Kt&&!G&&le.restart(!0),ee&&Nt(),p&&Kt&&p(V),v&&v(V,mt)}},ut=function(Rt){return Rt.touches&&Rt.touches.length>1&&(V.isGesturing=!0)&&nt(Rt,V.isDragging)},Z=function(){return(V.isGesturing=!1)||R(V)},j=function(Rt){if(!at(Rt)){var Kt=P(),mt=T();Mt((Kt-W)*et,(mt-tt)*et,1),W=Kt,tt=mt,h&&le.restart(!0)}},ct=function(Rt){if(!at(Rt)){Rt=Xo(Rt,u),K&&(L=!0);var Kt=(Rt.deltaMode===1?l:Rt.deltaMode===2?ai.innerHeight:1)*_;Mt(Rt.deltaX*Kt,Rt.deltaY*Kt,0),h&&!G&&le.restart(!0)}},ft=function(Rt){if(!at(Rt)){var Kt=Rt.clientX,mt=Rt.clientY,Yt=Kt-V.x,Pt=mt-V.y;V.x=Kt,V.y=mt,St=!0,h&&le.restart(!0),(Yt||Pt)&&Jt(Yt,Pt)}},Gt=function(Rt){V.event=Rt,B(V)},pe=function(Rt){V.event=Rt,k(V)},ze=function(Rt){return at(Rt)||Xo(Rt,u)&&$(V)};le=V._dc=fn.delayedCall(d||.25,Ot).pause(),V.deltaX=V.deltaY=0,V._vx=Fh(0,50,!0),V._vy=Fh(0,50,!0),V.scrollX=P,V.scrollY=T,V.isDragging=V.isGesturing=V.isPressed=!1,Y_(this),V.enable=function(vt){return V.isEnabled||(Pn(J?ht:a,"scroll",Nh),o.indexOf("scroll")>=0&&Pn(J?ht:a,"scroll",j,Ct,ot),o.indexOf("wheel")>=0&&Pn(a,"wheel",ct,Ct,ot),(o.indexOf("touch")>=0&&W_||o.indexOf("pointer")>=0)&&(Pn(a,Li[0],fe,Ct,ot),Pn(ht,Li[2],I),Pn(ht,Li[3],I),rt&&Pn(a,"click",st,!0,!0),$&&Pn(a,"click",ze),nt&&Pn(ht,"gesturestart",ut),R&&Pn(ht,"gestureend",Z),B&&Pn(a,rs+"enter",Gt),k&&Pn(a,rs+"leave",pe),H&&Pn(a,rs+"move",ft)),V.isEnabled=!0,V.isDragging=V.isGesturing=V.isPressed=St=ee=!1,V._vx.reset(),V._vy.reset(),W=P(),tt=T(),vt&&vt.type&&fe(vt),pt&&pt(V)),V},V.disable=function(){V.isEnabled&&(ao.filter(function(vt){return vt!==V&&fa(vt.target)}).length||Cn(J?ht:a,"scroll",Nh),V.isPressed&&(V._vx.reset(),V._vy.reset(),Cn(G?a:ht,Li[1],kt,!0)),Cn(J?ht:a,"scroll",j,ot),Cn(a,"wheel",ct,ot),Cn(a,Li[0],fe,ot),Cn(ht,Li[2],I),Cn(ht,Li[3],I),Cn(a,"click",st,!0),Cn(a,"click",ze),Cn(ht,"gesturestart",ut),Cn(ht,"gestureend",Z),Cn(a,rs+"enter",Gt),Cn(a,rs+"leave",pe),Cn(a,rs+"move",ft),V.isEnabled=V.isPressed=V.isDragging=!1,Ft&&Ft(V))},V.kill=V.revert=function(){V.disable();var vt=ao.indexOf(V);vt>=0&&ao.splice(vt,1),lr===V&&(lr=0)},ao.push(V),G&&fa(a)&&(lr=V),V.enable(g)},fT(r,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),r})();Xe.version="3.15.0";Xe.create=function(r){return new Xe(r)};Xe.register=J_;Xe.getAll=function(){return ao.slice()};Xe.getById=function(r){return ao.filter(function(t){return t.vars.id===r})[0]};q_()&&fn.registerPlugin(Xe);/*!
 * ScrollTrigger 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var bt,to,se,ye,ri,Me,kf,sc,Ia,da,Jo,xl,gn,bc,Oh,Un,Rp,Pp,eo,K_,_u,j_,In,Bh,Q_,tg,Er,zh,Hf,Mo,Vf,pa,kh,gu,Ml=1,Mn=Date.now,vu=Mn(),Ai=0,Ko=0,Dp=function(t,e,n){var i=ni(t)&&(t.substr(0,6)==="clamp("||t.indexOf("max")>-1);return n["_"+e+"Clamp"]=i,i?t.substr(6,t.length-7):t},Lp=function(t,e){return e&&(!ni(t)||t.substr(0,6)!=="clamp(")?"clamp("+t+")":t},mT=function r(){return Ko&&requestAnimationFrame(r)},Ip=function(){return bc=1},Up=function(){return bc=0},ki=function(t){return t},jo=function(t){return Math.round(t*1e5)/1e5||0},eg=function(){return typeof window<"u"},ng=function(){return bt||eg()&&(bt=window.gsap)&&bt.registerPlugin&&bt},ws=function(t){return!!~kf.indexOf(t)},ig=function(t){return(t==="Height"?Vf:se["inner"+t])||ri["client"+t]||Me["client"+t]},rg=function(t){return Nr(t,"getBoundingClientRect")||(ws(t)?function(){return ql.width=se.innerWidth,ql.height=Vf,ql}:function(){return sr(t)})},_T=function(t,e,n){var i=n.d,s=n.d2,o=n.a;return(o=Nr(t,"getBoundingClientRect"))?function(){return o()[i]}:function(){return(e?ig(s):t["client"+s])||0}},gT=function(t,e){return!e||~qi.indexOf(t)?rg(t):function(){return ql}},Xi=function(t,e){var n=e.s,i=e.d2,s=e.d,o=e.a;return Math.max(0,(n="scroll"+i)&&(o=Nr(t,n))?o()-rg(t)()[s]:ws(t)?(ri[n]||Me[n])-ig(i):t[n]-t["offset"+i])},yl=function(t,e){for(var n=0;n<eo.length;n+=3)(!e||~e.indexOf(eo[n+1]))&&t(eo[n],eo[n+1],eo[n+2])},ni=function(t){return typeof t=="string"},En=function(t){return typeof t=="function"},Qo=function(t){return typeof t=="number"},ss=function(t){return typeof t=="object"},Yo=function(t,e,n){return t&&t.progress(e?0:1)&&n&&t.pause()},Zs=function(t,e,n){if(t.enabled){var i=t._ctx?t._ctx.add(function(){return e(t,n)}):e(t,n);i&&i.totalTime&&(t.callbackAnimation=i)}},Js=Math.abs,sg="left",og="top",Gf="right",Wf="bottom",xs="width",Ms="height",ma="Right",_a="Left",ga="Top",va="Bottom",$e="padding",Si="margin",No="Width",Xf="Height",Qe="px",Ei=function(t){return se.getComputedStyle(t.nodeType===Node.DOCUMENT_NODE?t.scrollingElement:t)},vT=function(t){var e=Ei(t).position;t.style.position=e==="absolute"||e==="fixed"?e:"relative"},Np=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},sr=function(t,e){var n=e&&Ei(t)[Oh]!=="matrix(1, 0, 0, 1, 0, 0)"&&bt.to(t,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),i=t.getBoundingClientRect?t.getBoundingClientRect():t.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),i},oc=function(t,e){var n=e.d2;return t["offset"+n]||t["client"+n]||0},ag=function(t){var e=[],n=t.labels,i=t.duration(),s;for(s in n)e.push(n[s]/i);return e},xT=function(t){return function(e){return bt.utils.snap(ag(t),e)}},Yf=function(t){var e=bt.utils.snap(t),n=Array.isArray(t)&&t.slice(0).sort(function(i,s){return i-s});return n?function(i,s,o){o===void 0&&(o=.001);var a;if(!s)return e(i);if(s>0){for(i-=o,a=0;a<n.length;a++)if(n[a]>=i)return n[a];return n[a-1]}else for(a=n.length,i+=o;a--;)if(n[a]<=i)return n[a];return n[0]}:function(i,s,o){o===void 0&&(o=.001);var a=e(i);return!s||Math.abs(a-i)<o||a-i<0==s<0?a:e(s<0?i-t:i+t)}},MT=function(t){return function(e,n){return Yf(ag(t))(e,n.direction)}},Sl=function(t,e,n,i){return n.split(",").forEach(function(s){return t(e,s,i)})},ln=function(t,e,n,i,s){return t.addEventListener(e,n,{passive:!i,capture:!!s})},an=function(t,e,n,i){return t.removeEventListener(e,n,!!i)},El=function(t,e,n){n=n&&n.wheelHandler,n&&(t(e,"wheel",n),t(e,"touchmove",n))},Fp={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Tl={toggleActions:"play",anticipatePin:0},ac={top:0,left:0,center:.5,bottom:1,right:1},Gl=function(t,e){if(ni(t)){var n=t.indexOf("="),i=~n?+(t.charAt(n-1)+1)*parseFloat(t.substr(n+1)):0;~n&&(t.indexOf("%")>n&&(i*=e/100),t=t.substr(0,n-1)),t=i+(t in ac?ac[t]*e:~t.indexOf("%")?parseFloat(t)*e/100:parseFloat(t)||0)}return t},bl=function(t,e,n,i,s,o,a,l){var c=s.startColor,u=s.endColor,h=s.fontSize,d=s.indent,f=s.fontWeight,_=ye.createElement("div"),g=ws(n)||Nr(n,"pinType")==="fixed",m=t.indexOf("scroller")!==-1,p=g?Me:n.tagName==="IFRAME"?n.contentDocument.body:n,M=t.indexOf("start")!==-1,x=M?c:u,v="border-color:"+x+";font-size:"+h+";color:"+x+";font-weight:"+f+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return v+="position:"+((m||l)&&g?"fixed;":"absolute;"),(m||l||!g)&&(v+=(i===tn?Gf:Wf)+":"+(o+parseFloat(d))+"px;"),a&&(v+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),_._isStart=M,_.setAttribute("class","gsap-marker-"+t+(e?" marker-"+e:"")),_.style.cssText=v,_.innerText=e||e===0?t+"-"+e:t,p.children[0]?p.insertBefore(_,p.children[0]):p.appendChild(_),_._offset=_["offset"+i.op.d2],Wl(_,0,i,M),_},Wl=function(t,e,n,i){var s={display:"block"},o=n[i?"os2":"p2"],a=n[i?"p2":"os2"];t._isFlipped=i,s[n.a+"Percent"]=i?-100:0,s[n.a]=i?"1px":0,s["border"+o+No]=1,s["border"+a+No]=0,s[n.p]=e+"px",bt.set(t,s)},ne=[],Hh={},Ua,Op=function(){return Mn()-Ai>34&&(Ua||(Ua=requestAnimationFrame(ur)))},Ks=function(){(!In||!In.isPressed||In.startX>Me.clientWidth)&&(oe.cache++,In?Ua||(Ua=requestAnimationFrame(ur)):ur(),Ai||Cs("scrollStart"),Ai=Mn())},xu=function(){tg=se.innerWidth,Q_=se.innerHeight},ta=function(t){oe.cache++,(t===!0||!gn&&!j_&&!ye.fullscreenElement&&!ye.webkitFullscreenElement&&(!Bh||tg!==se.innerWidth||Math.abs(se.innerHeight-Q_)>se.innerHeight*.25))&&sc.restart(!0)},As={},yT=[],lg=function r(){return an(ae,"scrollEnd",r)||fs(!0)},Cs=function(t){return As[t]&&As[t].map(function(e){return e()})||yT},ei=[],cg=function(t){for(var e=0;e<ei.length;e+=5)(!t||ei[e+4]&&ei[e+4].query===t)&&(ei[e].style.cssText=ei[e+1],ei[e].getBBox&&ei[e].setAttribute("transform",ei[e+2]||""),ei[e+3].uncache=1)},ug=function(){return oe.forEach(function(t){return En(t)&&++t.cacheID&&(t.rec=t())})},qf=function(t,e){var n;for(Un=0;Un<ne.length;Un++)n=ne[Un],n&&(!e||n._ctx===e)&&(t?n.kill(1):n.revert(!0,!0));pa=!0,e&&cg(e),e||Cs("revert")},hg=function(t,e){oe.cache++,(e||!Nn)&&oe.forEach(function(n){return En(n)&&n.cacheID++&&(n.rec=0)}),ni(t)&&(se.history.scrollRestoration=Hf=t)},Nn,ys=0,Bp,ST=function(){if(Bp!==ys){var t=Bp=ys;requestAnimationFrame(function(){return t===ys&&fs(!0)})}},fg=function(){Me.appendChild(Mo),Vf=!In&&Mo.offsetHeight||se.innerHeight,Me.removeChild(Mo)},zp=function(t){return Ia(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(e){return e.style.display=t?"none":"block"})},fs=function(t,e){if(ri=ye.documentElement,Me=ye.body,kf=[se,ye,ri,Me],Ai&&!t&&!pa){ln(ae,"scrollEnd",lg);return}fg(),Nn=ae.isRefreshing=!0,pa||ug();var n=Cs("refreshInit");K_&&ae.sort(),e||qf(),oe.forEach(function(i){En(i)&&(i.smooth&&(i.target.style.scrollBehavior="auto"),i(0))}),ne.slice(0).forEach(function(i){return i.refresh()}),pa=!1,ne.forEach(function(i){if(i._subPinOffset&&i.pin){var s=i.vars.horizontal?"offsetWidth":"offsetHeight",o=i.pin[s];i.revert(!0,1),i.adjustPinSpacing(i.pin[s]-o),i.refresh()}}),kh=1,zp(!0),ne.forEach(function(i){var s=Xi(i.scroller,i._dir),o=i.vars.end==="max"||i._endClamp&&i.end>s,a=i._startClamp&&i.start>=s;(o||a)&&i.setPositions(a?s-1:i.start,o?Math.max(a?s:i.start+1,s):i.end,!0)}),zp(!1),kh=0,n.forEach(function(i){return i&&i.render&&i.render(-1)}),oe.forEach(function(i){En(i)&&(i.smooth&&requestAnimationFrame(function(){return i.target.style.scrollBehavior="smooth"}),i.rec&&i(i.rec))}),hg(Hf,1),sc.pause(),ys++,Nn=2,ur(2),ne.forEach(function(i){return En(i.vars.onRefresh)&&i.vars.onRefresh(i)}),Nn=ae.isRefreshing=!1,Cs("refresh")},Vh=0,Xl=1,xa,ur=function(t){if(t===2||!Nn&&!pa){ae.isUpdating=!0,xa&&xa.update(0);var e=ne.length,n=Mn(),i=n-vu>=50,s=e&&ne[0].scroll();if(Xl=Vh>s?-1:1,Nn||(Vh=s),i&&(Ai&&!bc&&n-Ai>200&&(Ai=0,Cs("scrollEnd")),Jo=vu,vu=n),Xl<0){for(Un=e;Un-- >0;)ne[Un]&&ne[Un].update(0,i);Xl=1}else for(Un=0;Un<e;Un++)ne[Un]&&ne[Un].update(0,i);ae.isUpdating=!1}Ua=0},Gh=[sg,og,Wf,Gf,Si+va,Si+ma,Si+ga,Si+_a,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],Yl=Gh.concat([xs,Ms,"boxSizing","max"+No,"max"+Xf,"position",Si,$e,$e+ga,$e+ma,$e+va,$e+_a]),ET=function(t,e,n){yo(n);var i=t._gsap;if(i.spacerIsNative)yo(i.spacerState);else if(t._gsap.swappedIn){var s=e.parentNode;s&&(s.insertBefore(t,e),s.removeChild(e))}t._gsap.swappedIn=!1},Mu=function(t,e,n,i){if(!t._gsap.swappedIn){for(var s=Gh.length,o=e.style,a=t.style,l;s--;)l=Gh[s],o[l]=n[l];o.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(o.display="inline-block"),a[Wf]=a[Gf]="auto",o.flexBasis=n.flexBasis||"auto",o.overflow="visible",o.boxSizing="border-box",o[xs]=oc(t,Fn)+Qe,o[Ms]=oc(t,tn)+Qe,o[$e]=a[Si]=a[og]=a[sg]="0",yo(i),a[xs]=a["max"+No]=n[xs],a[Ms]=a["max"+Xf]=n[Ms],a[$e]=n[$e],t.parentNode!==e&&(t.parentNode.insertBefore(e,t),e.appendChild(t)),t._gsap.swappedIn=!0}},TT=/([A-Z])/g,yo=function(t){if(t){var e=t.t.style,n=t.length,i=0,s,o;for((t.t._gsap||bt.core.getCache(t.t)).uncache=1;i<n;i+=2)o=t[i+1],s=t[i],o?e[s]=o:e[s]&&e.removeProperty(s.replace(TT,"-$1").toLowerCase())}},wl=function(t){for(var e=Yl.length,n=t.style,i=[],s=0;s<e;s++)i.push(Yl[s],n[Yl[s]]);return i.t=t,i},bT=function(t,e,n){for(var i=[],s=t.length,o=n?8:0,a;o<s;o+=2)a=t[o],i.push(a,a in e?e[a]:t[o+1]);return i.t=t.t,i},ql={left:0,top:0},kp=function(t,e,n,i,s,o,a,l,c,u,h,d,f,_){En(t)&&(t=t(l)),ni(t)&&t.substr(0,3)==="max"&&(t=d+(t.charAt(4)==="="?Gl("0"+t.substr(3),n):0));var g=f?f.time():0,m,p,M;if(f&&f.seek(0),isNaN(t)||(t=+t),Qo(t))f&&(t=bt.utils.mapRange(f.scrollTrigger.start,f.scrollTrigger.end,0,d,t)),a&&Wl(a,n,i,!0);else{En(e)&&(e=e(l));var x=(t||"0").split(" "),v,b,A,E;M=Vn(e,l)||Me,v=sr(M)||{},(!v||!v.left&&!v.top)&&Ei(M).display==="none"&&(E=M.style.display,M.style.display="block",v=sr(M),E?M.style.display=E:M.style.removeProperty("display")),b=Gl(x[0],v[i.d]),A=Gl(x[1]||"0",n),t=v[i.p]-c[i.p]-u+b+s-A,a&&Wl(a,A,i,n-A<20||a._isStart&&A>20),n-=n-A}if(_&&(l[_]=t||-.001,t<0&&(t=0)),o){var C=t+n,S=o._isStart;m="scroll"+i.d2,Wl(o,C,i,S&&C>20||!S&&(h?Math.max(Me[m],ri[m]):o.parentNode[m])<=C+1),h&&(c=sr(a),h&&(o.style[i.op.p]=c[i.op.p]-i.op.m-o._offset+Qe))}return f&&M&&(m=sr(M),f.seek(d),p=sr(M),f._caScrollDist=m[i.p]-p[i.p],t=t/f._caScrollDist*d),f&&f.seek(g),f?t:Math.round(t)},wT=/(webkit|moz|length|cssText|inset)/i,Hp=function(t,e,n,i){if(t.parentNode!==e){var s=t.style,o,a;if(e===Me){t._stOrig=s.cssText,a=Ei(t);for(o in a)!+o&&!wT.test(o)&&a[o]&&typeof s[o]=="string"&&o!=="0"&&(s[o]=a[o]);s.top=n,s.left=i}else s.cssText=t._stOrig;bt.core.getCache(t).uncache=1,e.appendChild(t)}},dg=function(t,e,n){var i=e,s=i;return function(o){var a=Math.round(t());return a!==i&&a!==s&&Math.abs(a-i)>3&&Math.abs(a-s)>3&&(o=a,n&&n()),s=i,i=Math.round(o),i}},Al=function(t,e,n){var i={};i[e.p]="+="+n,bt.set(t,i)},Vp=function(t,e){var n=Hr(t,e),i="_scroll"+e.p2,s=function o(a,l,c,u,h){var d=o.tween,f=l.onComplete,_={};c=c||n();var g=dg(n,c,function(){d.kill(),o.tween=0});return h=u&&h||0,u=u||a-c,d&&d.kill(),l[i]=a,l.inherit=!1,l.modifiers=_,_[i]=function(){return g(c+u*d.ratio+h*d.ratio*d.ratio)},l.onUpdate=function(){oe.cache++,o.tween&&ur()},l.onComplete=function(){o.tween=0,f&&f.call(d)},d=o.tween=bt.to(t,l),d};return t[i]=n,n.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},ln(t,"wheel",n.wheelHandler),ae.isTouch&&ln(t,"touchmove",n.wheelHandler),s},ae=(function(){function r(e,n){to||r.register(bt)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),zh(this),this.init(e,n)}var t=r.prototype;return t.init=function(n,i){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Ko){this.update=this.refresh=this.kill=ki;return}n=Np(ni(n)||Qo(n)||n.nodeType?{trigger:n}:n,Tl);var s=n,o=s.onUpdate,a=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,h=s.scrub,d=s.trigger,f=s.pin,_=s.pinSpacing,g=s.invalidateOnRefresh,m=s.anticipatePin,p=s.onScrubComplete,M=s.onSnapComplete,x=s.once,v=s.snap,b=s.pinReparent,A=s.pinSpacer,E=s.containerAnimation,C=s.fastScrollEnd,S=s.preventOverlaps,y=n.horizontal||n.containerAnimation&&n.horizontal!==!1?Fn:tn,D=!h&&h!==0,U=Vn(n.scroller||se),z=bt.core.getCache(U),B=ws(U),k=("pinType"in n?n.pinType:Nr(U,"pinType")||B&&"fixed")==="fixed",H=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],q=D&&n.toggleActions.split(" "),G="markers"in n?n.markers:Tl.markers,nt=B?0:parseFloat(Ei(U)["border"+y.p2+No])||0,R=this,K=n.onRefreshInit&&function(){return n.onRefreshInit(R)},pt=_T(U,B,y),Ft=gT(U,B),$=0,et=0,ot=0,rt=Hr(U,y),wt,Ht,Ut,le,ee,St,L,Ee,Vt,V,Tt,ue,Ct,P,T,W,tt,Q,J,ht,lt,dt,$t,st,at,Ot,Nt,Mt,Jt,kt,fe,I,ut,Z,j,ct,ft,Gt,pe;if(R._startClamp=R._endClamp=!1,R._dir=y,m*=45,R.scroller=U,R.scroll=E?E.time.bind(E):rt,le=rt(),R.vars=n,i=i||n.animation,"refreshPriority"in n&&(K_=1,n.refreshPriority===-9999&&(xa=R)),z.tweenScroll=z.tweenScroll||{top:Vp(U,tn),left:Vp(U,Fn)},R.tweenTo=wt=z.tweenScroll[y.p],R.scrubDuration=function(mt){ut=Qo(mt)&&mt,ut?I?I.duration(mt):I=bt.to(i,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:ut,paused:!0,onComplete:function(){return p&&p(R)}}):(I&&I.progress(1).kill(),I=0)},i&&(i.vars.lazy=!1,i._initted&&!R.isReverted||i.vars.immediateRender!==!1&&n.immediateRender!==!1&&i.duration()&&i.render(0,!0,!0),R.animation=i.pause(),i.scrollTrigger=R,R.scrubDuration(h),kt=0,l||(l=i.vars.id)),v&&((!ss(v)||v.push)&&(v={snapTo:v}),"scrollBehavior"in Me.style&&bt.set(B?[Me,ri]:U,{scrollBehavior:"auto"}),oe.forEach(function(mt){return En(mt)&&mt.target===(B?ye.scrollingElement||ri:U)&&(mt.smooth=!1)}),Ut=En(v.snapTo)?v.snapTo:v.snapTo==="labels"?xT(i):v.snapTo==="labelsDirectional"?MT(i):v.directional!==!1?function(mt,Yt){return Yf(v.snapTo)(mt,Mn()-et<500?0:Yt.direction)}:bt.utils.snap(v.snapTo),Z=v.duration||{min:.1,max:2},Z=ss(Z)?da(Z.min,Z.max):da(Z,Z),j=bt.delayedCall(v.delay||ut/2||.1,function(){var mt=rt(),Yt=Mn()-et<500,Pt=wt.tween;if((Yt||Math.abs(R.getVelocity())<10)&&!Pt&&!bc&&$!==mt){var Wt=(mt-St)/P,Ge=i&&!D?i.totalProgress():Wt,re=Yt?0:(Ge-fe)/(Mn()-Jo)*1e3||0,Ce=bt.utils.clamp(-Wt,1-Wt,Js(re/2)*re/.185),Je=Wt+(v.inertia===!1?0:Ce),Te,be,ge=v,Kn=ge.onStart,Re=ge.onInterrupt,wn=ge.onComplete;if(Te=Ut(Je,R),Qo(Te)||(Te=Je),be=Math.max(0,Math.round(St+Te*P)),mt<=L&&mt>=St&&be!==mt){if(Pt&&!Pt._initted&&Pt.data<=Js(be-mt))return;v.inertia===!1&&(Ce=Te-Wt),wt(be,{duration:Z(Js(Math.max(Js(Je-Ge),Js(Te-Ge))*.185/re/.05||0)),ease:v.ease||"power3",data:Js(be-mt),onInterrupt:function(){return j.restart(!0)&&Re&&Zs(R,Re)},onComplete:function(){R.update(),$=rt(),i&&!D&&(I?I.resetTo("totalProgress",Te,i._tTime/i._tDur):i.progress(Te)),kt=fe=i&&!D?i.totalProgress():R.progress,M&&M(R),wn&&Zs(R,wn)}},mt,Ce*P,be-mt-Ce*P),Kn&&Zs(R,Kn,wt.tween)}}else R.isActive&&$!==mt&&j.restart(!0)}).pause()),l&&(Hh[l]=R),d=R.trigger=Vn(d||f!==!0&&f),pe=d&&d._gsap&&d._gsap.stRevert,pe&&(pe=pe(R)),f=f===!0?d:Vn(f),ni(a)&&(a={targets:d,className:a}),f&&(_===!1||_===Si||(_=!_&&f.parentNode&&f.parentNode.style&&Ei(f.parentNode).display==="flex"?!1:$e),R.pin=f,Ht=bt.core.getCache(f),Ht.spacer?T=Ht.pinState:(A&&(A=Vn(A),A&&!A.nodeType&&(A=A.current||A.nativeElement),Ht.spacerIsNative=!!A,A&&(Ht.spacerState=wl(A))),Ht.spacer=Q=A||ye.createElement("div"),Q.classList.add("pin-spacer"),l&&Q.classList.add("pin-spacer-"+l),Ht.pinState=T=wl(f)),n.force3D!==!1&&bt.set(f,{force3D:!0}),R.spacer=Q=Ht.spacer,Jt=Ei(f),st=Jt[_+y.os2],ht=bt.getProperty(f),lt=bt.quickSetter(f,y.a,Qe),Mu(f,Q,Jt),tt=wl(f)),G){ue=ss(G)?Np(G,Fp):Fp,V=bl("scroller-start",l,U,y,ue,0),Tt=bl("scroller-end",l,U,y,ue,0,V),J=V["offset"+y.op.d2];var ze=Vn(Nr(U,"content")||U);Ee=this.markerStart=bl("start",l,ze,y,ue,J,0,E),Vt=this.markerEnd=bl("end",l,ze,y,ue,J,0,E),E&&(Gt=bt.quickSetter([Ee,Vt],y.a,Qe)),!k&&!(qi.length&&Nr(U,"fixedMarkers")===!0)&&(vT(B?Me:U),bt.set([V,Tt],{force3D:!0}),Ot=bt.quickSetter(V,y.a,Qe),Mt=bt.quickSetter(Tt,y.a,Qe))}if(E){var vt=E.vars.onUpdate,Rt=E.vars.onUpdateParams;E.eventCallback("onUpdate",function(){R.update(0,0,1),vt&&vt.apply(E,Rt||[])})}if(R.previous=function(){return ne[ne.indexOf(R)-1]},R.next=function(){return ne[ne.indexOf(R)+1]},R.revert=function(mt,Yt){if(!Yt)return R.kill(!0);var Pt=mt!==!1||!R.enabled,Wt=gn;Pt!==R.isReverted&&(Pt&&(ct=Math.max(rt(),R.scroll.rec||0),ot=R.progress,ft=i&&i.progress()),Ee&&[Ee,Vt,V,Tt].forEach(function(Ge){return Ge.style.display=Pt?"none":"block"}),Pt&&(gn=R,R.update(Pt)),f&&(!b||!R.isActive)&&(Pt?ET(f,Q,T):Mu(f,Q,Ei(f),at)),Pt||R.update(Pt),gn=Wt,R.isReverted=Pt)},R.refresh=function(mt,Yt,Pt,Wt){if(!((gn||!R.enabled)&&!Yt)){if(f&&mt&&Ai){ln(r,"scrollEnd",lg);return}!Nn&&K&&K(R),gn=R,wt.tween&&!Pt&&(wt.tween.kill(),wt.tween=0),I&&I.pause(),g&&i&&(i.revert({kill:!1}).invalidate(),i.getChildren?i.getChildren(!0,!0,!1).forEach(function(Zt){return Zt.vars.immediateRender&&Zt.render(0,!0,!0)}):i.vars.immediateRender&&i.render(0,!0,!0)),R.isReverted||R.revert(!0,!0),R._subPinOffset=!1;var Ge=pt(),re=Ft(),Ce=E?E.duration():Xi(U,y),Je=P<=.01||!P,Te=0,be=Wt||0,ge=ss(Pt)?Pt.end:n.end,Kn=n.endTrigger||d,Re=ss(Pt)?Pt.start:n.start||(n.start===0||!d?0:f?"0 0":"0 100%"),wn=R.pinnedContainer=n.pinnedContainer&&Vn(n.pinnedContainer,R),pi=d&&Math.max(0,ne.indexOf(R))||0,Ke=pi,je,w,O,Y,X,F,it,_t,Et,yt,It,zt,Lt;for(G&&ss(Pt)&&(zt=bt.getProperty(V,y.p),Lt=bt.getProperty(Tt,y.p));Ke-- >0;)F=ne[Ke],F.end||F.refresh(0,1)||(gn=R),it=F.pin,it&&(it===d||it===f||it===wn)&&!F.isReverted&&(yt||(yt=[]),yt.unshift(F),F.revert(!0,!0)),F!==ne[Ke]&&(pi--,Ke--);for(En(Re)&&(Re=Re(R)),Re=Dp(Re,"start",R),St=kp(Re,d,Ge,y,rt(),Ee,V,R,re,nt,k,Ce,E,R._startClamp&&"_startClamp")||(f?-.001:0),En(ge)&&(ge=ge(R)),ni(ge)&&!ge.indexOf("+=")&&(~ge.indexOf(" ")?ge=(ni(Re)?Re.split(" ")[0]:"")+ge:(Te=Gl(ge.substr(2),Ge),ge=ni(Re)?Re:(E?bt.utils.mapRange(0,E.duration(),E.scrollTrigger.start,E.scrollTrigger.end,St):St)+Te,Kn=d)),ge=Dp(ge,"end",R),L=Math.max(St,kp(ge||(Kn?"100% 0":Ce),Kn,Ge,y,rt()+Te,Vt,Tt,R,re,nt,k,Ce,E,R._endClamp&&"_endClamp"))||-.001,Te=0,Ke=pi;Ke--;)F=ne[Ke]||{},it=F.pin,it&&F.start-F._pinPush<=St&&!E&&F.end>0&&(je=F.end-(R._startClamp?Math.max(0,F.start):F.start),(it===d&&F.start-F._pinPush<St||it===wn)&&isNaN(Re)&&(Te+=je*(1-F.progress)),it===f&&(be+=je));if(St+=Te,L+=Te,R._startClamp&&(R._startClamp+=Te),R._endClamp&&!Nn&&(R._endClamp=L||-.001,L=Math.min(L,Xi(U,y))),P=L-St||(St-=.01)&&.001,Je&&(ot=bt.utils.clamp(0,1,bt.utils.normalize(St,L,ct))),R._pinPush=be,Ee&&Te&&(je={},je[y.a]="+="+Te,wn&&(je[y.p]="-="+rt()),bt.set([Ee,Vt],je)),f&&!(kh&&R.end>=Xi(U,y)))je=Ei(f),Y=y===tn,O=rt(),dt=parseFloat(ht(y.a))+be,!Ce&&L>1&&(It=(B?ye.scrollingElement||ri:U).style,It={style:It,value:It["overflow"+y.a.toUpperCase()]},B&&Ei(Me)["overflow"+y.a.toUpperCase()]!=="scroll"&&(It.style["overflow"+y.a.toUpperCase()]="scroll")),Mu(f,Q,je),tt=wl(f),w=sr(f,!0),_t=k&&Hr(U,Y?Fn:tn)(),_?(at=[_+y.os2,P+be+Qe],at.t=Q,Ke=_===$e?oc(f,y)+P+be:0,Ke&&(at.push(y.d,Ke+Qe),Q.style.flexBasis!=="auto"&&(Q.style.flexBasis=Ke+Qe)),yo(at),wn&&ne.forEach(function(Zt){Zt.pin===wn&&Zt.vars.pinSpacing!==!1&&(Zt._subPinOffset=!0)}),k&&rt(ct)):(Ke=oc(f,y),Ke&&Q.style.flexBasis!=="auto"&&(Q.style.flexBasis=Ke+Qe)),k&&(X={top:w.top+(Y?O-St:_t)+Qe,left:w.left+(Y?_t:O-St)+Qe,boxSizing:"border-box",position:"fixed"},X[xs]=X["max"+No]=Math.ceil(w.width)+Qe,X[Ms]=X["max"+Xf]=Math.ceil(w.height)+Qe,X[Si]=X[Si+ga]=X[Si+ma]=X[Si+va]=X[Si+_a]="0",X[$e]=je[$e],X[$e+ga]=je[$e+ga],X[$e+ma]=je[$e+ma],X[$e+va]=je[$e+va],X[$e+_a]=je[$e+_a],W=bT(T,X,b),Nn&&rt(0)),i?(Et=i._initted,_u(1),i.render(i.duration(),!0,!0),$t=ht(y.a)-dt+P+be,Nt=Math.abs(P-$t)>1,k&&Nt&&W.splice(W.length-2,2),i.render(0,!0,!0),Et||i.invalidate(!0),i.parent||i.totalTime(i.totalTime()),_u(0)):$t=P,It&&(It.value?It.style["overflow"+y.a.toUpperCase()]=It.value:It.style.removeProperty("overflow-"+y.a));else if(d&&rt()&&!E)for(w=d.parentNode;w&&w!==Me;)w._pinOffset&&(St-=w._pinOffset,L-=w._pinOffset),w=w.parentNode;yt&&yt.forEach(function(Zt){return Zt.revert(!1,!0)}),R.start=St,R.end=L,le=ee=Nn?ct:rt(),!E&&!Nn&&(le<ct&&rt(ct),R.scroll.rec=0),R.revert(!1,!0),et=Mn(),j&&($=-1,j.restart(!0)),gn=0,i&&D&&(i._initted||ft)&&i.progress()!==ft&&i.progress(ft||0,!0).render(i.time(),!0,!0),(Je||ot!==R.progress||E||g||i&&!i._initted)&&(i&&!D&&(i._initted||ot||i.vars.immediateRender!==!1)&&i.totalProgress(E&&St<-.001&&!ot?bt.utils.normalize(St,L,0):ot,!0),R.progress=Je||(le-St)/P===ot?0:ot),f&&_&&(Q._pinOffset=Math.round(R.progress*$t)),I&&I.invalidate(),isNaN(zt)||(zt-=bt.getProperty(V,y.p),Lt-=bt.getProperty(Tt,y.p),Al(V,y,zt),Al(Ee,y,zt-(Wt||0)),Al(Tt,y,Lt),Al(Vt,y,Lt-(Wt||0))),Je&&!Nn&&R.update(),u&&!Nn&&!Ct&&(Ct=!0,u(R),Ct=!1)}},R.getVelocity=function(){return(rt()-ee)/(Mn()-Jo)*1e3||0},R.endAnimation=function(){Yo(R.callbackAnimation),i&&(I?I.progress(1):i.paused()?D||Yo(i,R.direction<0,1):Yo(i,i.reversed()))},R.labelToScroll=function(mt){return i&&i.labels&&(St||R.refresh()||St)+i.labels[mt]/i.duration()*P||0},R.getTrailing=function(mt){var Yt=ne.indexOf(R),Pt=R.direction>0?ne.slice(0,Yt).reverse():ne.slice(Yt+1);return(ni(mt)?Pt.filter(function(Wt){return Wt.vars.preventOverlaps===mt}):Pt).filter(function(Wt){return R.direction>0?Wt.end<=St:Wt.start>=L})},R.update=function(mt,Yt,Pt){if(!(E&&!Pt&&!mt)){var Wt=Nn===!0?ct:R.scroll(),Ge=mt?0:(Wt-St)/P,re=Ge<0?0:Ge>1?1:Ge||0,Ce=R.progress,Je,Te,be,ge,Kn,Re,wn,pi;if(Yt&&(ee=le,le=E?rt():Wt,v&&(fe=kt,kt=i&&!D?i.totalProgress():re)),m&&f&&!gn&&!Ml&&Ai&&(!re&&St<Wt+(Wt-ee)/(Mn()-Jo)*m?re=1e-4:re===1&&L>Wt+(Wt-ee)/(Mn()-Jo)*m&&(re=.9999)),re!==Ce&&R.enabled){if(Je=R.isActive=!!re&&re<1,Te=!!Ce&&Ce<1,Re=Je!==Te,Kn=Re||!!re!=!!Ce,R.direction=re>Ce?1:-1,R.progress=re,Kn&&!gn&&(be=re&&!Ce?0:re===1?1:Ce===1?2:3,D&&(ge=!Re&&q[be+1]!=="none"&&q[be+1]||q[be],pi=i&&(ge==="complete"||ge==="reset"||ge in i))),S&&(Re||pi)&&(pi||h||!i)&&(En(S)?S(R):R.getTrailing(S).forEach(function(O){return O.endAnimation()})),D||(I&&!gn&&!Ml?(I._dp._time-I._start!==I._time&&I.render(I._dp._time-I._start),I.resetTo?I.resetTo("totalProgress",re,i._tTime/i._tDur):(I.vars.totalProgress=re,I.invalidate().restart())):i&&i.totalProgress(re,!!(gn&&(et||mt)))),f){if(mt&&_&&(Q.style[_+y.os2]=st),!k)lt(jo(dt+$t*re));else if(Kn){if(wn=!mt&&re>Ce&&L+1>Wt&&Wt+1>=Xi(U,y),b)if(!mt&&(Je||wn)){var Ke=sr(f,!0),je=Wt-St;Hp(f,Me,Ke.top+(y===tn?je:0)+Qe,Ke.left+(y===tn?0:je)+Qe)}else Hp(f,Q);yo(Je||wn?W:tt),Nt&&re<1&&Je||lt(dt+(re===1&&!wn?$t:0))}}v&&!wt.tween&&!gn&&!Ml&&j.restart(!0),a&&(Re||x&&re&&(re<1||!gu))&&Ia(a.targets).forEach(function(O){return O.classList[Je||x?"add":"remove"](a.className)}),o&&!D&&!mt&&o(R),Kn&&!gn?(D&&(pi&&(ge==="complete"?i.pause().totalProgress(1):ge==="reset"?i.restart(!0).pause():ge==="restart"?i.restart(!0):i[ge]()),o&&o(R)),(Re||!gu)&&(c&&Re&&Zs(R,c),H[be]&&Zs(R,H[be]),x&&(re===1?R.kill(!1,1):H[be]=0),Re||(be=re===1?1:3,H[be]&&Zs(R,H[be]))),C&&!Je&&Math.abs(R.getVelocity())>(Qo(C)?C:2500)&&(Yo(R.callbackAnimation),I?I.progress(1):Yo(i,ge==="reverse"?1:!re,1))):D&&o&&!gn&&o(R)}if(Mt){var w=E?Wt/E.duration()*(E._caScrollDist||0):Wt;Ot(w+(V._isFlipped?1:0)),Mt(w)}Gt&&Gt(-Wt/E.duration()*(E._caScrollDist||0))}},R.enable=function(mt,Yt){R.enabled||(R.enabled=!0,ln(U,"resize",ta),B||ln(U,"scroll",Ks),K&&ln(r,"refreshInit",K),mt!==!1&&(R.progress=ot=0,le=ee=$=rt()),Yt!==!1&&R.refresh())},R.getTween=function(mt){return mt&&wt?wt.tween:I},R.setPositions=function(mt,Yt,Pt,Wt){if(E){var Ge=E.scrollTrigger,re=E.duration(),Ce=Ge.end-Ge.start;mt=Ge.start+Ce*mt/re,Yt=Ge.start+Ce*Yt/re}R.refresh(!1,!1,{start:Lp(mt,Pt&&!!R._startClamp),end:Lp(Yt,Pt&&!!R._endClamp)},Wt),R.update()},R.adjustPinSpacing=function(mt){if(at&&mt){var Yt=at.indexOf(y.d)+1;at[Yt]=parseFloat(at[Yt])+mt+Qe,at[1]=parseFloat(at[1])+mt+Qe,yo(at)}},R.disable=function(mt,Yt){if(mt!==!1&&R.revert(!0,!0),R.enabled&&(R.enabled=R.isActive=!1,Yt||I&&I.pause(),ct=0,Ht&&(Ht.uncache=1),K&&an(r,"refreshInit",K),j&&(j.pause(),wt.tween&&wt.tween.kill()&&(wt.tween=0)),!B)){for(var Pt=ne.length;Pt--;)if(ne[Pt].scroller===U&&ne[Pt]!==R)return;an(U,"resize",ta),B||an(U,"scroll",Ks)}},R.kill=function(mt,Yt){R.disable(mt,Yt),I&&!Yt&&I.kill(),l&&delete Hh[l];var Pt=ne.indexOf(R);Pt>=0&&ne.splice(Pt,1),Pt===Un&&Xl>0&&Un--,Pt=0,ne.forEach(function(Wt){return Wt.scroller===R.scroller&&(Pt=1)}),Pt||Nn||(R.scroll.rec=0),i&&(i.scrollTrigger=null,mt&&i.revert({kill:!1}),Yt||i.kill()),Ee&&[Ee,Vt,V,Tt].forEach(function(Wt){return Wt.parentNode&&Wt.parentNode.removeChild(Wt)}),xa===R&&(xa=0),f&&(Ht&&(Ht.uncache=1),Pt=0,ne.forEach(function(Wt){return Wt.pin===f&&Pt++}),Pt||(Ht.spacer=0)),n.onKill&&n.onKill(R)},ne.push(R),R.enable(!1,!1),pe&&pe(R),i&&i.add&&!P){var Kt=R.update;R.update=function(){R.update=Kt,oe.cache++,St||L||R.refresh()},bt.delayedCall(.01,R.update),P=.01,St=L=0}else R.refresh();f&&ST()},r.register=function(n){return to||(bt=n||ng(),eg()&&window.document&&r.enable(),to=Ko),to},r.defaults=function(n){if(n)for(var i in n)Tl[i]=n[i];return Tl},r.disable=function(n,i){Ko=0,ne.forEach(function(o){return o[i?"kill":"disable"](n)}),an(se,"wheel",Ks),an(ye,"scroll",Ks),clearInterval(xl),an(ye,"touchcancel",ki),an(Me,"touchstart",ki),Sl(an,ye,"pointerdown,touchstart,mousedown",Ip),Sl(an,ye,"pointerup,touchend,mouseup",Up),sc.kill(),yl(an);for(var s=0;s<oe.length;s+=3)El(an,oe[s],oe[s+1]),El(an,oe[s],oe[s+2])},r.enable=function(){if(se=window,ye=document,ri=ye.documentElement,Me=ye.body,bt){if(Ia=bt.utils.toArray,da=bt.utils.clamp,zh=bt.core.context||ki,_u=bt.core.suppressOverwrites||ki,Hf=se.history.scrollRestoration||"auto",Vh=se.pageYOffset||0,bt.core.globals("ScrollTrigger",r),Me){Ko=1,Mo=document.createElement("div"),Mo.style.height="100vh",Mo.style.position="absolute",fg(),mT(),Xe.register(bt),r.isTouch=Xe.isTouch,Er=Xe.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),Bh=Xe.isTouch===1,ln(se,"wheel",Ks),kf=[se,ye,ri,Me],bt.matchMedia?(r.matchMedia=function(u){var h=bt.matchMedia(),d;for(d in u)h.add(d,u[d]);return h},bt.addEventListener("matchMediaInit",function(){ug(),qf()}),bt.addEventListener("matchMediaRevert",function(){return cg()}),bt.addEventListener("matchMedia",function(){fs(0,1),Cs("matchMedia")}),bt.matchMedia().add("(orientation: portrait)",function(){return xu(),xu})):console.warn("Requires GSAP 3.11.0 or later"),xu(),ln(ye,"scroll",Ks);var n=Me.hasAttribute("style"),i=Me.style,s=i.borderTopStyle,o=bt.core.Animation.prototype,a,l;for(o.revert||Object.defineProperty(o,"revert",{value:function(){return this.time(-.01,!0)}}),i.borderTopStyle="solid",a=sr(Me),tn.m=Math.round(a.top+tn.sc())||0,Fn.m=Math.round(a.left+Fn.sc())||0,s?i.borderTopStyle=s:i.removeProperty("border-top-style"),n||(Me.setAttribute("style",""),Me.removeAttribute("style")),xl=setInterval(Op,250),bt.delayedCall(.5,function(){return Ml=0}),ln(ye,"touchcancel",ki),ln(Me,"touchstart",ki),Sl(ln,ye,"pointerdown,touchstart,mousedown",Ip),Sl(ln,ye,"pointerup,touchend,mouseup",Up),Oh=bt.utils.checkPrefix("transform"),Yl.push(Oh),to=Mn(),sc=bt.delayedCall(.2,fs).pause(),eo=[ye,"visibilitychange",function(){var u=se.innerWidth,h=se.innerHeight;ye.hidden?(Rp=u,Pp=h):(Rp!==u||Pp!==h)&&ta()},ye,"DOMContentLoaded",fs,se,"load",fs,se,"resize",ta],yl(ln),ne.forEach(function(u){return u.enable(0,1)}),l=0;l<oe.length;l+=3)El(an,oe[l],oe[l+1]),El(an,oe[l],oe[l+2])}else if(ye){var c=function u(){r.enable(),ye.removeEventListener("DOMContentLoaded",u)};ye.addEventListener("DOMContentLoaded",c)}}},r.config=function(n){"limitCallbacks"in n&&(gu=!!n.limitCallbacks);var i=n.syncInterval;i&&clearInterval(xl)||(xl=i)&&setInterval(Op,i),"ignoreMobileResize"in n&&(Bh=r.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(yl(an)||yl(ln,n.autoRefreshEvents||"none"),j_=(n.autoRefreshEvents+"").indexOf("resize")===-1)},r.scrollerProxy=function(n,i){var s=Vn(n),o=oe.indexOf(s),a=ws(s);~o&&oe.splice(o,a?6:2),i&&(a?qi.unshift(se,i,Me,i,ri,i):qi.unshift(s,i))},r.clearMatchMedia=function(n){ne.forEach(function(i){return i._ctx&&i._ctx.query===n&&i._ctx.kill(!0,!0)})},r.isInViewport=function(n,i,s){var o=(ni(n)?Vn(n):n).getBoundingClientRect(),a=o[s?xs:Ms]*i||0;return s?o.right-a>0&&o.left+a<se.innerWidth:o.bottom-a>0&&o.top+a<se.innerHeight},r.positionInViewport=function(n,i,s){ni(n)&&(n=Vn(n));var o=n.getBoundingClientRect(),a=o[s?xs:Ms],l=i==null?a/2:i in ac?ac[i]*a:~i.indexOf("%")?parseFloat(i)*a/100:parseFloat(i)||0;return s?(o.left+l)/se.innerWidth:(o.top+l)/se.innerHeight},r.killAll=function(n){if(ne.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),n!==!0){var i=As.killAll||[];As={},i.forEach(function(s){return s()})}},r})();ae.version="3.15.0";ae.saveStyles=function(r){return r?Ia(r).forEach(function(t){if(t&&t.style){var e=ei.indexOf(t);e>=0&&ei.splice(e,5),ei.push(t,t.style.cssText,t.getBBox&&t.getAttribute("transform"),bt.core.getCache(t),zh())}}):ei};ae.revert=function(r,t){return qf(!r,t)};ae.create=function(r,t){return new ae(r,t)};ae.refresh=function(r){return r?ta(!0):(to||ae.register())&&fs(!0)};ae.update=function(r){return++oe.cache&&ur(r===!0?2:0)};ae.clearScrollMemory=hg;ae.maxScroll=function(r,t){return Xi(r,t?Fn:tn)};ae.getScrollFunc=function(r,t){return Hr(Vn(r),t?Fn:tn)};ae.getById=function(r){return Hh[r]};ae.getAll=function(){return ne.filter(function(r){return r.vars.id!=="ScrollSmoother"})};ae.isScrolling=function(){return!!Ai};ae.snapDirectional=Yf;ae.addEventListener=function(r,t){var e=As[r]||(As[r]=[]);~e.indexOf(t)||e.push(t)};ae.removeEventListener=function(r,t){var e=As[r],n=e&&e.indexOf(t);n>=0&&e.splice(n,1)};ae.batch=function(r,t){var e=[],n={},i=t.interval||.016,s=t.batchMax||1e9,o=function(c,u){var h=[],d=[],f=bt.delayedCall(i,function(){u(h,d),h=[],d=[]}).pause();return function(_){h.length||f.restart(!0),h.push(_.trigger),d.push(_),s<=h.length&&f.progress(1)}},a;for(a in t)n[a]=a.substr(0,2)==="on"&&En(t[a])&&a!=="onRefreshInit"?o(a,t[a]):t[a];return En(s)&&(s=s(),ln(ae,"refresh",function(){return s=t.batchMax()})),Ia(r).forEach(function(l){var c={};for(a in n)c[a]=n[a];c.trigger=l,e.push(ae.create(c))}),e};var Gp=function(t,e,n,i){return e>i?t(i):e<0&&t(0),n>i?(i-e)/(n-e):n<0?e/(e-n):1},yu=function r(t,e){e===!0?t.style.removeProperty("touch-action"):t.style.touchAction=e===!0?"auto":e?"pan-"+e+(Xe.isTouch?" pinch-zoom":""):"none",t===ri&&r(Me,e)},Cl={auto:1,scroll:1},AT=function(t){var e=t.event,n=t.target,i=t.axis,s=(e.changedTouches?e.changedTouches[0]:e).target,o=s._gsap||bt.core.getCache(s),a=Mn(),l;if(!o._isScrollT||a-o._isScrollT>2e3){for(;s&&s!==Me&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(Cl[(l=Ei(s)).overflowY]||Cl[l.overflowX]));)s=s.parentNode;o._isScroll=s&&s!==n&&!ws(s)&&(Cl[(l=Ei(s)).overflowY]||Cl[l.overflowX]),o._isScrollT=a}(o._isScroll||i==="x")&&(e.stopPropagation(),e._gsapAllow=!0)},pg=function(t,e,n,i){return Xe.create({target:t,capture:!0,debounce:!1,lockAxis:!0,type:e,onWheel:i=i&&AT,onPress:i,onDrag:i,onScroll:i,onEnable:function(){return n&&ln(ye,Xe.eventTypes[0],Xp,!1,!0)},onDisable:function(){return an(ye,Xe.eventTypes[0],Xp,!0)}})},CT=/(input|label|select|textarea)/i,Wp,Xp=function(t){var e=CT.test(t.target.tagName);(e||Wp)&&(t._gsapAllow=!0,Wp=e)},RT=function(t){ss(t)||(t={}),t.preventDefault=t.isNormalizer=t.allowClicks=!0,t.type||(t.type="wheel,touch"),t.debounce=!!t.debounce,t.id=t.id||"normalizer";var e=t,n=e.normalizeScrollX,i=e.momentum,s=e.allowNestedScroll,o=e.onRelease,a,l,c=Vn(t.target)||ri,u=bt.core.globals().ScrollSmoother,h=u&&u.get(),d=Er&&(t.content&&Vn(t.content)||h&&t.content!==!1&&!h.smooth()&&h.content()),f=Hr(c,tn),_=Hr(c,Fn),g=1,m=(Xe.isTouch&&se.visualViewport?se.visualViewport.scale*se.visualViewport.width:se.outerWidth)/se.innerWidth,p=0,M=En(i)?function(){return i(a)}:function(){return i||2.8},x,v,b=pg(c,t.type,!0,s),A=function(){return v=!1},E=ki,C=ki,S=function(){l=Xi(c,tn),C=da(Er?1:0,l),n&&(E=da(0,Xi(c,Fn))),x=ys},y=function(){d._gsap.y=jo(parseFloat(d._gsap.y)+f.offset)+"px",d.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(d._gsap.y)+", 0, 1)",f.offset=f.cacheID=0},D=function(){if(v){requestAnimationFrame(A);var G=jo(a.deltaY/2),nt=C(f.v-G);if(d&&nt!==f.v+f.offset){f.offset=nt-f.v;var R=jo((parseFloat(d&&d._gsap.y)||0)-f.offset);d.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+R+", 0, 1)",d._gsap.y=R+"px",f.cacheID=oe.cache,ur()}return!0}f.offset&&y(),v=!0},U,z,B,k,H=function(){S(),U.isActive()&&U.vars.scrollY>l&&(f()>l?U.progress(1)&&f(l):U.resetTo("scrollY",l))};return d&&bt.set(d,{y:"+=0"}),t.ignoreCheck=function(q){return Er&&q.type==="touchmove"&&D()||g>1.05&&q.type!=="touchstart"||a.isGesturing||q.touches&&q.touches.length>1},t.onPress=function(){v=!1;var q=g;g=jo((se.visualViewport&&se.visualViewport.scale||1)/m),U.pause(),q!==g&&yu(c,g>1.01?!0:n?!1:"x"),z=_(),B=f(),S(),x=ys},t.onRelease=t.onGestureStart=function(q,G){if(f.offset&&y(),!G)k.restart(!0);else{oe.cache++;var nt=M(),R,K;n&&(R=_(),K=R+nt*.05*-q.velocityX/.227,nt*=Gp(_,R,K,Xi(c,Fn)),U.vars.scrollX=E(K)),R=f(),K=R+nt*.05*-q.velocityY/.227,nt*=Gp(f,R,K,Xi(c,tn)),U.vars.scrollY=C(K),U.invalidate().duration(nt).play(.01),(Er&&U.vars.scrollY>=l||R>=l-1)&&bt.to({},{onUpdate:H,duration:nt})}o&&o(q)},t.onWheel=function(){U._ts&&U.pause(),Mn()-p>1e3&&(x=0,p=Mn())},t.onChange=function(q,G,nt,R,K){if(ys!==x&&S(),G&&n&&_(E(R[2]===G?z+(q.startX-q.x):_()+G-R[1])),nt){f.offset&&y();var pt=K[2]===nt,Ft=pt?B+q.startY-q.y:f()+nt-K[1],$=C(Ft);pt&&Ft!==$&&(B+=$-Ft),f($)}(nt||G)&&ur()},t.onEnable=function(){yu(c,n?!1:"x"),ae.addEventListener("refresh",H),ln(se,"resize",H),f.smooth&&(f.target.style.scrollBehavior="auto",f.smooth=_.smooth=!1),b.enable()},t.onDisable=function(){yu(c,!0),an(se,"resize",H),ae.removeEventListener("refresh",H),b.kill()},t.lockAxis=t.lockAxis!==!1,a=new Xe(t),a.iOS=Er,Er&&!f()&&f(1),Er&&bt.ticker.add(ki),k=a._dc,U=bt.to(a,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:dg(f,f(),function(){return U.pause()})},onUpdate:ur,onComplete:k.vars.onComplete}),a};ae.sort=function(r){if(En(r))return ne.sort(r);var t=se.pageYOffset||0;return ae.getAll().forEach(function(e){return e._sortY=e.trigger?t+e.trigger.getBoundingClientRect().top:e.start+se.innerHeight}),ne.sort(r||function(e,n){return(e.vars.refreshPriority||0)*-1e6+(e.vars.containerAnimation?1e6:e._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};ae.observe=function(r){return new Xe(r)};ae.normalizeScroll=function(r){if(typeof r>"u")return In;if(r===!0&&In)return In.enable();if(r===!1){In&&In.kill(),In=r;return}var t=r instanceof Xe?r:RT(r);return In&&In.target===t.target&&In.kill(),ws(t.target)&&(In=t),t};ae.core={_getVelocityProp:Fh,_inputObserver:pg,_scrollers:oe,_proxies:qi,bridge:{ss:function(){Ai||Cs("scrollStart"),Ai=Mn()},ref:function(){return gn}}};ng()&&bt.registerPlugin(ae);const Dt={paper:"#FFFDF7",ink:"#2B3118",olive:"#6E8B1F",oliveDark:"#4F6516",lime:"#C4D34E",orange:"#E8843A",amber:"#F2B33D",pink:"#F2A7A5",rock:"#D98B4E",rockDark:"#A9623A",white:"#FFFFFF",chontaduro:"#D8472A",chontaduroDark:"#8B2E18",chontaduroLight:"#EF9A4E",chontaduroPetal:"#EAC27E",chontaduroHorn:"#6B4226",chontaduroCheek:"#F2A96B",river:"#7BC4C0",riverDark:"#4E9A93",stone:"#E7DCC8",stoneDark:"#B9AC8E"};let jr=null;const Su=new Map;function PT(){if(!jr){const r=new Uint8Array([120,195,255]);jr=new yv(r,3,1,nf),jr.minFilter=Bn,jr.magFilter=Bn,jr.generateMipmaps=!1,jr.needsUpdate=!0}return jr}function te(r,t={}){const e=r+JSON.stringify(t);return Su.has(e)||Su.set(e,new Qv({color:r,gradientMap:PT(),...t})),Su.get(e)}function Rl(r,t=Dt.orange,e=1.07){const n=new At(r.geometry,new Fi({color:t,side:On}));return n.scale.setScalar(e),r.add(n),n}function DT(r=1){let t=r>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const LT=(r,t)=>t[Math.floor(r()*t.length)];function $f(r){const t=new Pe,e=new At(new Xn(.05,.07,.3,6),te(Dt.rockDark));e.position.y=.15,t.add(e);const n=LT(r,[Dt.olive,Dt.olive,Dt.lime]);if(r()>.45){const i=new At(new Yi(.28,.75,7),te(n));i.position.y=.3+.37,t.add(i)}else{const i=new At(new _f(.3,0),te(n));i.position.y=.3+.24,t.add(i)}return t.scale.setScalar(.7+r()*.6),t}function IT(r,{radius:t=1.5,top:e=Dt.lime,rock:n=Dt.rock,trees:i=3}={}){const s=new Pe,o=7,a=r()*Math.PI*2,l=new At(new Xn(t,t*.94,.32,o),te(e));l.position.y=-.16,l.rotation.y=a,s.add(l);const c=new At(new Xn(t*.94,t*.86,.28,o),te(Dt.rockDark));c.position.y=-.46,c.rotation.y=a,s.add(c);const u=t*1.5,h=new At(new Yi(t*.86,u,o),te(n));h.rotation.x=Math.PI,h.rotation.y=a,h.position.y=-.6-u/2,s.add(h);for(let d=0;d<i;d++){const f=r()*Math.PI*2,_=t*(.2+r()*.55),g=$f(r);g.position.set(Math.cos(f)*_,0,Math.sin(f)*_),s.add(g)}return s.userData.bottom=-.6-u,s}function UT(r,t=1){const e=new Pe,n=te(Dt.white),i=4+Math.floor(r()*3);for(let s=0;s<i;s++){const o=(.45+r()*.45)*t,a=new At(new Bi(o,14,10),n);a.position.set((s-i/2)*.55*t,r()*.3*t,(r()-.5)*.4*t),e.add(a)}return e}function NT(r){const t=new Pe,e=te("#FFF6EC"),n=te(Dt.pink),i=new At(new yn(1,.85,.8),e);i.position.y=.425,t.add(i);const s=new At(new Yi(.72,.5,4),n);s.rotation.y=Math.PI/4,s.scale.z=.82,s.position.y=.85+.25,t.add(s);const o=new At(new yn(.34,1.55,.34),e);o.position.set(0,.775,.5),t.add(o);const a=new At(new Yi(.27,.8,4),n);a.rotation.y=Math.PI/4,a.position.set(0,1.55+.4,.5),t.add(a);const l=new At(new yn(.14,.26,.02),te(Dt.rockDark));l.position.set(0,.13,.675),t.add(l),t.position.set(-.85,0,-.75),t.rotation.y=.35,r.add(t);const c=new Pe,u=new At(new Bi(.22,18,14),te(Dt.orange));u.position.y=.3;const h=new At(new Yi(.2,.42,18),te(Dt.orange));h.rotation.x=Math.PI,h.position.y=.06;const d=new At(new Bi(.08,12,10),te(Dt.paper));d.position.set(0,.32,.17),c.add(u,h,d),c.position.set(.95,1.9,-.5),r.add(c),r.userData.floaty=c}function FT(r,t){const e=te(Dt.amber),n=9;for(let a=0;a<n;a++){const l=a/(n-1),c=-1.45+l*2.8,u=Math.sin(l*Math.PI*1.6)*.75,h=new At(new yn(.34,.05,.34),e);h.position.set(c,.025,u),h.rotation.y=l*1.5,r.add(h)}const i=new At(new Xn(.025,.025,1.2,8),te(Dt.ink));i.position.set(1.35,.6,-.95),r.add(i);const s=new Om;s.moveTo(0,0),s.lineTo(.55,-.16),s.lineTo(0,-.34),s.lineTo(0,0);const o=new At(new xf(s),te(Dt.orange,{side:Ti}));o.position.set(1.36,1.18,-.95),r.add(o),r.userData.flag=o;for(let a=0;a<3;a++){const l=$f(t),c=-2.2+a*1.3;l.position.set(Math.cos(c)*1.45,0,Math.sin(c)*1.2-.3),r.add(l)}}function OT(r){const t=new At(new yn(1.7,.24,.9),te(Dt.amber));t.position.set(.15,.12,-.85),r.add(t);const e=new At(new yn(1.7,1.05,.08),te(Dt.orange));e.position.set(.15,.77,-1.26),r.add(e);const n=new At(new gf(.2,0),te(Dt.paper));n.position.set(.15,.82,-1.18),r.add(n),r.userData.floaty=n;const i=te(Dt.ink),s=new N(-1.45,1.35,.25),o=new N(1.5,1.35,.25);for(const u of[s,o]){const h=new At(new Xn(.025,.025,u.y,8),i);h.position.set(u.x,u.y/2,u.z),r.add(h)}const a=[Dt.pink,Dt.amber,Dt.lime,Dt.paper],l=[],c=9;for(let u=0;u<c;u++){const h=(u+1)/(c+1),d=new N().lerpVectors(s,o,h);d.y-=Math.sin(h*Math.PI)*.45;const f=new At(new Bi(.075,12,10),new Fi({color:a[u%a.length]}));f.position.copy(d),r.add(f),l.push(f)}r.userData.bulbs=l}function BT(r,t=[]){const e=new Pe,n=6.6,i=3.1,s=new At(new Xn(1,1,.4,56),te(Dt.lime));s.scale.set(n,1,i),s.position.y=-.2,e.add(s);const o=new At(new Xn(1,.9,.5,56),te(Dt.rockDark));o.scale.set(n*.97,1,i*.97),o.position.y=-.62,e.add(o);const a=new At(new Yi(1,3.4,56),te(Dt.rock));a.rotation.x=Math.PI,a.scale.set(n*.82,1,i*.82),a.position.y=-.62-1.7,e.add(a);const l=new At(new yn(n*1.94,.09,1.15),te(Dt.river));l.position.set(0,.005,.55),e.add(l);const c=new At(new yn(n*2,.04,1.3),te(Dt.riverDark));c.position.set(0,-.03,.55),e.add(c);function u(M){const x=new Pe,v=new At(new yn(.95,.08,1.5),te(Dt.stone));v.position.y=.13,x.add(v);for(const b of[-1,1]){const A=new At(new yn(.95,.16,.045),te(Dt.stoneDark));A.position.set(0,.24,b*.73),x.add(A)}return x.position.set(M,0,.55),x}e.add(u(0));function h({x:M,z:x,w:v,h:b,d:A,color:E,roof:C}){const S=new Pe,y=new At(new yn(v,b,A),te(E));if(y.position.y=b/2,S.add(y),C){const D=new At(new Yi(Math.max(v,A)*.72,b*.5,4),te(Dt.pink));D.rotation.y=Math.PI/4,D.position.y=b+b*.25,S.add(D)}return S.position.set(M,0,x),S}e.add(h({x:-4.9,z:-1.5,w:1.15,h:1.3,d:.95,color:"#FFF6EC",roof:!0})),e.add(h({x:5,z:-1.4,w:1.5,h:1.1,d:1.05,color:Dt.stone,roof:!1}));for(let M=0;M<6;M++){const x=$f(r),v=_(-n+1,n-1,M/5),A=(r()>.5?1:-1)*(1.4+r()*1.4);x.position.set(v,0,A),x.rotation.y=r()*Math.PI*2,x.scale.setScalar(.6+r()*.4),e.add(x)}function d(M,x){const v=new Pe,b=new At(new Xn(.03,.03,.9,8),te(Dt.ink));b.position.y=.45,v.add(b);const A=new At(new Bi(.09,12,10),new Fi({color:Dt.amber}));return A.position.y=.92,v.add(A),v.position.set(M,0,x),v.userData.globe=A,v}const f=[d(-1.6,1.05),d(1.6,1.05)];e.add(...f);function _(M,x,v){return M+(x-M)*v}function g(M,x,v){const b=new Pe,A=new Fi({color:M.color}),E=new At(new Bi(.16,16,12),A);E.position.y=.86,b.add(E);const C=new At(new Yi(.14,.3,16),A);C.rotation.x=Math.PI,C.position.y=.63,b.add(C);const S=new At(new vf(.22,.3,24),new Fi({color:M.color,transparent:!0,opacity:.55,side:Ti}));S.rotation.x=-Math.PI/2,S.position.y=.02,b.add(S);const y=new At(new ka(.55,24),new Fi({color:M.color,transparent:!0,opacity:.16,side:Ti,depthWrite:!1}));return y.rotation.x=-Math.PI/2,y.position.y=.015,b.add(y),b.position.set(x,0,v),b.userData={id:M.id,category:M.category,baseY:.86,head:E,tip:C,ring:S,glow:y,phase:r()*Math.PI*2},b}const m=Math.max(t.length,1),p=t.map((M,x)=>{const v=x/m*Math.PI*2-Math.PI/2,b=Math.cos(v)*(n-1.1),A=Math.sin(v)*(i+1.75),E=g(M,b,A);return e.add(E),E});return{group:e,pins:p,lamps:f}}function zT(){const r=new Pe,t=new Pe;r.add(t);const e=new Pe;e.position.y=.4,t.add(e);const n=te(Dt.chontaduroLight),i=new no(.2,.3,6,14),s=new At(i,n);s.position.y=.35,Rl(s,Dt.chontaduroDark,1.08),e.add(s);const o=new Pe;o.position.y=.56,e.add(o);const a=.88,l=[[.17,0],[.19,.08],[.25,.22],[.33,.38],[.39,.52],[.4,.6],[.36,.7],[.24,.8],[.08,.86],[0,a]].map(([B,k])=>new xt(B,k)),c=new _c(l,24),u=new ce(Dt.chontaduro),h=new ce(Dt.chontaduroLight),d=new ce,f=c.attributes.position,_=new Float32Array(f.count*3);for(let B=0;B<f.count;B++){const k=mc.clamp(f.getY(B)/a,0,1);d.copy(h).lerp(u,k),_.set([d.r,d.g,d.b],B*3)}c.setAttribute("color",new Oi(_,3));const g=new At(c,te("#FFFFFF",{vertexColors:!0}));Rl(g,Dt.chontaduroDark,1.04),o.add(g);const m=new Pe;m.position.y=.3,o.add(m);const p=te(Dt.ink),M=[];for(const B of[-1,1]){const k=new At(new no(.04,.05,4,8),p);k.position.set(B*.13,.02,.27),k.scale.z=.45,m.add(k),M.push(k)}const x=new At(new Bi(.048,14,10),p);x.scale.set(1.15,.9,.35),x.position.set(0,-.14,.19),m.add(x);const v=new Fi({color:Dt.chontaduroCheek});for(const B of[-1,1]){const k=new At(new ka(.055,18),v);k.position.set(B*.2,-.06,.24),k.rotation.y=B*.6,m.add(k)}const b=new Pe;b.position.y=a-.04,o.add(b);const A=te(Dt.chontaduroPetal),E=6;for(let B=0;B<E;B++){const k=B/E*Math.PI*2,H=new At(new Bi(.1,10,8),A);H.scale.set(.7,1.3,.4),H.position.set(Math.cos(k)*.1,.02,Math.sin(k)*.1),H.rotation.z=Math.cos(k)*.9,H.rotation.x=-Math.sin(k)*.9,b.add(H)}const C=new mf([new N(0,0,0),new N(.02,.1,0),new N(.09,.18,-.01),new N(.14,.23,-.04)]),S=new At(new Mc(C,12,.026,8,!1),te(Dt.chontaduroHorn));b.add(S);const y=new no(.055,.2,6,12),D=[];for(const B of[-1,1]){const k=new Pe;k.position.set(B*.22,.42,0),k.rotation.z=B*.12;const H=new At(y,n);H.position.y=-.17,Rl(H,Dt.chontaduroDark,1.18),k.add(H),e.add(k),k.userData.side=B,D.push(k)}const U=new no(.075,.16,6,12),z=[];for(const B of[-1,1]){const k=new Pe;k.position.set(B*.1,.19,0);const H=new At(U,n);H.position.y=-.17,Rl(H,Dt.chontaduroDark,1.14),k.add(H),t.add(k),z.push(k)}return{root:r,pivot:t,look:e,arms:D,legs:z,eyes:M,sprout:b}}const Va=[{year:"1536",title:"Un río funda una ciudad",text:"Sebastián de Belalcázar funda Santiago de Cali el 25 de julio, a orillas del río Cali. El río marca desde entonces el borde norte del centro.",color:"#6E8B1F"},{year:"1734",title:"El primer cruce",text:"Se levanta un primer puente de guadua sobre el río. La madera no resiste mucho tiempo y el paso se deteriora pronto.",color:"#E8843A"},{year:"1845",title:"Puente Ortiz",text:"Tras tres años bajo la dirección de fray José Ignacio Ortiz se termina el puente que une el centro con el norte. Hoy es monumento nacional.",color:"#F2B33D"},{year:"1936",title:"Puente España",text:"Para los 400 años de la ciudad, la colonia española en Cali financia un nuevo puente sobre la calle 11. Hoy es peatonal.",color:"#F2A7A5"},{year:"1950",title:"Llegan los carros",text:"El Puente Ortiz pasa de peatonal a vehicular. La orilla del río es ya la Avenida Colombia, una vía para carros.",color:"#C4D34E"},{year:"1971",title:"Juegos Panamericanos",text:"Cali recibe los Panamericanos y crece rápido. El tráfico del centro, en calles como la Sexta y la Trece, empieza a colapsar.",color:"#6E8B1F"},{year:"2012",title:"Se hunde la avenida",text:"El 11 de enero empiezan las obras del Túnel Mundialista. En las excavaciones aparecen vestigios del puente del siglo XIX.",color:"#E8843A"},{year:"2013",title:"Nace el Bulevar",text:"El 16 de mayo abre el Bulevar del Río, diseñado por la arquitecta caleña Elly Burckhardt, sobre el túnel urbano más largo del país.",color:"#F2B33D"},{year:"2014",title:"La memoria en vitrina",text:"El Inciva entrega restaurados los vestigios del antiguo Puente Ortiz, que se exhiben en el bulevar entre las calles 8 y 9.",color:"#F2A7A5"},{year:"Hoy",title:"La sala abierta del centro",text:"Feria del Libro, conciertos, ferias artesanales y el alumbrado de diciembre. Y justo aquí, la línea se acaba…",color:"#C4D34E"}],kT=[{id:"gato-del-rio",name:"Gato del Río",tag:"Escultura · 1996",short:"Escultura de Hernando Tejada a orillas del río Cali, hoy rodeada del parque de los gatos.",color:"#F2A7A5"},{id:"la-tertulia",name:"La Tertulia",tag:"Museo de arte",short:"Museo de Arte Moderno de Cali, junto al río, con colecciones de arte latinoamericano.",color:"#F2A7A5"},{id:"muiic",name:"MUIIC",tag:"Museo interactivo",short:"Espacio interactivo sobre el bulevar dedicado a la ciencia, la tecnología y la cultura caleña.",color:"#F2A7A5"},{id:"biblioteca-centenario",name:"Biblioteca Centenario",tag:"Biblioteca pública",short:"Biblioteca del centro histórico de Cali, a pocos pasos del recorrido del bulevar.",color:"#F2A7A5"}],HT=[{id:"fil-cali",name:"FIL Cali",tag:"Feria del libro",short:"La Feria Internacional del Libro de Cali toma el bulevar con casetas, autores y lecturas al aire libre.",color:"#E8843A"},{id:"alumbrado",name:"Alumbrado",tag:"Diciembre",short:"El alumbrado navideño ilumina la orilla del río y convierte el bulevar en un recorrido nocturno.",color:"#E8843A"},{id:"sucursal-fest",name:"Sucursal Fest",tag:"Música y cultura",short:"Festival de música y cultura urbana sobre el bulevar, con tarima abierta al río.",color:"#E8843A"}],VT=[{id:"cultura",name:"Cultura",short:"Esculturas, museos y espacios patrimoniales del bulevar.",color:"#F2B33D"},{id:"restaurantes",name:"Restaurantes",short:"Cafés, puestos y restaurantes sobre la orilla del río.",color:"#F2B33D"},{id:"talleres",name:"Talleres",short:"Actividades para hacer y aprender junto al río.",color:"#F2B33D"}];Wn.registerPlugin(ae);const GT={lugares:{label:"Lugares",color:Dt.pink,tint:"253, 238, 236"},eventos:{label:"Eventos",color:Dt.orange,tint:"253, 233, 219"},rutas:{label:"Rutas",color:Dt.amber,tint:"253, 240, 211"}},Yp={lugares:Dt.pink,eventos:Dt.orange},mg=[...kT.map(r=>({...r,category:"lugares",color:Yp.lugares})),...HT.map(r=>({...r,category:"eventos",color:Yp.eventos}))],Zf=new Map(mg.map(r=>[r.id,r])),Wh=[{id:"lugares",name:"Lugares",rock:"#E99A93",decorate:NT,startAngle:0},{id:"eventos",name:"Eventos",rock:"#E07F3A",decorate:OT,startAngle:Math.PI*.7},{id:"rutas",name:"Rutas",rock:"#E9A544",decorate:FT,startAngle:Math.PI*1.35}];"scrollRestoration"in history&&(history.scrollRestoration="manual");window.scrollTo(0,0);const _g=window.matchMedia("(prefers-reduced-motion: reduce)").matches,lo=(r,t=0,e=1)=>Math.min(e,Math.max(t,r)),vn=mc.lerp,hn=(r,t,e)=>{const n=lo((e-r)/(t-r));return n*n*(3-2*n)},Sr=(r,t,e,n)=>mc.damp(r,t,e,n),qp=r=>1+2.70158*Math.pow(r-1,3)+1.70158*Math.pow(r-1,2),WT=r=>r<1/2.75?7.5625*r*r:r<2/2.75?7.5625*(r-=1.5/2.75)*r+.75:r<2.5/2.75?7.5625*(r-=2.25/2.75)*r+.9375:7.5625*(r-=2.625/2.75)*r+.984375,mr=document.querySelector("canvas.webgl"),kn=new Mv;kn.fog=new hf("#F9EEE2",20,70);kn.add(new nx("#FFFFFF","#E9D6BE",1.6));const gg=new sx("#FFF4E0",2.2);gg.position.set(4,8,6);kn.add(gg);const si=DT(11),vg=8,XT=6,Pr=Va.map((r,t)=>-(XT+t*vg)),Ga=2,Jf=Pr[Pr.length-1]-4,ea=Ga-Jf,Xh=Ga-1,Kf=Jf+.5,xg=1.4,YT=46,jf=Kf-xg,lc=jf-YT,cc=lc-6,Mg=-.32,yg=2.4,Sg=-2.6,Eu=.15,Rs=new Pe;Rs.position.y=Ga;Rs.scale.y=1e-4;kn.add(Rs);{const r=new Xn(.05,.05,ea,12);r.translate(0,-ea/2,0),Rs.add(new At(r,te(Dt.olive)));const t=new Xn(.018,.018,ea,8);t.translate(0,-ea/2,0),Rs.add(new At(t,te(Dt.lime)))}const $p=Va.map((r,t)=>{const n=1*yg,i=new Pe;i.position.set(0,Pr[t],Mg);const s=new At(new Mf(.34,.045,10,28),te(r.color));s.rotation.x=-Math.PI/2,i.add(s);const o=new At(new Xn(.028,.028,Math.abs(n)*.72,8),te(Dt.oliveDark));o.rotation.z=Math.PI/2,o.position.x=n*.36,i.add(o);const a=new At(new Bi(.13,18,14),te(r.color));return a.position.set(n*.72,.06,0),i.add(a),i.userData.side=1,i.userData.knob=a,i.scale.setScalar(1e-4),kn.add(i),i}),Tu=Va.map(()=>0),wc=[];function Eg(r,t,e,n,i,s,o,a=1){for(let l=0;l<r;l++){const c=UT(si,a*(.7+si()*.8));c.position.set(vn(t,e,si()),vn(n,i,si()),vn(s,o,si())),c.userData.baseX=c.position.x,c.userData.phase=si()*Math.PI*2,kn.add(c),wc.push(c)}}Eg(12,-9,9,Jf-2,Ga+6,-24,-8);Eg(10,-6,6,jf+4,lc-6,-4,4,1.3);for(const r of wc)r.scale.setScalar(1e-4);const Dn=zT();kn.add(Dn.root);const ls=new At(new ka(.42,28),new Fi({color:Dt.ink,transparent:!0,opacity:.18,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}));ls.rotation.x=-Math.PI/2;kn.add(ls);const Tg=0,bg=cc,hi=BT(si,mg);hi.group.position.set(Tg,bg,0);hi.group.scale.setScalar(1e-4);kn.add(hi.group);const wg=[];for(const r of hi.pins)r.traverse(t=>{t.isMesh&&(t.userData.pinRef=r,wg.push(t))});let js=null;function Qf(r){if(js&&(hi.group.remove(js),js.geometry.dispose(),js=null),r.length<2)return;const t=[];for(const i of r){const s=hi.pins.find(o=>o.userData.id===i);s&&t.push(new N(s.position.x,.12,s.position.z))}if(t.length<2)return;const e=new mf(t,!1,"catmullrom",.2),n=new Mc(e,Math.max(t.length*12,24),.05,8,!1);js=new At(n,new Fi({color:Dt.ink})),hi.group.add(js)}const qt=r=>document.querySelector(r),Zp=qt("#white"),qT=qt("#loader"),$T=qt("#loaderPct"),Jp=qt("#intro"),Kp=qt("#alert"),ZT=qt("#rail"),JT=qt("#railFill"),Ag=qt("#clouds"),KT=qt("#veil"),Yh=qt("#worldTint"),qh=qt("#world"),$h=qt("#worldHint"),jp=qt("#worldList"),Cg=qt("#worldCta"),jT=qt("#worldCtaYes"),Rg=qt("#trio"),QT=qt("#trioEyebrow"),tb=qt("#trioHeading"),Qp=qt("#trioLabels"),uc=qt("#card3d"),eb=qt("#card3dClose"),nb=qt("#card3dTag"),ib=qt("#card3dTitle"),rb=qt("#card3dText"),So=qt("#card3dAdd"),sb=qt("#card3dAnother"),ob=qt("#card3dExit"),Pg=qt("#confirm");qt("#confirmText");const ab=qt("#confirmYes"),lb=qt("#confirmNo"),td=qt("#routebar"),tm=qt("#routeStops"),cb=qt("#routebarEmpty"),ub=qt("#routeReset"),Ac=qt("#shareFab"),ed=qt("#wall"),bu=qt("#wallList"),hb=qt("#wallClose"),Dg=qt("#subnav"),fb=qt("#navBack"),db=qt("#navMenu"),pb=qt("#navWall"),mb=qt("#navRestart"),_b=qt("#hitos"),Lg=Va.map(r=>{const t=document.createElement("article");return t.className="hito",t.style.setProperty("--c",r.color),t.innerHTML=`<span class="hito-year">${r.year}</span><h3>${r.title}</h3><p>${r.text}</p>`,_b.appendChild(t),{el:t,width:0,height:0,active:!1}}),gb=qt("#railYears"),vb=Va.map((r,t)=>{const e=document.createElement("li");e.textContent=r.year;const n=(Xh-Pr[t])/(Xh-Kf);return e.style.top=`${lo(n)*100}%`,gb.appendChild(e),e}),em='<circle cx="55" cy="70" r="38"/><circle cx="98" cy="52" r="46"/><circle cx="145" cy="68" r="36"/><rect x="22" y="66" width="158" height="42" rx="21"/>',xb=`<svg viewBox="0 0 200 120" aria-hidden="true"><g fill="#F1E3D3" transform="translate(0 7)">${em}</g><g fill="#FFFFFF">${em}</g></svg>`,Mb=[[.08,.12],[.5,.05],[.92,.14],[.22,.4],[.62,.36],[.95,.5],[.05,.7],[.42,.66],[.8,.8],[.25,.98],[.62,1],[.5,.5]],Ig=Mb.map(([r,t])=>{const e=document.createElement("div");e.className="cloud",e.innerHTML=xb,Ag.appendChild(e);const n=Math.abs(r-.5)<.05?si()>.5?1:-1:Math.sign(r-.5);return{el:e,tx:r,ty:t,side:n,size:.62+si()*.25,drop:1.05+si()*.4,delay:si()*.3,w:0,h:0}}),Le={width:window.innerWidth,height:window.innerHeight},Ui=new yi(35,Le.width/Le.height,.1,200);kn.add(Ui);const hc=new XE({canvas:mr,antialias:!0,alpha:!0});hc.setClearColor(0,0);const xn={dist:12,halfW:6,offset:3,trioDist:14,worldDist:20};function nd(){Le.width=window.innerWidth,Le.height=window.innerHeight;const r=Le.width/Le.height;Ui.aspect=r,Ui.updateProjectionMatrix(),hc.setSize(Le.width,Le.height),hc.setPixelRatio(Math.min(window.devicePixelRatio,2));const t=Math.tan(mc.degToRad(Ui.fov/2));xn.dist=Math.max(3.7/t,3.3/(t*r)),xn.halfW=xn.dist*t*r,xn.offset=Math.min(3.2,xn.halfW*.46),xn.readDist=Math.max(3.9/t,4.6/(t*r)),xn.trioDist=Math.max(6.4/t,8.6/(t*r)),xn.worldDist=Math.max(7/t,10/(t*r));for(const n of Lg)n.width=n.el.offsetWidth,n.height=n.el.offsetHeight;const e=Math.max(Le.width,Le.height);for(const n of Ig)n.w=e*n.size,n.h=n.w*.6,n.el.style.width=`${n.w}px`;xi==="loading"&&!Ug&&(Xt.loaderX=xn.offset+xn.halfW+1.6)}const Xt={loaderX:10,intro:0,travel:0,edge:0,look:0,fall:0,cover:0,reveal:0},fc={enter:0};let xi="loading",Ug=!1;window.addEventListener("resize",nd);nd();var am;(am=document.fonts)==null||am.ready.then(nd);function yb(){Ug=!0,Wn.to(Xt,{loaderX:Sg,duration:_g?1.6:4,ease:"none",onUpdate(){$T.textContent=Math.round(this.progress()*100)},onComplete:Sb})}function Sb(){xi="timeline";const r=Wn.timeline();r.to(Zp,{opacity:0,duration:1.2,ease:"power2.inOut"},0),r.to(qT,{opacity:0,y:20,duration:.6,ease:"power2.in"},0),r.to(Rs.scale,{y:1,duration:2.4,ease:"power2.out"},.4),wc.forEach(t=>{r.to(t.scale,{x:1,y:1,z:1,duration:.9,ease:"back.out(1.7)"},.3+Math.random()*1.2)}),r.to(Xt,{intro:1,duration:.9,ease:"power1.out"},1),r.add(()=>{document.documentElement.classList.remove("is-loading"),Zp.style.display="none",Eb()},1.2)}function Eb(){const r=Wn.timeline({defaults:{ease:"none"},scrollTrigger:{trigger:".scroll-space",start:"top top",end:"bottom bottom",scrub:1}});r.to(Xt,{travel:1,duration:7}),r.to(Xt,{edge:1,duration:.6,ease:"power1.inOut"}),r.to(Xt,{look:1,duration:.6}),r.to(Xt,{fall:1,duration:1.1,ease:"power2.in"},"+=0.1"),r.to(Xt,{cover:1,duration:.7,ease:"power1.out"},"<0.35"),r.to(Xt,{reveal:1,duration:1.2},">0.15"),r.to({},{duration:.4}),ae.refresh()}const co=new lx,dc=new xt(9,9);window.addEventListener("pointermove",r=>{dc.x=r.clientX/Le.width*2-1,dc.y=-(r.clientY/Le.height)*2+1});const Zh=[[0,2.3],[-3.3,-1.9],[3.3,-1.9]];let en=null,na=-1;function Tb(r,t,{eyebrow:e,heading:n,radius:i=1.9},s){QT.textContent=e,tb.textContent=n,Qp.innerHTML="";const o=new Pe;o.position.set(t.x,t.y,0),kn.add(o);const a=[],l=r.map((c,u)=>{var f;const h=IT(si,{radius:i,trees:0,top:Dt.lime,rock:c.rock});(f=c.decorate)==null||f.call(c,h,si),h.position.set(Zh[u][0],Zh[u][1],0),h.userData.trioIndex=u,h.userData.hover=0,h.scale.setScalar(1e-4),o.add(h),Wn.to(h.scale,{x:1,y:1,z:1,duration:.9,delay:.18*u,ease:"back.out(1.6)"});const d=document.createElement("span");return d.className="trio-label",d.textContent=c.name,Qp.appendChild(d),a.push(d),h});en={group:o,islands:l,items:r,labelEls:a,onSelect:s,resolved:!1}}function bb(r){if(!en||en.resolved)return;en.resolved=!0;const t=en.items[r],e=en.onSelect,n=en;n.islands.forEach((i,s)=>{s===r?Wn.to(i.scale,{x:2.6,y:2.6,z:2.6,duration:1.05,ease:"power2.inOut"}):(Wn.to(i.scale,{x:1e-4,y:1e-4,z:1e-4,duration:.65,ease:"power1.in"}),Wn.to(i.position,{x:i.position.x*2.4,y:i.position.y-2.4,duration:.65,ease:"power1.in"}))}),Rg.classList.remove("is-on"),na=-1,Wn.delayedCall(1,()=>{kn.remove(n.group),n.group.traverse(i=>{i.isMesh&&i.geometry.dispose()}),en===n&&(en=null),e(t.id)})}let Zi=!1,Ss=null,ds=null,Pl=null,Cc=!1,nn=[];const Ng="bulevar-diverso-muro";function wb(r){Zi=!0,Ss=r,Cc=!1;const t=Wh.find(e=>e.id===r)||Wh[0];if(hi.group.scale.x<.01&&(uo=t.startAngle,Wn.to(hi.group.scale,{x:1,y:1,z:1,duration:1.3,ease:"back.out(1.3)"})),Wn.to(fc,{enter:1,duration:1.4,ease:"power2.inOut"}),Dg.classList.add("is-on"),Yh.style.backgroundColor=`rgba(${GT[r].tint}, 1)`,Yh.classList.add("is-on"),Ls(),r==="rutas"){$h.textContent='Toca cualquier punto y usa "Agregar a ruta" para conectar tu recorrido',jp.innerHTML="";for(const e of VT){const n=document.createElement("li");n.className="world-item",n.style.setProperty("--c",e.color),n.innerHTML=`<strong>${e.name}</strong><span>${e.short}</span>`,jp.appendChild(n)}Cg.hidden=!1,qh.classList.add("is-on"),Wa()}else $h.textContent="Arrastra para girar el bulevar · Toca un punto para descubrirlo",qh.classList.remove("is-on"),td.classList.remove("is-on"),Ac.classList.remove("is-on")}function Wa(){tm.innerHTML="";for(const t of nn){const e=Zf.get(t);if(!e)continue;const n=document.createElement("li");n.textContent=e.name,tm.appendChild(n)}cb.hidden=nn.length>0,td.classList.toggle("is-on",Ss==="rutas");const r=nn.length>=2;routeUploadEl.disabled=!r,routeUploadEl.textContent=r?"Subir mi ruta al muro":`Agrega ${2-nn.length} punto${nn.length===1?"":"s"} más para subirla`,Ac.classList.toggle("is-on",Ss==="rutas"&&r)}function Ab(r){const t=Zf.get(r);if(!t)return;ds=r;const e=hi.pins.find(i=>i.userData.id===r);e&&(Fo=-Math.atan2(e.position.x,e.position.z)),uc.style.setProperty("--c",t.color),nb.textContent=t.tag,ib.textContent=t.name,rb.textContent=t.short,So.hidden=!1;const n=nn.includes(r);So.classList.toggle("is-added",n),So.textContent=n?"✓ En tu ruta":"+ Agregar a ruta",uc.classList.add("is-on")}function Ls(){ds=null,Fo=null,uc.classList.remove("is-on")}function Xa(){Pg.classList.remove("is-on")}eb.addEventListener("click",Ls);sb.addEventListener("click",Ls);ob.addEventListener("click",()=>{Ls(),Xa()});So.addEventListener("click",()=>{if(!ds)return;const r=nn.indexOf(ds);r>=0?nn.splice(r,1):nn.push(ds),Qf(nn),Wa();const t=nn.includes(ds);So.classList.toggle("is-added",t),So.textContent=t?"✓ En tu ruta":"+ Agregar a ruta"});ab.addEventListener("click",Xa);lb.addEventListener("click",Xa);jT.addEventListener("click",()=>{Cc=!0,Cg.hidden=!0,$h.textContent="Toca los puntos del bulevar para ir armando tu ruta",Ls(),Wa()});function Cb(r){const t=nn.indexOf(r);t>=0?nn.splice(t,1):nn.push(r),Qf(nn),Wa()}ub.addEventListener("click",()=>{nn=[],Cc=!0,Qf(nn),Wa()});function Fg(){try{return JSON.parse(localStorage.getItem(Ng))||[]}catch{return[]}}function Rb(r){const t=Fg();t.unshift(r);try{localStorage.setItem(Ng,JSON.stringify(t.slice(0,40)))}catch{}}function Pb(){const r=Fg();if(bu.innerHTML="",r.length===0){bu.innerHTML='<p class="wall-empty">Aún no hay rutas guardadas. ¡Sé el primero!</p>';return}for(const t of r){const e=document.createElement("article");e.className="wall-card",e.innerHTML=`<strong>${t.names.join(" → ")}</strong>${t.names.length} paradas`,bu.appendChild(e)}}function Og(){Pb(),ed.classList.add("is-on")}function id(){ed.classList.remove("is-on")}Ac.addEventListener("click",()=>{const r=nn.map(t=>{var e;return(e=Zf.get(t))==null?void 0:e.name}).filter(Boolean);r.length>=2&&Rb({names:r,date:Date.now()}),Og()});hb.addEventListener("click",id);pb.addEventListener("click",Og);function Bg(){id(),Xa(),Ls(),Ss=null,Dg.classList.remove("is-on"),qh.classList.remove("is-on"),Yh.classList.remove("is-on"),td.classList.remove("is-on"),Ac.classList.remove("is-on"),Zi=!1,Wn.to(fc,{enter:0,duration:1.1,ease:"power2.inOut"}),Wn.to(hi.group.scale,{x:1e-4,y:1e-4,z:1e-4,duration:.8,ease:"power1.in"}),zg()}fb.addEventListener("click",()=>{if(ed.classList.contains("is-on")){id();return}if(Pg.classList.contains("is-on")){Xa();return}if(uc.classList.contains("is-on")){Ls();return}Zi&&Bg()});db.addEventListener("click",()=>{Zi&&Bg()});mb.addEventListener("click",()=>{window.confirm("¿Reiniciar la experiencia desde el inicio?")&&window.location.reload()});function zg(){Tb(Wh,{x:Tg,y:cc},{eyebrow:"Aterrizaste en el bulevar",heading:"¿Por dónde quieres empezar?"},wb)}let uo=0,ps=0,Fo=null,Na=!1,rd=!1,Jh=0,Kh=0;mr.addEventListener("pointerdown",r=>{!Zi&&!en||(Na=!0,rd=!1,Jh=r.clientX,Kh=performance.now(),ps=0,mr.setPointerCapture(r.pointerId))});mr.addEventListener("pointermove",r=>{if(!Na)return;const t=r.clientX-Jh;Math.abs(t)>3&&(rd=!0);const e=performance.now(),n=Math.max(e-Kh,1)/1e3;if(Zi){const i=t/Le.width*Math.PI*1.6;uo+=i,ps=i/n,Fo=null}Jh=r.clientX,Kh=e});function nm(r,t,e){const n=new xt(r/Le.width*2-1,-(t/Le.height)*2+1);return co.setFromCamera(n,Ui),co.intersectObjects(e,!0)[0]||null}function kg(r){if(Na){Na=!1;try{mr.releasePointerCapture(r.pointerId)}catch{}if(!rd){if(en){const t=nm(r.clientX,r.clientY,en.islands);if(t){let e=t.object;for(;e&&e.userData.trioIndex===void 0;)e=e.parent;e&&bb(e.userData.trioIndex)}return}if(Zi){const t=nm(r.clientX,r.clientY,Hg());if(!t)return;const e=t.object.userData.pinRef.userData.id;Cc?Cb(e):Ab(e)}}}}function Hg(){return wg.filter(r=>r.userData.pinRef.visible)}mr.addEventListener("pointerup",kg);mr.addEventListener("pointercancel",kg);mr.addEventListener("wheel",r=>{Zi&&(r.preventDefault(),ps+=(r.deltaX+r.deltaY)*.0015,Fo=null)},{passive:!1});const wu=new N;function Au(r,t,e){return wu.set(r,t,e).project(Ui),{x:(wu.x*.5+.5)*Le.width,y:(-wu.y*.5+.5)*Le.height}}const im=new ax;let Dl=null,rm=0,Cu=0,Qr=0,Ll=2,sm=-1,om=!1;const Vg=()=>{const r=Math.min(im.getDelta(),.05),t=im.elapsedTime,e=_g?0:1;let n=0,i=0;const s=lo(Xt.reveal/.55);xi==="loading"?(n=Xt.loaderX,i=0):(n=Sg,i=vn(Xh,Kf,Xt.travel)-Xt.edge*xg,Xt.fall>0&&(i=vn(jf,lc,Xt.fall)),Xt.reveal>0&&(i=vn(lc,cc,WT(s))));const o=Xt.fall>0&&s<1,a=s>=1;Dl===null&&(Dl=i);const l=i-Dl;Dl=i;const c=n-rm;rm=n;const u=xi==="loading"?c:l,h=u/Math.max(r,.001),d=lo(Math.abs(h)/1);Qr=Sr(Qr,d,8,r),Cu+=Math.min(Math.abs(u)*4.5,.6);let f=xi==="loading"?-1.05:1.05;f=vn(f,0,Math.max(Xt.look,o?1:0,a?1:0)),Dn.root.rotation.y=Sr(Dn.root.rotation.y,f,6,r);let _=Qr>.3&&xi==="loading"?.05:-.05;Xt.look>0&&(_=vn(_,.42,Xt.look)),o&&(_=-.12),a&&(_=-.05),Dn.look.rotation.x=Sr(Dn.look.rotation.x,_,8,r);const g=o?1:0,m=Math.sin(Cu);Dn.legs[0].rotation.x=m*.65*Qr+Math.sin(t*16)*.45*g,Dn.legs[1].rotation.x=-m*.65*Qr-Math.sin(t*16)*.45*g;const p=hn(0,.12,Xt.fall)*(a?0:1);Dn.arms.forEach((R,K)=>{const pt=R.userData.side;R.rotation.x=(K===0?-m:m)*.5*Qr;const Ft=pt*(.35+p*2.3+Math.sin(t*14+K)*.2*g);R.rotation.z=Sr(R.rotation.z,Ft,12,r)});const M=Math.abs(Math.sin(Cu))*.07*Qr,x=Math.sin(t*2.2)*.015*e,v=Math.sin(lo((Xt.reveal-.5)/.25)*Math.PI)*.2;Dn.pivot.position.y=M,Dn.pivot.scale.set(1+v*.5,1+x-v,1+v*.5),Dn.root.rotation.z=Math.sin(t*7)*.12*g,Ll-=r;const b=Ll<.12;Ll<0&&(Ll=2.5+Math.random()*2.5);const A=1+hn(.2,.6,Xt.look)*.35*(o||a?.6:1);Dn.eyes.forEach(R=>{R.scale.set(A,b?.12:A,.45)}),Dn.sprout.rotation.z=Math.sin(t*3)*.08*e+Math.sin(t*20)*.3*g,Dn.root.position.set(n,i,Eu),Dn.root.visible=Xt.cover<.9,xi!=="loading"&&!o&&!a?(ls.visible=!0,ls.position.set(n,i-.5,Eu+.02),ls.material.opacity=.16,ls.scale.setScalar(.9)):ls.visible=!1;const E=Ga-Rs.scale.y*ea;$p.forEach((R,K)=>{const pt=i-Pr[K],Ft=hn(10,6,pt),$=lo((Pr[K]-E)/1.5);Tu[K]=xi==="loading"?0:Ft*$,R.scale.setScalar(Math.max(1e-4,qp(Tu[K]))),R.userData.knob.position.y=.06+Math.sin(t*2+K)*.04*e});const C=.9;let S=xi==="loading"?xn.offset:0,y=xi==="loading"?1.5:i-C*(1-Xt.edge*.4),D=(xi==="loading"?xn.dist:xn.readDist)*(1-.22*Xt.edge),U=xi==="loading"?.9:1.3;const z=hn(0,.5,Xt.fall);U=vn(U,7.5,z),D=vn(D,xn.readDist*1.35,z);const B=hn(0,.85,Xt.reveal);y=vn(y,cc-.6,B),D=vn(D,xn.trioDist,B),U=vn(U,3.2,B);const k=hn(0,1,fc.enter);y=vn(y,bg,k),D=vn(D,xn.worldDist,k),U=vn(U,4.4,k),Ui.position.set(S,y+U,D),Ui.lookAt(S,y,0),kn.fog.near=D+6,kn.fog.far=D+42;for(const R of wc)R.userData.baseY!==void 0&&(R.position.y=R.userData.baseY+Math.sin(t*.5+R.userData.phase)*.2*e),R.userData.baseX!==void 0&&(R.position.x=R.userData.baseX+Math.sin(t*.15+R.userData.phase)*.6*e);!om&&Xt.reveal>.6&&(om=!0,zg()),Fo!==null?(uo=Sr(uo,Fo,4,r),ps=0):Na||(ps=Sr(ps,0,3,r),uo+=ps*r),hi.group.rotation.y=uo,hi.pins.forEach(R=>{const K=!Ss||Ss==="rutas"||Ss===R.userData.category;if(R.visible=K,!K)return;const pt=R.userData.id===ds,Ft=R.userData.id===Pl,$=nn.includes(R.userData.id),et=pt||$?1.4:Ft?1.15:1;R.userData.animScale=Sr(R.userData.animScale??1,et,10,r),R.scale.setScalar(R.userData.animScale),R.position.y=Math.sin(t*2+R.userData.phase)*.05*e,R.userData.ring.rotation.z=t*.5,R.userData.glow.material.opacity=.14+(pt||Ft||$?.2:0)+Math.sin(t*3+R.userData.phase)*.03}),Jp.style.opacity=Xt.intro*(1-hn(0,.035,Xt.travel)),Jp.style.transform=`translateY(${-Xt.travel*600}px)`,ZT.style.opacity=Xt.intro*(1-hn(0,.5,Xt.edge)),JT.style.transform=`scaleY(${Xt.travel})`;let H=-1,q=vg*.55;Pr.forEach((R,K)=>{const pt=Math.abs(R-i);pt<q&&(q=pt,H=K)}),Lg.forEach((R,K)=>{const pt=Tu[K];if(pt<.01||Xt.look>.99){R.el.style.opacity=0;return}const Ft=$p[K].userData.side,$=Au(Ft*yg,Pr[K]+.35,Mg),et=hn(-R.width*.3,R.width*.5,$.x)*hn(Le.width+R.width*.3,Le.width-R.width*.5,$.x);R.el.style.opacity=pt*et*(1-Xt.look),R.el.style.transform=`translate3d(${$.x-R.width/2}px, ${$.y-R.height-14+(1-pt)*24}px, 0)`;const ot=K===H;ot!==R.active&&(R.active=ot,R.el.classList.toggle("is-active",ot))}),H!==sm&&(vb.forEach((R,K)=>R.classList.toggle("is-on",K<=H)),sm=H);const G=hn(.25,.5,Xt.look)*(1-hn(0,.12,Xt.fall));if(Kp.style.opacity=G,G>0){const R=Au(n,i+2.05,Eu),K=.6+qp(hn(.25,.55,Xt.look))*.4;Kp.style.transform=`translate3d(${R.x-10}px, ${R.y-70}px, 0) scale(${K}) rotate(${Math.sin(t*10)*4}deg)`}const nt=Xt.cover>0&&Xt.reveal<1;if(Ag.style.visibility=nt?"visible":"hidden",nt){for(const R of Ig){const K=hn(0,1,(Xt.cover-R.delay)/.7),pt=hn(0,1,(Xt.reveal-R.delay*.6)/.8),Ft=R.tx*Le.width,$=R.ty*Le.height;let et=Ft,ot=$+(1-K)*Le.height*R.drop;et+=pt*R.side*Le.width*.95,ot-=pt*Le.height*.35;const rt=1+pt*.25;R.el.style.transform=`translate3d(${et-R.w/2}px, ${ot-R.h/2}px, 0) scale(${rt})`}KT.style.opacity=hn(.55,1,Xt.cover)*(1-hn(0,.3,Xt.reveal))}if(Rg.classList.toggle("is-on",!!en&&Xt.reveal>.55),na=-1,en){co.setFromCamera(dc,Ui);const R=co.intersectObjects(en.islands,!0)[0];if(R){let K=R.object;for(;K&&K.userData.trioIndex===void 0;)K=K.parent;K&&(na=K.userData.trioIndex)}en.islands.forEach((K,pt)=>{K.position.y=Zh[pt][1]+Math.sin(t*.9+pt*1.7)*.1*e;const Ft=na===pt?1:0;K.userData.hover=Sr(K.userData.hover,Ft,8,r);const $=K.scale.x;$>.5&&K.scale.setScalar($);const et=new N;K.getWorldPosition(et);const ot=Au(et.x,et.y+2.4,et.z),rt=en.labelEls[pt];rt.style.transform=`translate3d(${ot.x}px, ${ot.y}px, 0)`,rt.classList.toggle("is-on",!0)})}if(Pl=null,Zi&&fc.enter>.9&&!en){co.setFromCamera(dc,Ui);const R=co.intersectObjects(Hg())[0];R&&(Pl=R.object.userData.pinRef.userData.id)}mr.style.cursor=Pl||en&&na>=0?"pointer":Zi?"grab":"",hc.render(kn,Ui),window.requestAnimationFrame(Vg)};Vg();yb();
//# sourceMappingURL=index-B_eH9EIW.js.map
