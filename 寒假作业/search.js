async function loadPlaylist() {
  const urlParams = new URLSearchParams(window.location.search)
  const keywords = urlParams.get('keywords')
  const playlist = await fetch(`http://localhost:3000/cloudsearch?keywords=${keywords}`)
  const res = await playlist.json()
  const songsArray = await Promise.all(
    res.result.songs.slice(0, 300).map(async (item, index) => {
      return `<div class="playlist-songs" data-ids="${item.id}" data-index="${index}">
          <div class="playlist-index">${padZero(index + 1)}</div>
          <img src="${item.al.picUrl}" class="playlist-photo" loading="lazy">
          <div class="playlist-name">${item.name}</div>
          <div class="singer">${item.ar[0].name}</div>
        </div>`
    })
  )
  document.querySelector('.song').innerHTML = songsArray.join('')
  toAudio('.playlist-songs')
}
document.addEventListener('DOMContentLoaded', loadPlaylist)