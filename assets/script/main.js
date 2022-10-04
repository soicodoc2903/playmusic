const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.playback');
const audio = $('#audio');
// Control Button
const playBtn = $('.btn-play');
const pauseBtn = $('.btn-pause');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-previous');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
//
const seekingLine = $('.seeking-line');
const seekedLine = $('.seeked');
const volumeLine = $('.volume-line');
const volumeCurrent = $('.volume-current');
const currentSongDuration = $('.total-time');
const currentSongPosition = $('.current-pos');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Niềm Vui Em Giữ Nỗi Buồn Đưa Anh",
            singer: 'VŨ THỊNH x FANNY',
            time: '06:01',
            path: './assets/music/1.mp3',
            img: './assets/img/1.jpg',
        },
        {
            name: 'Thôi Cứ Để',
            singer: 'VŨ THỊNH x FANNY',
            time: '05:25',
            path: './assets/music/2.mp3',
            img: './assets/img/2.jpg',
        },
        {
            name: 'Cứ Quên Đi',
            singer: 'VŨ THỊNH x FANNY',
            time: '05:23',
            path: './assets/music/3.mp3',
            img: './assets/img/3.jpg',
        },
        {
            name: 'Sao Vẫn Còn Yêu',
            singer: 'VŨ THỊNH x FANNY',
            time: '04:14',
            path: './assets/music/4.mp3',
            img: './assets/img/4.jpg',
        },
        {
            name: 'Có Em Là Vô Cùng Hoàn Mỹ',
            singer: 'OFFICIAL MUSIC VIDEO',
            time: '04:12',
            path: './assets/music/5.mp3',
            img: './assets/img/5.jpg',
        },
    ],

    handleEvents: function () {
        // Handle when user click Play button
        playBtn.onclick = function () {
            audio.play();
        };

        pauseBtn.onclick = function () {
            audio.pause();
        };

        audio.onplay = function () {
            player.classList.replace('not-playing', 'is-playing');
            app.isPlaying = true;
        };

        audio.onpause = function () {
            player.classList.replace('is-playing', 'not-playing');
            app.isPlaying = false;
        };

        audio.ontimeupdate = function () {
            if (window.screen.width <= 739) {
                seekingLineWith = 260;
            } else {
                seekingLineWith = 740;
            }
            currentTimeInSeconds = audio.currentTime;
            function fmtMSS(s) {
                return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
            }
            currentSongPosition.innerHTML = fmtMSS(
                Math.floor(currentTimeInSeconds)
            ).padStart(5, '0');
            var percentage = (currentTimeInSeconds / audio.duration) * 100;
            var seekedWidth = (seekingLineWith / 100) * percentage;
            seekedLine.style.width = seekedWidth + 'px';
        };

        seekingLine.onclick = function (e) {
            if (window.screen.width <= 739) {
                seekingLineWith = 260;
            } else {
                seekingLineWith = 740;
            }
            var mouseClickX = e.clientX;
            seekedLine.style.width =
                mouseClickX -
                (seekingLine.offsetLeft + seekingLine.offsetParent.offsetLeft) +
                'px';
            audio.currentTime =
                ((mouseClickX -
                    (seekingLine.offsetLeft +
                        seekingLine.offsetParent.offsetLeft)) /
                    seekingLineWith) *
                (audio.duration / 100) *
                100;
        };

        nextBtn.onclick = function () {
            $$('.list-item')[app.currentIndex].classList.remove('active');
            if (app.isRandom) {
                app.shuffleSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.scrollToActiveSong();
        };

        prevBtn.onclick = function () {
            $$('.list-item')[app.currentIndex].classList.remove('active');
            if (app.isRandom) {
                app.shuffleSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.scrollToActiveSong();
        };

        randomBtn.onclick = function (e) {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        };

        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        };

        $('.playlist').onclick = function (e) {
            if (
                e.target.closest('.list-item:not(.active)') &&
                !e.target.closest('.title-bar')
            ) {
                $$('.list-item')[app.currentIndex].classList.remove('active');
                app.currentIndex = e.target.closest(
                    '.list-item:not(.active)'
                ).dataset.index;
                app.loadCurrentSong();
                audio.play();
            }
        };

        volumeLine.onmousedown = function (e) {
            var mouseClickX = e.clientX;
            volumeCurrent.style.width =
                mouseClickX -
                (volumeLine.offsetLeft + volumeLine.offsetParent.offsetLeft) +
                'px';
            audio.volume = (parseInt(volumeCurrent.style.width) / 72).toFixed(
                1
            );
        };
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="list-item row" data-index=${index}>
                    <span class="song-id col l-1 m-1 c-1">${index + 1}</span>
                    <div class="song-content col l-6 m-6 c-6">
                        <img
                            src="${song.img}"
                            alt=""
                            class="song-img"
                        />
                        <span class="song-name">${song.name}</span>
                    </div>
                    <span class="song-singer-name col l-3 m-3 c-3"
                        >${song.singer}</span
                    >
                    <span class="song-time col l-2 m-3 c-3">${song.time}</span>
                </div>
            `;
        });

        $('.playlist .list-wrapper').innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    loadCurrentSong: function () {
        const htmls = `
            <img
                src="${this.currentSong.img}"
                alt=""
                class="current-song-img"
            />
            <div class="section-below-img">
                <div class="current-song-info">
                    <p class="current-song-name">${this.currentSong.name}</p>
                    <p class="current-song-singer">${this.currentSong.singer}</p>
                </div>
                <i class="fas fa-heart favourite-icon"></i>
            </div>
            `;

        $('.song-info-section').innerHTML = htmls;
        $$('.list-item')[this.currentIndex].classList.add('active');
        currentSongDuration.textContent = this.currentSong.time;
        currentSongPosition.textContent = '00:00';
        audio.setAttribute('src', this.currentSong.path);
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    shuffleSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.list-item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 500);
    },

    start: function () {
        this.defineProperties();

        this.handleEvents();

        this.render();

        this.loadCurrentSong();
    },
};

app.start();
