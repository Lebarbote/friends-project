// ===============================
// Função principal para carregar os personagens salvos
// ===============================
async function loadSavedCharacters() {
  const savedIds = JSON.parse(localStorage.getItem('savedCharacters')) || [];
  const container = document.getElementById('cardsContainer');

  if (savedIds.length === 0) {
    container.innerHTML = '<p style="color: white;">No characters saved yet.</p>';
    return;
  }

  const res = await fetch('http://localhost:3333/saved-characters');
  const allSavedCharacters = await res.json();

  container.innerHTML = '';

  allSavedCharacters
    .filter((character) => savedIds.includes(character.id))
    .forEach((character) => {
      const card = document.createElement('div');
      card.className = 'card';

      const phraseSpan = document.createElement('span');
      phraseSpan.className = 'phrase';
      phraseSpan.textContent = character.phrase;

      card.innerHTML = `
        <img src="http://127.0.0.1:5500/${character.image_url.replace('Assets/', 'Assets/')}" alt="${character.name}" />
        <h3>${character.name}</h3>
        <p><strong>Profession:</strong> ${character.profession}</p>
        <p><strong>Phrase:</strong> </p>
      `;
      card.querySelector('p:last-of-type').appendChild(phraseSpan);

      // Botão de atualizar frase (abre modal)
      const updateBtn = document.createElement('button');
      updateBtn.textContent = '🗘 Update';
      updateBtn.className = 'updateBtn';
      updateBtn.addEventListener('click', () => {
        openEditModal(character, phraseSpan);
      });

      // Botão de deletar personagem
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '❌ Delete';
      deleteBtn.className = 'deleteBtn';
      deleteBtn.addEventListener('click', () => {
        showConfirmModal(`Do you really want to delete ${character.name}?`, async () => {
          try {
            const response = await fetch(`http://localhost:3333/saved-characters/${character.id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              card.remove();
              const saved = JSON.parse(localStorage.getItem('savedCharacters')) || [];
              const updated = saved.filter((id) => id !== character.id);
              localStorage.setItem('savedCharacters', JSON.stringify(updated));
              showMessageModal('Character deleted successfully!');
            } else {
              showMessageModal('Error deleting character.');
            }
          } catch (err) {
            console.error('Unexpected error while deleting character:', err);
            showMessageModal('Unexpected error while deleting character.');
          }
        });
      });

      card.appendChild(updateBtn);
      card.appendChild(deleteBtn);
      container.appendChild(card);
    });
}

// ===============================
// Modal de mensagem
// ===============================
function showMessageModal(message) {
  const modal = document.getElementById('errorModal');
  const msg = document.getElementById('errorMessage');
  msg.textContent = message;
  modal.classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('errorModal').classList.add('hidden');
});

// ===============================
// Modal de edição da frase
// ===============================
let currentCharacter = null;
let currentPhraseSpan = null;

const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editPhraseInput');
const confirmEditBtn = document.getElementById('confirmEdit');
const cancelEditBtn = document.getElementById('cancelEdit');

function openEditModal(character, phraseSpan) {
  currentCharacter = character;
  currentPhraseSpan = phraseSpan;
  editInput.value = character.phrase;
  editModal.classList.remove('hidden');
}

confirmEditBtn.onclick = async () => {
  const newPhrase = editInput.value.trim();
  if (!newPhrase) return;

  const response = await fetch(`http://localhost:3333/saved-characters/${currentCharacter.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: currentCharacter.name,
      profession: currentCharacter.profession,
      phrase: newPhrase,
    }),
  });

  if (response.ok) {
    currentPhraseSpan.textContent = newPhrase;
    currentCharacter.phrase = newPhrase;
    showMessageModal('Updated successfully!');
  } else {
    showMessageModal('Error updating.');
  }

  editModal.classList.add('hidden');
};

cancelEditBtn.onclick = () => {
  editModal.classList.add('hidden');
};

// ===============================
// Modal de confirmação
// ===============================
function showConfirmModal(message, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const msg = document.getElementById('confirmMessage');
  const yesBtn = document.getElementById('confirmYes');
  const noBtn = document.getElementById('confirmNo');

  msg.textContent = message;
  modal.classList.remove('hidden');

  const cleanUp = () => {
    modal.classList.add('hidden');
    yesBtn.removeEventListener('click', onYes);
    noBtn.removeEventListener('click', onNo);
  };

  const onYes = () => {
    cleanUp();
    onConfirm();
  };

  const onNo = () => {
    cleanUp();
  };

  yesBtn.addEventListener('click', onYes);
  noBtn.addEventListener('click', onNo);
}

// ===============================
// Botão de voltar
// ===============================
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// ===============================
// Iniciar carregamento
// ===============================
loadSavedCharacters();
