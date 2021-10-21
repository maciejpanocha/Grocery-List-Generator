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

    const htmlItemAmount = (amount) => { return `Ilość: <span class="items__p items__p--bigger">${amount}x</span>` }

    const appendNode = (parent, element) => { parent.appendChild(element) };

    const createNode = (node) => { return document.createElement(node) };

    const getTotalWeight = (item) => { return item.weight * item.amount };

    const getKilograms = (amount) => { return amount / 1000 };

    const getLocalStorage = () => {
        for (const item of items) {
            const value = parseInt(localStorage.getItem(item.id))
            if (value > 0) {
                item.amount = value
                renderItem(item)
            }
        }
    };
    
    const getCustomHash = () => {
        let hash = ``
        for (const { id, amount } of items) {
            hash += `${id}=${amount}&`
        }
        return hash
    };

    const clearWindowHash = () => { window.location.hash = "" };

    const updateItemsData = () => {
        if (window.location.hash == "") return getLocalStorage()

        let currentHash = window.location.hash.substr(1)
        let objectsHash = currentHash.split('&').reduce(function (result, item) {
            let parts = item.split('=')
            result[parts[0]] = parts[1]
            return result
        }, {})

        for (let i = 0; i < Object.values(objectsHash).length; i++) {
            for (let z = 0; z < objectsHash[i + 1]; z++) {
                addToCartEvent(items[i])
            }
        }

        clearWindowHash()
        renderPreview()
    };

    const updateBarPosition = () => {
        const bar = document.querySelector(".js-cart-bar")

        if (window.scrollY >= 150) {
            bar.classList.add("container--sticky");
        } else {
            bar.classList.remove("container--sticky");
        }
    };

    const updateLocalStorage = (item) => {
        if (item.amount <= 0) localStorage.removeItem(`${item.id}`)
        localStorage.setItem(`${item.id}`, `${item.amount}`)
    };

    const updateClipboard = () => {
        const input = document.querySelector(".js-modal-input")
        navigator.clipboard.writeText(input.value)
        updateAnnouncementVisibility("block")
    };

    const updateAnnouncementVisibility = (state) => {
        if (state == "none" || state == "block") {
            document.querySelector(".js-modal-p").style.display = state
        }
    };

    const addToCartEvent = (item) => {
        const index = items.indexOf(item)

        items = [
            ...items.slice(0, index),
            { ...items[index], amount: items[index].amount + 1 },
            ...items.slice(index + 1)
        ]
        item.amount = items[index].amount
        updateLocalStorage(item)

        renderItem(item)
    };

    const removeFromCartEvent = (item) => {
        const index = items.indexOf(item)

        if (item.amount > 0) {
            items = [
                ...items.slice(0, index),
                { ...items[index], amount: items[index].amount - 1 },
                ...items.slice(index + 1)
            ]
        }
        item.amount = items[index].amount
        updateLocalStorage(item)

        renderItem(item)
    };

    const renderAmount = ({ id, amount }) => {
        let currentAmount = document.getElementById(`amountOf${id}`)
        currentAmount.innerHTML = htmlItemAmount(amount)
    };

    const renderItem = (item) => {
        renderAmount(item)
        renderPreview()
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
            item_amount.innerHTML = htmlItemAmount(item.amount)

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
        items_container.innerHTML = ''
        let order = 0

        cartLinkInput.value = `${window.location.host}/#${getCustomHash()}`

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
            { document.querySelector(".js-modal").style.display = "block" }
        })
    };

    const bindCloseModalEvent = () => {
        const closeModalButton = document.querySelector(".js-modal-close")
        closeModalButton.addEventListener("click", () => {
            { document.querySelector(".js-modal").style.display = "none" }
            updateAnnouncementVisibility("none")
        })
    };

    const bindShowCartEvent = () => {
        let cartButton = document.querySelector(".js-cart-button")
        cartButton.addEventListener("click", () => renderCart())
    };

    const bindManageItemEvents = () => {
        let addButton = document.querySelectorAll(".js-cart-button--add")
        let removeButton = document.querySelectorAll(".js-cart-button--remove")

        for (let i = 0; i < items.length; i++) {
            addButton[i].addEventListener("click", () => {
                addToCartEvent(items[i])
            })
            removeButton[i].addEventListener("click", () => {
                removeFromCartEvent(items[i])
            })
        }
    };

    const bindCopyToClipboardEvent = () => {
        const button = document.querySelector(".js-modal-input-copy-button")
        button.addEventListener("click", () => { updateClipboard() })
    };

    const bindAdjustBarPosition = () => window.addEventListener("scroll", () => { updateBarPosition() })

    const render = () => {
        renderItems()

        updateItemsData()

        bindAdjustBarPosition()
        bindManageItemEvents()
        bindShowCartEvent()
        bindCopyToClipboardEvent()
        bindCloseModalEvent()
        bindOpenModalEvent()
    };

    const init = () => {
        render()
    };

    init()
};