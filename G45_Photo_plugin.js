//Photo Plugin author: Gregory Jones
//Search and Display photos for a POI or City
//Currently supported Photo APIs: Flikr
//See API Config file for service configuration

var json;

//DEBUG birmingham weoid: 12723
//Base URL:https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e60cf64ebe42702907fa713ab085a05
//Photo url template: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
function getPhotos()
{
  //Get min upload date
  //var upLDate = document.getElementById().value;
  $.ajax({
    //Base Search method with key
    url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e9d832b772414144a351d458238065d4"
    //Add city woe_id
    + "&woe_id="+"12723"
    //Add response format
    + "&format=json&nojsoncallback=1"
    ,
     dataType: 'json',
     cache: false,
    error: function()
    {
        $("#test").append("FAIL");
    },

      success: function(data)
      {
        json = data;
      },
    type: 'GET'
  });
}
function nextPhoto()
{
  var display = document.getElementById("IMG");
  display.setAttribute("src", "0");
  //Current Page
  var page = json.photos.page;
  //Total Number of pages
  var pages = json.photos.pages;

  //Number of photos per page
  var perPage = json.photos.perpage;

  var i = 0;
  var farm = json.photos.photo[i].farm;
  var server = json.photos.photo[i].server;
  var photoID = json.photos.photo[i].id;
  var secret = json.photos.photo[i].secret;
  var photoURL = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg";
  $("#test").append(photoURL);
  function nextPhoto()
  {
    i++;
  }
  display.setAttribute("src", photoURL);
}
