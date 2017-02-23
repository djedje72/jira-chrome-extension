$(function() {
    setInterval(() => {
        if($('#ghx-pool [jira-chrome-extension]').length === 0) {
            fixWidth();
        }
    }, 50);
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

            const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
            $ghxColumnHeaderGroup.css({
                "position": "initial"
            });
        }
    });
}