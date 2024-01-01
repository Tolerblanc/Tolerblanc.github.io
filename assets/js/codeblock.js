var codeBlocks = document.querySelectorAll("pre.highlight");

codeBlocks.forEach(function (codeBlock) {
    var copyButton = document.createElement("button");
    copyButton.className = "copy";
    copyButton.type = "button";
    copyButton.ariaLabel = "Copy code to clipboard";
    copyButton.innerHTML = '<i class="fas fa-copy 3x" style="color: #ffffff;"></i>';

    codeBlock.append(copyButton);

    copyButton.addEventListener("click", function () {
        var code = codeBlock.querySelector("code").innerText.trim();
        window.navigator.clipboard.writeText(code);

        copyButton.innerHTML = '<i class="fas fa-check 3x" style="color: #ffffff;"></i>';
        var timer = 3000;

        setTimeout(function () {
            copyButton.innerHTML = '<i class="fas fa-copy 3x" style="color: #ffffff;"></i>';
        }, timer);
    });
});
