const header = document.querySelector('header');
const bubbles = [];

function createBubble(){
  const bubble = document.createElement('div');
  bubble.style.position='absolute';
  bubble.style.borderRadius='50%';
  bubble.style.width=bubble.style.height=Math.random()*50+20+'px';
  bubble.style.background='rgba(255,255,255,'+Math.random()*0.3+')';
  bubble.style.left=Math.random()*window.innerWidth+'px';
  bubble.style.top=Math.random()*window.innerHeight+'px';
  bubble.style.pointerEvents='none';
  header.appendChild(bubble);
  bubbles.push(bubble);
}
for(let i=0;i<20;i++) createBubble();

function animateBubbles(){
  bubbles.forEach(b=>{
    let top=parseFloat(b.style.top);
    top-=0.2;
    if(top<-50) top=window.innerHeight+50;
    b.style.top=top+'px';
  });
  requestAnimationFrame(animateBubbles);
}
animateBubbles();
