// 获取参数并渲染
async function loadPlaylist() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  const playlist = await fetch(`http://localhost:3000/playlist/detail?id=${id}`)
  const playlistData = await playlist.json()
  const count = playlistData.privileges.length
  //歌单简介
  document.querySelector('.introduction').innerHTML = `
      <img src="${playlistData.playlist.coverImgUrl}" class="playlist-picture" loading="lazy">
      <div class="Title">
        <div class="title">${playlistData.playlist.name}</div>
        <div class="subtitle">${playlistData.playlist.description}</div>
        <div class="subtitle-name">由 ${playlistData.playlist.creator.nickname} 创建</div>
      </div>`
  //歌曲数量
  document.querySelector('.Song').innerHTML = `
      <div class="songs">歌曲</div>
      <div class="number-songs">${count}</div>`
  //详细歌曲
  const songsArray = await Promise.all(
    playlistData.privileges.slice(0, 300).map(async (item, index) => {
      const data = await fetch(`http://localhost:3000/song/detail?ids=${item.id}`)
      const Data = await data.json()
      return `<div class="playlist-songs" data-ids="${Data.privileges[0].id}" data-index="${index}">
          <div class="playlist-index">${padZero(index + 1)}</div>
          <img src="${Data.songs[0].al.picUrl}" class="playlist-photo" loading="lazy">
          <div class="playlist-name">${Data.songs[0].name}</div>
          <div class="singer">${Data.songs[0].ar[0].name}</div>
        </div>`
    })
  )
  document.querySelector('.song').innerHTML = songsArray.join('')
  toAudio('.playlist-songs')
}
document.addEventListener('DOMContentLoaded', loadPlaylist)