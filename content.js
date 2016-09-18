
    var tag = "cats";
    var key = "ba49d98b5aefb7a284efcf1e9001466f";
    var token = "72157670705224674-b512ed677339242e";

    // var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+
    //     key+"&tags="+tag+"&format=json&nojsoncallback=1&auth_token="+
    //     token+"&api_sig=d5d0a55b9404f86d79a46037f29f7bfc";

    //var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ba49d98b5aefb7a284efcf1e9001466f&tags=cats&safe_search=&is_getty=&format=json&nojsoncallback=1&auth_token=72157670705224674-b512ed677339242e&api_sig=d5d0a55b9404f86d79a46037f29f7bfc";

    var images = document.getElementsByTagName('img');
    var next_page = 1;

    function imageLoader(){
        this.links = [];
    }

    imageLoader.prototype.load = function(page, callback){
        var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ba49d98b5aefb7a284efcf1e9001466f&text=cats&tags=cats&safe_search=&is_getty=&page="+
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

    imageLoader.prototype.randomLink = function(){
        return this.links[Math.floor(Math.random() * (this.links.length-1) )].link;
    };

    function collectLink(photo){
        return "https://farm" +
            photo['farm'] + ".staticflickr.com/" +
            photo['server'] + "/" +
            photo['id'] + "_" +
            photo['secret'] + ".jpg";
    }

    function setImage(){
        var images = document.getElementsByTagName("img");

        if(images.length != 0){
            //var images = [].slice.call( node.getElementsByTagName("img") );
            for(var i = 0; i < images.length; i++){
                if(images[i].className.indexOf("hello-kitty-extension") == -1){
                    var w = images[i].width;
                    var h = images[i].height;
                    //TODO: возможно есть ошибка
                    // проверка размера и пропорций
                    if(w > 100 && h > 100 && w/h <= 2 && h/w <= 2){
                        var link = _imageLoader.randomLink();
                        if (link) {
                            images[i].src = link;
                            images[i].width = "" + w;
                            images[i].height = "" + h;
                            images[i].className += " hello-kitty-extension";
                        }
                    }

                }

            }
        }
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation){
            if(mutation.addedNodes.length != 0){
                mutation.addedNodes.forEach(function(node){
                    setImage();
                });
            }
        });
    });

    var _imageLoader = new imageLoader();
    _imageLoader.load(1, function(data){
        var photos = data.photos.photo.sort(function(){
            return [-1,1,0][Math.floor(Math.random() * 2)];
        });

        photos.forEach(function(photo){
            _imageLoader.links.push({link: collectLink(photo), active: false});
        });

        setImage();

        observer.observe(document.body, {
            subtree: true,
            childList: true
        });
    });


    function Dictionary() {

    }

    Dictionary.prototype.load = function(){
        var self = this;

        var xmlhttp = new XMLHttpRequest();
        var url = chrome.extension.getURL('web_access/words.json');

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var words = JSON.parse(this.responseText);
                self.replaceOnPage(words);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    Dictionary.prototype.replaceOnPage = function(words){
        var textNodes = [];
        var all = document.body.getElementsByTagName("*");
        for (var i=0, max=all.length; i < max; i++) {
            if(all[i]){
                if(all[i].innerHTML != ""){
                    var reg = "";
                    words.change_words.forEach(function(word){
                        reg += word.base + "|";
                    });
                    reg.substring(0, reg.length - 1);

                    var test = new RegExp(reg);

                    if(test.test(all[i].innerHTML)){
                        console.log(all[i]);
                        
                    }
                    //all[i].innerHTML = all[i].innerHTML.replace("Новости", "<span style='background: #ffb7b7'>Котики</span>");
                }
            }

        }
    };


    var dict = new Dictionary();
    dict.load();

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

