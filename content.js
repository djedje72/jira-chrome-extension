(function() {
    $(function() {
        if ($("body").attr("id") === "jira") {
            console.log("[jira-chrome-extension] Current page is a JIRA page.");

            function dragInterval($ghxPool) {
                let maxLoop = 20;
                const interval = setInterval(function() {
                    const $columns = $ghxPool.find(".ghx-drag-in-progress .ghx-zone-overlay-column");
                    if($columns.length > 0) {
                        $ghxPool.scrollLeft($ghxPool.scrollLeft()+1);
                        $ghxPool.scrollLeft($ghxPool.scrollLeft()-1);
                        $columns.css({
                            "width": `${width?width:200}px`
                        });
                        clearInterval(interval);
                    }
                    if(maxLoop-- <= 0) {
                        clearInterval(interval);
                    }
                }, 50);
            }

            function dragEndInterval($this) {
                let maxLoop = 20;
                const interval = setInterval(function() {
                    if(!$this.is(':visible')) {
                        clearInterval(interval);
                        loadingInterval();
                    }
                    if(maxLoop-- <= 0) {
                        clearInterval(interval);
                    }
                }, 500);
            }

            function loadingInterval() {
                let maxLoop = 20;
                const interval = setInterval(function() {
                    if(!$('body').hasClass('ghx-loading-pool')) {
                        clearInterval(interval);
                        fixWidth();
                    }
                    if(maxLoop-- <= 0) {
                        clearInterval(interval);
                    }
                }, 100);
            }
            const $ghxPool = $('#ghx-pool-column #ghx-pool');
            $ghxPool.on('scroll', function() {
                followScroll($(this));
            });
            $ghxPool.on('mousedown', '.ui-draggable, .js-parent-drag', function() {
                const $this = $(this);
                dragInterval($ghxPool);
                dragEndInterval($this);
            });

            $(document).click(function() {
                loadingInterval();
                fixWidth();
            });
            
            //fix width when open page
            fixWidth();
        }
    });
    let width = 200;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if(request.type === "refresh") {
            if(request.value) {
                width = request.value;
            }
            fixWidth();
        }
    });

    function fixWidth() {
        $(function() {
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

                const $uiDraggable = $ghxPool.find(".ui-draggable, .js-parent-drag");
                $uiDraggable.attr('jira-chrome-extension', 'done');
            }
        });
    }
    function followScroll($ghxPool) {
        const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
        $ghxColumnHeaderGroup.css({
            "overflow": "hidden"
        });
        const $ghxColumnHeaders = $ghxColumnHeaderGroup.find("#ghx-column-headers");
        //$jsSwimlaneHeaderStalker = $('js-swimlane-header-stalker');
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