$(document).on("turbolinks:load", function() {
  setTimeout(function() {
    $('.alert').slideUp(500);
  }, 10000);
})