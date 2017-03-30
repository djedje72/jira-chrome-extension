(function() {
    setTimeout(() => {
        if(GH && GH.Layout && GH.Layout.fireDelayedWindowResize) {
            GH.Layout.fireDelayedWindowResize();
        }
    }, 200);
})();