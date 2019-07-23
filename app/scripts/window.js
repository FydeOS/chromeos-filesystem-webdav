"use strict";

(function() {

    var NUTSHARE_URL = 'https://dav.jianguoyun.com/dav/';

    var onLoad = function() {
        assignEventHandlers();
    };

    var assignEventHandlers = function() {
        var btnMount = document.querySelector("#btnMount");
        btnMount.addEventListener("click", function(e) {
            onClickedBtnMount(e);
        });

        $('.input-field').on('input', function () {
            if ($('#password').val().length > 0 && $('#username').val().length > 0) {
                $('#btnMount').removeClass('disabled');
            } else {
                $('#btnMount').addClass('disabled');
            }
        });
    };

    var onClickedBtnMount = function(evt) {
        var btnMount = document.querySelector("#btnMount");
        evt.preventDefault();
        btnMount.setAttribute("disabled", "true");
        var url = NUTSHARE_URL;
        if (url.substring(url.length - 1) === "/") {
            url = url.substring(0, url.length - 1);
        }
        $.toast({text: chrome.i18n.getMessage("mountAttempt"), loader: false});
        var request = {
            type: "mount",
            url: url,
            authType: 'basic',
            username: document.querySelector("#username").value,
            password: document.querySelector("#password").value
        };
        chrome.runtime.sendMessage(request, function(response) {
            if (response.success) {
                $.toast({text: chrome.i18n.getMessage("mountSuccess"), loader: false});
                window.setTimeout(function() {
                    window.close();
                }, 1000);
            } else {
                $.toast({text: chrome.i18n.getMessage("mountFail"), loader: false});
                btnMount.removeAttribute("disabled");
            }
        });
    };

    var setMessageResources = function() {
        var selector = "data-message";
        var elements = document.querySelectorAll("[" + selector + "]");

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];

            var messageID = element.getAttribute(selector);
            var messageText = chrome.i18n.getMessage(messageID);

            var textNode = null;

            switch(element.tagName.toLowerCase()) {
            case "button":
            case "h1":
            case "title":
            case "div":
            case "label":
                textNode = document.createTextNode(messageText);
                element.appendChild(textNode);
                break;
            }
        }
    };


    window.addEventListener("load", function(e) {
        onLoad();
    });

    setMessageResources();

})();
