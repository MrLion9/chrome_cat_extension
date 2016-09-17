    var keyword = "cats";

    var url = "https://api.flickr.com/services/feeds/photos_public.gne?tags="+ keyword +"&format=json&tagmode=any";

    var images = document.getElementsByTagName('img');

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4)
        {
            var data = this.responseText.split("jsonFlickrFeed(").pop();
            data = JSON.parse(data.substring(0, data.length-1));

            // var rnd = Math.floor(Math.random() * data.items.length);
            //
            // var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
            // console.log("total "+ data.items.length);
            // images[0].src = image_src;

            for(var i = 0; i < data.items.length && i < images.length; i++){
                images[i].src = data.items[i]['media']['m'].replace("_m", "_b");
            }
        }
    };
    xhr.send();





    // var script = document.createElement("script");
    // script.type = "text/javascript";
    // script.src = "https://www.google.com/jsapi";
    //
    // document.getElementsByTagName("head")[0].appendChild(script);
    //
    // script.onreadystatechange = function(){
    //     if (this.readyState == "complete") {
    //         start();
    //     }
    // };
    //
    //
    //
    // function start(){
    //     console.log("test");
    //     var images = document.getElementsByTagName('img');
    //
    //     google.load('search', '1');
    //     google.setOnLoadCallback(OnLoad);
    //     var search;
    //     var keyword = 'cat';
    //
    //     function OnLoad()
    //     {
    //         search = new google.search.ImageSearch();
    //
    //         search.setSearchCompleteCallback(this, searchComplete, null);
    //
    //         search.execute(keyword);
    //     }
    //
    //     function searchComplete()
    //     {
    //         console.log("search complete");
    //         if (search.results && search.results.length > 0)
    //         {
    //             var rnd = Math.floor(Math.random() * search.results.length);
    //
    //             //you will probably use jQuery and something like: $('body').css('background-image', "url('" + search.results[rnd]['url'] + "')");
    //             images[0].src = search.results[rnd]['url'];
    //         }
    //     }
    // }

