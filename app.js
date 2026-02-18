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

        function showPage(pageId) {
            document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('.nav-menu li a').forEach(link => link.classList.remove('active'));
            const activeSection = document.getElementById(pageId);
            activeSection.classList.add('active');
            document.getElementById('link-' + pageId).classList.add('active');

            navMenu.classList.remove('active');
            window.scrollTo(0, 0);

            activeSection.style.animation = 'none';
            activeSection.offsetHeight;
            activeSection.style.animation = 'slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

            if(pageId === 'home') {
                const heroContent = document.querySelector('.hero-content');
                heroContent.classList.remove('animate');
                void heroContent.offsetWidth;
                setTimeout(() => {
                    heroContent.classList.add('animate');
                }, 50);
            }
        }

        playBtn.addEventListener('click', () => {
            if (audio.paused) { audio.play(); icon.classList.remove('fa-play'); icon.classList.add('fa-pause'); }
            else { audio.pause(); icon.classList.remove('fa-pause'); icon.classList.add('fa-play'); }
        });

        audio.addEventListener('timeupdate', () => {
            if(audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + '%';
                let currentMin = Math.floor(audio.currentTime / 60);
                let currentSec = Math.floor(audio.currentTime % 60);
                if(currentSec < 10) currentSec = "0" + currentSec;
                timeDisplay.innerText = currentMin + ":" + currentSec;
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
            if(audio.volume === 0) volIcon.className = "fa-solid fa-volume-xmark volume-icon";
            else if (audio.volume < 0.5) volIcon.className = "fa-solid fa-volume-low volume-icon";
            else volIcon.className = "fa-solid fa-volume-high volume-icon";
        });
