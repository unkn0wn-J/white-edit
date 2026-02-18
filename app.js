        const audio = document.getElementById('bgm');
        const overlay = document.getElementById('start-overlay');
        const playBtn = document.getElementById('playToggleBtn');
        const icon = playBtn.querySelector('i');
        const progressFill = document.getElementById('progressFill');
        const timeDisplay = document.getElementById('timeDisplay');
        const volumeSlider = document.getElementById('volumeSlider');
        const volIcon = document.getElementById('volIcon');
        const navMenu = document.getElementById('navMenu');
        const modal = document.getElementById('feedback-modal');
        const alertModal = document.getElementById('alert-modal');
        const alertMsg = document.getElementById('alert-msg');
        const madmovieModal = document.getElementById('madmovie-modal');

        function startSite() {
            // [핵심 수정] 음악이 성공하든 실패하든, 일단 문은 무조건 엽니다.
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 800);

            // 문 열고 나서 음악 재생 시도 (실패해도 상관없음)
            audio.volume = 0.3;
            audio.play().then(() => {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }).catch(error => {
                console.log("음악 재생 실패 (파일 없음 or 권한 문제):", error);
            });
        }

        function toggleMenu() {
            navMenu.classList.toggle('active');
        }

        // 매드무비 모달 관련
        function openMadmovieModal() {
            madmovieModal.style.display = 'flex';
            setTimeout(() => { madmovieModal.classList.add('open'); }, 10);
        }

        function closeMadmovieModal() {
            madmovieModal.classList.remove('open');
            setTimeout(() => { madmovieModal.style.display = 'none'; }, 300);
        }

        // 피드백 모달 관련
        function openModal() {
            modal.style.display = 'flex';
            setTimeout(() => { modal.classList.add('open'); }, 10);
        }

        function closeModal() {
            modal.classList.remove('open');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }

        // [NEW] 알림 모달 관련
        function showAlert(msg) {
            alertMsg.innerHTML = msg;
            alertModal.style.display = 'flex';
            setTimeout(() => { alertModal.classList.add('open'); }, 10);
        }

        function closeAlert() {
            alertModal.classList.remove('open');
            setTimeout(() => { alertModal.style.display = 'none'; }, 300);
        }

        // 모달 배경 클릭 시 닫기 (둘 다 처리)
        window.onclick = function(event) {
            if (event.target == modal) { closeModal(); }
            if (event.target == alertModal) { closeAlert(); }
            if (event.target == madmovieModal) { closeMadmovieModal(); }
        }

function showPage(pageId, push = true) {


    document.body.classList.toggle('no-scroll', pageId !== 'home');

    const activeSection = document.getElementById(pageId);
    if (!activeSection) return;

    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-menu li a').forEach(link => link.classList.remove('active'));

    activeSection.classList.add('active');

    const activeLink = document.getElementById('link-' + pageId);
    if (activeLink) activeLink.classList.add('active');

    const logo = document.querySelector('.header-left');
    if (logo) logo.classList.toggle('not-home', pageId !== 'home');

    if (typeof navMenu !== "undefined" && navMenu) navMenu.classList.remove('active');
    activeSection.scrollTop = 0;

    activeSection.style.animation = 'none';
    activeSection.offsetHeight;
    activeSection.style.animation = 'slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

    if (pageId === 'home') {
        const hs = document.getElementById('home-scroll');
        if (hs) hs.scrollTop = 0;

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.remove('animate');
            void heroContent.offsetWidth;
            setTimeout(() => heroContent.classList.add('animate'), 50);
        }
    }

    if (push) history.pushState({ pageId }, '', `#${pageId}`);

    if (typeof updateScrollNav === "function") updateScrollNav();
    if (pageId === 'project' && typeof window.renderProjects === "function") window.renderProjects();
}


// 뒤로/앞으로 버튼 눌렀을 때: 해시 기반으로 섹션 복원
window.addEventListener('popstate', () => {
    const pageId = location.hash.replace('#', '') || 'home';
    showPage(pageId, false); // pushState 다시 하면 안 됨
});

// 새로고침/첫 진입 시: #madmovie 같은 해시가 있으면 그 섹션으로
window.addEventListener('load', () => {
    const pageId = location.hash.replace('#', '') || 'home';
    showPage(pageId, false);
});

if (playBtn && audio && volumeSlider && progressFill && timeDisplay && volIcon) {
// ✅ 재생 버튼
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            audio.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    });

    // ✅ 진행바/시간 표시
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + '%';

            let currentMin = Math.floor(audio.currentTime / 60);
            let currentSec = Math.floor(audio.currentTime % 60);
            if (currentSec < 10) currentSec = "0" + currentSec;
            timeDisplay.innerText = currentMin + ":" + currentSec;
        }
    });

}
let lastVolume = audio.volume || 0.3;

