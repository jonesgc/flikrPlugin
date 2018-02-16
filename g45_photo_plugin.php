
<?php



?>
<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="G45_Photo_plugin.js"></script>
  </head>

  <body>
    <div id="Search">

      <select id="city">
        <option>Birmingham</option>
        <option>Chicago</option>
      </select><br>

      <label for="minUpLDate">Minimum Upload Date:</label>
      <input id="minUpLDate" type="date"><br>
      <label for="minTaDate">Minimum Taken Date:</label>
      <input id="minTaDate" type="date"><br>
      <label for="Lat"> Latitude </label>
      <input id="Lat" type="text"><br>
      <label for="Long"> Longitude </label>
      <input id="Long" type="text"><br>
      <label for="poi"> Place of Interest </label>
      <input id="poi" type="text"><br>
      <button id="Search" onclick="getPhotos()">Sumbit</button>

      <div id="test">
        test test
        <img id="IMG" src="">
      </div>
    </div>
  </body>
</html>
