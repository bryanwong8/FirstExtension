getBackground();

function getBackground(){
  let search = document.getElementById("picSubmit");
  let page = document.getElementsByTagName("body");
  let bodyStyle = window.getComputedStyle(document.body, null);
  let night = document.getElementById("night");
  let day = document.getElementById("day");

  chrome.storage.sync.get("cover", (cover) => {
    document.body.style.backgroundImage = cover.cover;
  });

  chrome.storage.sync.get("textColor", (textColor) => {
    document.body.style.color = textColor.textColor;
  });

  night.addEventListener("click", () => {
    document.body.style.color = "black";
    chrome.storage.sync.set({"textColor": bodyStyle.color});
  });

  day.addEventListener("click", () => {
    document.body.style.color = "white";
    chrome.storage.sync.set({"textColor": bodyStyle.color});
  });

  search.addEventListener("click", () => {
    let picture = document.getElementById("picSearch").value;

    if(!picture || picture.length === 0){
      alert("Empty picture field");
    }else{
      let accessKey = config.PICTURE;
      let url = "https://api.unsplash.com/search/photos/?client_id=" + accessKey + "&query=" + picture + "&orientation=landscape&per_page=356";

      axios.get(url, {
        params: {
          width: "1800",
          height: "600"
        }
      })
      .then((response) =>{
        let imageLength = response.data.results.length;
        let randomNum = Math.floor(Math.random() * imageLength);
        let image = response.data.results[randomNum].urls.regular;

        document.body.style.backgroundImage = 'url('+image+')';
        picture = "";

        chrome.storage.sync.set({"cover": bodyStyle.backgroundImage});
      })
      .catch((error) => {
        console.log(error);
      });
    }
  })
}