function updateVolumeUI() {
  // 아이콘 업데이트
  if (audio.muted || audio.volume === 0) {
    volIcon.className = "fa-solid fa-volume-xmark volume-icon";
  } else if (audio.volume < 0.5) {
    volIcon.className = "fa-solid fa-volume-low volume-icon";
  } else {
    volIcon.className = "fa-solid fa-volume-high volume-icon";
  }

  // 슬라이더 업데이트(음소거일 땐 0처럼 보이게)
  volumeSlider.value = (audio.muted ? 0 : audio.volume);
}

// 스피커 아이콘 클릭 → 음소거 토글
volIcon.addEventListener('click', () => {
  volIcon.classList.add('vol-anim');

  if (audio.muted || audio.volume === 0) {
    // 음소거 해제
    audio.muted = false;
    audio.volume = lastVolume > 0 ? lastVolume : 0.3;
  } else {
    // 음소거
    lastVolume = audio.volume;  // 현재 볼륨 저장
    audio.muted = true;
  }

  updateVolumeUI();

  setTimeout(() => volIcon.classList.remove('vol-anim'), 220);
});

// 슬라이더로 조절하면 muted 해제 & UI 갱신
volumeSlider.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  audio.muted = (v === 0);
  audio.volume = v;

  if (v > 0) lastVolume = v;
  updateVolumeUI();
});
// ABOUT 스냅: 휠 한 번 = 다음(또는 이전) 섹션으로만 이동 (자잘한 스크롤 방지)
const aboutScroll = document.getElementById('about-scroll');
let aboutWheelLock = false;

