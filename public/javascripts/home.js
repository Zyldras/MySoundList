document.addEventListener("DOMContentLoaded", function () {
  var addPlaylistBtn = document.getElementById("addPlaylistBtn");
  var playlistForm = document.getElementById("playlistForm");

  addPlaylistBtn.addEventListener("click", function () {
    if (playlistForm.style.display === "none") {
      // Afficher le formulaire
      playlistForm.style.display = "block";
      addPlaylistBtn.textContent = "Annuler";
    } else {
      // Masquer le formulaire
      playlistForm.style.display = "none";
      addPlaylistBtn.textContent = "Ajouter une playlist";
    }
  });
});
