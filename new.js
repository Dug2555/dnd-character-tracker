const supabase = window.supabase.createClient("https://gdltukuntekcrjclvwpn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbHR1a3VudGVrY3JqY2x2d3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTUwNzYsImV4cCI6MjA2MDMzMTA3Nn0.u-soUjkX2Emt7LtX0cY4neHRMgzR9i_KnYWK7Sek_80");


async function createCharacter() {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return alert('You must be signed in.');
    
        const name = document.getElementById('name').value;
        const charClass = document.getElementById('class').value;
        const level = parseInt(document.getElementById('level').value);
        const hpMax = parseInt(document.getElementById('hp-max').value);
        const notes = document.getElementById('notes').value;
        const canCastSpells = document.getElementById('can-cast-spells').checked;
    
        const { data, error } = await supabase.from('characters').insert([{
        user_id: user.id,
        name,
        class: charClass,
        level,
        hpMax,
        hpCurrent: hpMax,
        tempHp: 0,
        notes,
        inventory: [],
        can_cast_spells: canCastSpells,
        strength:strength,
        dexterity:dexterity,
        constitution:constitution,
        intelligence:intelligence,
        wisdom:wisdom,
        charisma:charisma
        }]).select().single();
    
        if (error) {
        alert(error.message);
        } else {
        // Redirect to the character tracker or back to list
        window.location.href = `character.html?id=${data.id}`;
        }
  }
  
  function goBack() {
    window.location.href = 'index.html'; // or wherever your list is
  }