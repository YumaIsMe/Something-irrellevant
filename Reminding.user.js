// ==UserScript==
// @name         Remove Adblock Thing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes Adblock Thing
// @author       Yuma
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/YumaIsMe/Something-irrellevant/raw/main/Reminding.user.js
// @downloadURL  https://github.com/YumaIsMe/Something-irrellevant/raw/main/Reminding.user.js
// @grant        none


(function () {
  const adblocker = true;
  const removePopup = true;
  const debug = true;
  const domainsToRemove = ['*.youtube-nocookie.com/*'];
  const jsonPathsToRemove = [
    'playerResponse.adPlacements',
    'playerResponse.playerAds',
    'adPlacements',
    'playerAds',
    'playerConfig',
    'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
  ];

  const observerConfig = { childList: true, subtree: true };
  const keyEvent = new KeyboardEvent("keydown", { key: "k", code: "KeyK", keyCode: 75, which: 75, bubbles: true, cancelable: true, view: window });
  const mouseEvent = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });

  let unpausedAfterSkip = 0;

  if (debug) console.log("Remove Adblock Thing: Script started");
  window.__ytplayer_adblockDetected = false;

  if (adblocker) addblocker();
  if (removePopup) popupRemover();
  if (removePopup) observer.observe(document.body, observerConfig);

  function popupRemover() {
    const bodyStyle = document.body.style;
    const fullScreenButton = document.querySelector(".ytp-fullscreen-button");
    const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
    const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
    const popupButton = document.getElementById("dismiss-button");

    bodyStyle.setProperty('overflow-y', 'auto', 'important');

    if (modalOverlay) {
      modalOverlay.removeAttribute("opened");
      modalOverlay.remove();
    }

    if (popup) {
      if (debug) console.log("Remove Adblock Thing: Popup detected, removing...");

      if (popupButton) popupButton.click();
      popup.remove();
      unpausedAfterSkip = 2;

      fullScreenButton.dispatchEvent(mouseEvent);

      setTimeout(() => {
        fullScreenButton.dispatchEvent(mouseEvent);
      }, 500);

      if (debug) console.log("Remove Adblock Thing: Popup removed");
    }

    if (!unpausedAfterSkip > 0) return;

    const video1 = document.querySelector("#movie_player > video.html5-main-video");
    const video2 = document.querySelector("#movie_player > .html5-video-container > video");

    if (video1 && video1.paused) unPauseVideo();
    else if (video2 && video2.paused) unPauseVideo();
    else if (unpausedAfterSkip > 0) unpausedAfterSkip--;

    setTimeout(popupRemover, 1000);
  }

  function addblocker() {
    setTimeout(() => {
      const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
      const ad = document.querySelector('.ad-showing');
      const sidAd = document.querySelector('ytd-action-companion-ad-renderer');
      const displayAd = document.querySelector('div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint');
      const sparklesContainer = document.querySelector('div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer');
      const mainContainer = document.querySelector('div#main-container.style-scope.ytd-promoted-video-renderer');
      const feedAd = document.querySelector('ytd-in-feed-ad-layout-renderer');
      const mastheadAd = document.querySelector('.ytd-video-masthead-ad-v3-renderer');
      const sponsor = document.querySelectorAll("div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy");

      if (ad) {
        const video = document.querySelector('video');
        if (video && isFinite(video.duration)) {
          video.playbackRate = 10;
          video.volume = 0;
          video.currentTime = Math.min(video.duration, video.currentTime + 1); // Setting currentTime to a value slightly less than the duration
          skipBtn?.click();
        }
    }

      sidAd?.remove();
      displayAd?.remove();
      sparklesContainer?.remove();
      mainContainer?.remove();
      feedAd?.remove();
      mastheadAd?.remove();
      sponsor?.forEach(element => element.remove());

      setTimeout(addblocker, 50);
    }, 50);
  }

  function unPauseVideo() {
    document.dispatchEvent(keyEvent);
    unpausedAfterSkip = 0;
    if (debug) console.log("Remove Adblock Thing: Unpaused video using 'k' key");
  }

  function removeJsonPaths(domains, jsonPaths) {
    const currentDomain = window.location.hostname;
    if (!domains.includes(currentDomain)) return;

    jsonPaths.forEach(jsonPath => {
      let obj = window;
      for (const part of jsonPath.split('.')) {
        if (!obj || !obj.hasOwnProperty(part)) break;
        obj = obj[part];
      }
    });
  }

})();
