let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutes(second) {
  if (isNaN(second) || second < 0) {
    return "00:00";
  }

  const minutes = Math.floor(second / 60);
  const remainingSeconds = Math.floor(second % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}



function formatSongName(songName) {
  // Replace _ with space
  songName = songName.replace(/_/g, " ");

  // Remove ( and )
  songName = songName.replace(/[()]/g, "");
  // Remove .mp3
  songName = songName.replace(".mp3", "");
  songName = songName.replace(/\//g, "");

  return songName;
}





async function getSongs(folder) {

  currFolder = folder;

  let a = await fetch(`http://127.0.0.1:3000/${folder}/`); //provided the directory- usually from server so used fetch, await is for the fetch
  let response = await a.text(); // extracted text out of it

  let div = document.createElement("div"); // created a div
  div.innerHTML = response; //stored the response in div

  let tags = div.getElementsByTagName("a"); // collected all a tags

  songs = [];


  for (let index = 0; index < tags.length; index++) {
    const element = tags[index]; // store curr tag in element
    if (element.href.endsWith(".mp3")) {
      // if that tag has /songs in it
      songs.push(element.href.split(`${currFolder}`)[1]); // push it to song arr
    }
  }




// show all songs in playlist

  let songUL = document //  selects the first li in ul of songlist
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = ""  ;
  for (const song of songs) {
    // for all those li its innerhtml would be that div
    songUL.innerHTML =
      songUL.innerHTML +
      `<li data-song="${song}"> 
    <div class="info">
        <img class="invert" src="images/music.svg" alt="">
        <div class=""about">
            <div>${formatSongName(decodeURI(song))}</div>
            <div>Song Artist</div>
        </div>
    </div>
    <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="images/play.svg" alt="">
    </div> 
</li>`;
  }

  //   attach and event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".info div:first-child").textContent.trim());

      // const songTrack = e
      //   .querySelector(".info div:first-child")
      //   .textContent.trim();

      const songTrack = e.getAttribute("data-song");
      playMusic(songTrack);
    });
  });


  return songs;

  
}









const playMusic = (track, pause = false) => {
  //let audio = new Audio(`/songs/${track}`);

  currentSong.src = `/${currFolder}/${track}`; // to play one song at a time

  if (!pause) {
    currentSong.play();
  }
  play.src = "images/play.svg";
  document.querySelector(".songinfo").innerHTML = formatSongName(
    decodeURI(`${track}`)
  );
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};






//display albums on the page
async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:3000/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  


  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");
  let array = Array.from(anchors)

 for (let index = 0; index < array.length; index++) {
  const e = array[index];
  
 
    if(e.href.includes("/songs")){
      let folder = e.href.split("/").slice(-2)[0];


      //ger metadata of folder
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
      let response = await a.json();


      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="images/play.svg" alt="" >
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
      

    }
  }


    //load the playlist whenever card clicked

    Array.from(document.getElementsByClassName("card")).forEach(element => {
      element.addEventListener("click",async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        console.log(Array.isArray(songs))
        playMusic(songs[0])
      })
      
    });
  
}











async function main() {
  // stored in function coz promise pending
  await getSongs("songs/favs");
  playMusic(songs[0], true);

  
  displayAlbums()



  // attach an event listener to play next and prev song
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
    }
  });

  //Listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    const progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = `${progress}%`;
    document.querySelector(
      ".seekbar"
    ).style.background = `linear-gradient(to right, #00FF00 0% ${progress}%, #cccccc ${progress}% 100%)`;
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )} / ${secondsToMinutes(currentSong.duration)}`;
  });

  // an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //event listener for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.width = "max-content";
  });

  // event listener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  //event listener for prev song and next

  document.querySelector("#prev").addEventListener("click", () => {
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
   
    if((index-1) >= 0){
      playMusic(songs[index-1])
    }
    
    
  });

  document.querySelector("#next").addEventListener("click", (e) => {

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
   
    if((index+1) < songs.length){
      playMusic(songs[index+1])
    }
    
  });


  //event for volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value)/100
  })


  //event for mute

  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg","mute.svg")
      currentSong.volume = 0
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0
      }

      else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
      }
    
  })



  //   //play the first song

  //   var audio = new Audio(songs[12]);
  //   audio.play();   //plays the 12th song

  //   audio.addEventListener("loadeddata", () => {      //display the total duration of whole playlist
  //     let duration = audio.duration;
  //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
  //   });
}

main();
