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


  if (data.can_cast_spells) {
    document.getElementById('spells-section').style.display = 'block';
    loadSpells(characterId);
  } else {
    document.getElementById('spells-section').style.display = 'none';
  }

  // Populate form
  document.getElementById('name').value = data.name;
  document.getElementById('class').value = data.class;
  document.getElementById('level').value = data.level;
  document.getElementById('notes').value = data.notes;
  document.getElementById('hp-max').value = data.hpMax || 0;
  document.getElementById('stat-str').value = data.strength || 10;
  document.getElementById('stat-dex').value = data.dexterity || 10;
  document.getElementById('stat-con').value = data.constitution || 10;
  document.getElementById('stat-int').value = data.intelligence || 10;
  document.getElementById('stat-wis').value = data.wisdom || 10;
  document.getElementById('stat-cha').value = data.charisma || 10;
  
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
    const canCastSpells = document.getElementById('can-cast-spells').checked;
    const strength = parseInt(document.getElementById('stat-str').value);
    const dexterity = parseInt(document.getElementById('stat-dex').value);
    const constitution = parseInt(document.getElementById('stat-con').value);
    const intelligence = parseInt(document.getElementById('stat-int').value);
    const wisdom = parseInt(document.getElementById('stat-wis').value);
    const charisma = parseInt(document.getElementById('stat-cha').value);

    const { error } = await supabase
    .from('characters')
    .update({
        name,
        class: charClass,
        level,
        notes,
        hpMax,
        can_cast_spells:canCastSpells,
        strength:strength,
        dexterity:dexterity,
        constitution:constitution,
        intelligence:intelligence,
        wisdom:wisdom,
        charisma:charisma
    })
    .eq('id', characterId);


    if (error) {
        alert('Error saving character.');
    } else {
        alert('Character updated!');
        if (canCastSpells) {
            document.getElementById('spells-section').style.display = 'block';
            loadSpells(characterId);
        } else {
            document.getElementById('spells-section').style.display = 'none';
        }
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
  
async function loadSpells(characterId) {
    const { data: spells, error } = await supabase
      .from('spells')
      .select('*')
      .eq('character_id', characterId)
      .order('level', { ascending: true });
  
    if (error) {
        console.error('Error loading spells:', error.message, error.details, error.hint);
        return;
    }
  
    const container = document.getElementById('spells');
    container.innerHTML = '';
    spells.forEach(spell => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${spell.name}</strong> (Level ${spell.level})<br/>
            <em>${spell.description || ''}</em><br/>
            Prepared: <input type="checkbox" ${spell.prepared ? 'checked' : ''} onchange="togglePrepared('${spell.id}', this.checked)">
            <button onclick="deleteSpell('${spell.id}')">Delete</button>
            <hr/>
        `;
      container.appendChild(div);
    });
}
  


async function addSpell() {
    const name = document.getElementById('spell-name').value;
    const level = parseInt(document.getElementById('spell-level').value);
    const range = document.getElementById('spell-range').value;
    const description = document.getElementById('spell-description').value;
    const damage = document.getElementById('spell-damage').value;
  
    const { error } = await supabase.from('spells').insert([{
      character_id: characterId,
      name,
      level,
      description,
      range:range,
      damage:damage,
    }]);
  
    if (error) return alert(error.message);
  
    await loadSpells(characterId);
}
  
async function deleteSpell(spellId) {
    const { error } = await supabase
      .from('spells')
      .delete()
      .eq('id', spellId);
  
    if (error) {
      alert('Error deleting spell: ' + error.message);
      return;
    }
  
    await loadSpells(characterId);
}

async function togglePrepared(spellId, value) {
    await supabase
      .from('spells')
      .update({ prepared: value })
      .eq('id', spellId);
}