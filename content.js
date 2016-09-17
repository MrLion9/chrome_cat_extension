    var tag = "cats";
    var key = "ae31860245a55e8282262c2c7eaf6a17";
    var token = "72157670689935274-f2af444edc38d8cd";

    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+
        key+"&tags="+tag+"&format=json&nojsoncallback=1&auth_token="+
        token+"&api_sig=05d1dbe4c4810c7b33450685edaf3c01";

    var images = document.getElementsByTagName('img');

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4)
        {

            var data = JSON.parse(this.responseText);
            var photos = data.photos.photo;

            // var rnd = Math.floor(Math.random() * data.items.length);
            //
            // var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
            // console.log("total "+ data.items.length);
            // images[0].src = image_src;

            for(var i = 0; i < photos.length && i < images.length; i++){
                var w = images[i].width;
                var h = images[i].height;

                var farm_id = photos[i]['farm'],
                    server_id = photos[i]['server'],
                    id = photos[i]["id"],
                    secret = photos[i]["secret"];

                var link = "https://farm"+
                    farm_id+".staticflickr.com/"+
                    server_id+"/"+
                    id+"_"+
                    secret+".jpg";

                images[i].src = link;
                images[i].width = "" + w;
                images[i].height = "" + h;
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

