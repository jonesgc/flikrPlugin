//Photo Plugin author: Gregory Jones
//Search and Display photos for a POI or City
//Currently supported Photo APIs: Flikr
//See API Config file for service configuration.
var flikrJSON;
var i=0;
var p =1;
var modeVal =0;
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
  document.getElementById("nxtPhoto").addEventListener("click", function()
  {
    i = i + 1
    //Reset back button
    $("#bckPhoto").attr("class", "btn btn-primary");
  });
  document.getElementById("bckPhoto").addEventListener("click", function()
  {
    if(i == 0)
    {
      //Grey out back button because there are no more images to go back too.
      $("#bckPhoto").attr("class", "btn btn-secondary");
      return;
    }
    else
    {
      $("#bckPhoto").attr("class", "btn btn-primary");
      i = i - 1;
    }
  });
  //Reveal image aera when search button is clicked.
  document.getElementById("Searchbtn").addEventListener("click", function()
  {
    $("#imgs").collapse('show');
  });
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
      $("#searchArgs").append("<div id='DatesDiv'><label for='minUpLDate'>Minimum Upload Date:</label><input id='minUpLDate' type='date'><br><label for='minTaDate'>Minimum Taken Date:</label><input id='minTaDate' type='date'><br></div>")
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
      $("#searchArgs").append("<div id='LongLatDiv'><label for='Lat'> Latitude </label><input id='Lat' type='text'><br><label for='Long'> Longitude </label><input id='Long' type='text'><br></div>");
      $("#LongLatDiv").append("<div class='alert alert-warning' role='alert'>Both Latitude and Longitude are Required!</div>");
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
      $("#searchArgs").append("<div id='TagDiv'><label for='tags'> Comma separated tag </label><input id='tags' type='text'><br></div>")
      s4 = true;
    }
  })
});

//Gets json of image URL components.
function getPhotos()
{
  var args = "";
  //Get the city selection.
  if($("#city").val())
  {
    var city = $("#city").val();
  }
  var woeID = config.cities[city];
  //Add arguments per the flikr search spec, arguments are added in order.
  //tags
  if($("#tags").val())
  {
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
        $("#imgs").append("Failed to get JSON from flikr");
    },

    success: function(data)
    {
      flikrJSON = data;
      //Call the display photos which reads the JSON data and returns usable URLs
      displayPhoto();
    },
    type: 'GET'
  });
}

//Entry point into the photo display functions, determines which function to be called.
function displayPhoto()
{

  if(modeVal == 1)
  {
    displaySinglePhoto();
  }
  else if(modeVal == 2)
  {
    displayMultiplePhoto();
  }
}

function displaySinglePhoto()
{
  //Current Page
  var page = flikrJSON.photos.page;
  //Total Number of pages
  var pages = flikrJSON.photos.pages;
  //Number of photos per page
  var perPage = flikrJSON.photos.perpage;

  //Check the total number of images.
  var total = flikrJSON.photos.total;
  if(i == total)
  {
    return;
  }
  //Reset image counter. And iterate into next page.
  if(i == perPage)
  {
    i = 0;
    p = p + 1;
  }

  var date = new Date();
  var farm = flikrJSON.photos.photo[i].farm;
  var server = flikrJSON.photos.photo[i].server;
  var photoID = flikrJSON.photos.photo[i].id;
  var secret = flikrJSON.photos.photo[i].secret;
  var title = flikrJSON.photos.photo[i].title;
  //Assemble URL
  var photoURL = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg";

  //Get an image from server.
  $.ajax({
    url: photoURL,
    cache: false,
    error: function()
    {
      $("#imgs").append("Failed to retrieve Image - @Single URL stage");
    },

    success: function(data)
    {
      //Attach a date to force the image to repload.
      $("IMG").attr("src",photoURL+"?"+date.getTime());
      $("#figCap").text(title);
    },
    type: 'GET'
  });

}

function mode(int)
{
  //Check which button was pressed and fill it showing it was the one pressed.
  //1 is single mode.
  if(int == 1)
  {
    $("#single").attr("class", "btn btn-info");
    $("#multiple").attr("class", "btn btn-outline-info");
    modeVal = 1;
  }
  //Multiple mode.
  //Max displayed at once is 20 1/5 of a page.
  else if (int == 2)
  {
    $("#multiple").attr("class", "btn btn-info");
    $("#single").attr("class", "btn btn-outline-info");
    $("#modeSel").append("<input id='photoNo' type='text'></input>")
    modeVal = 2;
  }
  else
  {
    console.log("Error in mode assignment!");
    console.log(int);
  }
}

//When selected get multiple photos and display them.
function displayMultiplePhoto()
{

  //Current Page
  var page = flikrJSON.photos.page;
  //Total Number of pages
  var pages = flikrJSON.photos.pages;
  //Number of photos per page
  var perPage = flikrJSON.photos.perpage;

  //Check the total number of images.
  var total = flikrJSON.photos.total;



  //Get number of photos to be shown perpage.
  var photoNo = $("#photoNo").val();
  if(photoNo === undefined)
  {
    console.log("Could not retrieve number of photos to be shown in displayMultiPhoto");
  }

  //Create the URLs
  for(x=0; x < photoNo; x++)
  {
    var date = new Date();
    var photoURL = [];
    var farm = flikrJSON.photos.photo[x].farm;
    var server = flikrJSON.photos.photo[x].server;
    var photoID = flikrJSON.photos.photo[x].id;
    var secret = flikrJSON.photos.photo[x].secret;
    var title = flikrJSON.photos.photo[x].title;

    //Assemble URL
    photoURL[x] = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg";
    console.log(photoURL);

  }
  //Get images from server.
  $.ajax(
  {
    url: photoURL,
    cache: false,
    error: function()
    {
      $("#imgs").append("Failed to retrieve Image - @Multiple URL stage");
    },

    success: function(data)
    {
      //Attach a date to force the image to repload.
      $("#imgs").append("<img class='image-fluid' src=" + photoURL[1]+'?'+date.getTime()+'>');
    },
    type: 'GET'
  });

}
