{
    let items = [
        {
            id: 1,
            name: "Boczek wędzony",
            amount: 0,
            weight: 100,
            description: "Surowy, na zimno"
        },
        {
            id: 2,
            name: "Pomidor",
            amount: 0,
            weight: 150,
            description: "Odmiana Malinowa"
        },
        {
            id: 3,
            name: "Mleko UHT",
            amount: 0,
            weight: 1000,
            description: "Tłuszcz 1,5%"
        },
        {
            id: 4,
            name: "Mleko Świeże",
            amount: 0,
            weight: 1000,
            description: "Tłuszcz 3,5%"
        }
    ]

    const appendNode = (parent, element) => {parent.appendChild(element)};

    const createNode = (node) => {return document.createElement(node)};

    const getTotalWeight = (item) => {return item.weight * item.amount};
    
    const getKilograms = (amount) => {return amount / 1000};

    const getCustomHash = () => {
        let dataHash = ``

        for (const {id, amount} of items) {
            dataHash += `${id}=${amount}&`
        }

        return dataHash
    };

    const addToCartEvent = (item) => {
        const index = items.indexOf(item)
        
        items = [
            ...items.slice(0, index),
            {...items[index], amount: items[index].amount + 1},
            ...items.slice(index + 1)
        ]

        partialRender(item)
    };

    const removeFromCartEvent = (item) => {
        const index = items.indexOf(item)
        
        if (item.amount > 0) {
            items = [
                ...items.slice(0, index),
                {...items[index], amount: items[index].amount - 1},
                ...items.slice(index + 1)
            ]
        }
        
        partialRender(item)
    };

    const updateHash = () => {window.location.hash = getCustomHash()};

    const tryUpdateItemsData = () => {
        if (window.location.hash !== "") {
            let currentHash = window.location.hash.substr(1)
            let objectsHash = currentHash.split('&').reduce(function (res, item) {
                let parts = item.split('=')
                res[parts[0]] = parts[1]
                return res
            }, {})

            for (let i = 0; i < Object.values(objectsHash).length; i++) {
                for (let z = 0; z < objectsHash[i+1]; z++) {
                    addToCartEvent(items[i])
                    renderAmount(items[i])
                }
            }

            renderPreview()
        }
    };

    const renderPreview = () => {
        let previewBar = document.querySelector(".js-cart-info")
        let itemsNumber = 0
        let itemsPieces = 0
        let itemsTotalWeight = 0
        
        for (const item of items) {
            if (item.amount > 0) {
                itemsNumber++
                itemsPieces += item.amount
                itemsTotalWeight += getTotalWeight(item)
            }
        }
        
        previewBar.innerHTML = `
            Produktów razem: ${itemsNumber},
            Sztuk razem: ${itemsPieces},
            Waga razem: ${getKilograms(itemsTotalWeight)}kg
        `
    };

    const renderAmount = ({id, amount}) => {
        let currentAmount = document.getElementById(`amountOf${id}`)
        currentAmount.innerHTML = `Ilość: <span class="items__p items__p--bigger">${amount}x</span>`
    };

    const renderItems = () => {
        let items_container = document.querySelector(".js-items")
        items_container.innerHTML = ''

        for (const item of items) {
            const item_frame = createNode("li")
            item_frame.setAttribute("class", "items__li")

            const item_image = createNode("img")
            item_image.setAttribute("src", "./product.png")
            item_image.setAttribute("class", "items__img")

            const item_name = createNode("h4")
            item_name.setAttribute("class", "items__h4")
            item_name.innerHTML = item.name

            const item_description = createNode("p")
            item_description.setAttribute("class", "items__p items__p--description")
            item_description.innerHTML = item.description

            const item_weight = createNode("p")
            item_weight.setAttribute("class", "items__p items__p--weight")
            item_weight.innerHTML = `Masa: ${getKilograms(item.weight)}kg`

            const item_amount = createNode("p")
            item_amount.setAttribute("class", "items__p items__p--amount")
            item_amount.setAttribute("id", `amountOf${item.id}`)
            item_amount.innerHTML = `Ilość: <span class="items__p items__p--bigger">${item.amount}x</span>`

            const item_button_frame = createNode("span")
            item_button_frame.setAttribute("class", "items__span")

            const item_button_add = createNode("button")
            item_button_add.setAttribute("class", "items__button js-cart-button--add")
            item_button_add.innerHTML = `+`

            const item_button_remove = createNode("button")
            item_button_remove.setAttribute("class", "items__button js-cart-button--remove")
            item_button_remove.innerHTML = `-`

            appendNode(items_container, item_frame)
            appendNode(item_frame, item_image)
            appendNode(item_frame, item_name)
            appendNode(item_frame, item_description)
            appendNode(item_frame, item_weight)
            appendNode(item_frame, item_amount)
            appendNode(item_frame, item_button_frame)
            appendNode(item_button_frame, item_button_add)
            appendNode(item_button_frame, item_button_remove)
        }
    };

    const renderCart = () => {
        const items_container = document.querySelector(".js-cart")
        let cartLinkInput = document.querySelector(".js-modal-input")
        let order = 0

        items_container.innerHTML = ''
        cartLinkInput.value = window.location.href

        for (const item of items) {
            if (item.amount > 0) {
                order++
                const cart_frame = createNode("li")
                cart_frame.setAttribute("class", "cart__li")

                const cart_description = createNode("p")
                cart_description.setAttribute("class", "cart__p")
                cart_description.innerHTML = `<b>${order}</b>. ${item.name}, ${item.description}, Waga razem: <b>${getKilograms(getTotalWeight(item))}kg</b>, Sztuk razem: <b>${item.amount}</b>`

                appendNode(items_container, cart_frame)
                appendNode(cart_frame, cart_description)
            }
        }
    };

    const bindOpenModalEvent = () => {
        const openModalButton = document.querySelector(".js-modal-open")
        openModalButton.addEventListener("click", () => {
            {document.querySelector(".js-modal").style.display = "block"}
        })
    };

    const bindCloseModalEvent = () => {
        const closeModalButton = document.querySelector(".js-modal-close")
        closeModalButton.addEventListener("click", () => {
            {document.querySelector(".js-modal").style.display = "none"}
        })
    };

    const bindShowCartEvent = () => {
        let cartButton = document.querySelector(".js-cart-button")
        cartButton.addEventListener("click", () => renderCart())
    };
    
    const bindManageItemEvents = () => {
        let addButton = document.querySelectorAll(".js-cart-button--add")
        let removeButton = document.querySelectorAll(".js-cart-button--remove")
        
        for (let i = 0; i < addButton.length; i++) {
            addButton[i].addEventListener("click", () => {
                addToCartEvent(items[i])
            })
        }

        for (let i = 0; i < removeButton.length; i++) {
            removeButton[i].addEventListener("click", () => {
                removeFromCartEvent(items[i])
            })
        }
    };

    const partialRender = (item) => {
        renderAmount(item)
        renderPreview()

        updateHash()
    };

    const render = () => {
        renderItems()
        
        tryUpdateItemsData()
        
        bindManageItemEvents()
        bindShowCartEvent()
        bindCloseModalEvent()
        bindOpenModalEvent()
    };

    const init = () => {
        render()
    };
    
    init()
};