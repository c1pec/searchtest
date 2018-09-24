var form = document.getElementById('form');
var text = document.getElementById('text');

form.addEventListener('submit', function(e) {
    text.value = text.value.trim();

    if (text.value == '') {
        e.preventDefault();
    } 
});