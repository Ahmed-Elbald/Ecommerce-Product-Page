
// Getting elements from the document

const mainHeader = document.querySelector("header");
const openNavBtn = document.getElementById("open-menu");
const mainNav = document.getElementById("main-nav");
const closeNavBtn = mainNav.querySelector("#close-menu");

const cartBtn = document.getElementById("open-cart");
const cart = document.querySelector(".cart-items");

const imagesContainer = document.querySelector(".main-img-container .images");
const slideBtns = document.querySelectorAll(".thumbnails button");
const nextPreviousBtns = document.querySelectorAll(".main-img-container .images button.change");
const images = document.querySelectorAll(".main-img-container .images img");
let overlay = imagesContainer.querySelector(".view-icon-container");

const gallery = document.querySelector(".gallery");
const closeGalleryBtn = gallery.querySelector(".close-gallery-btn");

const controlsContainer = document.querySelector(".cart-control .number-container");
const controlBtns = controlsContainer.querySelectorAll("button");
const currentNumber = controlsContainer.querySelector(".current-number");
const addToCartBtn = controlsContainer.nextElementSibling;

const itemsContainer = document.querySelector(".cart-items .items");
const itemSample = document.querySelector(".cart-item-sample > div");

const textContainer = document.querySelector("main .container");



document.addEventListener("DOMContentLoaded", () => {

  // Checking whether the localStorage has previous data to fill the cart with
  if (localStorage.items) {
    addItems();
  }

  // Adding the eventListener to the buttons when the window loads
  openNavBtn.addEventListener("click", () => manageNav("open"));
  closeNavBtn.addEventListener("click", () => manageNav("close"));

  cartBtn.addEventListener("click", () => manageCart());

  slideBtns.forEach(element => {
    element.addEventListener("click", (event) => manageSlides(event))
  });

  nextPreviousBtns.forEach(btn => {
    btn.addEventListener("click", () => nextPreviousSlide(btn))
  });

  images.forEach(element => {
    element.addEventListener("click", (event) => manageGallery(event));
  });

  controlBtns.forEach(btn => {
    btn.addEventListener("click", () => updateItemsNumber(btn));
  });

  addToCartBtn.addEventListener("click", () => makeItem());
});


// A function to open and close the nav

function manageNav(order) {

  if (order == "open") {
    mainNav.classList.add("open");
    mainHeader.style.setProperty("--width", "100%");
  } else {
    mainNav.classList.remove("open");
    mainHeader.style.setProperty("--width", "0");
  }

}


// A function to open and close the cart

function manageCart() {
  cart.classList.toggle("open");
}


// A function to decide which slide should be displayed

function manageSlides(event) {

  let id = event.target.dataset.id;

  locateBefore(); // To locate the overlay that move when we change the slides
  showCurrentBtn(id); // To add the "current" class to the clicked button
  showCurrentImage(id); // To add the "current" class to the chosen img

}


function showCurrentBtn(id) {

  slideBtns.forEach(btn => {
    btn.classList.remove("current");

    if (btn.dataset.id == id) {
      btn.classList.add("current");
    }
  })

}


function showCurrentImage(id) {

  images.forEach(img => {
    setTimeout(() => {
      img.classList.remove("current");
      if (img.dataset.id == id) {
        img.classList.add("current");
      }
    }, 500)
  })

}

function locateBefore() {

  if (!gallery.classList.contains("open")) {
    let currentPosition = window.getComputedStyle(imagesContainer, "::before")

    if (Number.parseInt(currentPosition.left) > 0) {
      imagesContainer.style.setProperty("--position", "-100%");
    } else {
      imagesContainer.style.setProperty("--position", "100%");
    }
  }

}


// A function to respond to the next and previous buttons

function nextPreviousSlide(btn) {

  let id = +getCurrent();
  let btnType = btn.classList.contains("next");

  if (btnType && id != 4) { // If it's a "next" button
    showCurrentImage(id + 1);
    showCurrentBtn(id + 1);
    locateBefore();
  } else if (!btnType && id != 1) { // If it's a "previous" button
    showCurrentImage(id - 1);
    showCurrentBtn(id - 1);
    locateBefore();
  }

}


