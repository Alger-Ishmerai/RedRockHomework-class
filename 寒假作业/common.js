//返回键
document.querySelector('.back').addEventListener('click', function () {
  if (document.referrer) {
    history.back()
  }
})

// 个人信息
const cookie = '005641A0AD9CB7E6219DB92DCE4FB375091D94355D49610CF46045A8A646A07FEC64DAF1FA9331713A0F9432B14575F57557AE4F648E01584B7F82C63D6921B13DCE791B46C7FE5479B8335EB8371EF5D91461FCC32109CDF14A3AD4A551794539F6CA809A73CE652FA36A1E140AC9101B7EFA70D59CCCBE7D985E7BD3E220F01281EDC94CD9AA5FB2148C78A5132BFAD2595873D3C42285EDB10F1716EB786C97FDA4D4F171692F2611384337C690338AC3D9AD74D71A195EF96F47EF0B6206A42C105681B2788F27166B19A174F2C4E4E1288F0B07F486300F8C1918F3BAF6BE7F5713FB8CC142C1761C6B1027A95AAF909855B37BF73259A55490CAE4CCC47A1748CB05B98AB5DC8969841D1AC65166A2073993CB80310DC57D44913336E4D3C1CCBC32B516673629C44B7049FF463EF97B05E373D2C665317F91BB605C641069B403774E18849A022E65606AAAD1575DF68C7ACB3013CE2DA47774ED0B3640CB0F4671C91AC2BE4F24D4D05B72BF45785AEEBC661E60C864BCC2CFB8DF446D7FB4C769A5D95AA8538675A1C487B61B'
const uid = 1363802529




//封装函数
// 万字
function count(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num
}
//补零函数
function padZero(num) {
  return num < 10 ? '0' + num : num.toString()
}
//处理时间戳，结果没用上555
function timestamp(timestamp, keepZero = false) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}年${month}月${day}日`
}
//处理秒数为分秒
function Time(seconds) {
  seconds = Math.floor(seconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
//点击歌单跳转 需要父盒子('.class')和子盒子('.class')所含有的独特属性,并确保子盒子有data-id
function toPlaylist(fclass, sclass) {
  document.querySelector(fclass).addEventListener('click', async function (e) {
    const item = e.target.closest(sclass)
    if (item) {
      const id = item.dataset.id
      window.location.href = `./playmusic.html?id=${id}`
    }
  })
}
//点击歌曲进入具体歌曲界面，需要盒子'.class'，盒子需要有data-ids属性
const audio = document.querySelector('.audio')
const playBtn = document.querySelector('.pause')
// 设置了开关，非常巧妙的东西
let Switch = false
//加载底部音乐框，并记载现在播放的音乐的index
let indexNow = -1
let songsNumber = 0
function toAudio(Class) {
  document.querySelectorAll(Class).forEach(ev => {
    ev.addEventListener('click', async function (e) {
      //渲染底部
      const item = e.target.closest(Class)
      indexNow = parseInt(item.dataset.index)
      const res = await fetch(`http://localhost:3000/song/detail?ids=${item.dataset.ids}`)
      const data = await res.json()
      const Url = await fetch(`http://localhost:3000/song/url?id=${item.dataset.ids}&uid=${uid}&cookie=${cookie}`)
      const url = await Url.json()
      document.querySelector('.audio-picture').src = `${data.songs[0].al.picUrl}`
      document.querySelector('.audio-song').innerHTML = `${data.songs[0].name}`
      document.querySelector('.audio-picture').style.display = 'block'
      audio.src = `${url.data[0].url}`
      //暂停按钮的切换
      playBtn.classList.remove('icon-zanting1')
      playBtn.classList.add('icon-zanting')
      document.querySelector('.time').style.display = 'block'
      //渲染展开歌曲界面
      //痛恨正则表达式ing
      const Lyric = await fetch(`http://localhost:3000/lyric?id=${item.dataset.ids}`)
      const lyric = await Lyric.json()
      const lyricsList = analysisLrics(lyric.lrc.lyric)

      document.querySelector('.curtain').innerHTML = `<img src="${data.songs[0].al.picUrl}" class="curtain-picture" loading="lazy">
    <div class="curtain-name">${data.songs[0].name}</div>
    <div class="curtain-album">专辑：${data.songs[0].al.name}album</div>
    <div class="curtain-singer">歌手：${data.songs[0].ar[0].name}</div>
    <div class="curtain-lyric">${lyricsList[0]?.text || '暂无歌词'}</div>`
      //重新加载退回进度条
      slider.style.left = '0px';
      progress.style.width = '0px';
      //这一段差点给我写死，解决进度条自动走的问题
      //先移除旧的监听器
      audio.onloadedmetadata = null
      audio.ontimeupdate = null
      audio.onloadedmetadata = () => {
        document.querySelector('.time').innerHTML = `${Time(audio.currentTime)}/${Time(audio.duration)}`
      }
      audio.ontimeupdate = () => {
        document.querySelector('.time').innerHTML = `${Time(audio.currentTime)}/${Time(audio.duration)}`
        if (!Switch && audio.duration) {
          const percent = audio.currentTime / audio.duration
          const max = footer.clientWidth - 8
          const left = percent * max
          slider.style.left = left + 'px';
          progress.style.width = left + 'px';
        }
        //歌词随时间改变

        for (let i = 0; i < lyricsList.length; i++) {
          if (audio.currentTime >= lyricsList[i].time &&
            (i === lyricsList.length - 1 || audio.currentTime < lyricsList[i + 1].time)) {
            document.querySelector('.curtain-lyric').innerHTML = lyricsList[i].text
            break
          }
        }
      }

      // console.log(data)
      // //歌曲名
      // console.log(data.songs[0].name)
      // //图片
      // console.log(data.songs[0].al.picUrl)
      // //专辑
      // console.log(data.songs[0].al.name)
      // //歌手
      // console.log(data.songs[0].ar[0].name)
    });
  })
}
let lyrics = []
//解析歌词函数，返回一个数组
function analysisLrics(e) {
  const lyricsLines = e.split('\n')
  const lyrics = []
  lyricsLines.forEach(line => {
    const lyricsTime = /\[(\d{2}):(\d{2})\.(\d{3})\]/
    const match = line.match(lyricsTime)
    //将时间统一为秒
    if (match) {
      const mins = parseInt(match[1])
      const secs = parseInt(match[2])
      const milsecs = parseInt(match[3])
      const time = mins * 60 + secs + milsecs / 1000
      const text = line.replace(lyricsTime, '')
      lyrics.push({
        time: time,
        text: text
      })
    }
  })
  return lyrics
}
//开关
function update(e) {
  if (Switch) {
    //避免在拖鼠标的时候选中文本，不好看
    e.preventDefault();
    let location = e.clientX
    //避免滑块被拖出视口
    const rect = document.querySelector('.footer').getBoundingClientRect()
    location = Math.max(0, Math.min(location, rect.width - 8));
    document.querySelector('.slider').style.left = location + 'px'
    document.querySelector('.progress').style.width = location + 'px'
    if (audio.duration) {
      const percent = location / (rect.width - 8);
      audio.currentTime = percent * audio.duration;
    }
  }
}





