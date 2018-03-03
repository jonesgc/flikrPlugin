//Photo Plugin author: Gregory Jones
//Search and Display photos for a POI or City
//Currently supported Photo APIs: Flikr
//See API Config file for service configuration.
var json;
var i=1;
var p =1;
//Get api config infomation.
//Format json.
var config = {
    "flikrApiKey" : "e9d832b772414144a351d458238065d4",
    "flikrSecret" : "27e75c7eaed62742",
    "url" :{
            "base":"https://api.flickr.com/services/rest/?method=flickr.photos.search",
            "format":"&format=json&nojsoncallback=1"
          },
    "cities" :{
      "Birmingham":"12723",
      "Chicago":"2379574",
    }
};



//Make search argument fields based on checkboxes ticked.
$(document).ready(function()
{
  //Forward and back button event listeners.
  document.getElementById("nxtPhoto").addEventListener("click", function() {i = i + 1});
  document.getElementById("bckPhoto").addEventListener("click", function() {i = i - 1;});

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
      $("#Search").append("<div id='LongLatDiv'><label for='Lat'> Latitude </label><input id='Lat' type='text'><br><label for='Long'> Longitude </label><input id='Long' type='text'><br></div>");
      $("#LongLatDiv").append("<div class='alert alert-warning' role='alert'>This is a warning alert with <a href='#'' class='alert-link'>an example link</a>. Give it a click if you like.</div>");
      s2 = true;
    }
  })
  //Add tag field
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

//Base URL:https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e60cf64ebe42702907fa713ab085a05
function getPhotos()
{
  var args = "";
  var city = $("#city").val();
  var woeID = config.cities[city];
  //Add arguments per the flikr search spec, arguments are added in order.
  //tags
  if($("#tags").val())
  {
    console.log($("#tags").val());
    args += "&tags=" + $("#tags").val();
  }
  //Dates
  if($("#minUpLDate").val())
  {
    args += "&min_upload_date=" + $("#minUpLDate").val();
  }
  if($("#minTaDate").val())
  {
    args += "&min_taken_date=" + $("#minTaDate").val();
  }
  //Add city woe_id
  args += "&woe_id=" + woeID;
  //Page
  args += "&page=" + p;
  //Add response format
  args += "&format=json&nojsoncallback=1";
  //Lat+Long
  if($("#Lat").val() && $("#Long").val())
  {
      args += "&lat=" + $("#Lat").val() + "&long=" + $("#Long").val();
  }

  $.ajax({
    //Base Search method with key
    url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e9d832b772414144a351d458238065d4"
    + args

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
      //Call the display photos which reads the JSON data and returns usable URLs
      displayPhoto();
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

  //Check the total number of images.
  var total = json.photos.total;
  if(i == total)
  {
    return;
  }
  //Reset image counter. And iterate into next page.
  if(i == perPage)
  {
    i = 1;
    p = p + 1;
  }

  var farm = json.photos.photo[i].farm;
  var server = json.photos.photo[i].server;
  var photoID = json.photos.photo[i].id;
  var secret = json.photos.photo[i].secret;
  var photoURL = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg";
  //Set title.

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
      $("#figCap").text(json.photos.photo[i].title);
      $("IMG").attr("src",photoURL);
    },
    type: 'GET'
  });

}
