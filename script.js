let slideTimer = null;
let currentSlideIndex = 0;
const sliderWrap = document.querySelector(".photo-slider-wrap");


const memories = {
  "2026-10-10": { title: "A Beautiful Day In York", 
    text: "Finally explored the beautiful city of York with my friend. Both York Minster and The Shambles are absolutely stunning, though the wind is unbelievably strong..." ,
    images:["./image/10.11/01.jpg","./image/10.11/02.jpg","./image/10.11/03.jpg","./image/10.11/04.jpg","./image/10.11/05.jpg","./image/10.11/06.jpg","./image/10.11/07.jpg","./image/10.11/08.jpg","./image/10.11/09.jpg"]
    },
  "2026-10-11": { title: "Hospital....", 
    text: "Ugh, I haven’t had my period in ages, so I went to the hospital for an ultrasound today. Holding in urine was absolutely miserable...." ,
    images:["./image/10.11/10.jpg"]
  },
   
    "2026-10-12": { title: "A small, ordinary day", 
    text: "Coffee, notes, and a little time to myself. Nothing spectacular — still a day worth keeping." },
  "2026-10-15": { title: "A small, ordinary day", 
    text: "Coffee, notes, and a little time to myself. Nothing spectacular — still a day worth keeping." }

};
const grid = document.getElementById("calendar-grid");
const monthLabel = document.getElementById("month-label");
const memoryDate = document.getElementById("memory-date");
const memoryTitle = document.getElementById("memory-title");
const memoryText = document.getElementById("memory-text");
const memoryInner = document.querySelector(".memory-panel-inner");
let shownMonth = new Date(2026, 9, 1);
let selectedDay = null;
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function renderCalendar() {
  grid.innerHTML = "";
  monthLabel.textContent = `${monthNames[shownMonth.getMonth()]} ${shownMonth.getFullYear()}`;
  dayNames.forEach(name => {
    const el = document.createElement("div");
    el.className = "day-name";
    el.textContent = name;
    grid.appendChild(el);
  });
  const year = shownMonth.getFullYear(), month = shownMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    grid.appendChild(blank);
  }
for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const button = document.createElement("button");
    button.className = "day";
    button.textContent = day;
    button.type = "button";
    button.setAttribute("aria-label", dateKey);

    // 只有有记忆才高亮 has‑memory，但是【所有日期都绑定点击】
    if (memories[dateKey]) {
      button.classList.add("has-memory");
      button.title = "View memory";
    }else{
      button.title = "No memory for this day";
    }
    // ✅每一天都可以点击
 button.addEventListener("click", () => {
  // 第一步：关掉动画，全部变回透明
  memoryInner.classList.remove("show");

  // 等待动画完全结束（和CSS最长过渡时间保持一致 500ms）
  setTimeout(() => {
    // 这时已经完全透明了，再更新内容
    showMemory(dateKey, button);

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        memoryInner.classList.add("show");
      })
    });
  }, 500);
});



    if (dateKey === selectedDay) button.classList.add("selected");
    grid.appendChild(button);
  }

}
function showMemory(dateKey, button) {
  selectedDay = dateKey;
 
  if(slideTimer) clearInterval(slideTimer);
  slideTimer = null;
  currentSlideIndex = 0;
  sliderWrap.innerHTML = ""; //清空旧图片
  // 判断这一天有没有记忆
  const memory = memories[dateKey];

  memoryDate.textContent = dateKey;
  if(memory){
    memoryTitle.textContent = memory.title;
    memoryText.textContent = memory.text;
  const imgList = memory.images || [];
    if(imgList.length > 0){
      imgList.forEach((src,idx)=>{
        const img = document.createElement("img");
        img.src = src;
        img.alt="memory photo";
if(idx === 0) img.classList.add("active-slide");

        sliderWrap.appendChild(img);
      });

      // 自动轮播，每3秒切换一张
      slideTimer = setInterval(()=>{
        const allImgs = sliderWrap.querySelectorAll("img");
        if(allImgs.length ===0) return;
        // 移除当前active
        allImgs[currentSlideIndex].classList.remove("active-slide");
        currentSlideIndex = (currentSlideIndex +1) % allImgs.length;
        allImgs[currentSlideIndex].classList.add("active-slide");
      },3000);
    }
  }else{
    // 没有记忆的日子，展示提示文案
    memoryTitle.textContent = "No note for this day";
    memoryText.textContent = "Nothing was written on this date. Pick another date with memory mark.";
  }

  document.querySelectorAll(".day.selected").forEach(el => el.classList.remove("selected"));
  button.classList.add("selected");
  // ❗删掉了滚动跳转代码，不再自动滚动
}

document.getElementById("prev-month").addEventListener("click", () => {
  shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() - 1, 1);
  memoryInner.classList.remove("show");
  renderCalendar();
});
document.getElementById("next-month").addEventListener("click", () => {
  shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1);
  memoryInner.classList.remove("show");
  renderCalendar();
});

document.querySelector(".menu-toggle").addEventListener("click", () => document.querySelector(".nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => document.querySelector(".nav").classList.remove("open")));
renderCalendar();
