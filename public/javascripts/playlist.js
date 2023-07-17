document.addEventListener("DOMContentLoaded", function () {
    var addMusicBtn = document.getElementById("addMusicBtn");
    var addMusicForm = document.getElementById("addMusicForm");
  
    addMusicBtn.addEventListener("click", function () {
      if (addMusicForm.style.display === "none") {
        // Afficher le formulaire
        addMusicForm.style.display = "block";
        addMusicBtn.textContent = "Annuler";
      } else {
        // Masquer le formulaire
        addMusicForm.style.display = "none";
        addMusicBtn.textContent = "Ajouter une musique";
      }
    });
  });
  