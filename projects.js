// projects.js — 프로젝트(유튜브) 갤러리 + 페이지네이션 전용
(() => {
  const PROJECTS_PER_PAGE = 8;

  // ✅ 여기만 편하게 관리하면 됨
  const PROJECTS = [
      { id: "FXEghQiNnmQ", title: "프로젝트 영상 #1", desc: "High Quality Montage" },
      { id: "HT1PUiN0uQc", title: "프로젝트 영상 #2", desc: "Gameplay Highlight" },
      { id: "PxEkyT4Ncfs", title: "프로젝트 영상 #3", desc: "Creative Edit" },
      { id: "yT4orJcI3Nk", title: "프로젝트 영상 #4", desc: "New Highlight 2024" },
      { id: "PxEkyT4Ncfs", title: "프로젝트 영상 #5", desc: "Special Clip" },
      { id: "GQ3Athtgtlw", title: "프로젝트 영상 #6", desc: "Best Montage" },
    // { id: "영상ID", title: "제목", desc: "설명" },
  ];

  let page = 1;

  const grid = () => document.getElementById("projectGrid");
  const pager = () => document.getElementById("projectPager");

  const youtubeThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const youtubeUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

  function render(nextPage = 1) {
    const g = grid();
    const p = pager();
    if (!g || !p) return;

    const totalPages = Math.max(1, Math.ceil(PROJECTS.length / PROJECTS_PER_PAGE));
    page = Math.min(Math.max(1, nextPage), totalPages);

    const start = (page - 1) * PROJECTS_PER_PAGE;
    const items = PROJECTS.slice(start, start + PROJECTS_PER_PAGE);

    g.innerHTML = items.map(v => `
      <div class="video-card">
        <a href="${youtubeUrl(v.id)}" target="_blank" rel="noopener noreferrer" class="video-thumbnail">
          <img src="${youtubeThumb(v.id)}" alt="${v.title}">
          <div class="play-icon-overlay"><i class="fa-solid fa-play"></i></div>
        </a>
        <div class="video-info">
          <h3>${v.title}</h3>
          <p>${v.desc ?? ""}</p>
        </div>
      </div>
    `).join("");

    const numbers = Array.from({ length: totalPages }, (_, i) => {
      const n = i + 1;
      return `<button class="${n === page ? "active" : ""}" data-page="${n}">${n}</button>`;
    }).join("");

    p.innerHTML = `
      <button data-page="prev" ${page === 1 ? "disabled" : ""}>이전</button>
      ${numbers}
      <button data-page="next" ${page === totalPages ? "disabled" : ""}>다음</button>
    `;

    p.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-page");
        if (v === "prev") render(page - 1);
        else if (v === "next") render(page + 1);
        else render(parseInt(v, 10));
      });
    });
  }

  // 전역으로 노출(원하면 app.js에서 showPage('project') 시 호출 가능)
  window.renderProjects = render;

  window.addEventListener("load", () => {
    render(1);
  });
})();
