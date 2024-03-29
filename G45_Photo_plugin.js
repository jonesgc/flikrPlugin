//Photo Plugin author: Gregory Jones
//Search and Display photos for a City
//Currently supported Photo APIs: Flikr

var flikrJSON;
var i=0;
var p =1;
var modeVal =1;
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

//Initalise plugin components. For integration a check must be performed to see if it is integrated or not.
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
      $("#searchArgs").append("<div id='DatesDiv'><label for='minUpLDate'>Minimum Upload Date:</label><input id='minUpLDate' class='dynamIn' type='date'><br><label for='minTaDate'>Minimum Taken Date:</label><input id='minTaDate' class='dynamIn' type='date'><br></div>")
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
      $("#searchArgs").append("<div id='LongLatDiv'><label for='Lat'> Latitude </label><input id='Lat' class='dynamIn' type='text'><br><label for='Long'> Longitude </label><input id='Long' class='dynamIn' type='text'><br></div>");
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
      $("#searchArgs").append("<div id='TagDiv'><label for='tags'> Comma separated tag </label><input id='tags' class='dynamIn' type='text'><br></div>")
      s4 = true;
    }
  })
});

//Gets json of image URL components from Flikr. Arguments will be added in the order required by the API.
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
    //Regex taken from https://stackoverflow.com/questions/8205610/regex-for-tags-separated-by-spaces-commas-up-to-n-tags answer by Regexident.
    var tagReg = new RegExp('^[a-zA-Z0-9]+(?:[ ,]+[a-zA-Z0-9]+){0,5}$');
    var tags = $("#tags").val();
    var resp = tagReg.test(tags);

    if(resp)
    {
      console.log("Regex Validated @ Tags");
      args += "&tags=" + $("#tags").val();
    }
    else
    {
      console.log("Failed regex validation @ Tags");
    }



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

//Control button displays and determine which type of display type is requested.
function mode(int)
{
  //Check which button was pressed and fill it showing it was the one pressed.
  //1 is single mode.
  if(int == 1)
  {
    $("#single").attr("class", "btn btn-info");
    $("#multiple").attr("class", "btn btn-outline-info");
    //Remove elements for multiple photo selection.
    $("#photoNoId").remove();
    $("#photoNo").remove();
    modeVal = 1;
  }
  //Multiple mode.
  else if (int == 2)
  {
    $("#multiple").attr("class", "btn btn-info");
    $("#single").attr("class", "btn btn-outline-info");
    //Add an input for the number of image to display, but check if there is already one there.
    if($("#photoNo").length)
    {
      modeVal = 2;
    }
    else
    {
      $("#modeSel").append("<label id='photoNoId' for='photoNo'>No. Photos to display:</label><input id='photoNo' type='text' value='1'></input>");
      modeVal = 2;
    }

  }
  else
  {
    console.log("Error @mode assignment!");
    console.log(int);
  }
}

//Entry point into the photo display functions, determines which function to be called.
function displayPhoto()
{
  //Remove multiple images that mgiht have been added before.

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

  $(".multi").remove();
  $("#imgBtns").show();
  $("#imgFig").show();
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
      $("#fImg").attr("src",photoURL+"?"+date.getTime());
      $("#figCap").text(title);
    },
    type: 'GET'
  });

}

//When selected get multiple photos and display them.
function displayMultiplePhoto()
{
  //Remove interface for single display.
  if($("#imgFig").length)
  {
    $("#imgBtns").hide();
    $("#imgFig").hide();
  }

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
    console.log("Could not retrieve number of photos to be shown in @displayMultiPhoto");
  }

  //Create the URLs
  for(x=0; x < photoNo; x++)
  {
    var date = new Date();
    var photoURL=[];
    var farm = flikrJSON.photos.photo[x].farm;
    var server = flikrJSON.photos.photo[x].server;
    var photoID = flikrJSON.photos.photo[x].id;
    var secret = flikrJSON.photos.photo[x].secret;
    var title = flikrJSON.photos.photo[x].title;

    //Assemble URL
    photoURL[x] = "https://farm"+ farm + ".staticflickr.com/"+ server +"/"+ photoID + "_" + secret +".jpg";
    console.log(photoURL[x]);

    //Get images from server.
    //Done synchronosly, need to research a better method.
    $.ajax(
    {
      url: photoURL[x],
      cache: false,
      passThru: x,
      async: false,
      error: function()
      {
        $("#imgs").append("Failed to retrieve Image - @Multiple URL stage");
      },

      success: function(data)
      {
        x = this.passThru;
        //Attach a date to force the image to repload.
        $("#imgs").append("<img class='multi' image-fluid' src=" + photoURL[x]+'?'+date.getTime()+'>');
      },
      type: 'GET'
    });
  }

}
