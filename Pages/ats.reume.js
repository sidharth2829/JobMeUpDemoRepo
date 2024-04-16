document.getElementById("resumeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var field = document.getElementById("field").value;
  var file = document.getElementById("resume").files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }

  var formData = new FormData();
  formData.append("field", field);
  formData.append("resume", file);

  fetch("/check_resume", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      var resultDiv = document.getElementById("result");
      resultDiv.innerText =
        "Resume checked for " + data.field + " field.\nResult: " + data.result;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
