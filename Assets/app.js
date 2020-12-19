$(function(){
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
            
            // response weatherIcon
            var weatherIcon= response.weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
            // Date foramt is taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            var date=new Date(response.dt*1000).toLocaleDateString();
            // Weather at the current City 
            var city = $("#city");
            // response city
            $(City).html(response.name +"("+date+")" + "<img src="+iconurl+">");
            
            // var temperature
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
            
            // var humidity
        
        




        });


        



        
        
       
        // var windSpeed
        // var uvIndex 

        


        
        // response date
        
        // response temperature
        // response humidity
        // response windSpeed
        // response uvIndex



        // append city
        // append date
        // append weatherIcon
        // append temperature
        // append humidity
        // append windSpeed
        // append uvIndex



        

        
        // extract the info from the ajax response
        function UVIndex(ln,lt){
            //lets build the url for uvindex.
            var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
            $.ajax({
                    url:uvqURL,
                    method:"GET"
                    }).then(function(response){
                        $(currentUvindex).html(response.value);
                    });
        }
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
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);

