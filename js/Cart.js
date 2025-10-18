const CART_KEY = 'cartItems';

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPriceUSD(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


function renderCartInto(container) {
    const cart = loadCart();
    let list = container.querySelector('.list-group');
    if (!list) {
        list = document.createElement('ul');
        list.className = 'list-group list-group-flush bg-dark';
        container.appendChild(list);
    }
    list.innerHTML = '';

    if (cart.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'list-group-item bg-dark text-light';
        empty.textContent = 'Your cart is empty.';
        list.appendChild(empty);
    }

    cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-light d-flex justify-content-between align-items-center flex-column flex-sm-row';
        li.dataset.index = idx;


        const lineTotal = item.price * item.quantity;

        li.innerHTML = `
			<div class="me-3 w-100">
				${item.singer ? `<div class="small text-main-color singer-name text-main-font fs-5">${item.singer}</div>` : ''}
				<div class="fw-bold">${item.title}</div>
				<div class="small text-muted">${item.meta || ''}</div>
			</div>
			<div class="d-flex align-items-center gap-2">
				<button class="btn btn-sm btn-outline-light qty-decrease">−</button>
				<span class="mx-1 qty-value">${item.quantity}</span>
				<button class="btn btn-sm btn-outline-light qty-increase">+</button>
				<span class="ms-3 fw-bold price-value">${formatPriceUSD(item.price)}</span>
				<span class="ms-3 text-muted">x</span>
				<span class="ms-2 fw-bold line-total">${formatPriceUSD(lineTotal)}</span>
				<button class="btn btn-sm btn-outline-danger remove-item ms-2" title="Remove"><i class="fa-solid fa-trash"></i></button>
			</div>
		`;

        list.appendChild(li);
    });


    const subtotalEl = container.querySelector('.cart-subtotal');
    if (subtotalEl) {
        const subtotal = cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
        subtotalEl.textContent = formatPriceUSD(subtotal);
    }


    const listEl = container.querySelector('.list-group');
    if (listEl && !listEl.dataset.qtyDelegated) {
        listEl.addEventListener('click', (e) => {

            let clicked = e.target;
            if (clicked.nodeType !== 1) clicked = clicked.parentElement;
            const inc = clicked.closest('.qty-increase');
            const dec = clicked.closest('.qty-decrease');
            const removeBtn = clicked.closest('.remove-item');
            if (!inc && !dec && !removeBtn) return;
            const li = clicked.closest('.list-group-item');
            if (!li) return;
            const idx = Number(li.dataset.index);
            const cart = loadCart();

            if (inc) {
                cart[idx].quantity += 1;
                saveCart(cart);

                const qtyEl = li.querySelector('.qty-value');
                const lineTotalEl = li.querySelector('.line-total');
                if (qtyEl) qtyEl.textContent = cart[idx].quantity;
                if (lineTotalEl) lineTotalEl.textContent = formatPriceUSD(cart[idx].price * cart[idx].quantity);
            }

            if (dec) {
                cart[idx].quantity = Math.max(0, cart[idx].quantity - 1);
                if (cart[idx].quantity === 0) {
                    const newCart = cart.filter(i => i.quantity > 0);
                    saveCart(newCart);

                    renderCartInto(container);
                    return;
                } else {
                    saveCart(cart);
                    const qtyEl = li.querySelector('.qty-value');
                    const lineTotalEl = li.querySelector('.line-total');
                    if (qtyEl) qtyEl.textContent = cart[idx].quantity;
                    if (lineTotalEl) lineTotalEl.textContent = formatPriceUSD(cart[idx].price * cart[idx].quantity);
                }
            }

            if (removeBtn) {

                const newCart = loadCart().filter((_, i) => i !== idx);
                saveCart(newCart);

                renderCartInto(container);
                return;
            }


            const subtotalEl = container.querySelector('.cart-subtotal');
            if (subtotalEl) {
                const subtotal = loadCart().reduce((sum, it) => sum + (it.price * it.quantity), 0);
                subtotalEl.textContent = formatPriceUSD(subtotal);
            }
        });
        listEl.dataset.qtyDelegated = '1';
    }
}

function renderAllSidebars() {
    document.querySelectorAll('.cart-sidebar').forEach(container => renderCartInto(container));
}




window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) renderAllSidebars();
});

document.addEventListener('DOMContentLoaded', () => {
    renderAllSidebars();

    const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const subtotal = loadCart().reduce((sum, it) => sum + (it.price * it.quantity), 0);

        // 🛒 Empty cart alert (top popup)
        if (subtotal === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'alert alert-warning text-center position-fixed top-0 start-50 translate-middle-x mt-3 shadow';
            emptyDiv.style.zIndex = '2000';
            emptyDiv.innerHTML = '🛒 Your cart is empty! Add some items first.';
            document.body.appendChild(emptyDiv);
            setTimeout(() => emptyDiv.remove(), 2000);
            return;
        }

        // 💳 Show confirmation modal (uses your HTML modal)
        const confirmMsg = `Proceed to checkout — subtotal: ${formatPriceUSD(subtotal)}?`;
        document.getElementById('checkoutModalText').textContent = confirmMsg;
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();

        // Remove previous event listeners
        const confirmButton = document.getElementById('confirmCheckoutBtn');
        const newButton = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newButton, confirmButton);

        // ✅ Confirm checkout logic
        newButton.addEventListener('click', () => {
            localStorage.removeItem(CART_KEY);
            checkoutModal.hide();
            renderAllSidebars();

            // 🎉 Create success popup (like "cart empty" alert)
const successDiv = document.createElement('div');
successDiv.className = 'alert alert-success text-center position-fixed top-0 start-50 translate-middle-x mt-3 shadow';
successDiv.style.zIndex = '2000';
successDiv.style.fontSize = '1.1rem';
successDiv.innerHTML = '✅ Checkout completed successfully!';
document.body.appendChild(successDiv);

// ⏱ Fade out faster (1.5s)
setTimeout(() => {
  successDiv.style.transition = 'opacity 0.5s ease';
  successDiv.style.opacity = '0';
  setTimeout(() => successDiv.remove(), 500);
}, 700);


        });
 

        });
    }
});
