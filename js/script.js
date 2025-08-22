const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const PRODUCTS = [
  {id:"sw1", name:"Cotton Candy Crew", price:159000, image:"assets/svg/sweater1.svg", badge:"Best Seller"},
  {id:"sw2", name:"Baby Blue Cardigan", price:189000, image:"assets/svg/sweater3.svg", badge:"Hot"},
  {id:"sw3", name:"Blush Zip Sweater", price:209000, image:"assets/svg/sweater5.svg", badge:"Limited"},
  {id:"sw4", name:"Pastel Breeze Hoodie", price:199000, image:"assets/svg/sweater2.svg"},
  {id:"sw5", name:"Cloudy Knit Pullover", price:179000, image:"assets/svg/sweater4.svg"},
];
const currency = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);

const CART_KEY="sws_cart_v1";
const loadCart=()=>JSON.parse(localStorage.getItem(CART_KEY)||"[]");
const saveCart=c=>localStorage.setItem(CART_KEY,JSON.stringify(c));
const addToCart=id=>{const c=loadCart();const it=c.find(i=>i.id===id);if(it)it.qty++;else c.push({id,qty:1});saveCart(c);renderCartBadge();toast("Ditambahkan ke keranjang");};
const removeFromCart=id=>{const c=loadCart().filter(i=>i.id!==id);saveCart(c);renderCart();renderCartBadge();};
const changeQty=(id,d)=>{const c=loadCart();const it=c.find(i=>i.id===id);if(!it)return;it.qty+=d;if(it.qty<=0)return removeFromCart(id);saveCart(c);renderCart();renderCartBadge();};
const cartTotal=()=>loadCart().reduce((s,i)=>{const p=PRODUCTS.find(p=>p.id===i.id);return s+(p?p.price*i.qty:0)},0);
function renderCartBadge(){const count=loadCart().reduce((n,i)=>n+i.qty,0);const b=$(".cart-btn .badge");if(b)b.textContent=count;}

function renderProducts(){
  const wrap=$("#products");
  wrap.innerHTML = PRODUCTS.map(p=>`
    <article class="card" aria-label="${p.name}">
      <div class="media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="body">
        ${p.badge?`<span class="badge-pill">${p.badge}</span>`:""}
        <h3>${p.name}</h3>
        <div class="price">${currency(p.price)}</div>
        <div class="actions">
          <button class="add" data-id="${p.id}">+ Keranjang</button>
          <button class="buy" data-id="${p.id}">Checkout</button>
        </div>
      </div>
    </article>
  `).join("");
  $$("#products .add").forEach(b=>b.addEventListener("click",e=>addToCart(e.currentTarget.dataset.id)));
  $$("#products .buy").forEach(b=>b.addEventListener("click",e=>{ addToCart(e.currentTarget.dataset.id); openCart(); }));
}

function renderSlider(){
  $(".slider-track").innerHTML = PRODUCTS.slice(0,5).map(p=>`
    <div class="slide" aria-label="${p.name}">
      <div class="visual"><img src="${p.image}" alt="${p.name}"></div>
      <div class="copy">
        <span class="badge-pill">Terlaris</span>
        <h3>${p.name}</h3>
        <p>Look manis ala Korea dengan palet baby pink & baby blue yang lembut.</p>
        <div class="price">${currency(p.price)}</div>
        <div class="actions">
          <button class="add" data-id="${p.id}">+ Keranjang</button>
          <button class="buy" data-id="${p.id}">Checkout</button>
        </div>
      </div>
    </div>
  `).join("");
  bindActionButtons($(".slider"));
}
function bindActionButtons(root){
  $$(".add", root).forEach(b=>b.addEventListener("click",e=>addToCart(e.currentTarget.dataset.id)));
  $$(".buy", root).forEach(b=>b.addEventListener("click",e=>{ addToCart(e.currentTarget.dataset.id); openCart(); }));
}

let currentSlide=0;
function slideTo(i){const t=$(".slider-track");const total=PRODUCTS.slice(0,5).length;currentSlide=(i+total)%total;t.style.transform=`translateX(-${currentSlide*100}%)`;}
function nextSlide(){slideTo(currentSlide+1)}; function prevSlide(){slideTo(currentSlide-1)};

