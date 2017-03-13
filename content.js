(function() {
    $(function() {
        if ($("body").attr("id") === "jira") {
            console.log("[jira-chrome-extension] Current page is a JIRA page.");

            let dragInterval;
            function drag($ghxPool) {
                clearInterval(dragInterval);
                let maxLoop = 20;
                dragInterval = setInterval(function() {
                    const $columns = $ghxPool.find(".ghx-drag-in-progress .ghx-zone-overlay-column");
                    if($columns.length > 0) {
                        $ghxPool.scrollLeft($ghxPool.scrollLeft()+1);
                        $ghxPool.scrollLeft($ghxPool.scrollLeft()-1);
                        $columns.css({
                            "width": `${width?width:200}px`
                        });
                        clearInterval(dragInterval);
                    }
                    if(maxLoop-- <= 0) {
                        clearInterval(dragInterval);
                    }
                }, 50);
            }

            let dragEndInterval;
            function dragEnd($this, callback) {
                clearInterval(dragEndInterval);
                let maxLoop = 1000;
                dragEndInterval = setInterval(function() {
                    if(!$this.is(':visible')) {
                        clearInterval(dragEndInterval);
                        loading(callback);
                    }
                    if(maxLoop-- <= 0) {
                        clearInterval(dragEndInterval);
                    }
                }, 200);
            }

            let loadingInterval;
            function loading(callback) {
                clearInterval(loadingInterval);
                let maxLoop = 1000;
                loadingInterval = setInterval(function() {
                    if(!$('body').hasClass('ghx-loading-pool')) {
                        clearInterval(loadingInterval);
                        fixWidth();
                        if(callback) {
                            callback();
                        }
                    }
                    if(maxLoop-- <= 0) {
                        clearInterval(loadingInterval);
                    }
                }, 200);
            }
            const $ghxPool = $('#ghx-pool-column #ghx-pool');
            $ghxPool.on('scroll', function() {
                followScroll($(this));
            });

            $ghxPool.on('mousedown', '.ui-draggable, .js-parent-drag', function() {
                drag($ghxPool);
            });

            $ghxPool.on('mouseup', '.ui-draggable, .js-parent-drag', function() {
                const previousScrollLeft = $ghxPool.scrollLeft();
                const $this = $(this);
                dragEnd($this, () => {
                    $ghxPool.scrollLeft(previousScrollLeft);
                });
            });

            $(document).on('mouseup', function() {
                loading();
            });

            //fix width when open page
            fixWidth();
            setInterval(function() {
                fixWidth();
            }, 2000);
        }
    });
    let width = 200;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if(request.type === "refresh") {
            if(request.value) {
                width = request.value;
            }
            $(function() {
                fixWidth();
            });
        }
    });

    function fixWidth() {
        const $ghxPoolColumn = $("#ghx-pool-column");
        if($ghxPoolColumn.length > 0) {

            const $ghxPool = $ghxPoolColumn.find("#ghx-pool");
            $ghxPool.css({
                "padding-top": 0,
                "height": "100%"
            });
            $ghxPool.find("li").css({
                "width": `${width?width:200}px`
            });

            followScroll($ghxPool);

            const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
            
            const $firstSwimlane = $ghxPool.find('.ghx-swimlane.ghx-first');
            $firstSwimlane.css({
                "padding-top": `${$ghxColumnHeaderGroup.height()}px`
            });

            const $ghxDetailContents = $('#ghx-detail-contents');
            $ghxDetailContents.css({
                "position": "fixed",
                "z-index": 2
            });
        }
    }
    function followScroll($ghxPool) {
        const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
        $ghxColumnHeaderGroup.css({
            "overflow": "hidden"
        });
        const $ghxColumnHeaders = $ghxColumnHeaderGroup.find("#ghx-column-headers");
        
        const $floatGhxSwimlaneHeader = $('#js-swimlane-header-stalker:visible .ghx-swimlane-header');
        const currentSwimlaneId = $floatGhxSwimlaneHeader.attr('data-swimlane-id');

        const $ghxSwimlaneHeader = $ghxPool.find('.ghx-swimlane > .ghx-swimlane-header');
        $ghxSwimlaneHeader.css({
            "position": "relative",
            "left": `${$ghxPool.scrollLeft()}px`
        });
        
        $ghxPool.find(`[data-swimlane-id=${currentSwimlaneId}]`).not($floatGhxSwimlaneHeader).css({
            "position": "",
            "left": ""
        })
        $ghxColumnHeaders.css({
            "position": "relative",
            "left": `-${$ghxPool.scrollLeft()}px`
        });
    }
})();