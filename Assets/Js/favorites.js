const submitBtn = document.getElementById("submit");
const closeBtn = document.getElementById("close");
const editBtn = document.getElementById("edit");
const deleteBtn = document.getElementById("delete");

getFavorite();

function getFavorite()
{
    let plus = document.getElementsByClassName("box");
    let favorite = document.querySelector("#favorite");
    let input = document.querySelector(".ui.large.form");
    let title = document.getElementById("title");
    let url = document.getElementById("url");
    let anchorEdit = document.getElementsByClassName("anchorText");
    let editIcon = document.getElementsByClassName("edit icon");

    chrome.storage.sync.get("len", (fav) => {
      for(let i = 0; i < fav.len - 1; i++){
        chrome.storage.sync.get("titles", (response) => {
          chrome.storage.sync.get("links", (url) => {
            createNewFavorite(plus, favorite, response.titles[i], url.links[i], input, "future");
            clickEdit(input, response.titles[i], url.links[i], plus, editIcon, anchorEdit, favorite);
          });
        });
      }
    });

    favoriteClicks(plus, input, title, url);

    closeBtn.addEventListener("click", function(){
      input.style.display = "none";
    });

    submitBtn.addEventListener("click", function(){
      if(title.value === "" || url.value === ""){
        alert("Empty field");
      }else{
        createNewFavorite(plus, favorite, title, url, input, "present");
        clickEdit(input, title, url, plus, editIcon, anchorEdit, favorite);

        let titles = new Array();
        let links = new Array();

        for(let i = 1; i < plus.length; i++){
          titles.push(plus[i].textContent);
          links.push(plus[i].firstChild.href);
        }

        chrome.storage.sync.set({"titles": titles});
        chrome.storage.sync.set({"links": links});
      }

      chrome.storage.sync.set({"len": plus.length});
    });
}

function favoriteClicks(plus, input, title, url)
{
    let i = plus.length - 1;
    plus[i].addEventListener("click", function(){
      input.style.display = "block";
      submitBtn.style.display = "block";
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      title.value = "";
      url.value = "";
    });
}

function createNewFavorite(plus, favorite, title, url, input, time)
{
  if(plus.length > 8){
    alert("Delete some favorites");
  }else{
    let newDiv = document.createElement("div");
    let newAn = document.createElement("a");
    let edit = document.createElement("i");

    edit.className = "edit icon";
    newAn.className = "anchorText";
    newDiv.className = "box";
    newDiv.appendChild(newAn);
    newDiv.appendChild(edit);
    favorite.prepend(newDiv);

    if(time === "present"){
      newAn.textContent = title.value;
      newAn.href = url.value;
    }else if(time === "future"){
      newAn.textContent = title;
      newAn.href = url;
    }

    favorite.append(plus[0]);
    input.style.display = "none";
  }
}

function clickEdit(input, title, url, plus, editIcon, anchorEdit, favorite)
{
  let i = editIcon.length - 1;

  editIcon[i].addEventListener("click", function(){
    input.style.display = "block";
    submitBtn.style.display = "none";
    deleteBtn.style.display = "block";
    editBtn.style.display = "block";
    title.value = plus[i + 1].textContent;
    url.value = anchorEdit[i].href;

    editFavorite(anchorEdit[i], url, title, input);

    deleteBtn.addEventListener("click", function(){
      favorite.removeChild(plus[i + 1]);
      input.style.display = "none";
    },{once : true});
  });
}

function editFavorite(changed, url, title, input)
{
  editBtn.addEventListener("click", function(){
    changed.href = url.value;
    changed.textContent = title.value;
    input.style.display = "none";
  },{once : true});
}
