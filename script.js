document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================
     HEADER
  ========================= */

  const header = document.getElementById("header");

  function handleHeader() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeader, { passive: true });
  handleHeader();


  /* =========================
     MENU MOBILE
  ========================= */

  const menuToggle = document.getElementById("menuToggle");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function closeMenu() {
    if (!menuToggle || !mobileOverlay) return;

    menuToggle.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !mobileOverlay) return;

    menuToggle.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileOverlay.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });


  /* =========================
     REVEAL AO ROLAR
  ========================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 0.035, 0.25)}s`;
    revealObserver.observe(element);
  });


  /* =========================
     CONTADORES
  ========================= */

  const counters = document.querySelectorAll(".stat-num");

  function animateCounter(element) {
    const target = Number(element.dataset.target || 0);
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);

      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });


  /* =========================
     CARROSSEL DE PREÇOS
  ========================= */

  const precoCarousel = document.getElementById("precoCarousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const carouselDots = document.getElementById("carouselDots");

  if (precoCarousel) {
    const cards = Array.from(
      precoCarousel.querySelectorAll(".preco-card")
    );

    let currentPriceIndex = 0;

    function getPriceStep() {
      if (!cards.length) return 0;

      const card = cards[0];
      const styles = window.getComputedStyle(precoCarousel);
      const gap = parseFloat(styles.columnGap || styles.gap || 0);

      return card.offsetWidth + gap;
    }

    function getVisibleCards() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 1050) return 2;
      return 3;
    }

    function getMaxPriceIndex() {
      return Math.max(
        0,
        cards.length - getVisibleCards()
      );
    }

    function updatePriceDots() {
      if (!carouselDots) return;

      carouselDots.innerHTML = "";

      const total = getMaxPriceIndex() + 1;

      for (let i = 0; i < total; i++) {
        const dot = document.createElement("button");

        dot.className = "carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir para item ${i + 1}`);

        if (i === currentPriceIndex) {
          dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
          currentPriceIndex = i;
          scrollPriceCarousel();
        });

        carouselDots.appendChild(dot);
      }
    }

    function scrollPriceCarousel() {
      const step = getPriceStep();

      precoCarousel.scrollTo({
        left: step * currentPriceIndex,
        behavior: "smooth",
      });

      updatePriceDots();
    }

    function goPriceNext() {
      const max = getMaxPriceIndex();

      currentPriceIndex++;

      if (currentPriceIndex > max) {
        currentPriceIndex = 0;
      }

      scrollPriceCarousel();
    }

    function goPricePrev() {
      const max = getMaxPriceIndex();

      currentPriceIndex--;

      if (currentPriceIndex < 0) {
        currentPriceIndex = max;
      }

      scrollPriceCarousel();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", goPriceNext);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", goPricePrev);
    }

    precoCarousel.addEventListener(
      "scroll",
      () => {
        const step = getPriceStep();

        if (!step) return;

        const newIndex = Math.round(
          precoCarousel.scrollLeft / step
        );

        currentPriceIndex = Math.max(
          0,
          Math.min(newIndex, getMaxPriceIndex())
        );

        updatePriceDots();
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      currentPriceIndex = Math.min(
        currentPriceIndex,
        getMaxPriceIndex()
      );

      updatePriceDots();
    });

    updatePriceDots();
  }


  /* =========================
     GALERIA
  ========================= */

  const galeriaSlider = document.getElementById("galeriaSlider");
  const galeriaTrack = document.getElementById("galeriaTrack");
  const galPrev = document.getElementById("galPrev");
  const galNext = document.getElementById("galNext");
  const galeriaDots = document.getElementById("galeriaDots");
  const thumbs = document.querySelectorAll(".galeria-thumb");
  const slides = document.querySelectorAll(".galeria-slide");

  if (galeriaSlider && galeriaTrack && slides.length) {
    let currentGalleryIndex = 0;
    let autoGallery;

    function buildGalleryDots() {
      if (!galeriaDots) return;

      galeriaDots.innerHTML = "";

      slides.forEach((_, index) => {
        const dot = document.createElement("button");

        dot.className = "galeria-dot";
        dot.type = "button";
        dot.setAttribute(
          "aria-label",
          `Visualizar imagem ${index + 1}`
        );

        if (index === currentGalleryIndex) {
          dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
          goToGallery(index);
          restartGalleryAuto();
        });

        galeriaDots.appendChild(dot);
      });
    }

    function updateGallery() {
      galeriaTrack.style.transform =
        `translateX(-${currentGalleryIndex * 100}%)`;

      slides.forEach((slide, index) => {
        slide.classList.toggle(
          "active",
          index === currentGalleryIndex
        );
      });

      thumbs.forEach((thumb, index) => {
        thumb.classList.toggle(
          "active",
          index === currentGalleryIndex
        );
      });

      const dots =
        galeriaDots?.querySelectorAll(".galeria-dot");

      dots?.forEach((dot, index) => {
        dot.classList.toggle(
          "active",
          index === currentGalleryIndex
        );
      });
    }

    function goToGallery(index) {
      if (index < 0) {
        currentGalleryIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentGalleryIndex = 0;
      } else {
        currentGalleryIndex = index;
      }

      updateGallery();
    }

    function nextGallery() {
      goToGallery(currentGalleryIndex + 1);
    }

    function prevGallery() {
      goToGallery(currentGalleryIndex - 1);
    }

    function startGalleryAuto() {
      clearInterval(autoGallery);

      autoGallery = setInterval(() => {
        nextGallery();
      }, 5000);
    }

    function restartGalleryAuto() {
      startGalleryAuto();
    }

    if (galNext) {
      galNext.addEventListener("click", () => {
        nextGallery();
        restartGalleryAuto();
      });
    }

    if (galPrev) {
      galPrev.addEventListener("click", () => {
        prevGallery();
        restartGalleryAuto();
      });
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const index = Number(thumb.dataset.idx);

        if (!Number.isNaN(index)) {
          goToGallery(index);
          restartGalleryAuto();
        }
      });
    });

    // Swipe no celular
    let touchStartX = 0;
    let touchEndX = 0;

    galeriaSlider.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true }
    );

    galeriaSlider.addEventListener(
      "touchend",
      (event) => {
        touchEndX = event.changedTouches[0].screenX;

        const difference =
          touchStartX - touchEndX;

        if (Math.abs(difference) < 45) return;

        if (difference > 0) {
          nextGallery();
        } else {
          prevGallery();
        }

        restartGalleryAuto();
      },
      { passive: true }
    );

    // Pausa enquanto o mouse estiver em cima
    galeriaSlider.addEventListener("mouseenter", () => {
      clearInterval(autoGallery);
    });

    galeriaSlider.addEventListener("mouseleave", () => {
      startGalleryAuto();
    });

    buildGalleryDots();
    updateGallery();
    startGalleryAuto();
  }


  /* =========================
     FORMULÁRIO
  ========================= */

  const contatoForm = document.getElementById("contatoForm");

  if (contatoForm) {
    contatoForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome =
        document.getElementById("nome")?.value.trim() || "";

      const telefone =
        document.getElementById("telefone")?.value.trim() || "";

      const servicoElement =
        document.getElementById("servico");

      const mensagem =
        document.getElementById("mensagem")?.value.trim() || "";

      const servico =
        servicoElement?.options[
          servicoElement.selectedIndex
        ]?.text || "";

      if (!nome) {
        alert("Por favor, informe seu nome.");
        document.getElementById("nome")?.focus();
        return;
      }

      let texto =
        `Olá! Meu nome é ${nome}. Gostaria de agendar um atendimento na Onça Glow.`;

      if (telefone) {
        texto += `\nMeu WhatsApp: ${telefone}`;
      }

      if (servico) {
        texto += `\nServiço desejado: ${servico}`;
      }

      if (mensagem) {
        texto += `\nMensagem: ${mensagem}`;
      }

      const whatsappNumber = "5554984150735";

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(texto)}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
    });
  }


  /* =========================
     CURSOR PERSONALIZADO
  ========================= */

  const cursor = document.getElementById("cursor");
  const cursorFollower =
    document.getElementById("cursorFollower");

  if (
    cursor &&
    cursorFollower &&
    window.matchMedia("(min-width: 901px)").matches
  ) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.14;
      followerY += (mouseY - followerY) * 0.14;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);
    }

    animateFollower();

    const hoverElements = document.querySelectorAll(
      "a, button, .servico-card, .preco-card, .galeria-thumb"
    );

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorFollower.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursorFollower.classList.remove("hover");
      });
    });
  }


  /* =========================
     PARTÍCULAS
  ========================= */

  const particlesContainer =
    document.getElementById("particles");

  if (particlesContainer) {
    const particleCount =
      window.innerWidth <= 600 ? 18 : 35;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");

      particle.className = "particle";

      const size = Math.random() * 2.5 + 1;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left =
        `${Math.random() * 100}%`;

      particle.style.animationDuration =
        `${Math.random() * 10 + 8}s`;

      particle.style.animationDelay =
        `${Math.random() * 10}s`;

      fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
  }


  /* =========================
     PARALLAX LEVE DO HERO
  ========================= */

  const hero = document.getElementById("hero");
  const heroContent = document.getElementById("heroContent");
  const heroImage = document.querySelector(".hero-banner-img");

  if (
    hero &&
    heroContent &&
    heroImage &&
    window.innerWidth > 800
  ) {
    window.addEventListener(
      "scroll",
      () => {
        const scroll = window.scrollY;

        if (scroll > window.innerHeight) return;

        heroContent.style.transform =
          `translateY(${scroll * 0.12}px)`;

        heroImage.style.transform =
          `scale(1) translateY(${scroll * 0.04}px)`;
      },
      { passive: true }
    );
  }


  /* =========================
     FECHAR MENU COM ESC
  ========================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });


  /* =========================
     LINKS INTERNOS
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

});
