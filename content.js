$(function() {
    const $jira = $('body#jira');
    if($jira.length > 0) {
        $jira.click(() => fixWidth());
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

            $ghxPool.find(".ui-draggable").mousedown(function() {
                setTimeout(function() {
                    $ghxPool.scrollLeft($ghxPool.scrollLeft()+1);
                    $ghxPool.scrollLeft($ghxPool.scrollLeft()-1);
                    $ghxPool.find(".ghx-drag-in-progress .ghx-zone-overlay-column").css({
                        "width": `${width?width:200}px`
                    });
                }, 300);
            });

            const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
            $ghxColumnHeaderGroup.css({
                "position": "initial"
            });

        }
    });
}