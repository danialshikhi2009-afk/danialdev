```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SMOOTH SCROLL
    ========================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (targetId && targetId.length > 1) {

                const target = document.querySelector(targetId);

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            }
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

            /*
             * کمی تأخیر برای کارت‌ها
             * باعث می‌شود کارت‌ها یکی‌یکی ظاهر شوند.
             */

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

        /*
         * مرورگرهای قدیمی
         */

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    /* =========================
       SHARE WEBSITE
    ========================== */

    const shareButton = document.getElementById("shareSite");

    if (shareButton) {

        shareButton.addEventListener("click", async function () {

            const siteLink = window.location.href;

            const shareData = {
                title: "Danial | نمونه‌کارهای شخصی",
                text: "وب‌سایت شخصی دانیال؛ طراحی سایت و پروژه‌های خلاقانه",
                url: siteLink
            };

            try {

                if (navigator.share) {

                    await navigator.share(shareData);

                } else {

                    await copySiteLink(siteLink);

                }

            } catch (error) {

                /*
                 * اگر کاربر پنجره Share را بست،
                 * پیام خطا نمایش نمی‌دهیم.
                 */

                if (error.name !== "AbortError") {
                    await copySiteLink(siteLink);
                }

            }

        });

    }


    /* =========================
       COPY SITE LINK
    ========================== */

    async function copySiteLink(link) {

        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(link);

                showToast("لینک سایت کپی شد ✓");

                return;
            }

        } catch (error) {
            // روش جایگزین پایین اجرا می‌شود.
        }

        window.prompt(
            "لینک سایت رو انتخاب و کپی کن:",
            link
        );
    }


    /* =========================
       TOAST MESSAGE
    ========================== */

    function showToast(message) {

        const oldToast = document.querySelector(".site-toast");

        if (oldToast) {
            oldToast.remove();
        }

        const toast = document.createElement("div");

        toast.className = "site-toast";

        toast.textContent = message;

        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add("show");
        });

        setTimeout(function () {

            toast.classList.remove("show");

            setTimeout(function () {
                toast.remove();
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

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navLinks = document.querySelectorAll(
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

                        if (entry.isIntersecting) {

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

                        }

                    });

                },
                {
                    rootMargin: "-35% 0px -55% 0px",
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

    document.querySelectorAll(".btn").forEach(function (button) {

        button.addEventListener("click", function (event) {

            const ripple =
                document.createElement("span");

            ripple.className = "button-ripple";

            const rect =
                button.getBoundingClientRect();

            const size =
                Math.max(rect.width, rect.height);

            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;

            ripple.style.left =
                `${event.clientX - rect.left - size / 2}px`;

            ripple.style.top =
                `${event.clientY - rect.top - size / 2}px`;

            button.appendChild(ripple);

            setTimeout(function () {
                ripple.remove();
            }, 600);

        });

    });


    /* =========================
       IMAGE LOAD EFFECT
    ========================== */

    const projectImages =
        document.querySelectorAll(".project-image img");

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
