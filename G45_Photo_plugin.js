//Photo Plugin author: Gregory Jones
//Search and Display photos for a POI or City
//Currently supported Photo APIs: Flikr
//See API Config file for service configuration

//DEBUG birmingham weoid: 12723
//Base URL:https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e60cf64ebe42702907fa713ab085a05
//Photo url template: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
function getPhotos()
{
  //Get min upload date
  //var upLDate = document.getElementById().value;
  $.ajax({
    //Base Search method with key
    url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bccaf6ff67eb7fc29f7c26b0d24def91"
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
        var json = data;
        var farm = json.photos.photo[0].farm;
        var server = json.photos.photo[0].server;
        var photoID = json.photos.photo[0].id;
        var secret = json.photos.photo[0].secret;
        var photoURL = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg"
        //console.log(farm);
        $("#test").append(photoURL);
      },
    type: 'GET'
  });
}
