const splide = new Splide(".splide", {
  type: "loop",
  perPage: 4,
  focus: "center",
  autoplay: true,
  gap: "1rem",
  pagination: false,
  interval: 2500,
  speed: 1000,
  arrows: false,
  focus: "number",
  breakpoints: {  
    992: {
      perPage: 3,
    },
    640: {
      perPage: 2,
    },
    480: {
      perPage: 1,
      focus: "center",
      width: "90%",
    },
  },
});
splide.mount();

document.addEventListener("DOMContentLoaded", function(event) {
  const faders = document.querySelectorAll("[data-fade]");

  const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -100px 0px",
  };
  
  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      } else {
        const fadeDir = entry.target.getAttribute("data-fade");
        const fadeSpeed = entry.target.getAttribute("data-fade-speed") || "0.8s";
        const fadeDelay = entry.target.getAttribute("data-fade-delay") || "0s";
  
        switch (fadeDir) {
          case "left":
            entry.target.style.animation = `fade-left ${fadeSpeed} ease-in-out forwards ${fadeDelay}`;
            break;
          case "right":
            entry.target.style.animation = `fade-right ${fadeSpeed} ease-in-out forwards ${fadeDelay}`;
            break;
          case "up":
            entry.target.style.animation = `fade-up ${fadeSpeed} ease-in-out forwards ${fadeDelay}`;
            break;
          case "down":
            entry.target.style.animation = `fade-down ${fadeSpeed} ease-in-out forwards ${fadeDelay}`;
            break;
          case "in":
            entry.target.style.animation = `fade-in ${fadeSpeed} ease-in-out forwards ${fadeDelay}`;
            break;
          default:
            entry.target.style.animation = `fade-up ${fadeSpeed} ease-in-out forwards ${fadeDelay}`;
            break;
        }
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  
  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
  
});

