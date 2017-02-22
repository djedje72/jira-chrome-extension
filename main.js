$(function() {
    $("input[name=rowWidth]").change(function() {
        $('.rowWidthDisplay').show();
        const value = $(this).val();
        $(".rowWidthDisplay span").text(value);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "refresh", value: value});
        });
    });
});