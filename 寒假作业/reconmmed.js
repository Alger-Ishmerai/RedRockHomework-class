// 推荐歌单
fetch(`http://localhost:3000/personalized?limit=8`)
  .then(res => res.json())
  .then(res => {
    document.querySelector('.musiclist').innerHTML = res.result.map(item => {
      return `<div class="recommended-list" data-id="${item.id}"><img src="${item.picUrl}" alt="" class="recommended-picture" loading="lazy">
      <div class="recommended-view-count">
      <span class="iconfont icon-18erji-2 recommended-headphones"></span>${count(item.playCount)}
      </div>
      <p class="recommended-text">${item.name}</p>
      </div>`
    }).join('')
  })
toPlaylist('.musiclist', '.recommended-list')
// banner
let i = 0
let timer = null;
fetch(`http://localhost:3000/banner?type=0`)
  .then(res => res.json())
  .then(res => {
    //定时器函数
    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        document.querySelector('.icon-jiantouyou').click();
      }, 3000);
    }

    //渲染数据&清除和设置active dot的函数
    function setContent() {
      //dot
      document.querySelector('.dots .active').classList.remove('active')
      document.querySelector(`.dots .dot:nth-child(${i + 1})`).classList.add('active')
      //渲染数据
      return document.querySelector('.activity').innerHTML = res.banners.map((item, index) => {
        if (i && index >= 4) {
          return `<a href="${item.url}"><img src="${item.bigImageUrl}" class="photograph" loading="lazy"></a>`
        }
        else if (!i && index <= 3) {
          return `<a href="${item.url}"><img src="${item.bigImageUrl}" class="photograph" loading="lazy"></a>`
        }
      }).join('')
    }
    setContent()
    startTimer()

    //左箭头
    document.querySelector('.icon-jiantouzuo').addEventListener('click', () => {
      i--;
      if (i > 1) i = 0
      else if (i < 0) i = 1
      setContent()
      startTimer()
    })

    //右箭头
    document.querySelector('.icon-jiantouyou').addEventListener('click', () => {
      i++;
      if (i > 1) i = 0
      else if (i < 0) i = 1
      setContent()
      startTimer()
    });
  });


