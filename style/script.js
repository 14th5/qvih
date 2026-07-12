$(document).ready(function () {
  const envelope = $('#envelope');
  const openBtn = $("#openBtn");
  const resetBtn = $("#resetBtn");

  let currentPage = 1;
  const totalPages = 23;
  let isOpen = false;

  envelope.on('click', function () {
      if (isOpen) nextLyric();
  });

  openBtn.on('click', function () {
      envelope.removeClass("close").addClass("open");
      isOpen = true;
      openBtn.hide();
      resetBtn.show();
  });

  resetBtn.on('click', function () {
      envelope.removeClass("open").addClass("close");
      isOpen = false;
      setTimeout(function () {
          currentPage = 1;
          updateActivePage();
          resetBtn.hide();
          openBtn.show();
      }, 600);
  });

  function nextLyric() {
      currentPage = currentPage < totalPages ? currentPage + 1 : 1;
      updateActivePage();
  }

  function updateActivePage() {
      $(".lyric-page").removeClass("active");
      $("#page" + currentPage).addClass("active");
  }
});

const openBtn = document.getElementById("openBtn");
const resetBtn = document.getElementById("resetBtn");
const envelope = document.getElementById("envelope");
const audio = document.getElementById("sound");

let hasPlayed = false;

function playAudioOnce() {
    if (!hasPlayed) {
        audio.play().then(() => {
            hasPlayed = true;
        }).catch((e) => {
            console.log("Không thể phát nhạc:", e);
        });
    }
}

openBtn.addEventListener("click", function () {
    envelope.classList.remove("close");
    envelope.classList.add("open");
    openBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
    playAudioOnce();
});

resetBtn.addEventListener("click", function () {
    envelope.classList.remove("open");
    envelope.classList.add("close");
    openBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
    playAudioOnce();
});

// ==== Tự động Fullscreen & Xoay ngang khi mở trên điện thoại ====
function isMobileDevice() {
    const uaCheck = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent);
    const touchCheck = (navigator.maxTouchPoints || 0) > 0;
    const sizeCheck = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    // Chỉ coi là di động khi vừa có touch/UA di động, vừa màn hình nhỏ
    return (uaCheck || touchCheck) && sizeCheck;
}

function requestFullscreenAndLandscape() {
    // Trên máy tính: không fullscreen, không xoay ngang — giữ nguyên trải nghiệm bình thường
    if (!isMobileDevice()) return;

    const elem = document.documentElement;

    const goFullscreen = elem.requestFullscreen
        ? elem.requestFullscreen()
        : elem.webkitRequestFullscreen
        ? elem.webkitRequestFullscreen()
        : elem.msRequestFullscreen
        ? elem.msRequestFullscreen()
        : Promise.resolve();

    Promise.resolve(goFullscreen)
        .catch(() => {})
        .finally(() => {
            if (screen.orientation && screen.orientation.lock) {
                // Trình duyệt hỗ trợ khoá xoay thật (đa số Android)
                screen.orientation.lock("landscape").catch(() => {
                    // Nếu khoá thất bại (vd: chưa fullscreen), dùng cách CSS dự phòng
                    document.body.classList.add("force-landscape");
                });
            } else {
                // Trình duyệt không hỗ trợ Screen Orientation API (vd: iOS Safari)
                document.body.classList.add("force-landscape");
            }
        });
}

// Gắn vào nút "Mở" vì các API này yêu cầu phải có thao tác chạm/click của người dùng
const openBtnFS = document.getElementById("openBtn");
if (openBtnFS) {
    openBtnFS.addEventListener("click", requestFullscreenAndLandscape);
}

// Thoát fullscreen & bỏ xoay ngang khi bấm "Đóng"
const resetBtnFS = document.getElementById("resetBtn");
if (resetBtnFS) {
    resetBtnFS.addEventListener("click", function () {
        if (!isMobileDevice()) return;
        document.body.classList.remove("force-landscape");
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitFullscreenElement) {
            document.webkitExitFullscreen();
        }
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    });
}
