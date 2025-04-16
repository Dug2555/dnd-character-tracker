const supabase = window.supabase.createClient("https://gdltukuntekcrjclvwpn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbHR1a3VudGVrY3JqY2x2d3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTUwNzYsImV4cCI6MjA2MDMzMTA3Nn0.u-soUjkX2Emt7LtX0cY4neHRMgzR9i_KnYWK7Sek_80");

let characterId = null;

// Get character ID from URL
window.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  characterId = urlParams.get('id');
  if (!characterId) {
    alert('Missing character ID.');
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
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

  if (error || !data) {
    alert('Character not found.');
    return;
  }

  // Populate form
  document.getElementById('name').value = data.name;
  document.getElementById('class').value = data.class;
  document.getElementById('level').value = data.level;
  document.getElementById('notes').value = data.notes;
});

async function saveCharacter() {
  const name = document.getElementById('name').value;
  const charClass = document.getElementById('class').value;
  const level = parseInt(document.getElementById('level').value);
  const notes = document.getElementById('notes').value;

  const { error } = await supabase
    .from('characters')
    .update({ name, class: charClass, level, notes })
    .eq('id', characterId);

  if (error) {
    alert('Error saving character.');
  } else {
    alert('Character updated!');
  }
}
