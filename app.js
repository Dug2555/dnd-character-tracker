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
    await loadCharacters();
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
  await loadCharacters();
}

async function loadCharacters() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
  
    const { data, error } = await supabaseClient
      .from('characters')
      .select('*')
      .eq('user_id', user.id);
  
    const listDiv = document.getElementById('character-list');
    listDiv.innerHTML = ''; // Clear old content
  
    if (error) {
      listDiv.innerText = 'Error loading characters';
      return;
    }
  
    data.forEach((char) => {
      const div = document.createElement('div');
      div.classList.add('character-card');
      div.innerHTML = `
        <strong>${char.name}</strong> (Level ${char.level} ${char.class})<br/>
        <em>${char.notes || ''}</em><br/>
        <button onclick="printCharacter(${char.id})">🖨️ Print</button>
      `;
      listDiv.appendChild(div);
    });
  }

  async function printCharacter(charId) {
    const { data: { user } } = await supabaseClient.auth.getUser();
  
    const { data, error } = await supabaseClient
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', charId)
      .single();
  
    if (error || !data) {
      alert('Character not found');
      return;
    }
  
    const popup = window.open('', '', 'width=600,height=600');
    popup.document.write(`
      <html>
        <head><title>${data.name}</title></head>
        <body>
          <h1>${data.name}</h1>
          <p><strong>Class:</strong> ${data.class}</p>
          <p><strong>Level:</strong> ${data.level}</p>
          <p><strong>Notes:</strong><br/>${data.notes.replace(/\n/g, '<br/>')}</p>
          <script>window.print()</script>
        </body>
      </html>
    `);
    popup.document.close();
  }
  