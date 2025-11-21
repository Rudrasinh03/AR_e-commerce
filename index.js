const scene = document.querySelector("a-scene");
const motion = document.getElementById("motionCard");
const status = document.getElementById("status");
const sound = document.getElementById("sound");
const card = document.getElementById("parallaxCard");

const discountBtn = document.getElementById("discountBtn");

// Fixed discount code & percentage
const DISCOUNT_CODE = "RUDRA10";
const DISCOUNT_PERCENT = 10;

// Random time limits (in hours)
const timeVariants = [48, 24, 20, 2]; // 2d, 1d, 20h, 2h
const randomHours = timeVariants[Math.floor(Math.random() * timeVariants.length)];
const STORAGE_KEY = "rudra_discount_expiry";

// AR detection events
scene.addEventListener("targetFound", () => {
  status.innerText = "✨ Experience Activated";
  motion.style.display = "flex";
  sound.play();
});

scene.addEventListener("targetLost", () => {
  status.innerText = "📷 Target lost";
  motion.style.display = "none";
});

// Parallax card effect
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
});

// Show discount popup
discountBtn.addEventListener("click", () => {
  // Calculate expiry timestamp
  const now = new Date().getTime();
  const expiryTime = now + randomHours * 60 * 60 * 1000; // in ms
  localStorage.setItem(STORAGE_KEY, expiryTime);

  // Create popup element
  const discountPopup = document.createElement("div");
  discountPopup.style.position = "fixed";
  discountPopup.style.top = "50%";
  discountPopup.style.left = "50%";
  discountPopup.style.transform = "translate(-50%,-50%)";
  discountPopup.style.background = "#fffbe6";
  discountPopup.style.border = "2px solid #d4af37";
  discountPopup.style.borderRadius = "20px";
  discountPopup.style.padding = "30px";
  discountPopup.style.textAlign = "center";
  discountPopup.style.zIndex = "4000";
  discountPopup.style.boxShadow = "0 20px 50px rgba(0,0,0,.3)";
  discountPopup.style.animation = "popupAnim 0.5s ease-out forwards";

  discountPopup.innerHTML = `
    <h2>🎉 Discount Unlocked!</h2>
    <p>Use Code: <b>${DISCOUNT_CODE}</b> & Get <b>${DISCOUNT_PERCENT}% OFF</b>!</p>
    <p id="timeLimit" style="font-size:18px;color:#4b3b22;margin-bottom:20px;">Time left: calculating...</p>
    <div style="margin-top:10px;">
      <button id="reviewBtn" style="
        padding:10px 20px;
        margin-right:10px;
        border:none;
        border-radius:50px;
        background:#8b6b00;
        color:#fff;
        cursor:pointer;
        font-weight:600;
      ">Leave Review</button>
      <button id="continueShopBtn" style="
        padding:10px 20px;
        margin-left:10px;
        border:none;
        border-radius:50px;
        background:#d4af37;
        color:#fff;
        cursor:pointer;
        font-weight:600;
      ">Continue Shopping</button>
    </div>
    <button id="closePopup" style="
      margin-top:15px;
      padding:10px 25px;
      border:none;
      border-radius:50px;
      background:#b8860b;
      color:#fff;
      cursor:pointer;
      font-weight:600;
    ">Cancel</button>
  `;

  document.body.appendChild(discountPopup);

  // Countdown timer
  const timeElem = discountPopup.querySelector("#timeLimit");
  const countdown = setInterval(() => {
    const now = new Date().getTime();
    let distance = expiryTime - now;

    if(distance <= 0){
      clearInterval(countdown);
      timeElem.innerText = "⏰ Discount Expired!";
    } else {
      const hours = Math.floor((distance % (24*60*60*1000)) / (1000*60*60));
      const minutes = Math.floor((distance % (60*60*1000)) / (1000*60));
      const seconds = Math.floor((distance % (60*1000)) / 1000);
      timeElem.innerText = `Time left: ${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);

  // Close popup
  discountPopup.querySelector("#closePopup").addEventListener("click", () => {
    discountPopup.remove();
    clearInterval(countdown);
  });

  // Review button
  discountPopup.querySelector("#reviewBtn").addEventListener("click", () => {
    window.open("https://example.com/review", "_blank");
  });

  // Continue Shopping button
  discountPopup.querySelector("#continueShopBtn").addEventListener("click", () => {
    window.location.href = `https://example.com/shop?discount=${DISCOUNT_CODE}`;
  });

  discountBtn.style.display = "none"; // hide discount button after tap
});

// Parallax popup animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes popupAnim{
0%{transform:translate(-50%,-50%) scale(0.5);opacity:0}
100%{transform:translate(-50%,-50%) scale(1);opacity:1}
}`;
document.head.appendChild(styleSheet);
