$("#scrape-btn").click(function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function (data) {
    console.log(data);
    window.location = "/";
  });
});

$(".save").click(function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  }).done(function (data) {
    window.location = "/";
  });
});

$(".delete").click(function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + thisId
  }).done(function (data) {
    window.location = "/saved";
  });
});

$(".save-note-btn").click(function () {
  var thisId = $(this).attr("data-id");
  if (!$("#note-Body" + thisId).val()) {
    alert("please enter a note to save");
  } else {
    $.ajax({
      method: "POST",
      url: "/notes/save/" + thisId,
      data: {
        text: $("#note-Body" + thisId).val()
      }
    }).done(function (data) {
      console.log(data);
      $("#note-Body" + thisId).val("");
      $(".modalNote").modal("hide");
      window.location = "/saved";
    });
  }
});

$(".delete-note-btn").click(function () {
  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/delete/" + noteId + "/" + articleId
  }).done(function (data) {
    console.log(data);
    $(".modalNote").modal("hide");
    window.location = "/saved";
  });
});

$("#delete-btn").click(function () {
  $.ajax({
    method: "GET",
    url: "/clear"
  }).done(function (data) {
    console.log("CLEAR");
    window.location = "/";
  });
});
