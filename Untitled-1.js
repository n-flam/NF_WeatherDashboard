// variable declaration
var city="";
// variable declaration
var searchCity = $("#searchCity");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];

// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}


// Here we create the AJAX call
$(function currentWeather(city){
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const apiKey = "956dda6b020b9fbad71791c3c8fdfe53";
    console.log(searchForm);
    
    // search Form
    // user types in
    // user presses search
    // addEventListener to search button
    searchForm.addEventListener('submit', function(event){
        event.preventDefault();
        console.log('hey');

        const userInput = searchInput.value;
        
        // user expects info in todays detail
        // we want date, city name, temp, humidity, picture, wind speed, uv index 
        // ajax call to weather api to retrieve these info
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`,
            method: 'GET',
        }).then(function(response){
            console.log(response);
        });

        // append info to HTML
        var weatherIcon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // Date foramt is taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        var date=new Date(response.dt*1000).toLocaleDateString();
        // Weather at the current City 
        var currentCity = $("#city");
        // response city
        $(city).html(response.name +"("+date+")" + "<img src="+iconurl+">");
       
        // var temperature
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        
        // var humidity
        $(currentHumidty).html(response.main.humidity+"%");
         //Display Wind speed and convert to MPH
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");

        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }



        


        // extract the info from the ajax response
        // append info to HTML
        
        
        
        // user expects info in forecast cards
        // each card should have
        // date, temp. humidity, icon,
        // ajax call to weather api to retrieve these info
        // extract the info from the ajax response
        // append info to HTML
        
        
        
        // user expects searched terms appear in history
        // what the user typed in needs to be saved, to local storage
        // get those items in local storage and display in the history list

    });
    
    
    
});

// This function returns the UVIindex response.
function UVIndex(ln,lt){
    //lets build the url for uvindex.
        var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lt+"&lon="+ln;
        $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
        }
        
    // Here we display the 5 days forecast for the current city.
    function forecast(cityid){
        var dayover= false;
        var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+apiKey;
        $.ajax({
            url:queryforcastURL,
            method:"GET"
        }).then(function(response){
        
            for (i=0;i<5;i++){
                var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
                var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
                var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
                var tempK= response.list[((i+1)*8)-1].main.temp;
                var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
                var humidity= response.list[((i+1)*8)-1].main.humidity;
        
                $("#fDate"+i).html(date);
                $("#fImg"+i).html("<img src="+iconurl+">");
                $("#fTemp"+i).html(tempF+"&#8457");
                $("#fHumidity"+i).html(humidity+"%");
            }
        });
    }

    //Daynamically add the passed city on the search history
    function addToList(c){
        var listEl= $("<li>"+c.toUpperCase()+"</li>");
        $(listEl).attr("class","list-group-item");
        $(listEl).attr("data-value",c.toUpperCase());
        $(".list-group").append(listEl);
    }
    // display the past search again when the list group item is clicked in search history
    function invokePastSearch(event){
        var liEl=event.target;
        if (event.target.matches("li")){
            city=liEl.textContent.trim();
            currentWeather(city);
        }
    }
    // render function
    function loadlastCity(){
        $("ul").empty();
        var sCity = JSON.parse(localStorage.getItem("cityname"));
        if(sCity!==null){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            for(i=0; i<sCity.length;i++){
                addToList(sCity[i]);
            }
            city=sCity[i-1];
            currentWeather(city);
        }
    }

    //Clear the search history from the page
    function clearHistory(event){
        event.preventDefault();
        sCity=[];
        localStorage.removeItem("cityname");
        document.location.reload();

    }

    //Click Handlers
    // $("#search-button").on("click",displayWeather);
    // $(document).on("click",invokePastSearch);
    // $(window).on("load",loadlastCity);
    $("#clear-history").on("click",clearHistory);

     

