
    var tag = "cats";
    var key = "ba49d98b5aefb7a284efcf1e9001466f";
    var token = "72157670705224674-b512ed677339242e";

    // var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+
    //     key+"&tags="+tag+"&format=json&nojsoncallback=1&auth_token="+
    //     token+"&api_sig=d5d0a55b9404f86d79a46037f29f7bfc";

    //var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ba49d98b5aefb7a284efcf1e9001466f&tags=cats&safe_search=&is_getty=&format=json&nojsoncallback=1&auth_token=72157670705224674-b512ed677339242e&api_sig=d5d0a55b9404f86d79a46037f29f7bfc";

    var images = document.getElementsByTagName('img');
    //var links = [];

    function imageLoader(){
        this.links = [];
    }

    imageLoader.prototype.load = function(page, callback){
        var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ba49d98b5aefb7a284efcf1e9001466f&tags=cats&safe_search=&is_getty=&page="+
            page+"&format=json&nojsoncallback=1";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4)
            {
                callback( JSON.parse(this.responseText) );
            }
        };
        xhr.send();
    };

    imageLoader.prototype.notActiveLink = function(){
        for(var i = 0; i< this.links.length; i++){
            if(this.links[i].active == false){
                this.links[i].active = true;
                return this.links[i].link;
            }
        }
        return false;
    };

    function collectLink(photo){
        return "https://farm" +
            photo['farm'] + ".staticflickr.com/" +
            photo['server'] + "/" +
            photo['id'] + "_" +
            photo['secret'] + ".jpg";
    }

    var _imageLoader = new imageLoader();
    _imageLoader.load(1, function(data){
        var photos = data.photos.photo.sort(function(){
            return [-1,1,0][Math.floor(Math.random() * 2)];
        });

        for(var i = 0; i < photos.length && i < images.length; i++) {
            var w = images[i].width;
            var h = images[i].height;

            var farm_id = photos[i]['farm'],
                server_id = photos[i]['server'],
                id = photos[i]["id"],
                secret = photos[i]["secret"];

            var link = collectLink(photos[i]);

            _imageLoader.links.push({link: link, active: true});
            delete photos[i];

            images[i].src = link;
            images[i].width = "" + w;
            images[i].height = "" + h;
        }

        photos.forEach(function(photo){
            _imageLoader.links.push({link: collectLink(photo), active: false});
        });
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", url, true);
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4)
    //     {
    //
    //         var data = JSON.parse(this.responseText);
    //         var photos = data.photos.photo.sort(function(){
    //             return [-1,1,0][Math.floor(Math.random() * 2)];
    //         });
    //
    //         for(var i = 0; i < photos.length && i < images.length; i++){
    //             var w = images[i].width;
    //             var h = images[i].height;
    //
    //             var farm_id = photos[i]['farm'],
    //                 server_id = photos[i]['server'],
    //                 id = photos[i]["id"],
    //                 secret = photos[i]["secret"];
    //
    //             var link = "https://farm"+
    //                 farm_id+".staticflickr.com/"+
    //                 server_id+"/"+
    //                 id+"_"+
    //                 secret+".jpg";
    //
    //             images[i].src = link;
    //             images[i].width = "" + w;
    //             images[i].height = "" + h;
    //         }
    //     }
    // };
    // xhr.send();


    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation){
            if(mutation.addedNodes.length != 0){
                mutation.addedNodes.forEach(function(node){
                    var images = [].slice.call( node.getElementsByTagName("img") );

                    if(images.length != 0) {
                        for(var i = 0; i < images.length; i++){
                            var link = _imageLoader.notActiveLink();
                            if (link) {
                                images[i].src = link;
                            } else {
                                //load more
                            }
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });


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

