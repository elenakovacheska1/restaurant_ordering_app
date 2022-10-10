import { menuArray } from "./data.js";

let card = [];

localStorage.setItem("menuArray", JSON.stringify(menuArray));

function getItemFromStorage() {
  return JSON.parse(localStorage.getItem("menuArray"));
}

document.addEventListener("click", function (event) {
  if (event.target.dataset.addtocard) {
    handleAddToCardClick(event.target.dataset.addtocard);
  } else if (event.target.id === "complete-order-btn") {
    handleCompleteOrderClick();
  } else if (event.target.id === "pay") {
    handlePayClick();
  } else if (event.target.dataset.remove) {
    handleRemoveClick(event.target.dataset.remove);
  }
});

function handleAddToCardClick(itemId) {
  card.push(itemId);
  render();
}

function handleCompleteOrderClick() {
  renderModal();
}

function handlePayClick() {
  card = [];
  renderModal();
  renderDeliveryMessage();
}

function handleRemoveClick(removeId) {
  card.forEach(function (item, index) {
    if (Number(item) === Number(removeId)) {
      card.splice(index, 1);
    }
  });
  render();
}

function render() {
  const data = getItemFromStorage();
  const mainEl = document.querySelector("main");
  let orderClass = "hidden";

  if (card.length) {
    orderClass = "active";
  }

  let html = ``;
  data.forEach(function (item) {
    html += `<section id="${item.id}" class="food-item-container">
          <div class="food-item-emoji">${item.emoji}</div>
          <div class="food-item-description">
            <h2>${item.name}</h2>
            <p class="food-ing">${item.ingredients}</p>
            <h2>$${item.price}</h2>
          </div>
          <button class="add-to-card-btn" data-addtocard="${item.id}">+</button>
        </section>
        `;
  });

  let cardItems = ``;
  let totalPrice = 0;
  card.forEach(function (itemId) {
    data.forEach(function (food) {
      if (food.id === Number(itemId)) {
        cardItems += `<h2>${food.name} <span class="remove" data-remove=${food.id}>remove</span><span class="card-item-price">$${food.price}</span></h2>`;
        totalPrice += food.price;
      }
    });
  });
  cardItems += `<h2>Total price: <span class="total-price">$${totalPrice}</span></h2>`;

  html += `<section id="order" class="${orderClass} order-container">
          <h2 class="title">Your order</h2>
          ${cardItems}
          <button id="complete-order-btn" class="complete-order-btn">Complete order</button>
        </section>`;

  mainEl.innerHTML = html;
}

function renderModal() {
  const mainEl = document.querySelector("main");
  let modalClass = "";
  if (card.length) {
    modalClass = "activeModal";
  } else {
    modalClass = "hidden";
  }

  let modalHtml = `<div id="modal" class="${modalClass} modal">
          <h3>Enter card details</h3>   
            <input type="text" placeholder="Enter your name" id="name" required />
            <input
              type="text"
              placeholder="Enter card number"
              id="card-number"
              required
            />
            <input type="text" placeholder="Enter CVV" id="cvv" required />
            <button type="submit" id="pay">Pay</button>
        </div>`;
  mainEl.innerHTML += modalHtml;
}

function renderDeliveryMessage() {
  render();
  const mainEl = document.querySelector("main");
  mainEl.innerHTML += `<h1 class="delivery-message">Thanks! Your order is on its way!</h1>`;
}

render();
