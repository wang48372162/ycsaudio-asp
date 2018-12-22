(function ($) {

    var ycsAudioData = {//公開
        id: 0,
        url: null,
        title: null,
        //button
        rewind: false,
        forward: false,
        //settings
        autoplay: true,
        repeatNub: 1,
        me: null,
        //list
        list: null,  //Array
        listData: null
    }
    var ycsAudioSettings = {//不公開
        //player
        playeraudioClass: 'ycs-player-audio',
        playertitleClass: 'ycs-player-title',
        playercontrolsClass: 'ycs-player-controls',
        playerprogressbarClass: 'ycs-player-progress-bar',
        //button
        defaultbtData: { class: 'ycs-button' },
        playbtData: { class: 'ycs-button-play', path: 'M 10,8 26,17 26,33 10,41 z M 26,17 41,25 41,25 26,33 z', pathID: 'ycs-button-play-path' },
        pausebtData: { class: 'ycs-button-pause', path: 'M 10,8 20,8 20,41 10,41 z M 31,8 41,8 41,41 31,41 z' },
        stopbtData: { class: 'ycs-button-stop', path: 'M 10,8 41,8 41,41 10,41 z', pathID: 'ycs-button-stop-path' },
        rewindbtData: { class: 'ycs-button-rewind', path: 'M 10,25 25,15.5 25,32.5 z M 25,25 40,15.5 40,32.5 z', pathID: 'ycs-button-rewind-path' },
        forwardbtData: { class: 'ycs-button-forward', path: 'M 10,15.5 10,32.5 25,25 z M 25,15.5 25,32.5 40,25 z', pathID: 'ycs-button-forward-path' },
        repeatbtData: { class: 'ycs-button-repeat', path: 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 25,25 25,25 25,25 25,25 25,25 z', pathID: 'ycs-button-repeat-path' },
        repeatonebtData: { class: 'ycs-button-repeatone', path: 'M 48,20 38,30 28,20 35,20 35,14 16,14 16,35 35,35 35,31 41,31 41,41 10,41 10,8 41,8 41,20 z M 27,16 19,24 23,24 23,33 27,33 z' },
        prevbtData: { class: 'ycs-button-prev', path: 'M 10,8 17,8 17,41 10,41 z M 17,25 41,8 41,41 z', pathID: 'ycs-button-prev-path' },
        nextbtData: { class: 'ycs-button-next', path: 'M 10,8 34,25 10,41 z M 34,8 41,8 41,41 34,41 z', pathID: 'ycs-button-next-path' },
        //playbt-text
        playbttext: 'play'
    }

    $.fn.ycsaudio = function (options) {

        var el = this;
        if (!el) return;

        var audios = {};
        audios.data = $.extend({}, ycsAudioData, options);
        audios.settings = ycsAudioSettings;
        audios.audio = $('<audio class="ycs-audio">HTML5 audio not supported</audio>');
        audios.audio = audios.audio.get(0);
        var mestr = audios.data.me != 'me' ? '' : '&me=me';
        var autostr = audios.data.autoplay == true ? '' : '&autoplay=false';

        var setup = function () {
            $(el).addClass('player');
            audios.player = $('<div class="ycs-player"></div>');
            $(el).append(audios.player);

            var setPlayer = function (elt, name) {
                elt = $('<div class="ycs-player-' + name + '"></div>');
                audios.player.append(elt);
                return elt;
            }

            if (audios.data.list != null) {
                audios.list = $('<div id="list"></div>');
                setupList();
            }

            if (audios.data.list == null || audios.data.list != null && audios.data.id != 0 && audios.data.url != null && audios.data.title != null) {
                audios.playerAudio = setPlayer(audios.playerAudio, 'player-audio');
                appendAudio();

                audios.title = setPlayer(audios.title, 'title');
                appendTitle();

                audios.controls = setPlayer(audios.controls, 'controls');
                appendControls();

                audios.time = setPlayer(audios.time, 'time');
                appendTime();

                audios.progressbar = setPlayer(audios.progressbar, 'progress-bar');
                appendProgressbar();
            } else {
                $(el).css('display', 'none');
            }
        }

        var setupList = function () {
            var data = {
                firstindex: null,
                previndex: null,
                thisindex: null,
                nextindex: null,
                lastindex: null
            }
            var mel = audios.list;
            mel = $.extend(mel, data);
            mel.addClass('player');
            $(el).after(mel);
            mel.append($('<div class="ycs-list-title">' + audios.data.listData.name.replace(/_/g, '&nbsp;') + '</div>'));
            mel.listul = $('<ul class="ycs-list-ul"></ul>');
            mel.append(mel.listul);
            for (var i in audios.data.list) {
                mel.listli = $('<li></li>');
                mel.listul.append(mel.listli);
                mel.listhref = $('<a href="?id=' + audios.data.list[i].id + '&list=' + audios.data.listData.id + autostr + mestr + '">' + audios.data.list[i].title + '</a>');
                mel.listli.append(mel.listhref);
                if (audios.data.list[i].id == audios.data.id) {
                    mel.thisindex = i;
                    mel.listhref.addClass('this');
                }
            }
            if (mel.thisindex != null) {
                mel.firstindex = 0;
                mel.lastindex = audios.data.list.length - 1;
                if (mel.thisindex != 0) {
                    mel.previndex = Number(mel.thisindex) - 1;
                }
                if (mel.thisindex != audios.data.list.length - 1) {
                    mel.nextindex = Number(mel.thisindex) + 1;
                }
            }
        }

        var appendAudio = function () {
            audios.playerAudio.append(audios.audio);
            audios.audio.src = audios.data.url;
            audios.audio.preload = 'auto';
            $(audios.audio).on({
                'loadeddata': function () {
                    /*if (audios.data.url != null) {
                        if (audios.audio.autoplay == true) {
                            audios.controls.playbt.ev('play');
                        } else {
                            audios.controls.playbt.ev('pause');
                        }
                    } else {
                        audios.controls.playbt.ev('pause');
                    }*/
                    audios.time.evDu();
                },
                'play': function () { audios.controls.playbt.ev('play'); },
                'pause': function () { audios.controls.playbt.ev('pause'); },
                'ended': function () { audios.controls.repeatbt.repeat(); },
                'progress': function () { audios.progressbar.evLoad(); },
                'timeupdate': function () {
                    audios.progressbar.evBar();
                    audios.time.ev();
                }
            });
            $(audios.audio).error(function () {
                location.reload(true);
                console.log('Error');
                audios.controls.playbt.ev('pause');
                audios.data.url = null;
                audios.controls.playbt.disabled.ev();
                audios.controls.stopbt.disabled.ev();
                if (audios.data.rewind == true) { audios.controls.rewindbt.disabled.ev(); }
                if (audios.data.rewind == true) { audios.controls.forwardbt.disabled.ev(); }
                audios.controls.repeatbt.disabled.ev();
                audios.progressbar.disabled.ev();
            });
        }

        var appendTitle = function () {
            audios.title.text(audios.data.title);
        }

        var appendControls = function () {
            var mel = audios.controls;

            //Svg
            var initSvg = function (tag, attrs) {
                var elt = document.createElementNS('http://www.w3.org/2000/svg', tag);
                for (var i in attrs) { elt.setAttribute(i, attrs[i]) }
                return elt;
            }
            var modifySvg = function (id, attrs) {
                var elt = document.getElementById(id);
                for (var i in attrs) { elt.setAttribute(i, attrs[i]); }
            }

            //Cookie
            var setCookie = function (cName, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = cName + "=" + escape(value) + "; expires=" + exdate.toGMTString();
            }
            var getCookie = function (cName) {
                if (document.cookie.length > 0) {
                    cStart = document.cookie.indexOf(cName + "=");
                    if (cStart != -1) {
                        cStart = cStart + cName.length + 1;
                        c_end = document.cookie.indexOf(";", cStart);
                        if (c_end == -1) { c_end = document.cookie.length; }
                        return unescape(document.cookie.substring(cStart, c_end));
                    }
                }
                return "";
            }

            //設定按鈕
            var setButton = function (display, btData) {
                var elt, data = {
                    disabled: {
                        j: false,
                        ev: function () { return false }
                    },
                    svg: $('<svg width="50px" height="50px"></svg>'),
                    pathmain: function () {
                        if (btData.pathID != undefined) {
                            return initSvg('path', { d: btData.path, class: 'ycs-svg-fill', id: btData.pathID });
                        } else {
                            return initSvg('path', { d: btData.path, class: 'ycs-svg-fill' });
                        }
                    },
                    ev: function () { return false }
                };
                if (btData.class.indexOf('prev') == -1 && btData.class.indexOf('next') == -1) {
                    elt = $('<button class="' + audios.settings.defaultbtData.class + ' ' + btData.class + '"></button>');
                } else {
                    elt = $('<a href="javascript: void(0)" class="' + audios.settings.defaultbtData.class + ' ' + btData.class + '"></a>');
                }
                elt = $.extend(elt, data);
                elt.disabled.ev = function () {
                    elt.disabled.j = true;
                    elt.css('cursor', 'default');
                    modifySvg(btData.pathID, { class: 'disabled' });
                }
                if (display == true) {
                    mel.append(elt);
                    elt.svg.append(elt.pathmain());
                    elt.append(elt.svg);
                }
                return elt;
            }

            //播放/暫停按鈕
            var setPlayButton = function () {
                mel.playbt = setButton(true, audios.settings.playbtData);
                mel.playbt.ev = function (text) {
                    if (mel.playbt.disabled.j == false) {
                        audios.settings.playbttext = text;
                        if (text == 'play') {
                            modifySvg(audios.settings.playbtData.pathID, { d: audios.settings.pausebtData.path });
                            if (audios.audio.paused == true) { audios.audio.play(); }
                        } else {
                            modifySvg(audios.settings.playbtData.pathID, { d: audios.settings.playbtData.path });
                            if (audios.audio.paused == false) { audios.audio.pause(); }
                        }
                    }
                }
                if (audios.data.autoplay == true && !navigator.userAgent.match(/[Aa]{1}ndroid|[Pp]{1}hone|[Pp]{1}ad|[Mm]{1}obile/i)) {
                    audios.audio.autoplay = true;
                }
                if (audios.data.url != null) {
                    if (audios.audio.autoplay == true) {
                        mel.playbt.ev('play');
                    } else {
                        mel.playbt.ev('pause');
                    }
                } else {
                    mel.playbt.ev('pause');
                }
                mel.playbt.click(function () {
                    switch (audios.settings.playbttext) {
                        case 'play':
                            if (audios.audio.paused == false) { mel.playbt.ev('pause'); }
                            break;
                        case 'pause':
                            if (audios.audio.paused == true) { mel.playbt.ev('play'); }
                            break;
                    }
                });
            }

            //停止按鈕
            var setStopButton = function () {
                mel.stopbt = setButton(true, audios.settings.stopbtData);
                mel.stopbt.ev = function () {
                    if (mel.stopbt.disabled.j == false) {
                        mel.playbt.ev('pause');
                        audios.audio.currentTime = 0;
                    }
                }
                mel.stopbt.click(function () { mel.stopbt.ev(); });
            }

            //上一個按鈕
            var setPrevButton = function () {
                if (audios.data.list != null) {
                    mel.prevbt = setButton(true, audios.settings.prevbtData);
                    if (audios.list.previndex != null) {
                        mel.prevbt.attr('href', '?id=' + audios.data.list[audios.list.previndex].id + '&list=' + audios.data.listData.id + autostr + mestr);
                    } else {
                        mel.prevbt.disabled.ev();
                    }
                }
            }

            //下一個按鈕
            var setNextButton = function () {
                if (audios.data.list != null) {
                    mel.nextbt = setButton(true, audios.settings.nextbtData);
                    if (audios.list.nextindex != null) {
                        mel.nextbt.attr('href', '?id=' + audios.data.list[audios.list.nextindex].id + '&list=' + audios.data.listData.id + autostr + mestr);
                    } else {
                        mel.nextbt.disabled.ev();
                    }
                }
            }

            //倒轉按鈕
            var setRewindButton = function () {
                if (audios.data.rewind == true) {
                    mel.rewindbt = setButton(audios.data.rewind, audios.settings.rewindbtData);
                    mel.rewindbt.ev = function () {
                        if (mel.rewindbt.disabled.j == false) {
                            audios.audio.currentTime -= 5.0;
                        }
                    }
                    mel.rewindbt.click(function () { mel.rewindbt.ev(); });
                }
            }

            //快轉按鈕
            var setForwardButton = function () {
                if (audios.data.forward == true) {
                    mel.forwardbt = setButton(audios.data.forward, audios.settings.forwardbtData);
                    mel.forwardbt.ev = function () {
                        if (mel.forwardbt.disabled.j == false) {
                            audios.audio.currentTime += 5.0;
                        }
                    }
                    mel.forwardbt.click(function () { mel.forwardbt.ev(); });
                }
            }

            //循環按鈕
            var setRepeatButton = function () {
                mel.repeatbt = setButton(true, audios.settings.repeatbtData);
                //設定按鈕
                mel.repeatbt.ev = function (text) {
                    if (mel.repeatbt.disabled.j == false) {
                        audios.data.repeatNub = text;
                        setCookie('repeatNub', String(text), 365);
                        switch (text) {
                            case 1: //default
                                modifySvg(audios.settings.repeatbtData.pathID, { d: audios.settings.repeatbtData.path, class: 'ycs-svg-fill-s' });
                                break;
                            case 2: //all
                                modifySvg(audios.settings.repeatbtData.pathID, { d: audios.settings.repeatbtData.path, class: 'ycs-svg-fill' });
                                break;
                            case 3: //Single cycle
                                modifySvg(audios.settings.repeatbtData.pathID, { d: audios.settings.repeatonebtData.path, class: 'ycs-svg-fill' });
                                break;
                        }
                    }
                }
                if (!isNaN(getCookie('repeatNub')) && Number(getCookie('repeatNub')) > 0 && Number(getCookie('repeatNub')) <= 3) {
                    if (audios.data.list == null && Number(getCookie('repeatNub')) == 2) {
                        mel.repeatbt.ev(3);
                    } else {
                        mel.repeatbt.ev(Number(getCookie('repeatNub')));
                    }
                } else {
                    mel.repeatbt.ev(1);
                }
                mel.repeatbt.click(function () {
                    switch (audios.data.repeatNub) {
                        case 1://default
                            if (audios.data.list != null) { mel.repeatbt.ev(2); }
                            else { mel.repeatbt.ev(3); }
                            break;
                        case 2://all
                            mel.repeatbt.ev(3);
                            break;
                        case 3://Single cycle
                            mel.repeatbt.ev(1);
                            break;
                    }
                });
                //循環事件
                mel.repeatbt.repeat = function () {
                    switch (audios.data.repeatNub) {
                        case 1://default
                            if (audios.data.list == null) {
                                mel.stopbt.ev();
                            } else {
                                if (audios.list.nextindex != null) {
                                    location.href = '?id=' + audios.data.list[audios.list.nextindex].id + '&list=' + audios.data.listData.id + autostr + mestr;
                                } else {
                                    mel.playbt.ev('pause');
                                }
                            }
                            break;
                        case 2://all
                            if (audios.list.nextindex != null) {
                                location.href = '?id=' + audios.data.list[audios.list.nextindex].id + '&list=' + audios.data.listData.id + autostr + mestr;
                            } else {
                                location.href = '?id=' + audios.data.list[audios.list.firstindex].id + '&list=' + audios.data.listData.id + autostr + mestr;
                            }
                            break;
                        case 3://Single cycle
                            audios.audio.currentTime = 0;
                            mel.playbt.ev('play');
                            break;
                    }
                }
            }

            setPrevButton();
            setPlayButton();
            setStopButton();
            setRepeatButton();
            setNextButton();
        }

        var appendTime = function () {
            var mel = audios.time;
            var data = {
                currentTime: 0,
                currentMin: 0,
                currentSec: 0,
                elapsedTime: 0,
                durationTime: 0,
                durationMin: 0,
                durationSec: 0,
                currentText: $('<span>00:00</span>'),
                durationText: $('<span>00:00</span>'),
                ev: function () { return false },
                evDu: function () { return false }
            }
            mel = $.extend(mel, data);
            mel.append(mel.currentText);
            mel.append(' / ');
            mel.append(mel.durationText);
            mel.evDu = function () {
                mel.durationTime = !isNaN(audios.audio.duration) ? Math.round(audios.audio.duration) : 0;
                mel.durationMin = Math.floor(mel.durationTime / 60) < 10 ? ('0' + Math.floor(mel.durationTime / 60)) : Math.floor(mel.durationTime / 60);
                mel.durationSec = ((mel.durationTime % 60) < 10 ? '0' : "") + mel.durationTime % 60;
                mel.durationText.text(mel.durationMin + ':' + mel.durationSec);
            }
            mel.ev = function () {
                if (!isNaN(mel.currentTime) && !isNaN(audios.audio.duration) && audios.audio.currentTime <= audios.audio.duration) {
                    audios.audio.currentTime ? mel.currentTime = Math.round(audios.audio.currentTime) : mel.currentTime = 0;
                    if (mel.elapsedTime != Math.round(audios.audio.currentTime)) {
                        mel.currentSec = (mel.currentTime % 60) < 10 ? '0' + (mel.currentTime % 60) : mel.currentTime % 60;
                        mel.currentText.text((Math.floor(mel.currentTime / 60) < 10 ? ('0' + Math.floor(mel.currentTime / 60)) : Math.floor(mel.currentTime / 60)) + ':' + mel.currentSec);
                    }
                    audios.audio.currentTime ? mel.elapsedTime = Math.round(audios.audio.currentTime) : mel.elapsedTime = 0;
                }
            }
            mel.ev();
        }

        var appendProgressbar = function () {
            var mel = audios.progressbar;
            var data = {
                disabled: {
                    j: false,
                    ev: function () { return false }
                },
                evBar: function () { return false },
                evLoad: function () { return false }
            }
            mel.container = $('<div class="ycs-progress-container"></div>');
            mel.append(mel.container);
            mel.load = $('<div class="ycs-load-progress ycs-progress"></div>');
            mel.container.append(mel.load);
            mel.load.css('width', '0%');
            mel.bar = $('<div class="ycs-play-progress ycs-progress"></div>');
            mel.container.append(mel.bar);
            mel.bar.css('width', '0%');
            mel.container.click(function () {
                if (!isNaN(audios.audio.duration)) {
                    audios.audio.currentTime = audios.audio.duration * (window.event.offsetX / mel.container.get(0).clientWidth);
                    mel.evBar();
                    audios.time.ev();
                }
            });
            mel = $.extend(mel, data);
            mel.evLoad = function () {
                if (mel.disabled.j == false) {
                    var endVal = audios.audio.seekable && audios.audio.seekable.length ? audios.audio.seekable.end(0) : 0;
                    mel.load.css('width', (100 / audios.audio.duration * endVal) + '%');
                }
            }
            mel.evBar = function () {
                if (mel.disabled.j == false) {
                    //將 當前音訊時間(秒) 四捨五入
                    var elapsedTime = Math.round(audios.audio.currentTime);
                    mel.bar.css('width', (100 / audios.audio.duration * elapsedTime) + '%');
                }
            }
            mel.disabled.ev = function () {
                mel.disabled.j = true;
                mel.container.css('cursor', 'default');
            }
        }

        setup();

        return;
    }

})(jQuery)
