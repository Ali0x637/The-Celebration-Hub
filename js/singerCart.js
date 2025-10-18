
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

function addToCart(item) {
    const cart = loadCart();

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ticket-card').forEach((card, idx) => {
        const btn = card.querySelector('button');
        const qtyInput = card.querySelector('input[type="number"]');
        const title = card.querySelector('h5') ? card.querySelector('h5').textContent.trim() : `Ticket ${idx + 1}`;
        const priceEl = card.querySelector('.text-main-color');
        let price = 0;
        if (priceEl) {

            price = Number(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;

            price = Math.round(price * 100) / 100;
        }

        btn && btn.addEventListener('click', () => {
            const qty = Number(qtyInput.value) || 1;

            const page = window.location.pathname.split('/').pop().replace('.html', '') || 'page';
            const id = `${page}-ticket-${idx}`;

            const singerEl = document.querySelector('h1');
            const singer = singerEl ? singerEl.textContent.trim() : '';
            addToCart({ id, title, meta: '', price, quantity: qty, singer });


            btn.textContent = 'Added';
            setTimeout(() => btn.textContent = 'Add to Cart', 900);
        });
    });
});