function scrollAboutToSection(deltaY) {
  if (!aboutScroll) return;

  const sections = Array.from(aboutScroll.querySelectorAll('.about-snap'));
  if (sections.length === 0) return;

  // 현재 가장 가까운 섹션 찾기
  const current = sections.reduce((best, sec) => {
    const d = Math.abs(sec.offsetTop - aboutScroll.scrollTop);
    return d < best.d ? { sec, d } : best;
  }, { sec: sections[0], d: Infinity }).sec;

  let idx = sections.indexOf(current);
  if (deltaY > 0) idx = Math.min(idx + 1, sections.length - 1);
  else idx = Math.max(idx - 1, 0);

  sections[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

if (aboutScroll) {
  aboutScroll.addEventListener('wheel', (e) => {

    // ✅ 1. 모바일이면 그냥 통과 (기본 스크롤 허용)
    if (window.matchMedia("(max-width: 768px)").matches) {
      return;
    }

    // ✅ 2. about 페이지 아닐 때도 통과
    const aboutActive = document.getElementById('about')?.classList.contains('active');
    if (!aboutActive) return;

    // 🔥 여기부터 데스크톱 전용 스냅 로직
    e.preventDefault();

    if (aboutWheelLock) return;
    aboutWheelLock = true;

    scrollAboutToSection(e.deltaY);

    setTimeout(() => { aboutWheelLock = false; }, 700);

  }, { passive: false });
}

// ===== 하단 스크롤 네비 (HOME/ABOUT 공용) =====
const scrollNav = document.getElementById('scroll-nav');
const btnUp = document.getElementById('scroll-up');
const btnDown = document.getElementById('scroll-down');

function getActiveSnapContext() {
  // home/about만 네비 보이게
  const homeActive = document.getElementById('home')?.classList.contains('active');
  const aboutActive = document.getElementById('about')?.classList.contains('active');

  if (homeActive) {
    return {
      container: document.getElementById('home-scroll'),
      sections: Array.from(document.querySelectorAll('#home-scroll .home-snap')),
    };
  }
  if (aboutActive) {
    return {
      container: document.getElementById('about-scroll'),
      sections: Array.from(document.querySelectorAll('#about-scroll .about-snap')),
    };
  }
  return null;
}

function getCurrentIndex(container, sections) {
  // 현재 scrollTop과 가장 가까운 섹션을 현재 섹션으로 간주
  const top = container.scrollTop;
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < sections.length; i++) {
    const d = Math.abs(sections[i].offsetTop - top);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function updateScrollNav() {
    if (window.matchMedia("(max-width: 768px)").matches) {
  scrollNav.classList.remove('show');
  return;
}

  const ctx = getActiveSnapContext();
  if (!ctx || !ctx.container || ctx.sections.length === 0) {
    scrollNav.classList.remove('show');
    return;
  }

  const { container, sections } = ctx;
  const idx = getCurrentIndex(container, sections);
  const last = sections.length - 1;

  // 기본: home/about에서는 보이게
  scrollNav.classList.add('show');

  // 규칙:
  // - 첫 섹션: ↓만
  // - 마지막 섹션: ↑만
  // - 중간 섹션: ↑↓ 둘 다
  const showUp = idx > 0;
  const showDown = idx < last;

  btnUp.classList.toggle('hidden', !showUp);
  btnDown.classList.toggle('hidden', !showDown);

  // 라벨도 원하는 느낌이면 바꿀 수 있음 (지금은 Up/Down)
  // btnUp.querySelector('span').textContent = 'Up';
  // btnDown.querySelector('span').textContent = 'Down';
}

function scrollToIndex(targetIdx) {
  const ctx = getActiveSnapContext();
  if (!ctx) return;
  const { sections } = ctx;
  if (targetIdx < 0 || targetIdx >= sections.length) return;
  sections[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

btnUp?.addEventListener('click', () => {
  const ctx = getActiveSnapContext();
  if (!ctx) return;
  const idx = getCurrentIndex(ctx.container, ctx.sections);
  scrollToIndex(idx - 1);
});

btnDown?.addEventListener('click', () => {
  const ctx = getActiveSnapContext();
  if (!ctx) return;
  const idx = getCurrentIndex(ctx.container, ctx.sections);
  scrollToIndex(idx + 1);
});

// 스크롤 중 섹션 변화 감지(부드럽게)
function bindNavToContainer(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  let raf = null;
  el.addEventListener('scroll', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateScrollNav);
  });
}
bindNavToContainer('home-scroll');
bindNavToContainer('about-scroll');

// showPage 호출될 때도 갱신되게 (기존 showPage에 손대기 싫으면 popstate/load 이후에 한 번 더)
window.addEventListener('load', updateScrollNav);
window.addEventListener('popstate', () => setTimeout(updateScrollNav, 0));

// ===== 프로젝트(유튜브) 갤러리: 8개(4x2) 단위 페이지네이션 =====
const PROJECTS_PER_PAGE = 8;

// ✅ 여기만 편하게 관리하면 됨: 유튜브 ID / 제목 / 설명
//
const PROJECTS = [
  { id: "FXEghQiNnmQ", title: "프로젝트 영상 #1", desc: "High Quality Montage" },
  { id: "HT1PUiN0uQc", title: "프로젝트 영상 #2", desc: "Gameplay Highlight" },
  { id: "PxEkyT4Ncfs", title: "프로젝트 영상 #3", desc: "Creative Edit" },
  { id: "yT4orJcI3Nk", title: "프로젝트 영상 #4", desc: "New Highlight" },
  { id: "PxEkyT4Ncfs", title: "프로젝트 영상 #5", desc: "Best Montage" },
  { id: "GQ3Athtgtlw", title: "프로젝트 영상 #6", desc: "Best Montage" },



  // 🔽 계속 추가
  // { id: "영상ID", title: "제목", desc: "설명" },
];

let projectPage = 1;

function youtubeThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function youtubeUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}

function renderProjects(page = 1) {
  const grid = document.getElementById("projectGrid");
  const pager = document.getElementById("projectPager");
  if (!grid || !pager) return;

  const totalPages = Math.max(1, Math.ceil(PROJECTS.length / PROJECTS_PER_PAGE));
  projectPage = Math.min(Math.max(1, page), totalPages);

  const start = (projectPage - 1) * PROJECTS_PER_PAGE;
  const items = PROJECTS.slice(start, start + PROJECTS_PER_PAGE);

  // 카드 렌더
  grid.innerHTML = items.map(p => `
    <div class="video-card">
      <a href="${youtubeUrl(p.id)}" target="_blank" rel="noopener noreferrer" class="video-thumbnail">
        <img src="${youtubeThumb(p.id)}" alt="${p.title}">
        <div class="play-icon-overlay"><i class="fa-solid fa-play"></i></div>
      </a>
      <div class="video-info">
        <h3>${p.title}</h3>
        <p>${p.desc ?? ""}</p>
      </div>
    </div>
  `).join("");

  // 페이지네이션 렌더
  const pageButtons = Array.from({ length: totalPages }, (_, i) => {
    const n = i + 1;
    return `<button class="${n === projectPage ? "active" : ""}" data-page="${n}">${n}</button>`;
  }).join("");

  pager.innerHTML = `
    <button data-page="prev" ${projectPage === 1 ? "disabled" : ""}>이전</button>
    ${pageButtons}
    <button data-page="next" ${projectPage === totalPages ? "disabled" : ""}>다음</button>
  `;

  // 클릭 핸들러
  pager.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.getAttribute("data-page");
      if (v === "prev") renderProjects(projectPage - 1);
      else if (v === "next") renderProjects(projectPage + 1);
      else renderProjects(parseInt(v, 10));
    });
  });
}

// 첫 로드 시 렌더
window.addEventListener("load", () => {
  renderProjects(1);
});

// project 페이지로 들어갈 때마다 갱신하고 싶으면(선택)
const _origShowPage = window.showPage;
window.showPage = function(pageId, push = true) {
  _origShowPage(pageId, push);
  if (pageId === "project") {
    renderProjects(projectPage);
  }
};
