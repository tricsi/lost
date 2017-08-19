function SfxrParams(){this.setSettings=function(e){for(var t=0;t<24;t++)this[String.fromCharCode(97+t)]=e[t]||0;this.c<.01&&(this.c=.01);var s=this.b+this.c+this.e;if(s<.18){var r=.18/s;this.b*=r,this.c*=r,this.e*=r}}}function SfxrSynth(){this._params=new SfxrParams;var e,t,s,r,i,a,h,n,o,c,f,d;this.reset=function(){var e=this._params;r=100/(e.f*e.f+.001),i=100/(e.g*e.g+.001),a=1-e.h*e.h*e.h*.01,h=-e.i*e.i*e.i*1e-6,e.a||(f=.5-e.n/2,d=5e-5*-e.o),n=1+e.l*e.l*(e.l>0?-.9:10),o=0,c=1==e.m?0:(1-e.m)*(1-e.m)*2e4+32},this.totalReset=function(){this.reset();var r=this._params;return e=r.b*r.b*1e5,t=r.c*r.c*1e5,s=r.e*r.e*1e5+12,3*((e+t+s)/3|0)},this.synthWave=function(w,m){var p=this._params,l=1!=p.s||p.v,u=p.v*p.v*.1,x=1+3e-4*p.w,y=p.s*p.s*p.s*.1,v=1+1e-4*p.t,b=1!=p.s,g=p.x*p.x,G=p.g,k=p.q||p.r,S=p.r*p.r*p.r*.2,P=p.q*p.q*(p.q<0?-1020:1020),V=p.p?32+((1-p.p)*(1-p.p)*2e4|0):0,q=p.d,C=p.j/2,A=p.k*p.k*.01,B=p.a,R=e,j=1/e,I=1/t,U=1/s,E=5/(1+p.u*p.u*20)*(.01+y);E>.8&&(E=.8),E=1-E;for(var L,M,_,H,W,D,z=!1,F=0,J=0,K=0,N=0,O=0,Q=0,T=0,X=0,Y=0,Z=0,$=new Array(1024),ee=new Array(32),te=$.length;te--;)$[te]=0;for(te=ee.length;te--;)ee[te]=2*Math.random()-1;for(te=0;te<m;te++){if(z)return te;if(V&&++Y>=V&&(Y=0,this.reset()),c&&++o>=c&&(c=0,r*=n),a+=h,(r*=a)>i&&(r=i,G>0&&(z=!0)),M=r,C>0&&(Z+=A,M*=1+Math.sin(Z)*C),(M|=0)<8&&(M=8),B||((f+=d)<0?f=0:f>.5&&(f=.5)),++J>R)switch(J=0,++F){case 1:R=t;break;case 2:R=s}switch(F){case 0:K=J*j;break;case 1:K=1+2*(1-J*I)*q;break;case 2:K=1-J*U;break;case 3:K=0,z=!0}k&&((_=0|(P+=S))<0?_=-_:_>1023&&(_=1023)),l&&x&&((u*=x)<1e-5?u=1e-5:u>.1&&(u=.1)),D=0;for(var se=8;se--;){if(++T>=M&&(T%=M,3==B))for(var re=ee.length;re--;)ee[re]=2*Math.random()-1;switch(B){case 0:W=T/M<f?.5:-.5;break;case 1:W=1-T/M*2;break;case 2:W=.225*(((W=1.27323954*(H=6.28318531*((H=T/M)>.5?H-1:H))+.405284735*H*H*(H<0?1:-1))<0?-1:1)*W*W-W)+W;break;case 3:W=ee[Math.abs(32*T/M|0)]}l&&(L=Q,(y*=v)<0?y=0:y>.1&&(y=.1),b?(O+=(W-Q)*y,O*=E):(Q=W,O=0),N+=(Q+=O)-L,W=N*=1-u),k&&($[X%1024]=W,W+=$[(X-_+1024)%1024],X++),D+=W}D*=.125*K*g,w[te]=D>=1?32767:D<=-1?-32768:32767*D|0}return m}}var synth=new SfxrSynth,jsfxr=function(e){synth._params.setSettings(e);var t=synth.totalReset(),s=new Uint8Array(4*((t+1)/2|0)+44),r=2*synth.synthWave(new Uint16Array(s.buffer,44),t),i=new Uint32Array(s.buffer,0,44);i[0]=1179011410,i[1]=r+36,i[2]=1163280727,i[3]=544501094,i[4]=16,i[5]=65537,i[6]=44100,i[7]=88200,i[8]=1048578,i[9]=1635017060,i[10]=r,r+=44;for(var a=0,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n="data:audio/wav;base64,";a<r;a+=3){var o=s[a]<<16|s[a+1]<<8|s[a+2];n+=h[o>>18]+h[o>>12&63]+h[o>>6&63]+h[63&o]}return n};"function"==typeof require?module.exports=jsfxr:this.jsfxr=jsfxr;var Game;!function(e){class t{constructor(e,t,s){this.pos=e,this.w=t,this.h=s}test(e){return this.pos.x<e.pos.x+e.w&&this.pos.x+this.w>e.pos.x&&this.pos.y<e.pos.y+e.h&&this.h+this.pos.y>e.pos.y}intersect(s){let r=this.pos.x,i=this.pos.y,a=r+this.w,h=i+this.h,n=s.pos.x,o=s.pos.y,c=n+s.w,f=o+s.h,d=r<n?n:r,w=i<o?o:i,m=a<c?a:c,p=h<f?h:f;return new t(new e.Vec(d,w),m-d,p-w)}}e.Box=t}(Game||(Game={}));var Game;!function(e){class t{constructor(t,s,r){this.face=0,this.walk=!0,this.frame=1,this.sprite=r,this.speed=new e.Vec(0,1),this.box=new e.Box(new e.Vec(t,s),16,24)}render(e,t){let s=this.box,r=s.pos,i=r.x,a=r.y,h=s.w,n=s.h,o=this.face*n,c=this.walk,f=this.frame,d=this.sprite;c?(f=f<3?f:1,d.render(e,i,a,h,n,o,f+1)):(d.render(e,i,a,h,n,o,0),d.render(e,i,a,h,n,o,f+4)),r.x+s.w>t&&(i-=t,c?d.render(e,i,a,h,n,o,f+1):(d.render(e,i,a,h,n,o,0),d.render(e,i,a,h,n,o,f+4)))}update(e){e%8==0&&(this.walk?0!=this.speed.x&&(this.frame=++this.frame%4):this.frame=++this.frame%3)}}e.Hero=t}(Game||(Game={}));var Game;!function(e){class t{constructor(t,s,r,i){this.box=new e.Box(new e.Vec(t,s),r,i)}render(e,t){const s=this.box;e.fillStyle="#0ff",e.fillRect(s.pos.x,s.pos.y,s.w,s.h)}}e.Platform=t}(Game||(Game={}));var Game;!function(e){class t{constructor(t,s){this.tick=0,this.width=256,this.sprite=new e.Sprite(s),this.hero=new e.Hero(96,160,this.sprite.crop(t,0,0,112,48)),this.ship=new e.Ship(160,136,this.sprite.crop(t,0,88,48,48)),this.platforms=[new e.Platform(-50,0,350,16),new e.Platform(32,72,48,8),new e.Platform(120,96,32,8),new e.Platform(192,48,48,8),new e.Platform(-50,184,350,8)]}back(e){if(this.cache)return void e.drawImage(this.cache,0,0);let t=e.createLinearGradient(0,0,0,192);t.addColorStop(0,"#002"),t.addColorStop(1,"#224"),e.fillStyle=t,e.fillRect(0,0,e.canvas.width,e.canvas.height);for(let t=1;t<this.platforms.length;t++){let s=this.platforms[t].box,r=s.pos.x,i=s.pos.y,a=8;for(this.sprite.render(e,r,i,a,8,80,0);a<s.w-8;a+=8)this.sprite.render(e,r+a,i,8,8,80,1);this.sprite.render(e,r+a,i,8,8,80,2)}this.cache=new Image,this.cache.src=e.canvas.toDataURL()}render(e){this.back(e),this.ship.render(e),this.hero.render(e,this.width)}update(){let e=this.hero,t=e.speed,s=e.box.pos,r=s.clone(),i=!1;e.update(this.tick++),s.x+=t.x,s.x>this.width?s.x-=this.width:s.x<0&&(s.x+=this.width),this.platforms.forEach(t=>{t.box.test(e.box)&&(s.x=r.x)}),s.y+=t.y,this.platforms.forEach(a=>{a.box.test(e.box)&&(s.y=r.y,t.y>0&&(i=!0))}),e.walk=i}}e.Scene=t}(Game||(Game={}));var Game;!function(e){class t{constructor(t,s,r){this.sprite=r,this.boxes=[new e.Box(new e.Vec(t,s),16,16),new e.Box(new e.Vec(t,s+16),16,16),new e.Box(new e.Vec(t,s+32),16,16)]}render(e){this.boxes.forEach((t,s)=>{let r=t.pos,i=t.h*s;this.sprite.render(e,r.x,r.y,t.w,t.h,i,0)})}}e.Ship=t}(Game||(Game={}));var Game;!function(e){class t{constructor(e){this.img=e}render(e,t,s,r,i,a,h){e.drawImage(this.img,r*h,a,r,i,t,s,r,i)}crop(e,s,r,i,a,h=!1,n=!1){let o=new Image,c=e.canvas,f=c.width,d=c.height;return c.width=i,c.height=a,e.save(),e.translate(h?i:0,n?a:0),e.scale(h?-1:1,n?-1:1),e.drawImage(this.img,-s,-r),e.restore(),o.src=c.toDataURL(),c.width=f,c.height=d,new t(o)}}e.Sprite=t}(Game||(Game={}));var Game;!function(e){class t{constructor(e,t){this.x=e,this.y=t}clone(){return new t(this.x,this.y)}}e.Vec=t}(Game||(Game={}));var Game;!function(e){function t(e,t){return(t||document).querySelector(e)}function s(e,t,s){e.addEventListener(t,s,!1)}function r(){let e=document.body,t=e.clientWidth/e.clientHeight<h.width/h.height;h.style.width=t?"100%":"",h.style.height=t?"":"100%"}function i(){const e=o.hero;s(document,"keydown",t=>{let s=t.keyCode;38==s||87==s||119==s?e.speed.y=-1:37==s||65==s||97==s?(e.speed.x=-1,e.face=0):39!=s&&68!=s&&100!=s||(e.speed.x=1,e.face=1)}),s(document,"keyup",t=>{let s=t.keyCode;38==s||87==s||119==s||40==s||83==s||115==s?e.speed.y=1:37!=s&&65!=s&&97!=s&&39!=s&&68!=s&&100!=s||(e.speed.x=0)}),s(window,"resize",r)}function a(){requestAnimationFrame(()=>{a()}),o.update(),o.render(n)}let h,n,o;s(window,"load",()=>{const s=t("#sprite");h=t("#game"),n=h.getContext("2d"),o=new e.Scene(n,s),i(),r(),a()})}(Game||(Game={}));