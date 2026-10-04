const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
const icon = btn.querySelector('i');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

let cart = [];

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, qty: 1, image });
    }
    updateCartUI();

    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const badgeDesktop = document.getElementById('cart-badge-desktop');
    const badgeMobile = document.getElementById('cart-badge-mobile');
    const subtotalEl = document.getElementById('cart-subtotal');
    const emptyState = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems > 0) {
        badgeDesktop.innerText = totalItems;
        badgeDesktop.classList.remove('hidden');
        badgeMobile.innerText = totalItems;
        badgeMobile.classList.remove('hidden');
    } else {
        badgeDesktop.classList.add('hidden');
        badgeMobile.classList.add('hidden');
    }

    cartList.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        emptyState.classList.remove('hidden');
        cartFooter.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        cartFooter.classList.remove('hidden');

        cart.forEach((item, index) => {
            subtotal += item.price * item.qty;
            cartList.innerHTML += `
                <div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg" onerror="this.src='https://placehold.co/100x100/5C3A21/F8F5F0?text=Kue'">
                    <div class="flex-1">
                        <h4 class="font-bold text-sweet-dark text-sm leading-tight mb-1">${item.name}</h4>
                        <p class="text-sweet-brown text-sm font-semibold mb-2">Rp ${(item.price).toLocaleString('id-ID')}</p>
                        <div class="flex items-center gap-3">
                            <button onclick="changeQty(${index}, -1)" class="w-7 h-7 rounded-full bg-sweet-cream text-sweet-dark flex items-center justify-center hover:bg-sweet-brown hover:text-white transition-colors text-lg">-</button>
                            <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                            <button onclick="changeQty(${index}, 1)" class="w-7 h-7 rounded-full bg-sweet-cream text-sweet-dark flex items-center justify-center hover:bg-sweet-brown hover:text-white transition-colors text-lg">+</button>
                        </div>
                    </div>
                    <button onclick="changeQty(${index}, -${item.qty})" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-2" title="Hapus">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });
    }
    subtotalEl.innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }
}

function togglePaymentModal() {
    const sidebar = document.getElementById('cart-sidebar');
    if (!sidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }

    const modal = document.getElementById('payment-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        document.getElementById('payment-total').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function processCheckout(event) {
    event.preventDefault();

    const nama = document.getElementById('checkout-nama').value;
    const alamat = document.getElementById('checkout-alamat').value;
    const catatan = document.getElementById('checkout-catatan').value;

    let orderText = `*Halo MySweetheart, saya ingin memesan kue:* 🎂\n\n`;
    let total = 0;

    cart.forEach((item, index) => {
        let sub = item.price * item.qty;
        total += sub;
        orderText += `${index + 1}. *${item.name}*\n   ${item.qty}x Rp ${(item.price).toLocaleString('id-ID')} = Rp ${sub.toLocaleString('id-ID')}\n`;
    });

    orderText += `\n*TOTAL TAGIHAN: Rp ${total.toLocaleString('id-ID')}*\n`;
    orderText += `---------------------------\n`;
    orderText += `*Data Pengiriman:*\n`;
    orderText += `👤 Nama: ${nama}\n`;
    orderText += `📍 Alamat: ${alamat}\n`;
    if(catatan) orderText += `📝 Catatan: ${catatan}\n\n`;
    orderText += `Apakah pesanan saya bisa diproses? Terima kasih! ✨`;

    const waNumber = '6283894983594'; 
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(orderText)}`;

    window.open(waLink, '_blank');

    cart = [];
    updateCartUI();
    togglePaymentModal();
    document.getElementById('checkout-form').reset();
}

// Tahun otomatis di footer
document.getElementById('year').textContent = new Date().getFullYear();
