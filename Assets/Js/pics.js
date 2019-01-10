getBackground();

function getBackground(){
  let search = document.getElementById("picSubmit");
  let page = document.getElementsByTagName("body");
  let bodyStyle = window.getComputedStyle(document.body, null);
  let toggle = document.getElementById("toggle");
  let author = document.getElementById("author");

  chrome.storage.sync.get("cover", (response) => {
    document.body.style.backgroundImage = response.cover;
  });

  chrome.storage.sync.get("text", (response) => {
    author.text = response.text;
  });

  chrome.storage.sync.get("link", (response) => {
    author.href = response.link;
  });

  chrome.storage.sync.get("textColor", (response) => {
    document.body.style.color = response.textColor;
  });

  toggle.addEventListener("click", () => {
    text = document.body.style;

    if(text.color == "white"){
      text.color = "black";
    }else{
      text.color = "white";
    }
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
        console.log(response);
        let imageLength = response.data.results.length;
        let randomNum = Math.floor(Math.random() * imageLength);
        let image = response.data.results[randomNum].urls.regular;
        let first = response.data.results[randomNum].user.first_name;
        let last = response.data.results[randomNum].user.last_name;
        let home_page = response.data.results[randomNum].links.html;

        author.textContent = "Photo by " + first + " " + last;
        author.href = home_page + "?utm_source=First_Extension&utm_medium=referral";

        document.body.style.backgroundImage = 'url('+image+')';
        picture = "";

        chrome.storage.sync.set({"text": author.textContent, "link": author.href});
        chrome.storage.sync.set({"cover": bodyStyle.backgroundImage});
      })
      .catch((error) => {
        console.log(error);
      });
    }
  })
}
