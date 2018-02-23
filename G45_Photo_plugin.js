//Photo Plugin author: Gregory Jones
//Search and Display photos for a POI or City
//Currently supported Photo APIs: Flikr
//See API Config file for service configuration.
var json;
var i=0;

//Get api config infomation.
//Format json.
var config;

//Make search argument fields based on checkboxes ticked.
$(document).ready(function()
{
  //State variables used to prevent duplication of fields.
  var s1,s2,s3,s4 = false;

  //Add both min upload date and min taken date fields.
  $("#Dates").click(function()
  {
    if(s1 == true)
    {
      $("#DatesDiv").remove();
      s1 = false;
    }
    else
    {
      $("#Search").append("<div id='DatesDiv'><label for='minUpLDate'>Minimum Upload Date:</label><input id='minUpLDate' type='date'><br><label for='minTaDate'>Minimum Taken Date:</label><input id='minTaDate' type='date'><br></div>")
      s1 = true;
    }
  })

  //Add both lat + long fields.
  $("#LongLat").click(function()
  {
    if(s2 == true)
    {
      $("#LongLatDiv").remove();
      s2 = false;
    }
    else
    {
      $("#Search").append("<div id='LongLatDiv'><label for='Lat'> Latitude </label><input id='Lat' type='text'><br><label for='Long'> Longitude </label><input id='Long' type='text'><br></div>")
      s2 = true;
    }
  })

  $("#Poi").click(function()
  {
    if(s3 == true)
    {
      $("#PoiDiv").remove();
      s3 = false;
    }
    else
    {
      $("#Search").append("<div id='PoiDiv'><label for='poi'> Place of Interest </label><input id='poi' type='text'><br></div>")
      s3 = true;
    }

  })

  $("#Tags").click(function()
  {
    if(s4 == true)
    {
      $("#TagDiv").remove();
      s4 = false;
    }
    else
    {
      $("#Search").append("<div id='TagDiv'><label for='tags'> Comma separated tag </label><input id='tags' type='text'><br></div>")
      s4 = true;
    }
  })
});

//DEBUG birmingham weoid: 12723
//Base URL:https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e60cf64ebe42702907fa713ab085a05
function getPhotos()
{
  var args;

  //Add arguments

  args = args + "&min_upload_date=" + $("#minUpLDate").val();

  console.log(args);
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
        $("#imgs").append("FAIL");
    },

    success: function(data)
    {
      json = data;
    },
    type: 'GET'
  });
}

function displayPhoto()
{

  //Current Page
  var page = json.photos.page;
  //Total Number of pages
  var pages = json.photos.pages;
  //Number of photos per page
  var perPage = json.photos.perpage;
  var farm = json.photos.photo[i].farm;
  var server = json.photos.photo[i].server;
  var photoID = json.photos.photo[i].id;
  var secret = json.photos.photo[i].secret;
  var photoURL = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg";

  $.ajax({
    //Base Search method with key
    url: photoURL,
    cache: false,
    error: function()
    {
        $("#imgs").append("FAIL");
    },

      success: function(data)
      {
        $("IMG").attr("src",photoURL);
      },
    type: 'GET'
  });

  document.getElementById("nxtPhoto").addEventListener("click", function() {i = i + 1;});
}
