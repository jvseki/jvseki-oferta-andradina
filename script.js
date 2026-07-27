const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* Lightbox das prints */
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const img = lightbox.querySelector(".lightbox__img");
  const caption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const panel = lightbox.querySelector(".lightbox__panel");

  const openLightbox = (src, text, alt) => {
    img.src = src;
    img.alt = alt || "Print ampliada";
    caption.textContent = text || "Role para ver a print completa";
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    window.setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) {
        lightbox.hidden = true;
        img.removeAttribute("src");
      }
    }, 250);
  };

  document.querySelectorAll("[data-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const shot = btn.querySelector("img");
      openLightbox(
        btn.getAttribute("data-lightbox"),
        btn.getAttribute("data-caption"),
        shot ? shot.alt : ""
      );
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  panel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}
