require('dotenv').config()

// Initialize Supabase

const supabase = supabase.createClient(process.env.SupaURL, process.env.SupaANON);

// Auth
async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Check your email to confirm your account!');
}

async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('character-form').style.display = 'block';
  }
}

// Save character
async function saveCharacter() {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  const character = {
    user_id: userId,
    name: document.getElementById('charName').value,
    class: document.getElementById('charClass').value,
    level: parseInt(document.getElementById('charLevel').value),
    notes: document.getElementById('charNotes').value
  };

  const { error } = await supabase.from('characters').insert(character);
  if (error) alert(error.message);
  else alert('Character saved!');
}