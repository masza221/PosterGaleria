
const Eslider = document.querySelector(".slider-wrap");


class slider {
  constructor(sliderWraper) {
    this.sliderWraper = sliderWraper;
    this.slider = document.querySelector(".slider");
    this.children = [...this.slider.children];
    this.clones = [];
    this.isDragging = false;
    this.prevX;
    this.prevScrollLeft;
    this.leftIndex = this.children.length - 1;
    this.rightIndex = 0;
    this.init();
  }
  init() {

    this.pushClones();
    this.slider.addEventListener("mousedown", (e) => this.dragStart(e));
    this.slider.addEventListener("mousemove", (e) => this.dragging(e));
    this.slider.addEventListener("mouseup", (e) => this.dragEnd(e));
    this.slider.addEventListener("mouseleave", (e) => this.dragEnd(e));
    requestAnimationFrame(this.animateFrame);
  }

  addLeftIndex() {
    console.log(this.leftIndex);
    this.leftIndex = this.leftIndex - 1;
    if (this.leftIndex >= 0) this.leftIndex = this.children.length - 1;
  }

  addRightIndex() {
    this.rightIndex++;
    if (this.rightIndex >= this.children.length) this.rightIndex = 0;
    }

  pushClones() {
    this.clones = [];
    this.children.forEach((child) => {
      this.clones.push(this.createClone(child));
    });
  }

  createClone(el) {
    {
      const clone = el.cloneNode(true);
      return clone;
    }
  }

  dragStart(e) {
    this.isDragging = true;
    this.prevX = e.pageX;
    this.prevScrollLeft = this.sliderWraper.scrollLeft;
  }

  dragging(e) {
    if (!this.isDragging) return;

    if (
      e.pageX <= this.slider.offsetLeft + 1 ||
      e.pageX >=
        this.sliderWraper.offsetLeft + this.sliderWraper.offsetWidth - 1
    ) {
      this.dragEnd(e);
      return;
    }
    e.preventDefault();

    let posDiff = e.pageX - this.prevX;
    this.sliderWraper.scrollLeft = this.prevScrollLeft - posDiff;
  }

  dragEnd(e) {
    this.isDragging = false;
  }
  addClonesLeft = (index) => {
    this.slider.prepend(this.clones[index]);
    this.sliderWraper.scrollLeft = this.children[0].offsetWidth - 1;
  };

  addClonesRight = (index) => {
    this.slider.appendChild(this.clones[index]);
  };

  animateFrame = () => {
  
    if (!this.isDragging) return requestAnimationFrame(this.animateFrame);
  
    if (this.sliderWraper.scrollLeft <= 0) {
      this.addClonesLeft(this.leftIndex);
      this.addLeftIndex(this.leftIndex);
    }
    else if (
      this.sliderWraper.scrollLeft >=
      this.sliderWraper.scrollWidth - this.sliderWraper.offsetWidth
    ) {
      this.addClonesRight(this.rightIndex);
      this.addRightIndex(this.rightIndex);
    }
  
    requestAnimationFrame(this.animateFrame);
  };
}
new slider(Eslider);