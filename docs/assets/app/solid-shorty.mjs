var J=Object.defineProperty,Z=Object.defineProperties;var ee=Object.getOwnPropertyDescriptors;var L=Object.getOwnPropertySymbols;var te=Object.prototype.hasOwnProperty,ne=Object.prototype.propertyIsEnumerable;var $=(e,t,n)=>t in e?J(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,q=(e,t)=>{for(var n in t||(t={}))te.call(t,n)&&$(e,n,t[n]);if(L)for(var n of L(t))ne.call(t,n)&&$(e,n,t[n]);return e},F=(e,t)=>Z(e,ee(t));var m={};function I(e){m.context=e}function re(){return F(q({},m.context),{id:`${m.context.id}${m.context.count++}-`,count:0})}var se=(e,t)=>e===t,ke=Symbol("solid-proxy"),Ce=Symbol("solid-track"),Ee=Symbol("solid-dev-component"),x={equals:se},j=null,ie=_,a=1,h=2,oe={owned:null,cleanups:null,context:null,owner:null};var l=null,s=null,b=null,C=null,u=null,c=null,d=null,A=0,[ve,V]=D(!1);function D(e,t){t=t?Object.assign({},x,t):x;let n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},r=i=>(typeof i=="function"&&(s&&s.running&&s.sources.has(n)?i=i(n.tValue):i=i(n.value)),G(n,i));return[B.bind(n),r]}function R(e,t,n){let r=U(e,t,!1,a);b&&s&&s.running?c.push(r):k(r)}function E(e,t,n){n=n?Object.assign({},x,n):x;let r=U(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,b&&s&&s.running?(r.tState=a,c.push(r)):k(r),B.bind(r)}function p(e){let t=u;u=null;try{return e()}finally{u=t}}function le(e){return l===null||(l.cleanups===null?l.cleanups=[e]:l.cleanups.push(e)),e}function ue(e){if(s&&s.running)return e(),s.done;let t=u,n=l;return Promise.resolve().then(()=>{u=t,l=n;let r;return(b||ae)&&(r=s||(s={sources:new Set,effects:[],promises:new Set,disposed:new Set,queue:new Set,running:!0}),r.done||(r.done=new Promise(i=>r.resolve=i)),r.running=!0),g(e,!1),u=l=null,r?r.done:void 0})}function ce(e,t){let n=Symbol("context");return{id:n,Provider:me(n),defaultValue:e}}function fe(e){let t=E(e),n=E(()=>v(t()));return n.toArray=()=>{let r=n();return Array.isArray(r)?r:r!=null?[r]:[]},n}var ae;function B(){let e=s&&s.running;if(this.sources&&(!e&&this.state||e&&this.tState))if(!e&&this.state===a||e&&this.tState===a)k(this);else{let t=c;c=null,g(()=>S(this),!1),c=t}if(u){let t=this.observers?this.observers.length:0;u.sources?(u.sources.push(this),u.sourceSlots.push(t)):(u.sources=[this],u.sourceSlots=[t]),this.observers?(this.observers.push(u),this.observerSlots.push(u.sources.length-1)):(this.observers=[u],this.observerSlots=[u.sources.length-1])}return e&&s.sources.has(this)?this.tValue:this.value}function G(e,t,n){let r=s&&s.running&&s.sources.has(e)?e.tValue:e.value;if(!e.comparator||!e.comparator(r,t)){if(s){let i=s.running;(i||!n&&s.sources.has(e))&&(s.sources.add(e),e.tValue=t),i||(e.value=t)}else e.value=t;e.observers&&e.observers.length&&g(()=>{for(let i=0;i<e.observers.length;i+=1){let o=e.observers[i],f=s&&s.running;f&&s.disposed.has(o)||((f&&!o.tState||!f&&!o.state)&&(o.pure?c.push(o):d.push(o),o.observers&&K(o)),f?o.tState=a:o.state=a)}if(c.length>1e6)throw c=[],new Error},!1)}return t}function k(e){if(!e.fn)return;y(e);let t=l,n=u,r=A;u=l=e,H(e,s&&s.running&&s.sources.has(e)?e.tValue:e.value,r),s&&!s.running&&s.sources.has(e)&&queueMicrotask(()=>{g(()=>{s&&(s.running=!0),u=l=e,H(e,e.tValue,r),u=l=null},!1)}),u=n,l=t}function H(e,t,n){let r;try{r=e.fn(t)}catch(i){e.pure&&(s&&s.running?e.tState=a:e.state=a),Y(i)}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?G(e,r,!0):s&&s.running&&e.pure?(s.sources.add(e),e.tValue=r):e.value=r,e.updatedAt=n)}function U(e,t,n,r=a,i){let o={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:l,context:null,pure:n};if(s&&s.running&&(o.state=0,o.tState=r),l===null||l!==oe&&(s&&s.running&&l.pure?l.tOwned?l.tOwned.push(o):l.tOwned=[o]:l.owned?l.owned.push(o):l.owned=[o]),C){let[f,w]=D(void 0,{equals:!1}),P=C(o.fn,w);le(()=>P.dispose());let Q=()=>ue(w).then(()=>M.dispose()),M=C(o.fn,Q);o.fn=N=>(f(),s&&s.running?M.track(N):P.track(N))}return o}function T(e){let t=s&&s.running;if(!t&&e.state===0||t&&e.tState===0)return;if(!t&&e.state===h||t&&e.tState===h)return S(e);if(e.suspense&&p(e.suspense.inFallback))return e.suspense.effects.push(e);let n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<A);){if(t&&s.disposed.has(e))return;(!t&&e.state||t&&e.tState)&&n.push(e)}for(let r=n.length-1;r>=0;r--){if(e=n[r],t){let i=e,o=n[r+1];for(;(i=i.owner)&&i!==o;)if(s.disposed.has(i))return}if(!t&&e.state===a||t&&e.tState===a)k(e);else if(!t&&e.state===h||t&&e.tState===h){let i=c;c=null,g(()=>S(e,n[0]),!1),c=i}}}function g(e,t){if(c)return e();let n=!1;t||(c=[]),d?n=!0:d=[],A++;try{let r=e();return de(n),r}catch(r){c||(d=null),Y(r)}}function de(e){if(c&&(b&&s&&s.running?he(c):_(c),c=null),e)return;let t;if(s){if(!s.promises.size&&!s.queue.size){let r=s.sources,i=s.disposed;d.push.apply(d,s.effects),t=s.resolve;for(let o of d)"tState"in o&&(o.state=o.tState),delete o.tState;s=null,g(()=>{for(let o of i)y(o);for(let o of r){if(o.value=o.tValue,o.owned)for(let f=0,w=o.owned.length;f<w;f++)y(o.owned[f]);o.tOwned&&(o.owned=o.tOwned),delete o.tValue,delete o.tOwned,o.tState=0}V(!1)},!1)}else if(s.running){s.running=!1,s.effects.push.apply(s.effects,d),d=null,V(!0);return}}let n=d;d=null,n.length&&g(()=>ie(n),!1),t&&t()}function _(e){for(let t=0;t<e.length;t++)T(e[t])}function he(e){for(let t=0;t<e.length;t++){let n=e[t],r=s.queue;r.has(n)||(r.add(n),b(()=>{r.delete(n),g(()=>{s.running=!0,T(n)},!1),s&&(s.running=!1)}))}}function S(e,t){let n=s&&s.running;n?e.tState=0:e.state=0;for(let r=0;r<e.sources.length;r+=1){let i=e.sources[r];i.sources&&(!n&&i.state===a||n&&i.tState===a?i!==t&&T(i):(!n&&i.state===h||n&&i.tState===h)&&S(i,t))}}function K(e){let t=s&&s.running;for(let n=0;n<e.observers.length;n+=1){let r=e.observers[n];(!t&&!r.state||t&&!r.tState)&&(t?r.tState=h:r.state=h,r.pure?c.push(r):d.push(r),r.observers&&K(r))}}function y(e){let t;if(e.sources)for(;e.sources.length;){let n=e.sources.pop(),r=e.sourceSlots.pop(),i=n.observers;if(i&&i.length){let o=i.pop(),f=n.observerSlots.pop();r<i.length&&(o.sourceSlots[f]=r,i[r]=o,n.observerSlots[r]=f)}}if(s&&s.running&&e.pure){if(e.tOwned){for(t=0;t<e.tOwned.length;t++)y(e.tOwned[t]);delete e.tOwned}W(e,!0)}else if(e.owned){for(t=0;t<e.owned.length;t++)y(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}s&&s.running?e.tState=0:e.state=0,e.context=null}function W(e,t){if(t||(e.tState=0,s.disposed.add(e)),e.owned)for(let n=0;n<e.owned.length;n++)W(e.owned[n])}function ge(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function Y(e){e=ge(e);let t=j&&X(l,j);if(!t)throw e;for(let n of t)n(e)}function X(e,t){return e?e.context&&e.context[t]!==void 0?e.context[t]:X(e.owner,t):void 0}function v(e){if(typeof e=="function"&&!e.length)return v(e());if(Array.isArray(e)){let t=[];for(let n=0;n<e.length;n++){let r=v(e[n]);Array.isArray(r)?t.push.apply(t,r):t.push(r)}return t}return e}function me(e,t){return function(r){let i;return R(()=>i=p(()=>(l.context={[e]:r.value},fe(()=>r.children))),void 0),i}}var Ae=Symbol("fallback");var pe=!1;function O(e,t){if(pe&&m.context){let n=m.context;I(re());let r=p(()=>e(t||{}));return I(n),r}return p(()=>e(t||{}))}var Te=ce();var ye=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],De=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...ye]);function z(e,t,n){let r=document.createElement("template");r.innerHTML=e;let i=r.content.firstChild;return n&&(i=i.firstChild),i}import{render as we}from"https://esm.sh/solid-js/web";var be=z("<div>The solidify shortcode is active!</div>",2);function xe(){return be.cloneNode(!0)}we(()=>O(xe,{}),document.getElementById("shorty"));
