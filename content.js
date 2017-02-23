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
            $ghxPoolColumn.css({
                    //"overflow-x": "scroll"
            });

            const $ghxPool = $ghxPoolColumn.find("#ghx-pool");
            $ghxPool.css({
                "padding-top": 0,
                //"width": "4000px",
                "height": "100%"
            });
            $ghxPool.find("li").css({
                "width": `${width?width:200}px`
            })

            const $ghxColumnHeaderGroup = $ghxPool.find("#ghx-column-header-group");
            $ghxColumnHeaderGroup.css({
                // "width": "4000px",
                "position": "initial"
            });
        }
    });
}