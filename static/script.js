```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SMOOTH SCROLL
    ========================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================
       SCROLL REVEAL
    ========================== */

    const revealElements = document.querySelectorAll(
        ".project-card, .about-card, .contact-box, .section-heading"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element, index) {

            element.classList.add("reveal");

            if (
                element.classList.contains("project-card") ||
                element.classList.contains("about-card")
            ) {

                element.style.transitionDelay =
                    `${Math.min(index * 0.08, 0.4)}s`;

            }

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {

            element.classList.add("visible");

        });

    }


    /* =========================
       SHARE WEBSITE
    ========================== */

    const shareButton =
        document.getElementById("shareSite");

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async function () {

                const siteLink =
                    window.location.origin;

                const shareData = {
                    title: "Danial | نمونه‌کارهای شخصی",
                    text:
                        "وب‌سایت شخصی دانیال؛ طراحی سایت و پروژه‌های خلاقانه",
                    url: siteLink
                };

                try {

                    /*
                     * موبایل‌هایی که Web Share API دارند
                     */
                    if (
                        navigator.share &&
                        typeof navigator.share === "function"
                    ) {

                        await navigator.share(shareData);

                        return;
                    }

                    /*
                     * اگر Share API وجود نداشت،
                     * لینک را کپی می‌کنیم.
                     */
                    await copySiteLink(siteLink);

                } catch (error) {

                    /*
                     * بستن پنجره Share توسط کاربر
                     * خطا محسوب نمی‌شود.
                     */
                    if (
                        !error ||
                        error.name !== "AbortError"
                    ) {

                        await copySiteLink(siteLink);

                    }

                }

            }
        );

    }


    /* =========================
       COPY SITE LINK
    ========================== */

    async function copySiteLink(link) {

        /*
         * روش اصلی
         */
        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(link);

                showToast("لینک سایت کپی شد ✓");

                return true;

            }

        } catch (error) {
            // روش جایگزین اجرا می‌شود.
        }


        /*
         * روش جایگزین برای مرورگرهای قدیمی
         */
        try {

            const textArea =
                document.createElement("textarea");

            textArea.value = link;

            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            textArea.style.pointerEvents = "none";

            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const copied =
                document.execCommand("copy");

            textArea.remove();

            if (copied) {

                showToast("لینک سایت کپی شد ✓");

                return true;

            }

        } catch (error) {
            // روش نهایی پایین اجرا می‌شود.
        }


        /*
         * روش نهایی
         */
        window.prompt(
            "لینک سایت رو انتخاب و کپی کن:",
            link
        );

        return false;
    }


    /* =========================
       TOAST MESSAGE
    ========================== */

    function showToast(message) {

        const oldToast =
            document.querySelector(".site-toast");

        if (oldToast) {
            oldToast.remove();
        }

        const toast =
            document.createElement("div");

        toast.className = "site-toast";

        toast.textContent = message;

        document.body.appendChild(toast);

        requestAnimationFrame(function () {

            toast.classList.add("show");

        });

        setTimeout(function () {

            toast.classList.remove("show");

            setTimeout(function () {

                if (toast.parentNode) {
                    toast.remove();
                }

            }, 300);

        }, 2500);

    }


    /* =========================
       BACK TO TOP
    ========================== */

    const backToTopButton =
        document.getElementById("backToTop");

    if (backToTopButton) {

        function updateBackToTopButton() {

            if (window.scrollY > 250) {

                backToTopButton.classList.add("show");

            } else {

                backToTopButton.classList.remove("show");

            }

        }


        window.addEventListener(
            "scroll",
            updateBackToTopButton,
            {
                passive: true
            }
        );


        updateBackToTopButton();


        backToTopButton.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =========================
       ACTIVE NAVIGATION
    ========================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );

    if (
        "IntersectionObserver" in window &&
        sections.length &&
        navLinks.length
    ) {

        const sectionObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const currentId =
                            entry.target.getAttribute("id");

                        navLinks.forEach(function (link) {

                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${currentId}`
                            ) {

                                link.classList.add("active");

                            }

                        });

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",

                    threshold: 0
                }
            );


        sections.forEach(function (section) {

            sectionObserver.observe(section);

        });

    }


    /* =========================
       BUTTON RIPPLE EFFECT
    ========================== */

    document.querySelectorAll(".btn").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    const ripple =
                        document.createElement("span");

                    ripple.className =
                        "button-ripple";


                    const rect =
                        button.getBoundingClientRect();


                    const size =
                        Math.max(
                            rect.width,
                            rect.height
                        );


                    ripple.style.width =
                        `${size}px`;

                    ripple.style.height =
                        `${size}px`;


                    ripple.style.left =
                        `${event.clientX - rect.left - size / 2}px`;

                    ripple.style.top =
                        `${event.clientY - rect.top - size / 2}px`;


                    button.appendChild(ripple);


                    setTimeout(function () {

                        if (ripple.parentNode) {
                            ripple.remove();
                        }

                    }, 600);

                }
            );

        }
    );


    /* =========================
       IMAGE LOAD EFFECT
    ========================== */

    const projectImages =
        document.querySelectorAll(
            ".project-image img"
        );

    projectImages.forEach(function (image) {

        if (image.complete) {

            image.classList.add("loaded");

        } else {

            image.addEventListener(
                "load",
                function () {

                    image.classList.add("loaded");

                }
            );

        }

    });


    /* =========================
       REDUCED MOTION
    ========================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (prefersReducedMotion.matches) {

        document.documentElement.style.scrollBehavior =
            "auto";

    }

});
```
