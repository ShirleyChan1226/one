(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
        var pageData = null;    //后台所有数据
        var pageImgs = null;    //后台图片资源
        var pageTxts = null;    //后台文本资源
        var isSuccess = false;  //是否挑战成功
        var judgeBgMusic = false;    //是否已经判断音乐，再玩时不再改变音乐状态
		var indexPage = {}; //首页对象
		var gamePage = {}; //游戏页面对象
		var resultPage = {}; //结果页面对象
        var score = 0;   //得分
        var selfData = {
            title: '甜点消消乐', //活动标题
            rules: '',  //活动规则
            object_end: 0,  //项目已结束 【q平台不做判断，用默认值】
            activity_end: 0,    //活动已结束
            needBgMusic: 1,    //是否需要背景音乐 【q平台不做判断，用默认值】
            market_type: 0, //营销类型 0-抽奖 1-纯分享 【q平台不做判断，用默认值】
            maxplaynum: 0,  //最多游戏次数 0-无限制
            maxdayplaynum: 0,   //每天最多游戏次数 0-无限制
            playnum: 0,   //已玩游戏次数
            todayplaynum: 0,   //今天已玩游戏次数
            index: {
                music_on: 'images/music_on.png',
                music_off: 'images/music_off.png',
                index_bg: 'images/index_bg.jpg',
                logo: 'images/logo.png',
                index_title: 'images/index_title.png',
                start_btn: 'images/start_btn.png',
                rule_btn0: 'images/rule_btn0.png',
                rule_btn1: 'images/rule_btn1.png',
                myprize_btn: 'images/myprize_btn.png'
            },
            rule: {
                rule_bg: 'images/rule_bg.png',
                close_btn: 'images/close_btn.png'
            },
            game: {
                game_bg: 'images/game_bg.jpg',
                game_hint: 'images/game_hint.png',
                num_1: 'images/num_1.png',
                num_2: 'images/num_2.png',
                num_3: 'images/num_3.png',
                baby_1: 'images/baby_1.png',
                baby_2: 'images/baby_2.png',
                baby_3: 'images/baby_3.png',
                baby_4: 'images/baby_4.png',
                baby_5: 'images/baby_5.png',
                baby_6: 'images/baby_6.png',
                baby_7: 'images/baby_7.png',
                baby_8: 'images/baby_8.png',
                baby_9: 'images/baby_9.png',
                baby_10: 'images/baby_10.png',
                baby_hide: 'images/baby_hide.png',
                level_1: 'images/level_1.png',
                level_2: 'images/level_2.png',
                level_3: 'images/level_3.png',
                level_4: 'images/level_4.png',
                level_5: 'images/level_5.png',
                level: 'images/level.png',
                clock: 'images/clock.png'
            },
            result: {
                result_bg: 'images/result_bg.png',
                again_btn: 'images/again_btn.png',
                share_btn: 'images/share_btn.png',
                get_btn: 'images/get_btn.png'
            },
            share: {
                share_hint: 'images/share_hint.png'
            },
            text: {
                //首页文本
                object_end: '项目已下线，谢谢关注',   //项目已下线-不能玩游戏，不能查看奖品 【q平台暂不自定义，用默认值】
                activity_end: '活动已结束，下次再来', //活动已结束-不能玩游戏，可以查看奖品
                maxplay_hint: '您的游戏次数用完啦',   //总的游戏次数用玩了 【q平台暂不自定义，用默认值】
                maxdayplay_hint: '您今天的游戏次数用完啦',    //今天的游戏次数用完了 【q平台暂不自定义，用默认值】
                //游戏页文本
                score: 2,     //抽奖门槛
                //time: 30,   //游戏时间
                //结果页文本
                score_hint: '你成功闯过@关', //得分提示-@用来替换分数
                level_1: '小吃货',
                level_2: '大吃货',
                level_3: '专业吃货',
                level_4: '超级吃货',
                level_5: '大胃王',
                low_hint: '很遗憾！br再接再厉哟！', //未达到抽奖门槛-无券-br表示换行
                no_hint: '很遗憾！br未获得礼物！',   //达到抽奖门槛+券完了-无券
                totalmax_hint: '您的奖品总数已达上限！br快去使用吧！', //达到抽奖门槛+总券上限-无券 【q平台暂不配置】
                daymax_hint: '您今天的奖品领完了！br明天再来哟！',    //达到抽奖门槛+今天券上限-无券 【q平台暂不配置】
                has_hint: '恭喜您！br获得一份神秘礼物！'   //达到抽奖门槛-有券
            }
        };



        //阻止默认滚动事件
        $('#gamePage')[0].ontouchmove = function (e) {
            e.preventDefault();
        };

		window.oAudio_bg = document.getElementById('audio_bg');	//背景音乐
		window.oAudio_button = document.getElementById('audio_button');	//按钮声音

		indexPage.act = {
            init: function(){
                indexPage.data.index();
            },
            indexCb: function(data){
                var me = this;
                pageData = data;
                pageImgs = pageData.cfg.activesetting.imgs;
                pageTxts = pageData.cfg.activesetting.txts;
                console.log(pageData);
                //图片预加载
                //M.imgpreload(imgs, function(){});
                me.dataImport();
                me.judgeNeedBgMusic();
                me.judgeMarketType();
                me.checkTouch();
                //me.judgeGameState();
                me.wxshare(data.cfg);
                M.loadingHide();
            },
            dataImport: function(){
                /*q平台数据渲染开始*/
                selfData.title = pageData.cfg.title;
                selfData.rules = pageData.cfg.rules;
                selfData.activity_end = pageData.cfg.isend;
                selfData.maxplaynum = pageData.maxplaynum;
                selfData.maxdayplaynum = pageData.maxdayplaynum;
                selfData.playnum = pageData.playnum;
                selfData.todayplaynum = pageData.todayplaynum;
                $.each(pageImgs,function(key,value){
                    if(selfData.index.hasOwnProperty(key)){
                        selfData.index[key] = value;
                    }
                    if(selfData.rule.hasOwnProperty(key)){
                        selfData.rule[key] = value;
                    }
                    if(selfData.game.hasOwnProperty(key)){
                        selfData.game[key] = value;
                    }
                    if(selfData.result.hasOwnProperty(key)){
                        selfData.result[key] = value;
                    }
                    if(selfData.share.hasOwnProperty(key)){
                        selfData.share[key] = value;
                    }
                });
                $.each(pageTxts,function(key,value){
                    selfData.text[key] = value;
                });
                /*q平台渲染数据结束*/

                $('#title').text(selfData.title);
                $('#indexPage').find('.logo').attr({'src': selfData.index.logo});
                $('#indexPage').find('.indexTitle').attr({'src': selfData.index.index_title});
                $('#indexPage').find('.startBtn').attr({'src': selfData.index.start_btn});
                $('#indexPage').find('.ruleBtn0').attr({'src': selfData.index.rule_btn0});
                $('#indexPage').find('.ruleBtn1').attr({'src': selfData.index.rule_btn1});
                $('#indexPage').find('.myprizeBtn').attr({'src': selfData.index.myprize_btn});
                $('#rulePage').find('.ruleBg').attr({'src': selfData.rule.rule_bg});
                $('#rulePage').find('.rules').html(selfData.rules);
                $('#ruleCloseBtn').attr({'src': selfData.rule.close_btn});
                $('#indexPage').css({'background-image': "url('" + selfData.index.index_bg + "')"}).show();
            },
            judgeNeedBgMusic: function(){
                //判断是否需要背景音乐
                if(judgeBgMusic){   //已经判断了音乐,不再判断
                    return false;
                }
                judgeBgMusic = true;
                if(selfData.needBgMusic == 1){
                    //设置src
                    $('#music').attr('src',selfData.index.music_on).addClass('musicRun').show();
                    //音频自动播放的兼容处理
                    if(typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
                        WeixinJSBridge.invoke('getNetworkType', {}, function (res) {
                            oAudio_bg.play();
                        });
                    }else{
                        oAudio_bg.play();
                    }
                }
            },
            judgeMarketType: function(){
                //判断营销方式 0-抽奖/1-分享
                if(selfData.market_type == 0){
                    //抽奖
                    $('#indexPage').find('.type0').show();
                    $('#indexPage').find('.type1').hide();
                }else{
                    //分享
                    $('#indexPage').find('.type1').show();
                    $('#indexPage').find('.type0').hide();
                    $('#getBtn').hide();
                    $('.resultHint').hide();
                }
            },
            judgeGameState: function(){
                //判断活动、项目是否结束
                if(selfData.object_end == 1){
                    //项目结束-不能玩游戏，查看奖品
                    M.alert(selfData.text.object_end);
                    $('#indexPage').find('.startBtn').off();
                    $('#indexPage').find('.myprizeBtn').off();
                    return false;
                }else if(selfData.activity_end == 1){
                    //活动结束-不能玩游戏
                    M.alert(selfData.text.activity_end);
                    $('#indexPage').find('.startBtn').off();
                    return false;
                }
            },
            judgePlayNum: function(){
                //判断游戏次数
                if(selfData.maxplaynum !=0 && selfData.maxplaynum <= selfData.playnum){
                    //已达最大游戏次数
                    M.alert(selfData.text.maxplay_hint);
                    return false;
                }else if(selfData.maxdayplaynum !=0 && selfData.maxdayplaynum <= selfData.todayplaynum){
                    //已达每天最大游戏次数
                    M.alert(selfData.text.maxdayplay_hint);
                    return false;
                }
                return true;
            },
			checkTouch: function(){
				var me = this;
                $('#music').on(config.touch,function(){
                    //控制背景音乐
                    if($(this).attr('src') == selfData.index.music_on){
                        $(this).attr('src',selfData.index.music_off).removeClass('musicRun');
                        oAudio_bg.pause();
                    }else{
                        $(this).attr('src',selfData.index.music_on).addClass('musicRun');
                        oAudio_bg.play();
                    }
                });
                $('#indexPage').find('.ruleBtn').on(config.touch,function(){
                    oAudio_button.play();
					$('#rulePage').show();
				});
				$('#ruleCloseBtn').on(config.touch,function(){
                    oAudio_button.play();
					$('#rulePage').hide();
				});
                $('#indexPage').find('.startBtn').on(config.touch,function(){
                    oAudio_button.play();
                    if(me.judgePlayNum){
                        $('#indexPage').hide();
                        me.out();
                        gamePage.act.init();
                    }
				});
                $('#indexPage').find('.myprizeBtn').on(config.touch,function(){
                    oAudio_button.play();
					me.out();
                    gotoUrl(config.htmlUrl+'myprize.html?uid='+config.uid+'&gp='+config.gp);
				});
			},
			wxshare: function(data){
                config.shareInfo.title = data.sharetitle || config.shareInfo.title;
                config.shareInfo.desc = data.sharecontent || config.shareInfo.desc;
                config.shareInfo.imgUrl = data.sharepic || config.shareInfo.imgUrl;
				share(config.shareInfo);
			},
			out: function(){
                $('#music').off();
                $('#indexPage').find('.startBtn').off();
                $('#indexPage').find('.ruleBtn0').off();
                $('#indexPage').find('.ruleBtn1').off();
                $('#indexPage').find('.myPrizeBtn').off();
				$('#ruleCloseBtn').off();
			}
		};

        indexPage.data = {
            index : function(){
                post('active/index',{
                    gp : config.gp
                },function(data){
                    indexPage.act.indexCb(data);
                });
            }
        };

		gamePage.act = {
            svg: null,  //SVG对象
            time: 0,    //游戏时间
            game_timer: null,   //游戏定时器
            baby_width: 0,    //娃娃占宽度
            percent: 0.2,   //娃娃占宽度百分比
            space: 6,  //格子间距
            babyArr: [],  //储存baby
            view_width: 0,  //适口宽
            view_height: 0,  //适口高
            showArr: [],    //正在打开的娃娃
            threeArr: [],   //3秒倒计时图片
            levelArr: [],   //盛放level数组
            timeArr: [5,10,20,25,30],   //每关的游戏时间,
            init: function(){
                this.dataImport();
                this.roundOne();
            },
            dataImport: function(){
                this.svg = Snap('#gameSVG');
                isSuccess = false;
                score = 0;
                this.view_width = this.view().w;
                this.view_height = this.view().h;
                this.baby_width = this.view_width * this.percent;
                this.threeArr = [selfData.game.num_3,selfData.game.num_2,selfData.game.num_1];
                this.levelArr = [selfData.game.level_1,selfData.game.level_2,selfData.game.level_3,selfData.game.level_4,selfData.game.level_5];
                this.getBabyArr();
                $('.timeScore').find('.level').attr('src',selfData.game.level);
                $('.timeScore').find('.clock').attr('src',selfData.game.clock);
                $('.game_hint').attr('src',selfData.game.game_hint).hide();
                $('#gamePage').css({'background-image': "url('" + selfData.game.game_bg + "')"}).show();
            },
            getBabyArr: function(){
                //从后台遍历得到baby数组
                this.babyArr = [];
                for(var key in selfData.game){
                    if(key.match(/baby/) && !key.match(/hide/)){
                        this.babyArr.push(selfData.game[key]);
                    }
                }
            },
            roundOne: function(){
                //第一关
                var me = this;
                $('#gameSVG').html('');
                var arr = [[-1,-1,-0.5,-0.5],[0,-1,0.5,-0.5],[-1,0,-0.5,0.5],[0,0,0.5,0.5]];
                $.each(arr, function (i, v) {
                    me.svg.paper.image(selfData.game.baby_hide, me.view_width * 0.5 + me.baby_width * v[0] + me.space * v[2], me.view_height * 0.5 + me.baby_width * v[1] + me.space * v[3],
                        me.baby_width, me.baby_width).addClass('hide');
                });
                this.randomAdd(arr.length / 2, this.svg.selectAll('image'));
            },
            roundTwo: function(){
                //第二关
                var me = this;
                $('#gameSVG').html('');
                var arr = [
                    [-1,-2,-0.5,-1.5],[0,-2,0.5,-1.5],[-1,-1,-0.5,-0.5],[0,-1,0.5,-0.5],
                    [-1,0, -0.5,0.5],[0,0,0.5,0.5],[-1,1,-0.5,1.5],[0,1,0.5,1.5]
                ];
                $.each(arr,function(i,v){
                    me.svg.paper.image(selfData.game.baby_hide, me.view_width * 0.5 + me.baby_width * v[0] + me.space * v[2], me.view_height * 0.5 + me.baby_width * v[1] + me.space * v[3],
                        me.baby_width, me.baby_width).addClass('hide');
                });
                this.randomAdd(arr.length / 2, this.svg.selectAll('image'));
            },
            roundThree: function(){
                //第三关
                var me = this;
                $('#gameSVG').html('');
                var arr = [
                    [-1,-2,-0.5,-1.5],[0,-2,0.5,-1.5],[-1,-1,-0.5,-0.5],[0,-1,0.5,-0.5],
                    [-1,0,-0.5,0.5],[0,0,0.5,0.5],[-1,1,-0.5,1.5],[0,1,0.5,1.5],
                    [-2,-1,-1.5,-0.5],[1,-1,1.5,-0.5],[-2,0,-1.5,0.5],[1,0,1.5,0.5]
                ];
                $.each(arr,function(i,v){
                    me.svg.paper.image(selfData.game.baby_hide, me.view_width * 0.5 + me.baby_width * v[0] + me.space * v[2], me.view_height * 0.5 + me.baby_width * v[1] + me.space * v[3],
                        me.baby_width, me.baby_width).addClass('hide');
                });
                this.randomAdd(arr.length / 2, this.svg.selectAll('image'));
            },
            roundFour: function(){
                //第四关
                var me = this;
                $('#gameSVG').html('');
                var arr = [
                    [-2,-2,-1.5,-1.5],[-1,-2,-0.5,-1.5],[0,-2,0.5,-1.5],[1,-2,1.5,-1.5],
                    [-2,-1, -1.5,-0.5],[-1,-1,-0.5,-0.5],[0,-1,0.5,-0.5],[1,-1,1.5,-0.5],
                    [-2,0,-1.5,0.5],[-1,0,-0.5,0.5],[0,0,0.5,0.5],[1,0,1.5,0.5],
                    [-2,1,-1.5,1.5],[-1,1,-0.5,1.5],[0,1,0.5,1.5],[1,1,1.5,1.5]
                ];
                $.each(arr,function(i,v){
                    me.svg.paper.image(selfData.game.baby_hide, me.view_width * 0.5 + me.baby_width * v[0] + me.space * v[2], me.view_height * 0.5 + me.baby_width * v[1] + me.space * v[3],
                        me.baby_width, me.baby_width).addClass('hide');
                });
                this.randomAdd(arr.length / 2, this.svg.selectAll('image'));
            },
            roundFive: function(){
                //第五关
                var me = this;
                $('#gameSVG').html('');
                var arr = [
                    [-2,-2.3,-1.5,-1.5],[-1,-2.3,-0.5,-1.5],[0,-2.3,0.5,-1.5],[1,-2.3,1.5,-1.5],
                    [-2,-1.3, -1.5,-0.5],[-1,-1.3,-0.5,-0.5],[0,-1.3,0.5,-0.5],[1,-1.3,1.5,-0.5],
                    [-2,-0.3,-1.5,0.5],[-1,-0.3,-0.5,0.5],[0,-0.3,0.5,0.5],[1,-0.3,1.5,0.5],
                    [-2,0.7,-1.5,1.5],[-1,0.7,-0.5,1.5],[0,0.7,0.5,1.5],[1,0.7,1.5,1.5],
                    [-2,1.7,-1.5,2.5],[-1,1.7,-0.5,2.5],[0,1.7,0.5,2.5],[1,1.7,1.5,2.5]
                ];
                $.each(arr,function(i,v){
                    me.svg.paper.image(selfData.game.baby_hide, me.view_width * 0.5 + me.baby_width * v[0] + me.space * v[2], me.view_height * 0.5 + me.baby_width * v[1] + me.space * v[3],
                        me.baby_width, me.baby_width).addClass('hide');
                });
                this.randomAdd(arr.length / 2, this.svg.selectAll('image'));
            },
            levelToggle: function(level){
                var levelImg = this.svg.paper.image(this.levelArr[level], this.view_width * 0.5 - 53, this.view_height * 0.5 - 36, 106, 72).removeClass('hide').addClass('level_run');
                levelImg.animate({},1000,mina.linear,function(){
                    this.remove();
                });
            },
            randomAdd: function(num,domArr){
                //num-N组娃娃   domArr-image集合
                var me = this;
                //配置游戏时间和关卡
                me.time = me.timeArr[score];
                if (this.time >= 10) {
                    $('#second').text(this.time);
                } else {
                    $('#second').text('0' + this.time);
                }
                $('#score').text(score + 1);
                //1.随机生成长度为num的娃娃数组，每个值都不同
                var numArr = [];
                numArr.push(random(0,this.babyArr.length));
                function getNumArr(){
                    var hasSame = null;
                    for(var i=0;i<num-1;){
                        hasSame = false;
                        var index = random(0,me.babyArr.length);
                        for(var j=0;j<numArr.length;j++){
                            if(numArr[j] == index){
                                hasSame = true;
                            }
                        }
                        if(!hasSame){
                            numArr.push(index);
                            i++;
                        }
                    }
                }
                getNumArr();
                //2.1.随机生成新数组1
                var newArr1 = [];
                newArr1.push(numArr[random(0,numArr.length)]);
                function getNewArr1(){
                    var hasSame = null;
                    for(var i=0;i<num-1;){
                        hasSame = false;
                        var index = random(0,numArr.length);
                        for(var j=0;j<newArr1.length;j++){
                            if(newArr1[j] == numArr[index]){
                                hasSame = true;
                            }
                        }
                        if(!hasSame){
                            newArr1.push(numArr[index]);
                            i++;
                        }
                    }
                }
                getNewArr1();
                //2.2.随机生成新数组2
                var newArr2 = [];
                newArr2.push(numArr[random(0,numArr.length)]);
                function getNewArr2(){
                    var hasSame = null;
                    for(var i=0;i<num-1;){
                        hasSame = false;
                        var index = random(0,numArr.length);
                        for(var j=0;j<newArr2.length;j++){
                            if(newArr2[j] == numArr[index]){
                                hasSame = true;
                            }
                        }
                        if(!hasSame){
                            newArr2.push(numArr[index]);
                            i++;
                        }
                    }
                }
                getNewArr2();
                //3.将2个新数组拼接 - 值为babyArr的下标
                var newArr = newArr1.concat(newArr2);
                //4.显示level
                this.levelToggle(score);
                //5.渲染数据
                function svgImport(){
                    for(var i=0;i<newArr.length;i++){
                        domArr[i].attr('href',me.babyArr[newArr[i]]).data('type',newArr[i]);
                    }
                    var j = 0;
                    //按顺序显示
                    var showTimer = setInterval(function(){
                        domArr[j].removeClass('hide');
                        j++;
                        if(j >= newArr.length){
                            clearInterval(showTimer);
                        }
                    },100);
                    //3秒倒计时
                    setTimeout(function(){
                        me.readyCountDown();
                        //显示提示语
                        if(score == 0){
                            $('.game_hint').show();
                            setTimeout(function(){
                                $('.game_hint').hide();
                            },3000);
                        }
                    },100 * newArr.length + 100);
                    //全部hide
                    setTimeout(function(){
                        for(var m=0;m<newArr.length;m++){
                            domArr[m].addClass('baby_hide');
                            domArr[m].animate({},250,mina.linear,function(){
                                this.attr('href',selfData.game.baby_hide);
                            });
                            domArr[m].animate({},500,mina.linear,function(){
                                this.removeClass('baby_hide');
                            });
                        }
                        setTimeout(function(){
                            me.checkTouch_svg();
                        },500)
                    },100 * newArr.length + 100 + 3000);
                }
                setTimeout(function(){
                    svgImport();
                },1000)
            },
            checkTouch_svg: function(){
                var me = this;
                this.svg.selectAll('image').forEach(function(element, index) {
                    element.touchend(function(){
                        var isShow = element.hasClass('baby_show') ? true : false;
                        var type = element.data('type');
                        var src = me.babyArr[type];
                        if(!isShow){
                            //如果没显示，压入数组
                            me.showArr.push({element: element, type: type});
                            element.addClass('baby_show');
                            element.animate({},250,mina.linear,function(){
                                this.attr('href', src);
                            });
                            //判断偶数组的data是否相同
                            $.each(me.showArr, function(i,v){
                                if(i + 1 < me.showArr.length) {
                                    //如果存在下一个值，比较
                                    var curr = me.showArr[i];
                                    var next = me.showArr[i+1];
                                    if(curr.type == next.type){
                                        //图片相同
                                        me.showArr.shift(curr);
                                        me.showArr.shift(next);
                                        curr.element.animate({},600,mina.linear,function(){
                                            curr.element.remove();
                                        });
                                        next.element.animate({},600,mina.linear,function(){
                                            next.element.remove();
                                            //判断此关是否完成
                                            if($('#gameSVG').find('image').length == 0){
                                                clearInterval(me.game_timer);
                                                me.game_timer = null;
                                                score++;
                                                //判断是否成功
                                                if(score >= selfData.text.score){
                                                    isSuccess = true;
                                                }
                                                //开始下一关
                                                switch (score){
                                                    case 1 :
                                                        me.roundTwo();
                                                        break;
                                                    case 2 :
                                                        me.roundThree();
                                                        break;
                                                    case 3 :
                                                        me.roundFour();
                                                        break;
                                                    case 4 :
                                                        me.roundFive();
                                                        break;
                                                    default :
                                                        resultPage.act.init();
                                                }
                                            }
                                        });
                                    }else{
                                        me.showArr.shift(curr);
                                        me.showArr.shift(next);
                                        curr.element.removeClass('baby_show').addClass('baby_hide');
                                        next.element.removeClass('baby_show').addClass('baby_hide');
                                        curr.element.animate({},850,mina.linear,function(){
                                            this.attr('href',selfData.game.baby_hide);
                                        });
                                        next.element.animate({},850,mina.linear,function(){
                                            this.attr('href',selfData.game.baby_hide);
                                        });
                                        curr.element.animate({},1100,mina.linear,function(){
                                            this.removeClass('baby_hide');
                                        });
                                        next.element.animate({},1100,mina.linear,function(){
                                            this.removeClass('baby_hide');
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            },
            readyCountDown: function(){
                //3秒倒计时
                var me = this;
                var index = 0;
                var threeImg = this.svg.paper.image(this.threeArr[index], this.view_width * 0.5 - 25, this.view_height * 0.5 - 25, 50, 50);
                var timer = setInterval(function(){
                    if(index >= 2){
                        clearInterval(timer);
                        threeImg.remove();
                        me.gameCountDown();
                    }
                    index++;
                    threeImg.attr({href: me.threeArr[index]});
                },1000);
            },
            gameCountDown: function(){
                //游戏倒计时
                var me = this;
                this.game_timer = setInterval(function(){
                    if(me.time > 0){
                        me.time --;
                        if(me.time >= 10){
                            $('#second').text(me.time);
                        }else{
                            $('#second').text('0' + me.time);
                        }
                    }else{
                        $('#second').text('00');
                        me.out();
                    }
                },1000);
            },
            view: function(){
                return {
                    w : document.documentElement.clientWidth || document.body.clientWidth,
                    h : document.documentElement.clientHeight || document.body.clientHeight
                }
            },
            out: function(){
                var me = this;
                me.svg.selectAll('image').forEach(function(element, index) {
                    element.stop();
                });
                clearInterval(me.game_timer);
                me.game_timer = null;
                resultPage.act.init();
            }
		};

		resultPage.act = {
			init: function(){
                var me = this;
                M.loading();
                me.dataImport();
                me.judgeHint();
                me.checkTouch();
                //预留时间用于数据的渲染，增加体验
                setTimeout(function(){
                    M.loadingHide();
                    $('#resultPage').show();
                },1500);
            },
            dataImport: function(){
                $('.scoreHint').html('');
                $('.levelHint').hide().find('span').text('');
                $('.resultHint').html('');
                $('#againBtn').attr('src',selfData.result.again_btn);
                $('#shareBtn').attr('src',selfData.result.share_btn);
                $('#getBtn').attr('src',selfData.result.get_btn);
                $('#sharePage').find('img').attr('src',selfData.share.share_hint);
                $('.resultBg').attr('src',selfData.result.result_bg);
            },
            checkTouch: function(){
                var me = this;
                $('#againBtn').on(config.touch, function(){
                    oAudio_button.play();
                    me.out();
                    indexPage.act.init();
                });
                $('#shareBtn').on(config.touch, function(){
                    oAudio_button.play();
                    $('#sharePage').show();
                });
                $('#getBtn').on(config.touch, function(){
                    oAudio_button.play();
                    //me.out();
                    gotoUrl(config.htmlUrl+'myprize.html?uid='+config.uid+'&gp='+config.gp);
                });
                $('#sharePage').on(config.touch, function(){
                    $('#sharePage').hide();
                });
            },
            judgeHint: function(){
                //判断是否获得奖券
                //1未达到抽奖门槛-无券  2达到抽奖门槛
                //isSuccess-true表示挑战成功

                //显示吃货等级
                switch (score){
                    case 5:
                        $('.levelHint').show().find('span').text(selfData.text.level_5);
                        break;
                    case 4:
                        $('.levelHint').show().find('span').text(selfData.text.level_4);
                        break;
                    case 3:
                        $('.levelHint').show().find('span').text(selfData.text.level_3);
                        break;
                    case 2:
                        $('.levelHint').show().find('span').text(selfData.text.level_2);
                        break;
                    case 1:
                        $('.levelHint').show().find('span').text(selfData.text.level_1);
                        break;
                }
                //显示得分
                scoreConvert($('.scoreHint')[0],selfData.text.score_hint,score);

                if(!isSuccess){
                    //未达到抽奖门槛
                    textConvert($('.resultHint')[0], selfData.text.low_hint);
                }else{
                    //达到抽奖门槛
                    resultPage.data.save();
                }
            },
            getcouponCb: function(data){
                //1未达到抽奖门槛-无券  2.1达到抽奖门槛+券完了-无券 2.2达到抽奖门槛+总券上限-无券 2.3达到抽奖门槛+今天券上限-无券  3达到抽奖门槛-有券
                //q平台暂时只判断3中情况
                if(data.hasget == 0){
                    //达到抽奖门槛-无券
                    textConvert($('.resultHint')[0], selfData.text.no_hint);
                }else{
                    //达到抽奖门槛-有券
                    textConvert($('.resultHint')[0], selfData.text.has_hint);
                }

                //新平台以后再编辑
                /*var couponnum = pageData.couponnum;  //已获得奖品数量
                var maxcouponnum = pageData.maxcouponnum;   //最大领券数量 0-无限制
                if(data.hasget == 0){
                    //2达到抽奖门槛-无券
                    //旧平台暂时
                    textConvert($('.resultHint')[0], selfData.text.no_hint);
                    if(false){
                        //2.1达到抽奖门槛+券完了-无券
                        textConvert($('.resultHint')[0], selfData.text.no_hint);
                        return
                    }else if(maxcouponnum != 0 && couponnum == maxcouponnum){
                        //2.2达到抽奖门槛+总券上限-无券
                        textConvert($('.resultHint')[0], selfData.text.totalmax_hint);
                        return
                    }else if(false){
                        //2.3达到抽奖门槛+今天券上限-无券
                        textConvert($('.resultHint')[0], selfData.text.daymax_hint);
                        return
                    }
                }else{
                    //3达到抽奖门槛-有券
                    textConvert($('.resultHint')[0], selfData.text.has_hint);
                }*/
            },
            out: function(){
                $('#resultPage').hide();
                $('#againBtn').off();
                $('#shareBtn').off();
                $('#sharePage').off();
            }
		};

        resultPage.data = {
            save : function(){
                post('active/saveplay',{
                    score : score,
                    gp : config.gp
                },function(){
                    resultPage.data.getcoupon();
                });
            },
            getcoupon : function(){
                post('active/getcoupon',{
                    gp : config.gp
                },function(data){
                    resultPage.act.getcouponCb(data);
                });
            }
        };

		function defaultError(data){
			var err = data.error - 0;
			M.loadingHide();
			switch(err){
				case 1002:
					oAuth.clear();
					M.alert('你的身份信息已过期，点击确定刷新页面');
					window.location.reload();
					break;
				default:
					M.alert(data.error_msg);
			}
		}
		
		function post(action,param,cb){
			M.ajax(action,param,config.gameid,function(data){
				var err = data.error - 0;
				switch(err){
					case 0:
						cb && cb(data);
						break;
					default:
						defaultError(data);
				}
			},config.apiopenid,config.apitoken,config.isDebug?'nf':'');
		}
		
		function share(shareInfo,succCb){
			wxshare.initWx(shareInfo,config.gameid,config.apiopenid,config.apitoken,succCb,null,null,null);
		}
		
		//产生随机数 例如，生成0-9的随机数(包括0,不包括9) random(0,9)
	    function random(min,max){
	    	return Math.floor(min+Math.random()*(max-min));
	    }
	    
		M.loading();
		check(oAuth,function(){
			indexPage.act.init();
		});

	}

	//需要预加载的图片
	var imgs = [
        /*__uri('images/index_bg.jpg'),
        __uri('images/game_bg.jpg'),*/
    ];
}());
