
    /***/
    function imageLoader(){
        this.links = [];
    }

    imageLoader.prototype.load = function(page, callback){
        var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c630e1c9b6e630fcccb3604125a4f319&tags=cat%2Ccats%2Ckitten%2Cbritish+cat&text=cats&sort=relevance&format=json&nojsoncallback=1";

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
    var reg;
    /***/
    function Dictionary() {}

    Dictionary.prototype.load = function(){
        var self = this;

        var xmlhttp = new XMLHttpRequest();
        var url = chrome.extension.getURL('web_access/words.json');

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                words = JSON.parse(this.responseText);

                reg = Object.keys(words).join("|");
                reg = new RegExp( "(" + reg + ")", "ig" );

                replaceText(reg, document.body);

                setImage(document.body);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    function replacer (match){
        return words[match];
    }

    var dict = new Dictionary();
    var _imageLoader = new imageLoader();

    function collectLink(photo){
        return "https://farm" +
            photo['farm'] + ".staticflickr.com/" +
            photo['server'] + "/" +
            photo['id'] + "_" +
            photo['secret'] + ".jpg";
    }

    function setImage(node){

        if(typeof node.getElementsByTagName == "undefined") return;

        var images = node.getElementsByTagName("img");

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

    function replaceText(reg, node){
        node = node || document.body;

        var childs = node.childNodes, i = 0;

        while(node = childs[i]){
            if (node.nodeType == 3){
                if (node.textContent) {
                    node.textContent = node.textContent.replace(reg, replacer);
                } else { // support to IE
                    node.nodeValue = node.nodeValue.replace(reg, replacer);
                }
            } else {
                replaceText(reg, node);
            }
            i++;
        }


    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation){
            if(mutation.addedNodes.length != 0){
                //console.log(mutation.addedNodes);

                mutation.addedNodes.forEach(function(node){
                    setImage(node);
                    replaceText(reg, node);
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


