let fixedCharacters = [];

async function fetchFixedCharacters() {
  try {
    const res = await fetch('http://localhost:3333/fixed-characters');
    fixedCharacters = await res.json();

    const gallery = document.getElementById('gallery');

    fixedCharacters.forEach(character => {
      const div = document.createElement('div');
      div.className = 'gallery-item';

      div.innerHTML = `
        <img src="${character.image_url}" alt="${character.name}" />
        <p>${character.name}</p>
        <button class="clone-btn" data-id="${character.id}">Create character</button>
      `;

      gallery.appendChild(div);
    });

    document.querySelectorAll('.clone-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        event.stopPropagation();

        const fixedId = button.dataset.id;

        try {
          const res = await fetch(`http://localhost:3333/character/from-fixed/${fixedId}`, {
            method: 'POST'
          });

          if (!res.ok) {
            showErrorModal('Error creating character.');
            return;
          }

          const data = await res.json();

          const saved = JSON.parse(localStorage.getItem('savedCharacters')) || [];
          saved.push(data.id);
          localStorage.setItem('savedCharacters', JSON.stringify(saved));

          window.location.href = 'friends.html';
        } catch (err) {
          console.error('Error saving character:', err);
          showErrorModal('Error saving character.');
        }
      });
    });
  } catch (error) {
    console.error('Error searching for fixed characters:', error);
    showErrorModal('Error searching for fixed characters.');
  }
}

function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const msg = document.getElementById('errorMessage');
  msg.textContent = message;
  modal.classList.remove('hidden');
}

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('errorModal').classList.add('hidden');
});

fetchFixedCharacters();
