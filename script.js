document.addEventListener('DOMContentLoaded', function () {
    let items = JSON.parse(localStorage.getItem('items')) || [
        { name: 'Помідори', quantity: 2, bought: false },
        { name: 'Печиво', quantity: 2, bought: true },
        { name: 'Сир', quantity: 1, bought: true }
    ];

    const newItemNameInput = document.getElementById('new-item-name');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsList = document.getElementById('items-list');
    const remainingItems = document.getElementById('remaining-items');
    const boughtItems = document.getElementById('bought-items');

    addItemBtn.addEventListener('click', addItem);
    newItemNameInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            addItem();
        }
    });

    function addItem() {
        const itemName = newItemNameInput.value.trim();
        if (itemName === '') return;

        const newItem = { name: itemName, quantity: 1, bought: false };
        items.push(newItem);
        newItemNameInput.value = '';
        newItemNameInput.focus();

        saveItems();
        renderItems();
        updateStatistics();
    }

    function renderItems() {
        itemsList.innerHTML = '';
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            if (item.bought) {
                itemElement.classList.add('bought-item');
            } else {
                itemElement.classList.add('not-bought-item');
            }

            const itemNameElement = document.createElement('span');
            itemNameElement.classList.add('item-name');
            itemNameElement.textContent = item.name;
            if (!item.bought) {
                itemNameElement.addEventListener('click', () => editItemName(index));
            }

            const quantityControls = document.createElement('div');
            quantityControls.classList.add('quantity-controls');

            const decreaseBtn = document.createElement('button');
            decreaseBtn.classList.add('quantity-btn');
            decreaseBtn.textContent = '-';
            decreaseBtn.disabled = item.quantity === 1;
            decreaseBtn.addEventListener('click', () => decreaseItemQuantity(index));

            const quantityElement = document.createElement('span');
            quantityElement.classList.add('quantity');
            quantityElement.textContent = item.quantity;

            const increaseBtn = document.createElement('button');
            increaseBtn.classList.add('quantity-btn');
            increaseBtn.textContent = '+';
            increaseBtn.addEventListener('click', () => increaseItemQuantity(index));

            quantityControls.appendChild(decreaseBtn);
            quantityControls.appendChild(quantityElement);
            quantityControls.appendChild(increaseBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = '✖';
            deleteBtn.addEventListener('click', () => deleteItem(index));

            const statusBtn = document.createElement('button');
            statusBtn.classList.add('status-btn');
            statusBtn.textContent = item.bought ? 'Куплено' : 'Не куплено';
            statusBtn.addEventListener('click', () => toggleItemStatus(index));

            itemElement.appendChild(itemNameElement);
            itemElement.appendChild(quantityControls);
            itemElement.appendChild(statusBtn);
            if (!item.bought) itemElement.appendChild(deleteBtn);

            itemsList.appendChild(itemElement);
        });
    }

    function updateStatistics() {
        const remainingItemsList = items.filter(item => !item.bought);
        const boughtItemsList = items.filter(item => item.bought);

        remainingItems.innerHTML = '';
        remainingItemsList.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} ${item.quantity}`;
            remainingItems.appendChild(li);
        });

        boughtItems.innerHTML = '';
        boughtItemsList.forEach(item => {
            const li = document.createElement('li');
            const itemName = document.createElement('s');
            itemName.textContent = item.name;
            li.appendChild(itemName);
            const quantity = document.createElement('span');
            quantity.textContent = item.quantity;
            li.appendChild(quantity);
            boughtItems.appendChild(li);
        });
    }

    function editItemName(index) {
        const newName = prompt('Введіть нову назву товару:');
        if (newName !== null) {
            items[index].name = newName;
            saveItems();
            renderItems();
            updateStatistics();
        }
    }

    function decreaseItemQuantity(index) {
        if (items[index].quantity > 1) {
            items[index].quantity--;
            saveItems();
            renderItems();
            updateStatistics();
        }
    }

    function increaseItemQuantity(index) {
        items[index].quantity++;
        saveItems();
        renderItems();
        updateStatistics();
    }

    function deleteItem(index) {
        items.splice(index, 1);
        saveItems();
        renderItems();
        updateStatistics();
    }

    function toggleItemStatus(index) {
        items[index].bought = !items[index].bought;
        saveItems();
        renderItems();
        updateStatistics();
    }

    function saveItems() {
        localStorage.setItem('items', JSON.stringify(items));
    }

    renderItems();
    updateStatistics();
});
