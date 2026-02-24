

//获取歌单详情
// fetch('http://localhost:3000/playlist/detail?id=14068521897')
//   .then(res => res.json())
//   .then(res => {
//     console.log(res)
//   })
async function playList() {
  // 歌单分类
  const res = await fetch('http://localhost:3000/playlist/highquality/tags')
  const categorylist = await res.json()
  document.querySelector('.categorylist').innerHTML = categorylist.tags.map((item, index) => {
    if (index <= 4) return `<div class="category" data-value ="${item.name}">${item.name}</div>`
  }).join('')


  // 获取具体的歌曲
  //返回函数
  function renderData(arr) {
    document.querySelector('.musicmenu').innerHTML = arr.map(item => {
      return `<div class="square-playlist" data-id="${item.id}">

          <div class="square-view-count">
            <span class="iconfont icon-18erji-2 square-headphones"></span>${count(item.playCount)}
          </div>
          <img src="${item.coverImgUrl}" class="square-picture" loading="lazy">
          <div class="square-text">${item.title} ${item.subTitle || ''}</div>
        </div>`
    }).join('')
  }
  //默认渲染
  const result = await fetch(`http://localhost:3000/top/playlist?cat=${categorylist.tags[0].name}&order=hot&limit=36`)
  const Result = await result.json()
  renderData(Result.playlists)
  document.querySelector('.categorylist .category').classList.add('focus')

  //事件委托

  document.querySelector('.categorylist').addEventListener('click', async function (e) {
    if (e.target.tagName === 'DIV' && e.target.classList.contains('category')) {
      const data = await fetch(`http://localhost:3000/top/playlist?cat=${e.target.dataset.value}&order=hot&limit=36`)
      const Data = await data.json()
      renderData(Data.playlists)
      document.querySelector('.focus').classList.remove('focus')
      e.target.classList.add('focus')
    }
  })
}
playList()
toPlaylist('.musicmenu', '.square-playlist')

