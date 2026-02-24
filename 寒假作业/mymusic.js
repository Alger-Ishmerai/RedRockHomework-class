//这里写死是因为获取我喜欢的音乐的接口疑似有问题，获取过来是空数组
async function myPlaylist() {
  const playlist = await fetch(`http://localhost:3000/playlist/detail?id=2090361444`)
  const playlistData = await playlist.json()
  // 歌曲封面
  document.querySelector('.introduction').innerHTML = `<img src="${playlistData.playlist.coverImgUrl}" class="playlist-picture" loading="lazy">
          <div class="Title">
            <div class="title">我喜欢的音乐</div>
            <div class="subtitle">2018-02-06创建</div>
          </div>`
  const count = playlistData.privileges.length
  //歌曲数
  document.querySelector('.Song').innerHTML = `<div class="songs">歌曲</div>
          <div class="number-songs">${count}</div>`
  //详细歌曲
  const songsArray = await Promise.all(playlistData.privileges.map(async (item, index) => {
    const data = await fetch(`http://localhost:3000/song/detail?ids=${item.id}`)
    const Data = await data.json()
    // if (!index) {
    //   console.log(Data)
    //   // console.log(Data.songs[0].ar[0].name)
    //   // console.log(Data.songs[0].al)
    //   // console.log(Data.songs[0].al.id)
    //   // console.log(Data.songs[0].al.picUrl)
    //   // console.log(Data.songs[0].name)
    // }
    songsNumber = playlistData.privileges.length
    return `<div class="playlist-songs" data-ids="${Data.privileges[0].id}" data-index="${index}">
          <div class="playlist-index">${padZero(index + 1)}</div>
          <img src="${Data.songs[0].al.picUrl}" class="playlist-photo" loading="lazy">
          <div class="playlist-name">${Data.songs[0].name}</div>
          <div class="singer">${Data.songs[0].ar[0].name}</div>
        </div>`
  }))
  document.querySelector('.song').innerHTML = songsArray.join('')
  toAudio('.playlist-songs')
}

myPlaylist()
