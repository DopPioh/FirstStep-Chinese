document.addEventListener("DOMContentLoaded", function () {
    var videoModal = document.getElementById("videoModal");
    var videoFrame = document.getElementById("videoFrame");

    videoModal.addEventListener("show.bs.modal", function () {
        videoFrame.src = "https://www.youtube.com/embed/zPo5ZaH6sW8?autoplay=1";
    });

    videoModal.addEventListener("hidden.bs.modal", function () {
        videoFrame.src = "";
    });
});