// OneStop SmartCart prototype — CEN207 Assessment 2
// Demonstrates a simplified flow addressing product uncertainty, checkout friction,
// hidden costs, forced account creation, delivery uncertainty and order tracking.

const products=[
{id:1,name:"Nova X Phone",category:"Electronics",price:899,icon:"📱",rating:"4.6/5",features:["6.5-inch OLED display","256 GB storage","48 MP camera"]},
{id:2,name:"Pulse Pro Headphones",category:"Electronics",price:249,icon:"🎧",rating:"4.7/5",features:["Noise cancellation","30-hour battery","USB-C fast charging"]},
{id:3,name:"FlexFit Jacket",category:"Apparel",price:129,icon:"🧥",rating:"4.5/5",features:["Water-resistant fabric","Recycled polyester","Relaxed fit"]}
];

const state={cart:[],compare:new Set(),delivery:"standard",trackingStage:1};
const deliveryOptions={standard:{label:"Standard",price:6.95,etaDays:[4,6]},express:{label:"Express",price:14.95,etaDays:[1,2]}};
const $=id=>document.getElementById(id);
const money=v=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(v);

function renderProducts(){
  $("productGrid").innerHTML=products.map(p=>`<article class="product-card"><div class="product-image">${p.icon}</div><p class="eyebrow">${p.category}</p><h3>${p.name}</h3><p class="price">${money(p.price)}</p><ul class="features">${p.features.map(f=>`<li>${f}</li>`).join("")}</ul><div class="card-actions"><label class="compare-check"><input type="checkbox" data-compare="${p.id}">Compare</label><button class="primary" data-add="${p.id}">Add to cart</button></div></article>`).join("");
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.add))));
  document.querySelectorAll("[data-compare]").forEach(i=>i.addEventListener("change",()=>i.checked?state.compare.add(Number(i.dataset.compare)):state.compare.delete(Number(i.dataset.compare))));
}

function addToCart(id){state.cart.push(products.find(p=>p.id===id));updateSummary();}

function showComparison(){
  const selected=products.filter(p=>state.compare.has(p.id));
  if(selected.length<2){alert("Select at least two products to compare.");return;}
  $("compareContent").innerHTML=`<table class="compare-table"><thead><tr><th>Feature</th>${selected.map(p=>`<th>${p.name}</th>`).join("")}</tr></thead><tbody><tr><td>Price</td>${selected.map(p=>`<td>${money(p.price)}</td>`).join("")}</tr><tr><td>Rating</td>${selected.map(p=>`<td>${p.rating}</td>`).join("")}</tr><tr><td>Key features</td>${selected.map(p=>`<td>${p.features.join("<br>")}</td>`).join("")}</tr></tbody></table>`;
  $("comparePanel").classList.remove("hidden");$("comparePanel").scrollIntoView({behavior:"smooth"});
}

function deliveryEstimate(){
  const o=deliveryOptions[state.delivery],s=new Date(),e=new Date();s.setDate(s.getDate()+o.etaDays[0]);e.setDate(e.getDate()+o.etaDays[1]);
  const f=d=>d.toLocaleDateString("en-AU",{day:"numeric",month:"short"});return `${f(s)} – ${f(e)}`;
}

function updateSummary(){
  const subtotal=state.cart.reduce((sum,i)=>sum+i.price,0),shipping=deliveryOptions[state.delivery].price;
  $("cartCount").textContent=state.cart.length;$("subtotal").textContent=money(subtotal);$("shipping").textContent=money(shipping);$("total").textContent=money(subtotal+shipping);
  $("summaryItems").innerHTML=state.cart.length?state.cart.map(i=>`<div class="summary-item"><span>${i.name}</span><strong>${money(i.price)}</strong></div>`).join(""):`<p class="muted">Your cart is empty.</p>`;
  $("eta").textContent=`Estimated delivery: ${deliveryEstimate()} (${deliveryOptions[state.delivery].label})`;
}

function placeOrder(e){
  e.preventDefault();if(!state.cart.length){alert("Add at least one product before placing an order.");return;}
  const name=$("fullName").value.trim(),payment=document.querySelector('input[name="payment"]:checked').value,order=`OS-${Math.floor(100000+Math.random()*900000)}`;
  $("confirmationText").textContent=`Thanks ${name}. Order ${order} was placed using ${payment}. Estimated delivery is ${deliveryEstimate()}.`;
  $("confirmation").classList.remove("hidden");$("confirmation").scrollIntoView({behavior:"smooth"});
}

function advanceTracking(){
  const steps=document.querySelectorAll(".tracking-step");state.trackingStage=Math.min(state.trackingStage+1,steps.length-1);
  steps.forEach((step,index)=>{step.classList.remove("complete","active");if(index<state.trackingStage)step.classList.add("complete");if(index===state.trackingStage)step.classList.add("active");});
}

$("compareButton").addEventListener("click",showComparison);$("closeCompare").addEventListener("click",()=>$("comparePanel").classList.add("hidden"));
document.querySelectorAll('input[name="delivery"]').forEach(i=>i.addEventListener("change",()=>{state.delivery=i.value;updateSummary();}));
$("checkoutForm").addEventListener("submit",placeOrder);$("demoAdvance").addEventListener("click",advanceTracking);$("cartButton").addEventListener("click",()=>document.querySelector(".order-summary").scrollIntoView({behavior:"smooth"}));
renderProducts();updateSummary();
