let inventory = [];

window.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const { data, error } = await supabase.from('characters').select('*').eq('id', id).single();
  if (error) return alert('Character not found');

  inventory = data.inventory || [];
  renderInventory();

  document.getElementById('back-to-info').addEventListener('click', () => {
    window.location.href = `character.html?id=${id}`;
  });
});

function renderInventory() {
  const container = document.getElementById('inventory-list');
  container.innerHTML = '';
  inventory.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${item.name} (x${item.quantity}) <button onclick="removeItem(${index})">🗑️</button>`;
    container.appendChild(div);
  });
}

function addItem() {
  const name = document.getElementById('item-name').value;
  const qty = parseInt(document.getElementById('item-qty').value);
  if (!name || qty <= 0) return;

  inventory.push({ name, quantity: qty });
  renderInventory();
  saveInventory();
}

function removeItem(index) {
  inventory.splice(index, 1);
  renderInventory();
  saveInventory();
}

async function saveInventory() {
  const id = new URLSearchParams(window.location.search).get('id');
  await supabase.from('characters').update({ inventory }).eq('id', id);
}
