const supabase = window.supabase.createClient("https://gdltukuntekcrjclvwpn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbHR1a3VudGVrY3JqY2x2d3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTUwNzYsImV4cCI6MjA2MDMzMTA3Nn0.u-soUjkX2Emt7LtX0cY4neHRMgzR9i_KnYWK7Sek_80");

let inventory = [];
let characterId = null;

// Get character ID from URL
window.addEventListener('DOMContentLoaded', async () => {

    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = "index.html";
    });
      
    const urlParams = new URLSearchParams(window.location.search);
    const { data: { user } } = await supabase.auth.getUser();
    


    renderInventory();
      

  
  characterId = urlParams.get('id');
  if (!characterId) {
    alert('Missing character ID.');
    return;
  }

  
  if (!user) {
    alert("Please log in to view this character.");
    window.location.href = "index.html";
    return;
  }

  // Load character data
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', characterId)
    .single();

    inventory = data.inventory || [];
  if (error || !data) {
    alert('Character not found.');
    return;
  }

  // Populate form
  document.getElementById('name').value = data.name;
  document.getElementById('class').value = data.class;
  document.getElementById('level').value = data.level;
  document.getElementById('notes').value = data.notes;
  document.getElementById('hp-max').value = data.hpMax || 0;
});

function renderInventory() {
    const list = document.getElementById('inventory-list');
    if (!list) return; // Skip rendering if this page doesn't have it
    list.innerHTML = '';
    inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
        <strong>${item.name}</strong> (x${item.quantity})
        <button onclick="removeItem(${index})">🗑️</button>
        `;
        list.appendChild(div);
    });
}

async function saveCharacter() {
  const name = document.getElementById('name').value;
  const charClass = document.getElementById('class').value;
  const level = parseInt(document.getElementById('level').value);
  const notes = document.getElementById('notes').value;
  const hpMax = parseInt(document.getElementById('hp-max').value);

  const { error } = await supabase
  .from('characters')
  .update({ name, class: charClass, level, notes, hpMax })
  .eq('id', characterId);


  if (error) {
    alert('Error saving character.');
  } else {
    alert('Character updated!');
  }
}

function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const quantity = parseInt(document.getElementById('item-qty').value);
    if (!name || quantity < 1) return alert("Enter valid item and quantity");
  
    inventory.push({ name, quantity });
    renderInventory();
  
    // Clear inputs
    document.getElementById('item-name').value = '';
    document.getElementById('item-qty').value = '';
}
  
function removeItem(index) {
    inventory.splice(index, 1);
    renderInventory();
}
  
function goToTracker() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    window.location.href = `tracker.html?id=${id}`;
}
  