// A function to open and close the gallery

function manageGallery() {

  if (screen.availWidth >= 800) {
    gallery.classList.add("open");

    closeGalleryBtn.addEventListener("click", () => {
      gallery.classList.remove("open");
    });
  }

}


// A function to track how many items the user wants to buy

function updateItemsNumber(btn) {

  let currentItemsNumber = +currentNumber.textContent;

  if (btn.className == "plus-btn") {
    currentNumber.innerHTML = ++currentItemsNumber;
  } else if (btn.className == "minus-btn" && currentItemsNumber != 0) {
    currentNumber.innerHTML = --currentItemsNumber;
  }
}


// A function to make an object of the new item contining its information to display it

function makeItem() {

  let itemsToBuy = +currentNumber.textContent;

  if (itemsToBuy != 0) {

    newItem = {
      id: getMax() + 1,
      name: textContainer.querySelector("h2").innerHTML,
      price: parseInt(textContainer.querySelector(".new-price span").innerHTML).toFixed(2),
      number: +itemsToBuy,
      total: this.price * this.number,
      img: getCurrent(true),
    }

    if (localStorage.items) {
      let oldItems = JSON.parse(localStorage.items);
      oldItems.push(newItem);
      localStorage.items = JSON.stringify(oldItems);
    } else {
      localStorage.items = JSON.stringify([newItem])
    }
    addItems();
  }
}


// A function to arrange the content of the cart when the user first visit the page or 
// update anything

function addItems() {

  itemsContainer.innerHTML = ""; // Emptying the caart
  itemsContainer.classList.add("has-items"); // Adding the "has-items" class

  // Getting the items array form the localStorage
  let items = JSON.parse(localStorage.items);
  let len = items.length;
  let itemsNubmer = document.querySelector(".cart-container .items-number");

  if (len == 0) { // There is no items in the array
    itemsContainer.classList.remove("has-items");
    itemsContainer.innerHTML = "<p>Your cart is empty</p>"
    itemsNubmer.style.display = "none";
  } else { // There is items
    itemsNubmer.style.display = "inline"
    itemsNubmer.innerHTML = len;
    itemsContainer.classList.remove("large");
    if (len > 3) { // Items are more than 3 and thus, adding an overflow of "scroll"
      itemsContainer.classList.add("large");
    }
  }

  // Looping through the items, making new items in the page and filling them with data
  for (let item of items) {
    let itemSampleCloned = itemSample.cloneNode(true);

    let deleteBtn = itemSampleCloned.querySelector(".delete-item-btn");
    deleteBtn.dataset.id = item.id;
    deleteBtn.addEventListener("click", () => deleteItem(deleteBtn.dataset.id));

    itemSampleCloned.querySelector("img.item-img").src = item.img;
    itemSampleCloned.querySelector(".details p").textContent = item.name;
    itemSampleCloned.querySelector(".details .price").textContent = "$" + item.price;
    itemSampleCloned.querySelector(".details .number").textContent = item.number;
    itemSampleCloned.querySelector(".details .total").textContent = "$" + item.number * item.price;

    // Adding the item to the cart
    itemsContainer.appendChild(itemSampleCloned);
  }

}


// A function to delete a particular item

function deleteItem(id) {
  let items = JSON.parse(localStorage.items);
  for (let item of items) {
    if (item.id == id) {
      items.splice(items.indexOf(item), 1);
    }
  }

  localStorage.items = JSON.stringify(items);

  addItems();

}


// A function to get the current id/src of the img that has a class of "current"

function getCurrent(getSrc) {
  let id, src;
  images.forEach(img => {
    if (img.classList.contains("current")) {
      src = img.attributes.src.value;
      id = img.dataset.id;
    }
  });

  if (getSrc) {
    return src;
  } else {
    return id;
  }
}


// A function to get the maximum id in the items array

function getMax() {
  let max = 0;
  let items = localStorage.items;

  if (!items) { // If no items, return 0
    return max;
  } else {
    items = JSON.parse(items);
    for (let item of items) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max;
  }
}