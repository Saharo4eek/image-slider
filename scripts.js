document.addEventListener('DOMContentLoaded', () => {
    class Slider {
        constructor(container, options = {}) {
            this.container = container;
            this.slides = container.querySelector('.slider__list');
            this.slideItems = Array.from(container.querySelectorAll('.slider__item'));
            this.prevBtn = container.querySelector('.nav__prev');
            this.nextBtn = container.querySelector('.nav__next');
            this.dotsContainer = container.querySelector('.dots');
            this.dots = [];
            this.currentIndex = 0;
            this.loop = options.loop !== undefined ? options.loop : true;
            this.autoPlay = options.autoPlay || false;
            this.interval = options.interval || 5000;
            this.autoPlayInterval = null;

            this.init();
            this.createDots();
            this.setupEventListeners();

            if (this.autoPlay) {
                this.startAutoPlay();
            }
        }

        init() {
            this.updateSlider();
        }

        updateSlider() {
            this.slides.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            this.updateDots();
        }

        nextSlide() {
            if (this.currentIndex < this.slideItems.length - 1) {
                this.currentIndex++;
            } else if (this.loop) {
                this.currentIndex = 0;
            }
            this.updateSlider();
        }

        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else if (this.loop) {
                this.currentIndex = this.slideItems.length - 1;
            }
            this.updateSlider();
        }

        goToSlide(index) {
            if (index >= 0 && index < this.slideItems.length) {
                this.currentIndex = index;
                this.updateSlider();
            }
        }

        createDots() {
            this.slideItems.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dots__item');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot).textContent = String(index + 1);
                this.dots.push(dot);
            });
        }

        updateDots() {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        setupEventListeners() {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            this.prevBtn.addEventListener('click', () => this.prevSlide());

            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            this.slides.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            this.slides.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, {passive: true});
        }

        handleSwipe() {
            const SWIPE_THRESHOLD = 50;
            const diff = touchStartX - touchEndX;

            if (diff > SWIPE_THRESHOLD) {
                this.nextSlide();
            } else if (diff < -SWIPE_THRESHOLD) {
                this.prevSlide();
            }
        }

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.interval);

            this.container.addEventListener('mouseenter', () => {
                clearInterval(this.autoPlayInterval);
            });

            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }

    // Инициализация слайдера (без автоплея)
    const slider = new Slider(document.querySelector('.slider'), {
        loop: true,
        autoPlay: false, // Отключено по умолчанию
    });
});