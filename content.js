$(function() {
    setInterval(() => {
        if($('#ghx-pool [jira-chrome-extension]').length === 0) {
            fixWidth();
        }
    }, 50);

    $('.ghx-swimlane-header').click(function() {
        fixWidth();
    });
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
            $ghxPool.off('scroll').on('scroll', function() {
                followScroll($(this));
            });
            const $firstSwimlane = $ghxPool.find('.ghx-swimlane.ghx-first');
            $firstSwimlane.css({
                "padding-top": "20px"
            });

            const $ghxDetailContents = $('#ghx-detail-contents');
            $ghxDetailContents.css({
                "position": "fixed",
                "z-index": 2
            });

            const $uiDraggable = $ghxPool.find(".ui-draggable");
            $uiDraggable.attr('jira-chrome-extension', 'done');
            $uiDraggable.off('mousedown').on('mousedown', function() {
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
            });

            $ghxPool.css({
                "padding-top": "50px"
            });
        }
    });

    function followScroll($ghxPool) {
        const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
        $ghxColumnHeaderGroup.css({
            "overflow": "hidden"
        })
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
}