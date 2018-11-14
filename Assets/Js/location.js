myLocation();
displayDate();

function myLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getCity);
  }else{
    console.log("Geolocation is not supported");
  }
}

function getCity(position)
{
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
    params: {
      latlng: lat + "," + lng,
      key: config.LOCATION
    }
  })
  .then(function(response){
    let address = response.data.results[0].formatted_address;
    let location = document.getElementById("location");
    let city = address.split(",");

    location.textContent = city[1];
    getWeather(location.textContent);
  })
  .catch(function(error){
    console.log(error)
  });
}

function getWeather(location)
{
  let url = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + config.WEATHER;

  axios.get(url)
  .then(function(response){
    console.log(response);
    let temp = document.getElementById("temp");
    let icon = document.getElementById("icon");
    let image = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";
    let weather = response.data.main.temp;

    temp.textContent = weather;
    icon.src = image;
  })
  .catch(function(error){
    console.log(error);
  })
}

function displayDate()
{
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
  let changeTime = setTimeout(displayDate, 1000);
  let now = document.getElementById("date");
  let time = document.getElementById("time");

  if(minutes < 10){
    time.textContent = hours + ":0" + minutes;
  }else{
    time.textContent = hours + ":" + minutes;
  }

  now.textContent = date;
}
