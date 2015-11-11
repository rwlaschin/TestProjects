// ==UserScript==
// @name         Demo for Interstitial
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @include        https://apps.facebook.com/dicewithbuddies/*
// @include        https://apps.facebook.com/playzoo/zoo/home.php*
// ==/UserScript==

// http://cdnrockyou-a.akamaihd.net/apps/ams/images/dicebuddies_bg.png 
// http://cdnrockyou-a.akamaihd.net/apps/ams/images/yahtzee_bg.png

/*
.left-bumper > .btn-wrap > button - roll 'button'
.btn-wrap > button > div.roll-count-wrap > span > span.count - keeps track of counts
.right-bumper > .btn-wrap > button - plays move, start interstitial
.middle-bumper - dice are held
*/

var _calculatedGameName = 'dicewithbuddies';
if ( /yahtzee.?withbuddies/.test(location.hostname) == true ) {
    _calculatedGameName = 'yahtzeewithbuddies';
}

(function(gameName){ // namespace hiding
    var gameConfigs = { 'dicewithbuddies' : { 'placeguid': '276AC58838', 'modal-color' : '#82acc1',
                            'background' : "url('//cdnrockyou-a.akamaihd.net/apps/ams/images/dicebuddies_bg.png')"}, // scopely needs to host this
                        'yahtzeewithbuddies' : { 'placeguid' : '6C05458839', 'modal-color' : '#904e4f',
                            'background' : "url('//cdnrockyou-a.akamaihd.net/apps/ams/images/yahtzee_bg.png')" } // scopely needs to host this
                      };
    var gameConfig = gameConfigs[gameName];
    var modalElement;

    window.ryanInterstitial = undefined;
    window.RYANCoreonReady = window.RYANCoreonReady || [];

    var containerId = "ry_interstitialcontainerdiv";
    var modalId = "ry_modalcontainerdiv";
    
    function insertScript(url) {
        var elem = window.document.createElement('script');
        elem.type = 'text/javascript'; 
        elem.src = url;
        elem.async = true;
        var head = window.document.getElementsByTagName('head')[0];
        head.appendChild(elem);
    }
    if( !window.RYANCore ) {
        insertScript("//rya.rockyou.com/rya/js/RYANCore.cb.js"); // this might be better
    }
    
    function initializeInterstitial() {
        var config = {'placeguid': gameConfig.placeguid,
                      'nameSpace': "ryanInterstitial",
                      'containerId' : containerId, 
                      "autoHide": true
                     };

        window.ryanInterstitial = new RYANCore(config);
        window.ryanInterstitial.setAdSize('425px','690px');
        window.ryanInterstitial.registerEventHandler(RYANCore.HLOAD, addShowModal);
        window.ryanInterstitial.registerEventListener(RYANCore.AD_COMPLETE, interstitialAdComplete);
        window.ryanInterstitial.registerEventListener(RYANCore.NO_AD, interstitialNoAd);
    }

    function getCreateModal() {
        modalElement = window.document.getElementById(modalId);
        if( !modalElement) { // could have been deleted by user, readd if necessary
            modalElement = window.document.createElement('div');
            modalElement.id = modalId;
            modalElement.style.display = 'none'; // start off hidden
            modalElement.style.position = "absolute";
            modalElement.style.top = "0px";
            modalElement.style.left = "0px";
            modalElement.style.zIndex = "1000";
            modalElement.style['background-color'] = gameConfig['modal-color'];
            modalElement.style['-ms-filter'] = "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
            modalElement.style['filter'] = "alpha(opacity=60)";
            modalElement.style['-moz-opacity'] = '0.60';
            modalElement.style['-khtml-opacity'] = '0.60';
            modalElement.style['opacity'] = '0.60';
            $('body').append(modalElement);
        }
        return modalElement;
    }

    function addShowModal() {
        try {
            modalElement = getCreateModal();
            modalElement.style.width = "100%";
            modalElement.style.height = "100%";
            modalElement.style.display = "inline";
        } catch(e) {}
    }

    function hideModal() {
        try {
            modalElement = window.document.getElementById(modalId);
            if( !!modalElement ) {
                // make sure I'm over the top of any elements
                modalElement.style.width = "0px";
                modalElement.style.height = "0px";
                modalElement.style.display = "none";
            }
        } catch(e) {}
    }

    function interstitialAdComplete() {
        hideModal();
    }

    function interstitialNoAd() {
        hideModal();
    }

    function getCreateAdDiv() {
        var divElement = window.document.getElementById(containerId);
        if( !divElement ) {
            divElement = window.document.createElement('div');
            divElement.id = containerId;
            divElement.style.zIndex = "2000";
            // styling for auto-centering and positioning
            divElement.style.top = '50%';
            divElement.style.left = '50%';
            divElement.style['transform'] = 'translate(-50%,-90%)';
            divElement.style['-moz-transform'] = 'translate(-50%,-90%)';
            divElement.style['-webkit-transform'] = 'translate(-50%,-90%)';

            // remove from rendering, hide
            divElement.style.visibility = "hidden";
            divElement.style.position = "absolute";
            divElement.style.padding = '50px 38px';
            divElement.style['background'] = gameConfig['background'];
            divElement.style['background-size'] = 'auto';
            divElement.style.width = '762px'; 
            divElement.style.height = '555px';
            $('body').append(divElement);
        }
        return divElement;
    }
    
    function attachControls() {
        if( ! $ ) { window.setTimeout(100, attachControls); }
        
        // <div id="<?php echo $containerName;?>" style="border:1px solid orange"></div>
        getCreateAdDiv();

        // is this ok for all browsers?
        $('.right-bumper > .btn-wrap > .btn-play').click(playAd);
    }
    
    function playAd() {
        getCreateAdDiv(); // make sure I exist
        window.ryanInterstitial.loadAd();
    }
    
    window.RYANCoreonReady.push( function () {
                try {
                    initializeInterstitial();
                } catch(e) {}
            }
        );
    window.RYANCoreonReady.push( function () {
                try { 
                    attachControls();
                } catch(e) {}
            }
        );

})(_calculatedGameName);