"use strict";
const flsModules = {};
let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(
                new CustomEvent("slideUpDone", {
                    detail: {
                        target,
                    },
                })
            );
        }, duration);
    }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(
                new CustomEvent("slideDownDone", {
                    detail: {
                        target,
                    },
                })
            );
        }, duration);
    }
};
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration);
    else return _slideUp(target, duration);
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
    if (document.documentElement.classList.contains("lock")) bodyUnlock(delay);
    else bodyLock(delay);
};
let bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
            lockPaddingElements.forEach((lockPaddingElement) => {
                lockPaddingElement.style.paddingRight = "";
            });
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }, delay);
        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
};
let bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement) => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        });
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
};
// Spollers
function spollers() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {
        document.addEventListener("click", setSpollerAction);
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        if (spollersRegular.length) initSpollers(spollersRegular);
        let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
        if (mdQueriesArray && mdQueriesArray.length)
            mdQueriesArray.forEach((mdQueriesItem) => {
                mdQueriesItem.matchMedia.addEventListener("change", function () {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach((spollersBlock) => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("_spoller-init");
                    initSpollerBody(spollersBlock);
                } else {
                    spollersBlock.classList.remove("_spoller-init");
                    initSpollerBody(spollersBlock, false);
                }
            });
        }
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            let spollerItems = spollersBlock.querySelectorAll("details");
            if (spollerItems.length)
                spollerItems.forEach((spollerItem) => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
        }
        function setSpollerAction(e) {
            const el = e.target;
            if (el.closest("summary") && el.closest("[data-spollers]")) {
                e.preventDefault();
                if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                    const spollerTitle = el.closest("summary");
                    const spollerBlock = spollerTitle.closest("details");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed
                        ? parseInt(spollersBlock.dataset.spollersSpeed)
                        : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                        !spollerBlock.open
                            ? (spollerBlock.open = true)
                            : setTimeout(() => {
                                  spollerBlock.open = false;
                              }, spollerSpeed);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                        if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                            const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                            const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                            const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader")
                                ? document.querySelector(".header").offsetHeight
                                : 0;
                            window.scrollTo({
                                top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                behavior: "smooth",
                            });
                        }
                    }
                }
            }
            if (!el.closest("[data-spollers]")) {
                const spollersClose = document.querySelectorAll("[data-spoller-close]");
                if (spollersClose.length)
                    spollersClose.forEach((spollerClose) => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed
                                ? parseInt(spollersBlock.dataset.spollersSpeed)
                                : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout(() => {
                                spollerCloseBlock.open = false;
                            }, spollerSpeed);
                        }
                    });
            }
        }
        function hideSpollersBody(spollersBlock) {
            const spollerActiveBlock = spollersBlock.querySelector("details[open]");
            if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed
                    ? parseInt(spollersBlock.dataset.spollersSpeed)
                    : 500;
                spollerActiveTitle.classList.remove("_spoller-active");
                _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                setTimeout(() => {
                    spollerActiveBlock.open = false;
                }, spollerSpeed);
            }
        }
    }
}
// Menu
function menuInit() {
    if (document.querySelector(".icon-menu"))
        document.addEventListener("click", function (e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
            if (bodyLockStatus && e.target.closest(".menu__link")) menuClose();
        });
}
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}
function removeClasses(array, className) {
    for (var i = 0; i < array.length; i++) array[i].classList.remove(className);
}
function uniqArray(array) {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
}
function dataMediaQueries(array, dataSetValue) {
    const media = Array.from(array).filter(function (item, index, self) {
        if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
    });
    if (media.length) {
        const breakpointsArray = [];
        media.forEach((item) => {
            const params = item.dataset[dataSetValue];
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });
        let mdQueries = breakpointsArray.map(function (item) {
            return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
        });
        mdQueries = uniqArray(mdQueries);
        const mdQueriesArray = [];
        if (mdQueries.length) {
            mdQueries.forEach((breakpoint) => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);
                const itemsArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                });
                mdQueriesArray.push({
                    itemsArray,
                    matchMedia,
                });
            });
            return mdQueriesArray;
        }
    }
}
// Sliders
function initSliders() {
    if (document.querySelector(".promo__slider"))
        new Swiper(".promo__slider", {
            modules: [Pagination, Autoplay],
            observer: true,
            observeParents: true,
            slidesPerView: 4,
            spaceBetween: 24,
            speed: 800,
            autoplay: {
                delay: 3e3,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                319: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                649.98: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
                991.98: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                },
            },
            on: {},
        });
    if (document.querySelector(".news__slider"))
        new Swiper(".news__slider", {
            modules: [],
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            spaceBetween: 24,
            speed: 800,
            breakpoints: {
                319: {
                    slidesPerView: 1.2,
                    spaceBetween: 24,
                },
                649.98: {
                    slidesPerView: 2.2,
                    spaceBetween: 24,
                },
                767.98: {
                    slidesPerView: 1.6,
                    spaceBetween: 24,
                },
                991.98: {
                    slidesPerView: 2.2,
                    spaceBetween: 24,
                },
                1099.98: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
            },
            on: {},
        });
}
window.addEventListener("load", function (e) {
    initSliders();
});
// Gallery
const galleries = document.querySelectorAll("[data-gallery]");
if (galleries.length) {
    let galleyItems = [];
    galleries.forEach((gallery) => {
        galleyItems.push({
            gallery,
            galleryClass: lightgallery_es5(gallery, {
                licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
                speed: 500,
            }),
        });
    });
    flsModules.gallery = galleyItems;
}
// DynamicAdaptive
class DynamicAdapt {
    constructor(type) {
        this.type = type;
    }
    init() {
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = [...document.querySelectorAll("[data-da]")];
        this.nodes.forEach((node) => {
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        });
        this.arraySort(this.оbjects);
        this.mediaQueries = this.оbjects
            .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)
            .filter((item, index, self) => self.indexOf(item) === index);
        this.mediaQueries.forEach((media) => {
            const mediaSplit = media.split(",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
            matchMedia.addEventListener("change", () => {
                this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        });
    }
    mediaHandler(matchMedia, оbjects) {
        if (matchMedia.matches)
            оbjects.forEach((оbject) => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            });
        else
            оbjects.forEach(({ parent, element, index }) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            });
    }
    moveTo(place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === "last" || place >= destination.children.length) {
            destination.append(element);
            return;
        }
        if (place === "first") {
            destination.prepend(element);
            return;
        }
        destination.children[place].before(element);
    }
    moveBack(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== void 0) parent.children[index].before(element);
        else parent.append(element);
    }
    indexInParent(parent, element) {
        return [...parent.children].indexOf(element);
    }
    arraySort(arr) {
        if (this.type === "min")
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            });
        else {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return 1;
                    if (a.place === "last" || b.place === "first") return -1;
                    return 0;
                }
                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    }
}
const da = new DynamicAdapt("max");
da.init();
// Click document
document.addEventListener("click", (e) => {
    const targetElement = e.target;
    if (targetElement.closest(".search-block__btn"))
        targetElement.closest(".search-block").classList.add("open-search");
    if (!targetElement.closest(".search-block__btn") && !targetElement.closest(".search-block__field"))
        removeClasses(document.querySelectorAll(".search-block.open-search"), "open-search");
});
// Scroll line text
document.querySelectorAll(".line-text").forEach((line) => {
    const copyLine = document.querySelector(".line-text__items").cloneNode(true);
    line.appendChild(copyLine);
});

menuInit();
spollers();