/* Cart drawer */
function openCart(){ $("#cart").showModal(); renderCart(); }
function closeCart(){ $("#cart").close(); }
function renderCart(){
  const body=$("#cart-items"); const cart=loadCart();
  if(cart.length===0){ body.innerHTML="<p>Keranjang kosong.</p>"; }
  else{
    body.innerHTML = cart.map(i=>{ const p=PRODUCTS.find(p=>p.id===i.id); if(!p) return ""; return `
      <div class="row" style="display:flex;gap:.6rem;align-items:center;justify-content:space-between;padding:.4rem 0;border-bottom:1px dashed #e5e7eb">
        <div style="display:flex;gap:.6rem;align-items:center">
          <img src="${p.image}" width="40" height="40" alt="">
          <div><div style="font-weight:800">${p.name}</div><div>${currency(p.price)}</div></div>
        </div>
        <div style="display:flex;gap:.4rem;align-items:center">
          <button aria-label="Kurangi" onclick="changeQty('${i.id}',-1)">−</button>
          <span aria-live="polite">${i.qty}</span>
          <button aria-label="Tambah" onclick="changeQty('${i.id}',1)">+</button>
          <button onclick="removeFromCart('${i.id}')">Hapus</button>
        </div>
      </div>`; }).join("");
  }
  $("#cart-total").textContent = currency(cartTotal());
}
function checkout(){
  if(loadCart().length===0){ toast("Keranjang masih kosong"); return; }
  toast("Checkout berhasil (simulasi). Kami akan menghubungi via WhatsApp!");
  localStorage.removeItem(CART_KEY); renderCart(); renderCartBadge();
}

/* Toast */
let toastTimer;
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),1800); }

/* Testimonials */
const T_KEY="sws_testi_v1";
const loadT=()=>JSON.parse(localStorage.getItem(T_KEY)||"[]");
const saveT=a=>localStorage.setItem(T_KEY,JSON.stringify(a));
const defaultT=[
  {name:"Lia", rating:5, text:"Bahannya lembut bgt, warna pastel gemes!"},
  {name:"Dio", rating:4, text:"Fit-nya pas, pengiriman cepat. Mantap."},
  {name:"Mira", rating:5, text:"Style Korea vibes dapet, suka banget."}
];
function ensureDefaultT(){ if(loadT().length===0) saveT(defaultT); }
function renderTestimonials(){
  const list=$("#testimonials"); const all=loadT();
  list.innerHTML = all.map(t=>`
    <div class="testimonial">
      <div class="name">${t.name}</div>
      <div class="rating">${"★".repeat(t.rating)}${"☆".repeat(5-t.rating)}</div>
      <p>${t.text}</p>
    </div>`).join("");
}
function handleSubmitTesti(e){
  e.preventDefault();
  const name=$("#t-name").value.trim()||"Anonim";
  const rating=+$("#t-rating").value||5;
  const text=$("#t-text").value.trim();
  if(!text){ toast("Tulis testimonimu dulu ya"); return; }
  const all=loadT(); all.unshift({name,rating,text}); saveT(all);
  $("#t-form").reset(); renderTestimonials(); toast("Terima kasih untuk testimoninya!");
}

/* Feedback */
function handleSubmitFeedback(e){
  e.preventDefault();
  const name=$("#f-name").value.trim()||"Anonim";
  const message=$("#f-message").value.trim();
  if(!message){ toast("Isi kritik/saran ya"); return; }
  const FB_KEY="sws_feedback_v1";
  const all=JSON.parse(localStorage.getItem(FB_KEY)||"[]");
  all.push({name,message,at:new Date().toISOString()});
  localStorage.setItem(FB_KEY, JSON.stringify(all));
  $("#f-form").reset(); toast("Terima kasih untuk masukannya!");
}

/* Init */
document.addEventListener("DOMContentLoaded",()=>{
  renderProducts(); renderSlider(); ensureDefaultT(); renderTestimonials(); renderCartBadge();
  $("#next").addEventListener("click", nextSlide);
  $("#prev").addEventListener("click", prevSlide);
  $("#open-cart").addEventListener("click", openCart);
  $("#close-cart").addEventListener("click", closeCart);
  $("#checkout").addEventListener("click", checkout);
  $("#t-form").addEventListener("submit", handleSubmitTesti);
  $("#f-form").addEventListener("submit", handleSubmitFeedback);
  setInterval(nextSlide, 5000);
});