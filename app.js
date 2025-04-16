// Initialize Supabase

const { createClient } = supabase;
const supabaseClient = createClient("https://gdltukuntekcrjclvwpn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkbHR1a3VudGVrY3JqY2x2d3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTUwNzYsImV4cCI6MjA2MDMzMTA3Nn0.u-soUjkX2Emt7LtX0cY4neHRMgzR9i_KnYWK7Sek_80");

// Auth
async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Check your email to confirm your account!');
}

async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('character-form').style.display = 'block';
  }
}

// Save character
async function saveCharacter() {
  const user = await supabaseClient.auth.getUser();
  const userId = user.data.user.id;

  const character = {
    user_id: userId,
    name: document.getElementById('charName').value,
    class: document.getElementById('charClass').value,
    level: parseInt(document.getElementById('charLevel').value),
    notes: document.getElementById('charNotes').value
  };

  const { error } = await supabaseClient.from('characters').insert(character);
  if (error) alert(error.message);
  else alert('Character saved!');
}