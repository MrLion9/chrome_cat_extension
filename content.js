

    // var tag = "cats";
    // var key = "ba49d98b5aefb7a284efcf1e9001466f";
    // var token = "72157670705224674-b512ed677339242e";

    // var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+
    //     key+"&tags="+tag+"&format=json&nojsoncallback=1&auth_token="+
    //     token+"&api_sig=d5d0a55b9404f86d79a46037f29f7bfc";

    //var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ba49d98b5aefb7a284efcf1e9001466f&tags=cats&safe_search=&is_getty=&format=json&nojsoncallback=1&auth_token=72157670705224674-b512ed677339242e&api_sig=d5d0a55b9404f86d79a46037f29f7bfc";



    /***/
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


    var words;
    /***/
    function Dictionary() {}

    Dictionary.prototype.load = function(){
        var self = this;

        var xmlhttp = new XMLHttpRequest();
        var url = chrome.extension.getURL('web_access/words.json');

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                words = JSON.parse(this.responseText);
                self.replaceOnPage(document.body);

                setImage();
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    Dictionary.prototype.replaceOnPage = function(node){
        var textNodes = [];
        //var all = document.body.getElementsByTagName( "*" );

        var tags = ["div", "span", "p", "li", "h1", "h2", "h3"];

        tags.forEach(function(tag){
            if(typeof node.getElementsByTagName == "function"){
                var all = node.getElementsByTagName(tag);
                for (var i=0, max=all.length; i < max; i++) {
                    if(all[i]){
                        if(all[i].innerHTML != ""){
                            words[0].forEach(function(pair){
                                all[i].innerHTML = all[i].innerHTML.replace(
                                    new RegExp(pair[0]),
                                    "<span style='background: #ffb7b7'>"+pair[1]+"</span>");
                            });
                        }
                    }

                }
            }

        });
    };

    var dict = new Dictionary();
    var _imageLoader = new imageLoader();

    function collectLink(photo){
        return "https://farm" +
            photo['farm'] + ".staticflickr.com/" +
            photo['server'] + "/" +
            photo['id'] + "_" +
            photo['secret'] + ".jpg";
    }

    function setImage(image){
        var images = document.getElementsByTagName("img");

        if(images.length != 0) {
            //var images = [].slice.call( node.getElementsByTagName("img") );
            for (var i = 0; i < images.length; i++) {
                if (images[i].className.indexOf("hello-kitty-extension") == -1) {
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

                    // dict.replaceOnPage(node);
                });
            }
        });
    });

    _imageLoader.load(1, function(data){
        var photos = data.photos.photo.sort(function(){
            return [-1,1,0][Math.floor(Math.random() * 2)];
        });

        photos.forEach(function(photo){
            _imageLoader.links.push({link: collectLink(photo), active: false});
        });

        //setImage();

        dict.load();

        observer.observe(document.body, {
            subtree: true,
            childList: true
        });
    });


