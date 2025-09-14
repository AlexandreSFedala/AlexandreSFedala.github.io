// Navbar shrink
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if(window.scrollY > 80) navbar.classList.add('shrink');
  else navbar.classList.remove('shrink');
});

// Bubbles
const bubbleContainer = document.getElementById('bubbleContainer');
const bubbles = [];
const numBubbles = 25;

for(let i=0;i<numBubbles;i++){
  const bubble = document.createElement('div');
  bubble.className='bubble';
  bubble.style.width = bubble.style.height = `${30+Math.random()*20}px`;
  bubble.style.left = `${Math.random()*100}%`;
  bubble.style.bottom = `${-50-Math.random()*100}px`;
  bubble.style.opacity = 0.35;
  bubbleContainer.appendChild(bubble);
  bubbles.push({el:bubble, speed:1+Math.random()*2});
  
  // drag & scale on click
  bubble.addEventListener('mousedown', ()=>{
    bubble.style.transform='scale(1.5)';
    bubble.addEventListener('mouseup', ()=>{bubble.style.transform='scale(1)';}, {once:true});
  });
}

// Animate bubbles
function animate(){
  bubbles.forEach(b=>{
    const bottom = parseFloat(b.el.style.bottom);
    b.el.style.bottom = `${bottom + b.speed}px`;
    if(bottom > window.innerHeight) b.el.style.bottom = `${-50-Math.random()*100}px`;
  });
  requestAnimationFrame(animate);
}
animate();

