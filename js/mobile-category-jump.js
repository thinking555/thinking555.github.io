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

        var oldJump = searchWrap.querySelector(":scope > .mobile-category-jump");
        if (oldJump) {
            oldJump.remove();
        }

        var menu = searchWrap.querySelector(".mobile-category-menu");
        if (!menu) {
            menu = document.createElement("div");
            menu.className = "mobile-category-menu";
            (buttonGroup || searchBox).insertAdjacentElement("afterend", menu);
        }

        var toggle = menu.querySelector(".mobile-category-toggle");
        if (!toggle) {
            toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "mobile-category-toggle";
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "分类跳转";
            menu.appendChild(toggle);
        }

        var jump = menu.querySelector(".mobile-category-jump");
        if (!jump) {
            jump = document.createElement("nav");
            jump.className = "mobile-category-jump";
            jump.id = "mobile-category-jump";
            jump.hidden = true;
            jump.setAttribute("aria-label", "分类快速跳转");
            menu.appendChild(jump);
        }

        toggle.setAttribute("aria-controls", jump.id);
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

        toggle.addEventListener("click", function () {
            var isOpen = menu.classList.toggle("is-open");
            jump.hidden = !isOpen;
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        jump.addEventListener("click", function (event) {
            if (!event.target.closest("a")) return;
            menu.classList.remove("is-open");
            jump.hidden = true;
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}());
