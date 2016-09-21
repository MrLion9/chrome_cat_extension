!function(){
   function HelloKitty()
   {
       this.links = [];
       this.words = null;
       this.reg = null;
       this.observer = null;
   }

   HelloKitty.prototype.start = function(){
       this.loadImages();
   };

   HelloKitty.prototype.loadImages = function(page, callback){
       var self = this;
       var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"+
           "&api_key=c630e1c9b6e630fcccb3604125a4f319"+
           "&tags=cat%2Ccats%2Ckitten%2Cbritish+cat&text=cats&sort=relevance&format=json&nojsoncallback=1";

       var xhr = new XMLHttpRequest();
       xhr.open("GET", url, true);
       xhr.onreadystatechange = function() {
           if (xhr.readyState == 4)
           {
               self.processImageData( JSON.parse(this.responseText) );
           }
       };
       xhr.send();
   };

   HelloKitty.prototype.loadDict = function(){
       var self = this;

       var xmlhttp = new XMLHttpRequest();
       var url = chrome.extension.getURL('web_access/words.json');

       xmlhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
               self.words = JSON.parse(this.responseText);

               self.reg = Object.keys(self.words).join("|");
               self.reg = new RegExp( "(" + self.reg + ")", "ig" );

               self.replaceText(document.body);

               self.setImage(document.body);

               self.startObserve();
           }
       };
       xmlhttp.open("GET", url, true);
       xmlhttp.send();
   };

   HelloKitty.prototype.processImageData = function(data){
       var self = this;
       var photos = data.photos.photo.sort(function(){
           return [-1,1,0][Math.floor(Math.random() * 2)];
       });

       photos.forEach(function(photo){
           self.links.push({link: self.collectLink(photo), active: false});
       });

       this.loadDict();
   };

   HelloKitty.prototype.randomLink = function(){
       return this.links[Math.floor(Math.random() * (this.links.length-1) )].link;
   };

   HelloKitty.prototype.collectLink = function(photo){
       return "https://farm" +
           photo['farm'] + ".staticflickr.com/" +
           photo['server'] + "/" +
           photo['id'] + "_" +
           photo['secret'] + ".jpg";
   };

   HelloKitty.prototype.createObserver = function(){
       var self = this;
       var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

       this.observer = new MutationObserver(function(mutations) {
           mutations.forEach(function(mutation){
               if(mutation.addedNodes.length != 0){
                   //console.log(mutation.addedNodes);

                   mutation.addedNodes.forEach(function(node){
                       self.setImage(node);
                       self.replaceText(node);
                   });
               }
           });
       });
   };

   HelloKitty.prototype.startObserve = function(){
       this.createObserver();
       this.observer.observe(document.body, {
           subtree: true,
           childList: true
       });
   };

   HelloKitty.prototype.setImage = function(node){
       if(typeof node.getElementsByTagName == "undefined") return;

       var images = node.getElementsByTagName("img");

       if(images.length != 0) {
           for (var i = 0; i < images.length; i++) {
               if (images[i].className.indexOf("hello-kitty-extension") == -1) {
                   var w = images[i].width;
                   var h = images[i].height;
                   //TODO: возможно есть ошибка
                   // проверка размера и пропорций
                   if(w > 100 && h > 100 && w/h <= 2 && h/w <= 2){
                       var link = this.randomLink();
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
   };

   HelloKitty.prototype.replaceText = function(node){
       var that = this;
       node = node || document.body;

       var childs = node.childNodes, i = 0;

       while(node = childs[i]){
           if (node.nodeType == 3){
               if (node.textContent) {
                   node.textContent = node.textContent.replace(this.reg, function(match){return that.words[match];});
               } else { // support to IE
                   node.nodeValue = node.nodeValue.replace(this.reg, function(match){return that.words[match];});
               }
           } else {
               this.replaceText(node);
           }
           i++;
       }
   };

   HelloKitty.prototype.connectWithPopup = function(data){
       // Inform the background page that
       // this tab should have a page-action
       chrome.runtime.sendMessage({
           from:    'content',
           subject: 'showPageAction'
       });

       // Listen for messages from the popup
       chrome.runtime.onMessage.addListener(function (msg, sender, response) {
           // First, validate the message's structure
           if ((msg.from === 'popup') && (msg.subject === 'info')) {

               // Directly respond to the sender (popup),
               // through the specified callback */
               response( data );
           }
       });
   };

   var _helloKitty = new HelloKitty();
    _helloKitty.start();
}();




    // var jqueryScript = document.createElement('script');
    // jqueryScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
    // document.head.appendChild(jqueryScript);
    //
    // jqueryScript.onload = function(){
    //
    //     var semantic = document.createElement('script');
    //     semantic.src = "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.4/semantic.min.js";
    //     document.head.appendChild(semantic);
    //
    //     var div = document.createElement('div');
    //     div.className = "ui modal";
    //     div.innerHTML = "<i class='close icon'></i>"+
    //         "<div class='header'>Modal Title</div>"+
    //         "<div class='description'>descjhfdksl</div>"+
    //         "<div class='actions'>"+
    //         "<div class='ui button'>Cancel</div>"+
    //         "<div class='ui button'>OK</div>"+
    //         "</div>";
    //     document.body.appendChild(div);
    // };