//搜索
//默认搜索词
fetch(`http://localhost:3000/search/default`)
  .then(res => res.json())
  .then(res => {
    document.querySelector('.search').placeholder = res.data.showKeyword
  })
//热搜
fetch(`http://localhost:3000/search/hot`)
  .then(res => res.json())
  .then(res => {
    document.querySelector('.searchbox').innerHTML = '<div class="hotsearch">热搜榜</div>' + res.result.hots.map((item, index) => {
      return `<div class="hot" data-value="${item.first}"><div class="search-index">${index + 1}</div>${item.first}</div>`
    }).join('')
    //点击热搜并跳转
    document.querySelector('label').addEventListener('click', function (e) {
      const item = e.target.closest('.hot')
      if (item) {
        const keywords = item.dataset.value
        window.location.href = `./search.html?keywords=${keywords}`
      }
    })
  })
//搜索并跳转
const input = document.querySelector('.search')
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const keywords = input.value.trim() || input.placeholder
    window.location.href = `./search.html?keywords=${keywords}`
  }
})
//阻止默认行为，我靠这个太恶心了，搜索页面跳转不了卡我半天
document.querySelector('.searchbox').addEventListener('mousedown', function (e) {
  e.preventDefault();
});




// 头像昵称
fetch(`http://localhost:3000/user/detail?uid=${uid}&cookie=${cookie}`)
  .then(res => res.json())
  .then(res => {
    document.querySelector('.information').innerHTML = `<img src="${res.profile.avatarUrl}" class="profile" loading="lazy"><div>${res.profile.nickname}</div>`
  })



//控制音乐播放
playBtn.addEventListener('click', () => {
  if (audio.src) {
    if (audio.paused) {
      audio.play()
      playBtn.classList.remove('icon-zanting')
      playBtn.classList.add('icon-zanting1')
    }
    else {
      audio.pause()
      playBtn.classList.remove('icon-zanting1')
      playBtn.classList.add('icon-zanting')
    }
  }
})


// 底部进度条以及播放暂停等功能
// 最烦人的部分
// 更新进度条
const slider = document.querySelector('.slider')
const progress = document.querySelector('.progress')
slider.addEventListener('mousedown', (e) => {
  Switch = true
  update(e)
  document.addEventListener('mousemove', update)
  //鼠标抬起关闭设置的开关
  document.addEventListener('mouseup', function end() {
    Switch = false
    document.removeEventListener('mousemove', update)
    document.removeEventListener('mouseup', end)
  })
})
const footer = document.querySelector('.footer')
//音量
const volumeProgress = document.querySelector('.volume-progress')
const volume = document.querySelector('.volume')
volume.addEventListener('click', function () {
  if (volumeProgress.style.display === 'block') {
    volumeProgress.style.display = 'none'
  } else {
    volumeProgress.style.display = 'block'
  }
})
volumeProgress.addEventListener('input', function (e) {
  if (audio.src) {
    audio.volume = e.target.value / 100
  }
})
//上一首下一首
document.querySelector('.previous').addEventListener('click', function () {
  if (audio.src && indexNow) {
    document.querySelector(`[data-index="${indexNow - 1}"]`).click()
  }
})
document.querySelector('.next').addEventListener('click', function () {
  if (audio.src && indexNow < songsNumber - 1) {
    document.querySelector(`[data-index="${indexNow + 1}"]`).click()
  }
})
//幕布升起降落，并阻止事件委托
document.querySelector('.footer').addEventListener('click', function (e) {
  if (e.target === document.querySelector('.footer')) document.querySelector('.curtain').classList.toggle('show')
})