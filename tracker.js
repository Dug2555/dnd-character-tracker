const supabase = window.supabase.createClient("https://gdltukuntekcrjclvwpn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbHR1a3VudGVrY3JqY2x2d3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTUwNzYsImV4cCI6MjA2MDMzMTA3Nn0.u-soUjkX2Emt7LtX0cY4neHRMgzR9i_KnYWK7Sek_80");

let characterId = null;
let hpMax = 0;
let inventory = [];

window.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const { data, error } = await supabase.from('characters').select('*').eq('id', id).single();
  if (error) return alert('Character not found');

  characterId = id;
  hpMax = data.hpMax || 0;
  inventory = data.inventory || [];
  renderInventory();

  document.getElementById('to-editor').addEventListener('click', () => {
    window.location.href = `character.html?id=${id}`;
  });
  document.getElementById('back-to-characters').addEventListener('click', () => {
    window.location.href = `index.html?id=${id}`;
  });




  document.getElementById('hp-temp').value = data.tempHp || 0;
  document.getElementById('hp-current').value = data.hpCurrent || data.hpMax || 0;
  document.getElementById('hp-max-display').textContent = data.hpMax || 0;
  document.getElementById('name').textContent = data.name || "";
  document.getElementById('class').textContent = data.class || "";
  document.getElementById('level').textContent = data.level || "";
  document.getElementById('tracker-str').textContent = data.strength;
  document.getElementById('tracker-dex').textContent = data.dexterity;
  document.getElementById('tracker-con').textContent = data.constitution;
  document.getElementById('tracker-int').textContent = data.intelligence;
  document.getElementById('tracker-wis').textContent = data.wisdom;
  document.getElementById('tracker-cha').textContent = data.charisma;
  setMod("str",data.strength);
  setMod("dex",data.dexterity);
  setMod("con",data.constitution);
  setMod("int",data.intelligence);
  setMod("wis",data.wisdom);
  setMod("cha",data.charisma);  
});

function setMod(statName,stat){
    document.getElementById('tracker-' + statName).textContent = stat;
    mod = Math.floor((stat - 10) / 2);
    sign = mod >= 0 ? '+' : '';
    document.getElementById('tracker-'+statName+'-mod').textContent = `(${sign}${mod})`; 
}

async function updateHP() {
    const currentHP = parseInt(document.getElementById('hp-current').value);
    const tempHP = parseInt(document.getElementById('hp-temp').value);
    await supabase.from('characters').update({
      hpCurrent: currentHP,
      tempHp: tempHP
    }).eq('id', characterId);
  }
  
async function resetHP() {
    document.getElementById('hp-current').value = hpMax;
    await supabase.from('characters').update({ hpCurrent: hpMax }).eq('id', characterId);
}

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
