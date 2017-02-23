$(function() {
    let currentValue = localStorage.getItem("value");
    const $rowWidth = $("input[name=rowWidth]");
    if(!currentValue && $rowWidth.length > 0) {
        currentValue = $rowWidth.val();
    }

    const $rowWidthDisplay = $('.rowWidthDisplay');
    const $rowWidthDisplaySpan = $('.rowWidthDisplay').find('span');
    if(currentValue) {
        $rowWidth.val(currentValue);
        setValue(currentValue);
    }

    $rowWidth.change(function() {
        const $this = $(this);
        const value = $this.val();
        setValue(value);
        localStorage.setItem("value", value);
    });

    function setValue(value) {
        $rowWidthDisplaySpan.text(value);
        refreshValue(value);
    }

    function refreshValue(value) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "refresh", value: value});
        });
    }
});