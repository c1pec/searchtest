var form = document.getElementById('form');
var file = document.getElementById('file');

form.addEventListener('submit', function(e) {
    if (file.value == '') {
        e.preventDefault();
        return;
    }

    var files = file.files;

    if (files[0].type != 'text/plain') {
        alert('Extension de fichier invalide, seuls les fichiers .txt sont autorises');
        file.value = '';
        e.preventDefault();
    }
});