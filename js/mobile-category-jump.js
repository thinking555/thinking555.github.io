(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    onReady(function () {
        var searchWrap = document.querySelector(".search-wrap");
        var searchBox = searchWrap && searchWrap.querySelector(".search-box");
        var buttonGroup = searchWrap && searchWrap.querySelector(".button-group, .search-actions");
        var sections = Array.from(document.querySelectorAll(".container .section")).filter(function (section) {
            var title = section.querySelector("h3");
            return title && title.textContent.trim();
        });

        if (!searchWrap || !searchBox || !sections.length) return;

        var oldMenu = searchWrap.querySelector(".mobile-category-menu");
        if (oldMenu) {
            oldMenu.remove();
        }

        var jump = searchWrap.querySelector(".mobile-category-jump");
        if (!jump) {
            jump = document.createElement("nav");
            jump.className = "mobile-category-jump";
            jump.id = "mobile-category-jump";
            jump.setAttribute("aria-label", "分类快速跳转");
            (buttonGroup || searchBox).insertAdjacentElement("afterend", jump);
        }

        jump.textContent = "";

        sections.forEach(function (section, index) {
            var title = section.querySelector("h3");
            var text = title.textContent.trim();

            if (!section.id) {
                section.id = "category-" + (index + 1);
            }

            var link = document.createElement("a");
            link.href = "#" + section.id;
            link.textContent = text;
            jump.appendChild(link);
        });

        var backTop = document.querySelector(".mobile-back-top");
        if (!backTop) {
            backTop = document.createElement("button");
            backTop.type = "button";
            backTop.className = "mobile-back-top";
            backTop.setAttribute("aria-label", "回到顶部");
            backTop.textContent = "↑";
            document.body.appendChild(backTop);
        }

        function updateBackTop() {
            backTop.classList.toggle("is-visible", window.scrollY > 360);
        }

        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", updateBackTop, { passive: true });
        window.addEventListener("resize", updateBackTop);
        updateBackTop();
    });
}());
