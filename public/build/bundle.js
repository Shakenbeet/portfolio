var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function s(t){t.forEach(n)}function a(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let l;function i(t,e){return l||(l=document.createElement("a")),l.href=e,t===l.href}function c(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function u(t){return null==t?"":t}const p="undefined"!=typeof window;let d=p?()=>window.performance.now():()=>Date.now(),m=p?t=>requestAnimationFrame(t):t;const f=new Set;function g(t){f.forEach((e=>{e.c(t)||(f.delete(e),e.f())})),0!==f.size&&m(g)}function h(t,e){t.appendChild(e)}function $(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function y(t){const e=v("style");return function(t,e){h(t.head||t,e)}($(t),e),e.sheet}function w(t,e,n){t.insertBefore(e,n||null)}function b(t){t.parentNode.removeChild(t)}function v(t){return document.createElement(t)}function C(t){return document.createTextNode(t)}function x(){return C(" ")}function k(){return C("")}function j(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function B(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function W(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function L(t,e,n,o){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function T(t,e,n){t.classList[n?"add":"remove"](e)}function I(t,e,{bubbles:n=!1,cancelable:o=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,o,e),s}const O=new Map;let P,D=0;function N(t,e,n,o,s,a,r,l=0){const i=16.666/o;let c="{\n";for(let t=0;t<=1;t+=i){const o=e+(n-e)*a(t);c+=100*t+`%{${r(o,1-o)}}\n`}const u=c+`100% {${r(n,1-n)}}\n}`,p=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${l}`,d=$(t),{stylesheet:m,rules:f}=O.get(d)||function(t,e){const n={stylesheet:y(e),rules:{}};return O.set(t,n),n}(d,t);f[p]||(f[p]=!0,m.insertRule(`@keyframes ${p} ${u}`,m.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${p} ${o}ms linear ${s}ms 1 both`,D+=1,p}function M(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),s=n.length-o.length;s&&(t.style.animation=o.join(", "),D-=s,D||m((()=>{D||(O.forEach((t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}})),O.clear())})))}function E(t){P=t}function _(){if(!P)throw new Error("Function called outside component initialization");return P}function S(t,e){return _().$$.context.set(t,e),e}const H=[],A=[],G=[],F=[],z=Promise.resolve();let R=!1;function V(t){G.push(t)}const U=new Set;let q,Y=0;function J(){const t=P;do{for(;Y<H.length;){const t=H[Y];Y++,E(t),K(t.$$)}for(E(null),H.length=0,Y=0;A.length;)A.pop()();for(let t=0;t<G.length;t+=1){const e=G[t];U.has(e)||(U.add(e),e())}G.length=0}while(H.length);for(;F.length;)F.pop()();R=!1,U.clear(),E(t)}function K(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(V)}}function Z(t,e,n){t.dispatchEvent(I(`${e?"intro":"outro"}${n}`))}const X=new Set;let Q;function tt(){Q={r:0,c:[],p:Q}}function et(){Q.r||s(Q.c),Q=Q.p}function nt(t,e){t&&t.i&&(X.delete(t),t.i(e))}function ot(t,e,n,o){if(t&&t.o){if(X.has(t))return;X.add(t),Q.c.push((()=>{X.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const st={duration:0};function at(n,o,r,l){let i=o(n,r),c=l?0:1,u=null,p=null,h=null;function $(){h&&M(n,h)}function y(t,e){const n=t.b-c;return e*=Math.abs(n),{a:c,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function w(o){const{delay:a=0,duration:r=300,easing:l=e,tick:w=t,css:b}=i||st,v={start:d()+a,b:o};o||(v.group=Q,Q.r+=1),u||p?p=v:(b&&($(),h=N(n,c,o,r,a,l,b)),o&&w(0,1),u=y(v,r),V((()=>Z(n,o,"start"))),function(t){let e;0===f.size&&m(g),new Promise((n=>{f.add(e={c:t,f:n})}))}((t=>{if(p&&t>p.start&&(u=y(p,r),p=null,Z(n,u.b,"start"),b&&($(),h=N(n,c,u.b,u.duration,0,l,i.css))),u)if(t>=u.end)w(c=u.b,1-c),Z(n,u.b,"end"),p||(u.b?$():--u.group.r||s(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;c=u.a+u.d*l(e/u.duration),w(c,1-c)}return!(!u&&!p)})))}return{run(t){a(i)?(q||(q=Promise.resolve(),q.then((()=>{q=null}))),q).then((()=>{i=i(),w(t)})):w(t)},end(){$(),u=p=null}}}const rt="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function lt(t){t&&t.c()}function it(t,e,o,r){const{fragment:l,on_mount:i,on_destroy:c,after_update:u}=t.$$;l&&l.m(e,o),r||V((()=>{const e=i.map(n).filter(a);c?c.push(...e):s(e),t.$$.on_mount=[]})),u.forEach(V)}function ct(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ut(t,e){-1===t.$$.dirty[0]&&(H.push(t),R||(R=!0,z.then(J)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function pt(e,n,a,r,l,i,c,u=[-1]){const p=P;E(e);const d=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:l,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(p?p.$$.context:[])),callbacks:o(),dirty:u,skip_bound:!1,root:n.target||p.$$.root};c&&c(d.root);let m=!1;if(d.ctx=a?a(e,n.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return d.ctx&&l(d.ctx[t],d.ctx[t]=s)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](s),m&&ut(e,t)),n})):[],d.update(),m=!0,s(d.before_update),d.fragment=!!r&&r(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(b)}else d.fragment&&d.fragment.c();n.intro&&nt(e.$$.fragment),it(e,n.target,n.anchor,n.customElement),J()}E(p)}class dt{$destroy(){ct(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function mt(e){let n;return{c(){n=v("div"),n.innerHTML='<a href="#home"><h3 class="svelte-chgos3">Home</h3></a> \n    <a href="#about"><h3 class="svelte-chgos3">About</h3></a> \n    <a href="#work"><h3 class="svelte-chgos3">Applications</h3></a> \n    <a href="#games"><h3 class="svelte-chgos3">Games</h3></a> \n    <a href="#contact"><h3 class="svelte-chgos3">Contact</h3></a>',B(n,"class","navbar svelte-chgos3")},m(t,e){w(t,n,e)},p:t,i:t,o:t,d(t){t&&b(n)}}}class ft extends dt{constructor(t){super(),pt(this,t,null,mt,r,{})}}function gt(e){let n;return{c(){n=v("div"),n.innerHTML='<h1 class="copyrightText">Copyright © 2022 Luke Gobin</h1> \n\n    <a href="https://github.com/Shakenbeet" style="text-decoration: none;"><button>Visit My Github Profile</button></a> \n    <a href="mailto:luke.gobin1@icloud.com" style="text-decoration: none;"><button>Send an E-Mail</button></a>',B(n,"class","footer svelte-z1peg0"),B(n,"id","contact")},m(t,e){w(t,n,e)},p:t,i:t,o:t,d(t){t&&b(n)}}}class ht extends dt{constructor(t){super(),pt(this,t,null,gt,r,{})}}function $t(e){let n,o,s,a,r,l,c,u,p,d,m,f,g,$;return{c(){n=v("div"),o=v("h2"),s=C(e[0]),a=x(),r=v("img"),u=x(),p=v("p"),d=C(e[2]),m=x(),f=v("a"),g=v("button"),$=C(e[4]),i(r.src,l=e[1])||B(r,"src",l),B(r,"alt",c="image of "+e[0]+"'s logo"),B(r,"class","svelte-m69z29"),B(f,"href",e[3]),B(n,"class","Project")},m(t,e){w(t,n,e),h(n,o),h(o,s),h(n,a),h(n,r),h(n,u),h(n,p),h(p,d),h(n,m),h(n,f),h(f,g),h(g,$)},p(t,[e]){1&e&&W(s,t[0]),2&e&&!i(r.src,l=t[1])&&B(r,"src",l),1&e&&c!==(c="image of "+t[0]+"'s logo")&&B(r,"alt",c),4&e&&W(d,t[2]),16&e&&W($,t[4]),8&e&&B(f,"href",t[3])},i:t,o:t,d(t){t&&b(n)}}}function yt(t,e,n){let{projectName:o="Github Project"}=e,{projectImage:s="VC.png"}=e,{projectDesc:a="Description of this Project"}=e,{projectLink:r=""}=e,{buttonText:l="View on Github"}=e;return t.$$set=t=>{"projectName"in t&&n(0,o=t.projectName),"projectImage"in t&&n(1,s=t.projectImage),"projectDesc"in t&&n(2,a=t.projectDesc),"projectLink"in t&&n(3,r=t.projectLink),"buttonText"in t&&n(4,l=t.buttonText)},[o,s,a,r,l]}class wt extends dt{constructor(t){super(),pt(this,t,yt,$t,r,{projectName:0,projectImage:1,projectDesc:2,projectLink:3,buttonText:4})}}function bt(t,{delay:n=0,duration:o=400,easing:s=e}={}){const a=+getComputedStyle(t).opacity;return{delay:n,duration:o,easing:s,css:t=>"opacity: "+t*a}}const{window:vt}=rt;function Ct(t){let e,n,o,r,l,i,c,p,d,m,f,g,$,y,C,k,W,L=t[1].closeButton&&xt(t);var I=t[2];return I&&(i=new I({})),{c(){e=v("div"),n=v("div"),o=v("div"),L&&L.c(),r=x(),l=v("div"),i&&lt(i.$$.fragment),B(l,"class",c=u(t[1].classContent)+" svelte-g4wg3a"),B(l,"style",t[9]),T(l,"content",!t[0]),B(o,"class",p=u(t[1].classWindow)+" svelte-g4wg3a"),B(o,"role","dialog"),B(o,"aria-modal","true"),B(o,"aria-label",d=t[1].ariaLabelledBy?null:t[1].ariaLabel||null),B(o,"aria-labelledby",m=t[1].ariaLabelledBy||null),B(o,"style",t[8]),T(o,"window",!t[0]),B(n,"class",g=u(t[1].classWindowWrap)+" svelte-g4wg3a"),B(n,"style",t[7]),T(n,"wrap",!t[0]),B(e,"class",$=u(t[1].classBg)+" svelte-g4wg3a"),B(e,"style",t[6]),T(e,"bg",!t[0])},m(s,c){w(s,e,c),h(e,n),h(n,o),L&&L.m(o,null),h(o,r),h(o,l),i&&it(i,l,null),t[48](o),t[49](n),t[50](e),C=!0,k||(W=[j(o,"introstart",(function(){a(t[13])&&t[13].apply(this,arguments)})),j(o,"outrostart",(function(){a(t[14])&&t[14].apply(this,arguments)})),j(o,"introend",(function(){a(t[15])&&t[15].apply(this,arguments)})),j(o,"outroend",(function(){a(t[16])&&t[16].apply(this,arguments)})),j(e,"mousedown",t[20]),j(e,"mouseup",t[21])],k=!0)},p(s,a){if((t=s)[1].closeButton?L?(L.p(t,a),2&a[0]&&nt(L,1)):(L=xt(t),L.c(),nt(L,1),L.m(o,r)):L&&(tt(),ot(L,1,1,(()=>{L=null})),et()),I!==(I=t[2])){if(i){tt();const t=i;ot(t.$$.fragment,1,0,(()=>{ct(t,1)})),et()}I?(i=new I({}),lt(i.$$.fragment),nt(i.$$.fragment,1),it(i,l,null)):i=null}(!C||2&a[0]&&c!==(c=u(t[1].classContent)+" svelte-g4wg3a"))&&B(l,"class",c),(!C||512&a[0])&&B(l,"style",t[9]),3&a[0]&&T(l,"content",!t[0]),(!C||2&a[0]&&p!==(p=u(t[1].classWindow)+" svelte-g4wg3a"))&&B(o,"class",p),(!C||2&a[0]&&d!==(d=t[1].ariaLabelledBy?null:t[1].ariaLabel||null))&&B(o,"aria-label",d),(!C||2&a[0]&&m!==(m=t[1].ariaLabelledBy||null))&&B(o,"aria-labelledby",m),(!C||256&a[0])&&B(o,"style",t[8]),3&a[0]&&T(o,"window",!t[0]),(!C||2&a[0]&&g!==(g=u(t[1].classWindowWrap)+" svelte-g4wg3a"))&&B(n,"class",g),(!C||128&a[0])&&B(n,"style",t[7]),3&a[0]&&T(n,"wrap",!t[0]),(!C||2&a[0]&&$!==($=u(t[1].classBg)+" svelte-g4wg3a"))&&B(e,"class",$),(!C||64&a[0])&&B(e,"style",t[6]),3&a[0]&&T(e,"bg",!t[0])},i(n){C||(nt(L),i&&nt(i.$$.fragment,n),V((()=>{f||(f=at(o,t[12],t[1].transitionWindowProps,!0)),f.run(1)})),V((()=>{y||(y=at(e,t[11],t[1].transitionBgProps,!0)),y.run(1)})),C=!0)},o(n){ot(L),i&&ot(i.$$.fragment,n),f||(f=at(o,t[12],t[1].transitionWindowProps,!1)),f.run(0),y||(y=at(e,t[11],t[1].transitionBgProps,!1)),y.run(0),C=!1},d(n){n&&b(e),L&&L.d(),i&&ct(i),t[48](null),n&&f&&f.end(),t[49](null),t[50](null),n&&y&&y.end(),k=!1,s(W)}}}function xt(t){let e,n,o,s,a;const r=[jt,kt],l=[];function i(t,n){return 2&n[0]&&(e=null),null==e&&(e=!!t[17](t[1].closeButton)),e?0:1}return n=i(t,[-1,-1,-1]),o=l[n]=r[n](t),{c(){o.c(),s=k()},m(t,e){l[n].m(t,e),w(t,s,e),a=!0},p(t,e){let a=n;n=i(t,e),n===a?l[n].p(t,e):(tt(),ot(l[a],1,1,(()=>{l[a]=null})),et(),o=l[n],o?o.p(t,e):(o=l[n]=r[n](t),o.c()),nt(o,1),o.m(s.parentNode,s))},i(t){a||(nt(o),a=!0)},o(t){ot(o),a=!1},d(t){l[n].d(t),t&&b(s)}}}function kt(e){let n,o,s,a;return{c(){n=v("button"),B(n,"class",o=u(e[1].classCloseButton)+" svelte-g4wg3a"),B(n,"aria-label","Close modal"),B(n,"style",e[10]),T(n,"close",!e[0])},m(t,o){w(t,n,o),s||(a=j(n,"click",e[18]),s=!0)},p(t,e){2&e[0]&&o!==(o=u(t[1].classCloseButton)+" svelte-g4wg3a")&&B(n,"class",o),1024&e[0]&&B(n,"style",t[10]),3&e[0]&&T(n,"close",!t[0])},i:t,o:t,d(t){t&&b(n),s=!1,a()}}}function jt(t){let e,n,o;var s=t[1].closeButton;function a(t){return{props:{onClose:t[18]}}}return s&&(e=new s(a(t))),{c(){e&&lt(e.$$.fragment),n=k()},m(t,s){e&&it(e,t,s),w(t,n,s),o=!0},p(t,o){if(s!==(s=t[1].closeButton)){if(e){tt();const t=e;ot(t.$$.fragment,1,0,(()=>{ct(t,1)})),et()}s?(e=new s(a(t)),lt(e.$$.fragment),nt(e.$$.fragment,1),it(e,n.parentNode,n)):e=null}},i(t){o||(e&&nt(e.$$.fragment,t),o=!0)},o(t){e&&ot(e.$$.fragment,t),o=!1},d(t){t&&b(n),e&&ct(e,t)}}}function Bt(t){let e,n,o,s,a=t[2]&&Ct(t);const r=t[47].default,l=function(t,e,n,o){if(t){const s=c(t,e,n,o);return t[0](s)}}(r,t,t[46],null);return{c(){a&&a.c(),e=x(),l&&l.c()},m(r,i){a&&a.m(r,i),w(r,e,i),l&&l.m(r,i),n=!0,o||(s=j(vt,"keydown",t[19]),o=!0)},p(t,o){t[2]?a?(a.p(t,o),4&o[0]&&nt(a,1)):(a=Ct(t),a.c(),nt(a,1),a.m(e.parentNode,e)):a&&(tt(),ot(a,1,1,(()=>{a=null})),et()),l&&l.p&&(!n||32768&o[1])&&function(t,e,n,o,s,a){if(s){const r=c(e,n,o,a);t.p(r,s)}}(l,r,t,t[46],n?function(t,e,n,o){if(t[2]&&o){const s=t[2](o(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|s[o];return t}return e.dirty|s}return e.dirty}(r,t[46],o,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[46]),null)},i(t){n||(nt(a),nt(l,t),n=!0)},o(t){ot(a),ot(l,t),n=!1},d(t){a&&a.d(t),t&&b(e),l&&l.d(t),o=!1,s()}}}function Wt(t,e,n){let{$$slots:o={},$$scope:s}=e;const a=function(){const t=_();return(e,n,{cancelable:o=!1}={})=>{const s=t.$$.callbacks[e];if(s){const a=I(e,n,{cancelable:o});return s.slice().forEach((e=>{e.call(t,a)})),!a.defaultPrevented}return!0}}(),r=S;let{show:l=null}=e,{key:i="simple-modal"}=e,{ariaLabel:c=null}=e,{ariaLabelledBy:u=null}=e,{closeButton:p=!0}=e,{closeOnEsc:d=!0}=e,{closeOnOuterClick:m=!0}=e,{styleBg:f={}}=e,{styleWindowWrap:g={}}=e,{styleWindow:h={}}=e,{styleContent:$={}}=e,{styleCloseButton:y={}}=e,{classBg:w=null}=e,{classWindowWrap:b=null}=e,{classWindow:v=null}=e,{classContent:C=null}=e,{classCloseButton:x=null}=e,{unstyled:k=!1}=e,{setContext:j=r}=e,{transitionBg:B=bt}=e,{transitionBgProps:W={duration:250}}=e,{transitionWindow:L=B}=e,{transitionWindowProps:T=W}=e,{disableFocusTrap:O=!1}=e;const P={ariaLabel:c,ariaLabelledBy:u,closeButton:p,closeOnEsc:d,closeOnOuterClick:m,styleBg:f,styleWindowWrap:g,styleWindow:h,styleContent:$,styleCloseButton:y,classBg:w,classWindowWrap:b,classWindow:v,classContent:C,classCloseButton:x,transitionBg:B,transitionBgProps:W,transitionWindow:L,transitionWindowProps:T,disableFocusTrap:O,unstyled:k};let D,N,M,E,H,G,F,z,R,V,U,q,Y,J,K,Z={...P},X=null;const Q=t=>t?Object.keys(t).reduce(((e,n)=>`${e}; ${(t=>t.replace(/([a-zA-Z])(?=[A-Z])/g,"$1-").toLowerCase())(n)}: ${t[n]}`),""):"",tt=t=>!!(t&&t.constructor&&t.call&&t.apply),et=()=>{};let nt=et,ot=et,st=et,at=et;const rt=(t,e={},o={},s={})=>{n(2,X=function(t,e={}){return function(n){return new t({...n,props:{...e,...n.props}})}}(t,e)),n(1,Z={...P,...o}),n(6,H=Q(Object.assign({},{width:window.innerWidth,height:window.innerHeight},Z.styleBg))),n(7,G=Q(Z.styleWindowWrap)),n(8,F=Q(Z.styleWindow)),n(9,z=Q(Z.styleContent)),n(10,R=Q(Z.styleCloseButton)),n(11,V=Z.transitionBg),n(12,U=Z.transitionWindow),it(),n(13,nt=t=>{s.onOpen&&s.onOpen(t),a("open"),a("opening")}),n(14,ot=t=>{s.onClose&&s.onClose(t),a("close"),a("closing")}),n(15,st=t=>{s.onOpened&&s.onOpened(t),a("opened")}),n(16,at=t=>{s.onClosed&&s.onClosed(t),a("closed")})},lt=(t={})=>{X&&(n(14,ot=t.onClose||ot),n(16,at=t.onClosed||at),n(2,X=null),ct())},it=()=>{E=window.scrollY,q=document.body.style.position,Y=document.body.style.overflow,J=document.body.style.width,document.body.style.position="fixed",document.body.style.top=`-${E}px`,document.body.style.overflow="hidden",document.body.style.width="100%"},ct=()=>{document.body.style.position=q||"",document.body.style.top="",document.body.style.overflow=Y||"",document.body.style.width=J||"",window.scrollTo(0,E)};j(i,{open:rt,close:lt});let ut=!1;var pt;return pt=()=>{ut&&lt()},_().$$.on_destroy.push(pt),function(t){_().$$.on_mount.push(t)}((()=>{n(45,ut=!0)})),t.$$set=t=>{"show"in t&&n(22,l=t.show),"key"in t&&n(23,i=t.key),"ariaLabel"in t&&n(24,c=t.ariaLabel),"ariaLabelledBy"in t&&n(25,u=t.ariaLabelledBy),"closeButton"in t&&n(26,p=t.closeButton),"closeOnEsc"in t&&n(27,d=t.closeOnEsc),"closeOnOuterClick"in t&&n(28,m=t.closeOnOuterClick),"styleBg"in t&&n(29,f=t.styleBg),"styleWindowWrap"in t&&n(30,g=t.styleWindowWrap),"styleWindow"in t&&n(31,h=t.styleWindow),"styleContent"in t&&n(32,$=t.styleContent),"styleCloseButton"in t&&n(33,y=t.styleCloseButton),"classBg"in t&&n(34,w=t.classBg),"classWindowWrap"in t&&n(35,b=t.classWindowWrap),"classWindow"in t&&n(36,v=t.classWindow),"classContent"in t&&n(37,C=t.classContent),"classCloseButton"in t&&n(38,x=t.classCloseButton),"unstyled"in t&&n(0,k=t.unstyled),"setContext"in t&&n(39,j=t.setContext),"transitionBg"in t&&n(40,B=t.transitionBg),"transitionBgProps"in t&&n(41,W=t.transitionBgProps),"transitionWindow"in t&&n(42,L=t.transitionWindow),"transitionWindowProps"in t&&n(43,T=t.transitionWindowProps),"disableFocusTrap"in t&&n(44,O=t.disableFocusTrap),"$$scope"in t&&n(46,s=t.$$scope)},t.$$.update=()=>{4194304&t.$$.dirty[0]|16384&t.$$.dirty[1]&&ut&&(tt(l)?rt(l):lt())},[k,Z,X,D,N,M,H,G,F,z,R,V,U,nt,ot,st,at,tt,lt,t=>{if(Z.closeOnEsc&&X&&"Escape"===t.key&&(t.preventDefault(),lt()),X&&"Tab"===t.key&&!Z.disableFocusTrap){const e=M.querySelectorAll("*"),n=Array.from(e).filter((t=>t.tabIndex>=0));let o=n.indexOf(document.activeElement);-1===o&&t.shiftKey&&(o=0),o+=n.length+(t.shiftKey?-1:1),o%=n.length,n[o].focus(),t.preventDefault()}},t=>{!Z.closeOnOuterClick||t.target!==D&&t.target!==N||(K=t.target)},t=>{Z.closeOnOuterClick&&t.target===K&&(t.preventDefault(),lt())},l,i,c,u,p,d,m,f,g,h,$,y,w,b,v,C,x,j,B,W,L,T,O,ut,s,o,function(t){A[t?"unshift":"push"]((()=>{M=t,n(5,M)}))},function(t){A[t?"unshift":"push"]((()=>{N=t,n(4,N)}))},function(t){A[t?"unshift":"push"]((()=>{D=t,n(3,D)}))}]}class Lt extends dt{constructor(t){super(),pt(this,t,Wt,Bt,r,{show:22,key:23,ariaLabel:24,ariaLabelledBy:25,closeButton:26,closeOnEsc:27,closeOnOuterClick:28,styleBg:29,styleWindowWrap:30,styleWindow:31,styleContent:32,styleCloseButton:33,classBg:34,classWindowWrap:35,classWindow:36,classContent:37,classCloseButton:38,unstyled:0,setContext:39,transitionBg:40,transitionBgProps:41,transitionWindow:42,transitionWindowProps:43,disableFocusTrap:44},null,[-1,-1,-1])}}function Tt(e){let n,o,s,a,r;return{c(){n=v("h2"),o=C(e[0]),s=x(),a=v("p"),r=C(e[1])},m(t,e){w(t,n,e),h(n,o),w(t,s,e),w(t,a,e),h(a,r)},p(t,[e]){1&e&&W(o,t[0]),2&e&&W(r,t[1])},i:t,o:t,d(t){t&&b(n),t&&b(s),t&&b(a)}}}function It(t,e,n){let{title:o="About Project"}=e,{message:s="Lorem ipsum dolor sit amet"}=e;return t.$$set=t=>{"title"in t&&n(0,o=t.title),"message"in t&&n(1,s=t.message)},[o,s]}class Ot extends dt{constructor(t){super(),pt(this,t,It,Tt,r,{title:0,message:1})}}function Pt(e){let n,o,s,a;return{c(){n=v("button"),o=C(e[0])},m(t,r){w(t,n,r),h(n,o),s||(a=j(n,"click",e[1]),s=!0)},p(t,[e]){1&e&&W(o,t[0])},i:t,o:t,d(t){t&&b(n),s=!1,a()}}}function Dt(t,e,n){let{popupMessage:o="Lorem ipsum dolor sit amet"}=e,{popupTitle:s="Title"}=e,{buttonText:a="Project Flaws"}=e;const{open:r}=(l="simple-modal",_().$$.context.get(l));var l;return t.$$set=t=>{"popupMessage"in t&&n(2,o=t.popupMessage),"popupTitle"in t&&n(3,s=t.popupTitle),"buttonText"in t&&n(0,a=t.buttonText)},[a,()=>r(Ot,{title:s,message:o}),o,s]}class Nt extends dt{constructor(t){super(),pt(this,t,Dt,Pt,r,{popupMessage:2,popupTitle:3,buttonText:0})}}function Mt(t){let e,n;return e=new Nt({props:{popupMessage:t[0],popupTitle:"About",buttonText:"Learn More"}}),{c(){lt(e.$$.fragment)},m(t,o){it(e,t,o),n=!0},p(t,n){const o={};1&n&&(o.popupMessage=t[0]),e.$set(o)},i(t){n||(nt(e.$$.fragment,t),n=!0)},o(t){ot(e.$$.fragment,t),n=!1},d(t){ct(e,t)}}}function Et(t){let e,n;return e=new Lt({props:{$$slots:{default:[Mt]},$$scope:{ctx:t}}}),{c(){lt(e.$$.fragment)},m(t,o){it(e,t,o),n=!0},p(t,[n]){const o={};3&n&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(nt(e.$$.fragment,t),n=!0)},o(t){ot(e.$$.fragment,t),n=!1},d(t){ct(e,t)}}}function _t(t,e,n){let{msg:o="lorem ipsum dolor sit amet"}=e;return t.$$set=t=>{"msg"in t&&n(0,o=t.msg)},[o]}class St extends dt{constructor(t){super(),pt(this,t,_t,Et,r,{msg:0})}}function Ht(e){let n,o,s,a,r,l,c,u,p,d,m,f,g,$,y,C,k,j,W,T,I,O,P,D,N,M,E,_,S,H,A,G,F,z,R,V,U,q,Y,J,K,Z,X,Q,tt,et,st,at,rt,ut,pt,dt,mt,gt,$t,yt,bt,vt,Ct,xt,kt,jt,Bt,Wt,Lt,Tt,It,Ot,Pt,Dt,Nt,Mt,Et,_t,Ht,At,Gt;return o=new ft({}),q=new wt({props:{projectName:"Visual Code",projectDesc:"Visual Code is an application to help new programmers write C# code with ease.",projectImage:"VC.png",projectLink:"https://github.com/Shakenbeet/VisualCode"}}),J=new St({props:{msg:"When I started to learn how to program I always wanted to try and get friends and families to learn aswell, however programming proved to difficult for them. August of 2022"}}),Q=new wt({props:{projectName:"Image Resize",projectDesc:"Image Resize was made with the purpose of resizing multiple images quickly.",projectImage:"ImageResize.png",projectLink:"https://github.com/Shakenbeet/ImageResizeTool"}}),et=new St({props:{msg:"Image Resize replaces images it resizes, permanently deleting the original file. I have fallen victim to my own project's flaws many times, yet I still too lazy to fix it :)"}}),at=new wt({props:{projectName:"Nova Storefront",projectDesc:"My most successful application to date, Nova was a psuedo game-storefront.",projectImage:"Nova.png",buttonText:"Source not Available"}}),ut=new St({props:{msg:"Nova was written in raw HTML and preformance was terrible. A Desktop version was once available, it was a WPF app that used Cefsharp to connect to the Nova website. Games were difficult to download and play because of how challenging it was to use the Nova client."}}),yt=new wt({props:{projectName:"Snake Hunter",projectDesc:"Simple game where you shoot the snake for points, made with java in LibGDX",projectImage:"snake.png",buttonText:"Play On Web",projectLink:"https://shakenbeet.github.io/SnakeHunter/"}}),jt=new wt({props:{projectName:"Lucy Simulator",projectDesc:"Lucy Simulator is a small cult-classic 'franchise' of pet simulators where you take care of a dog named Lucy",projectImage:"lucy.png",buttonText:"Download Lucy Simulator 2019 (Nova)",projectLink:"http://nova-storefront.glitch.me/games/Lucy.html"}}),Wt=new St({props:{msg:"Lucy Simulator was a game I made on scratch in 2017 about my Grandma's dog, Lucy. The game was very popular among my friends and many unofficial spin-offs were made. Eventually I created an official sequel in Unity during 2019 for the Nova Launcher."}}),Tt=new wt({props:{projectName:"Flappuccino",projectDesc:"Flappuccino is a Unity remake of Polymars' game of the same name",projectImage:"flap.png",buttonText:"Download Flappuccino (Nova)",projectLink:"http://nova-storefront.glitch.me/games/Flap.html"}}),Dt=new wt({props:{projectName:"Unreal CubeBlaster",projectDesc:"Explode cubes with your exceptionally weird rifle or ride them, but at all costs don't get knocked off the platform!",projectImage:"blast.png",buttonText:"Download Unreal CubeBlaster (GameJolt)",projectLink:"https://gamejolt.com/games/CubeBlaster/469015"}}),Mt=new wt({props:{projectName:"Hobbit VideoGame",projectDesc:"A 'game' made for a school project about The Hobbit",projectImage:"hobbit.png",buttonText:"Download The Hobbit (Nova)",projectLink:"http://nova-storefront.glitch.me/games/Hobbit.html"}}),At=new ht({}),{c(){n=v("main"),lt(o.$$.fragment),s=x(),a=v("div"),a.innerHTML='<h1 class="title svelte-1i2itc6">Luke Gobin</h1> \n\t\t<p>an endless journey of spaghetti code</p>',r=x(),l=v("div"),c=v("h1"),c.textContent="About Me",u=x(),p=v("p"),p.textContent="My name is Luke Gobin and I'm from Houston. I'm proficient in C#, C++, and HTML but I am always open to learn new languages.",d=x(),m=v("img"),g=x(),$=v("h3"),$.textContent="When Did You Start Programming?",y=x(),C=v("h4"),C.textContent="I have no certain date of when I started programming, I think I started programming around 2016 and 2017",k=x(),j=v("h3"),j.textContent="How Did You Learn How to Program?",W=x(),T=v("h4"),T.textContent="I learned how to program using a HTML book I got for christmas one year, for all the other languages, I used W3Schools and StackOverflow",I=x(),O=v("h4"),O.textContent="I started programming with Scratch.mit.edu, a block-coding website, to make fun little games and animations.",P=x(),D=v("h4"),D.textContent="However, I started to realise the limitations of Scratch, so I started to learn HTML and C# using books and W3Schools",N=x(),M=v("h3"),M.textContent="What Are You Doing Now?",E=x(),_=v("h4"),_.textContent="Currently I am exploring the programming world, but my main interest is in game engines such as Unity.",S=x(),H=v("h3"),H.textContent="What Do You Want to Do in The Future?",A=x(),G=v("h4"),G.textContent="In the future I want to work in the game development industry, as a kid I always wanted to build games and now I am trying to make that dream a reality.",F=x(),z=v("h1"),z.textContent="My Applications",R=x(),V=v("h2"),V.textContent="Featured Project",U=x(),lt(q.$$.fragment),Y=x(),lt(J.$$.fragment),K=x(),Z=v("h2"),Z.textContent="Other Projects",X=x(),lt(Q.$$.fragment),tt=x(),lt(et.$$.fragment),st=x(),lt(at.$$.fragment),rt=x(),lt(ut.$$.fragment),pt=x(),dt=v("h1"),dt.textContent="My Games",mt=x(),gt=v("h2"),gt.textContent="Featured Game",$t=x(),lt(yt.$$.fragment),bt=x(),vt=v("a"),vt.innerHTML="<button>View on Github</button>",Ct=x(),xt=v("h2"),xt.textContent="Other Games",kt=x(),lt(jt.$$.fragment),Bt=x(),lt(Wt.$$.fragment),Lt=x(),lt(Tt.$$.fragment),It=x(),Ot=v("a"),Ot.innerHTML="<button>View on Github</button>",Pt=x(),lt(Dt.$$.fragment),Nt=x(),lt(Mt.$$.fragment),Et=x(),_t=v("a"),_t.innerHTML="<button>Alternate Download (GameJolt)</button>",Ht=x(),lt(At.$$.fragment),B(a,"class","banner svelte-1i2itc6"),B(c,"id","about"),B(c,"class","svelte-1i2itc6"),B(p,"class","textblock"),i(m.src,f="https://avatars.githubusercontent.com/u/68769498?v=4")||B(m,"src","https://avatars.githubusercontent.com/u/68769498?v=4"),L(m,"width","350px"),L(m,"height","350px"),B(m,"alt","My Profile Image from Github"),B($,"class","svelte-1i2itc6"),B(j,"class","svelte-1i2itc6"),B(M,"class","svelte-1i2itc6"),B(H,"class","svelte-1i2itc6"),B(z,"id","work"),B(z,"class","svelte-1i2itc6"),B(V,"class","svelte-1i2itc6"),B(Z,"class","svelte-1i2itc6"),B(dt,"id","games"),B(dt,"class","svelte-1i2itc6"),B(gt,"class","svelte-1i2itc6"),B(vt,"href","https://shakenbeet.github.io/SnakeHunter/"),B(xt,"class","svelte-1i2itc6"),B(Ot,"href","https://github.com/Shakenbeet/FlappuccinoUnity"),B(_t,"href","https://gamejolt.com/games/thehobbitvideogame/552429"),B(l,"class","content svelte-1i2itc6"),B(n,"class","svelte-1i2itc6")},m(t,e){w(t,n,e),it(o,n,null),h(n,s),h(n,a),h(n,r),h(n,l),h(l,c),h(l,u),h(l,p),h(l,d),h(l,m),h(l,g),h(l,$),h(l,y),h(l,C),h(l,k),h(l,j),h(l,W),h(l,T),h(l,I),h(l,O),h(l,P),h(l,D),h(l,N),h(l,M),h(l,E),h(l,_),h(l,S),h(l,H),h(l,A),h(l,G),h(l,F),h(l,z),h(l,R),h(l,V),h(l,U),it(q,l,null),h(l,Y),it(J,l,null),h(l,K),h(l,Z),h(l,X),it(Q,l,null),h(l,tt),it(et,l,null),h(l,st),it(at,l,null),h(l,rt),it(ut,l,null),h(l,pt),h(l,dt),h(l,mt),h(l,gt),h(l,$t),it(yt,l,null),h(l,bt),h(l,vt),h(l,Ct),h(l,xt),h(l,kt),it(jt,l,null),h(l,Bt),it(Wt,l,null),h(l,Lt),it(Tt,l,null),h(l,It),h(l,Ot),h(l,Pt),it(Dt,l,null),h(l,Nt),it(Mt,l,null),h(l,Et),h(l,_t),h(l,Ht),it(At,l,null),Gt=!0},p:t,i(t){Gt||(nt(o.$$.fragment,t),nt(q.$$.fragment,t),nt(J.$$.fragment,t),nt(Q.$$.fragment,t),nt(et.$$.fragment,t),nt(at.$$.fragment,t),nt(ut.$$.fragment,t),nt(yt.$$.fragment,t),nt(jt.$$.fragment,t),nt(Wt.$$.fragment,t),nt(Tt.$$.fragment,t),nt(Dt.$$.fragment,t),nt(Mt.$$.fragment,t),nt(At.$$.fragment,t),Gt=!0)},o(t){ot(o.$$.fragment,t),ot(q.$$.fragment,t),ot(J.$$.fragment,t),ot(Q.$$.fragment,t),ot(et.$$.fragment,t),ot(at.$$.fragment,t),ot(ut.$$.fragment,t),ot(yt.$$.fragment,t),ot(jt.$$.fragment,t),ot(Wt.$$.fragment,t),ot(Tt.$$.fragment,t),ot(Dt.$$.fragment,t),ot(Mt.$$.fragment,t),ot(At.$$.fragment,t),Gt=!1},d(t){t&&b(n),ct(o),ct(q),ct(J),ct(Q),ct(et),ct(at),ct(ut),ct(yt),ct(jt),ct(Wt),ct(Tt),ct(Dt),ct(Mt),ct(At)}}}return new class extends dt{constructor(t){super(),pt(this,t,null,Ht,r,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map