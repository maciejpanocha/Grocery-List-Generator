let items = [
    {
        id: 1,
        name: "Boczek wędzony",
        amount: 0,
        weight: 100,
        totalWeight: 0,
        description: "Surowy, na zimno",
    },
    {
        id: 2,
        name: "Pomidor",
        amount: 0,
        weight: 150,
        totalWeight: 0,
        description: "Odmiana Malinowa",
    },
    {
        id: 3,
        name: "Mleko UHT",
        amount: 0,
        weight: 1000,
        totalWeight: 0,
        description: "Tłuszcz 1,5%",
    },
];

function appendNode(parent, element) {
    parent.appendChild(element);
};

function createNode(node) {
    return document.createElement(node);
};

function getTotalWeight(item) {
    return item.weight * item.amount;
};

function getKilograms(item) {
    return item / 1000;
};

function getCustomHash() {
    let dataHash = ``;
    
    for (let i = 0; i < items.length; i++) {
        dataHash = dataHash + `${items[i].id}=${items[i].amount}&`;
    };

    return dataHash;
};

function addToCart(item) {
    item.amount++;
    item.totalWeight = getTotalWeight(item);
};

function removeFromCart(item) {
    if (item.amount > 0) {
        item.amount--;
        item.totalWeight = getTotalWeight(item);
    };
};

function updateHash() {
    window.location.hash = getCustomHash();
};

function updateData() {
    var currentHash = window.location.hash.substr(1);
    var objectsHash = currentHash.split('&').reduce(function (res, item) {
        var parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});

    for (let i = 0; i < Object.values(objectsHash).length; i++) {
        for (let z = 0; z < objectsHash[i+1]; z++) {
            addToCart(items[i]);
            renderAmount(items[i]);
        };
    };

    renderPreview();
}

function renderPreview() {
    let previewBar = document.querySelector(".js-cart-info");
    let itemsNumber = 0;
    let itemsPieces = 0;
    let itemsTotalWeight = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].amount > 0) {
            itemsNumber++;
            itemsPieces += items[i].amount;
            itemsTotalWeight += getTotalWeight(items[i]);
        };
    };
    
    previewBar.innerHTML = `
        Produktów razem: ${itemsNumber},
        Sztuk razem: ${itemsPieces},
        Waga razem: ${getKilograms(itemsTotalWeight)}kg
    `;
};

function renderAmount(item) {
    let currentAmount = document.getElementById(`amountOf${item.id}`);

    currentAmount.innerHTML = `Ilość: <span class="items__p items__p--bigger">${item.amount}x</span>`;
};

function renderItems() {
    let items_container = document.querySelector(".js-items");
    items_container.innerHTML = '';

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        let item_frame = createNode("li");
        item_frame.setAttribute("class", "items__li");

        let item_image = createNode("img");
        item_image.setAttribute("src", "./product.png");
        item_image.setAttribute("class", "items__img");

        let item_name = createNode("h4");
        item_name.setAttribute("class", "items__h4");
        item_name.innerHTML = item.name;

        let item_description = createNode("p");
        item_description.setAttribute("class", "items__p items__p--description");
        item_description.innerHTML = item.description;

        let item_weight = createNode("p");
        item_weight.setAttribute("class", "items__p items__p--weight");
        item_weight.innerHTML = `Masa: ${getKilograms(item.weight)}kg`;

        let item_amount = createNode("p");
        item_amount.setAttribute("class", "items__p items__p--amount");
        item_amount.setAttribute("id", `amountOf${item.id}`);
        item_amount.innerHTML = `Ilość: <span class="items__p items__p--bigger">${item.amount}x</span>`;

        let item_button_frame = createNode("span");
        item_button_frame.setAttribute("class", "items__span");

        let item_button_add = createNode("button");
        item_button_add.setAttribute("class", "items__button js-cart-button--add");
        item_button_add.innerHTML = `+`;

        let item_button_remove = createNode("button");
        item_button_remove.setAttribute("class", "items__button js-cart-button--remove");
        item_button_remove.innerHTML = `-`;

        appendNode(items_container, item_frame);
        appendNode(item_frame, item_image);
        appendNode(item_frame, item_name);
        appendNode(item_frame, item_description);
        appendNode(item_frame, item_weight);
        appendNode(item_frame, item_amount);
        appendNode(item_frame, item_button_frame);
        appendNode(item_button_frame, item_button_add);
        appendNode(item_button_frame, item_button_remove)
    };
};

function renderCart(){
    let items_container = document.querySelector(".js-cart");
    items_container.innerHTML = '';
    let order = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (item.amount > 0) {
            order++;
            let cart_frame = createNode("li");
            cart_frame.setAttribute("class", "cart__li");

            let cart_description = createNode("p");
            cart_description.setAttribute("class", "cart__p");
            cart_description.innerHTML = `<b>${order}</b>. ${item.name}, ${item.description}, Waga razem: <b>${getKilograms(item.totalWeight)}kg</b>, Sztuk razem: <b>${item.amount}</b>`;

            appendNode(items_container, cart_frame);
            appendNode(cart_frame, cart_description);
        };
    };
};

function renderModal() {
    const modal = document.querySelector(".js-modal");
    const openButton = document.querySelector(".js-modal-open");
    const closeButton = document.querySelector(".js-modal-close");

    openButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
};

function manageItems() {
    let addButton = document.querySelectorAll(".js-cart-button--add");
    let removeButton = document.querySelectorAll(".js-cart-button--remove");
    
    for (let i = 0; i < addButton.length; i++) {
        addButton[i].addEventListener("click", () => {
            addToCart(items[i]);
            renderAmount(items[i]);
            renderPreview();
            updateHash();
        });
    };

    for (let i = 0; i < removeButton.length; i++) {
        removeButton[i].addEventListener("click", () => {
            removeFromCart(items[i]);
            renderAmount(items[i]);
            renderPreview();
            updateHash();
        });
    };
};

function manageCart() {
    let cartButton = document.querySelector(".js-cart-button");
    let cartLinkInput = document.querySelector(".js-modal-input");

    cartButton.addEventListener("click", () => {
        renderCart();
        cartLinkInput.value = `${window.location.href}${getCustomHash()}`
    });
};

renderItems();
renderModal();
manageItems();
manageCart();
updateData();