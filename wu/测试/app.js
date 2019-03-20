(function() {
    // 这个常用功能 放到前面吧
    // http://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html
    Date.prototype.format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    Date.format = function(fmt, date) {
        if (!date) {
            date = new Date();
        }
        return date.format(fmt);
    };

    //设置语言
    jet.tr.local = jet.tr.defaultLocal = 'zh-CN';
    //加载默认类库
    jet.use([
        'js/api.js',
        'vue',
        'js/store.js',
        'js/worker.js',
        // 'js/promise.js',
        'locales/common.[i18n].json',
        //@DEBUG
        'js/sim.js', //jet.use([]); // 调试阶段加载模拟器
        //!DEBUG
        'jquery'

    ], function(api, Vue, store, worker /*, promise*/ ) {
        //@DEBUG
        Vue.config.debug = true;
        //!DEBUG
        // 注册VUE过滤器
        Vue.filter('tr', jet.tr);

        // Base64
        function b64EncodeUnicode(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        }

        function b64DecodeUnicode(str) {
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        Vue.filter('encodeBase64', b64EncodeUnicode);
        Vue.filter('decodeBase64', b64DecodeUnicode);

        Vue.filter('hashTransform', function(url) {
            var matcher;
            var currentLocationHash = window.location.hash;

            // Maybe encodeUrl
            currentLocationHash = decodeURIComponent(currentLocationHash);

            if (url && ~currentLocationHash.indexOf('__hash') && !!(matcher = currentLocationHash.match(/__hash=(.+?)(?:&|$)/))) {
                var hash = matcher[1];

                try {
                    hash = b64DecodeUnicode(hash);

                    url = url + (!~url.lastIndexOf('?') ? '?' : '&') + hash;

                } catch (e) {
                    console.warn('__hash transform error');
                }
            }

            return url;
        });

        // 注册URL过滤器
        Vue.filter('url', function(url) {
            return url ? '#!' + url : url;
        });
        // 点点文字
        Vue.filter('dotText', function(text, len) {
            if (text && text.length) {
                return text.length > len ? text.substr(0, len) + '...' : text;
            }
            return "";
        });
        // HTML文档生成
        Vue.filter('htmlText', function(text) {
            if (text) { //将回车替换为 br 
                // http://www.lifefrom.com/qianduan/332.html 去除HTML tag @NOTE 不知道有没有做详细验证
                return text.replace(/<\/?[^>]*>/g, '').replace(/\r\n|\n|\r/g, '<br>');
            }
            return "";
        });

        // 组件注册 返回注册的对象
        Vue._component = Vue.component;
        Vue.component = function(id, definition) {
            if (definition) {
                Vue._component(id, definition);
            }
            return Vue._component(id);
        };

        // 注册op数据
        Vue.use(api);
        // // 注册 promise
        // Vue.$promise =  Vue.prototype.$promise = promise;

        // Vue.$promise(function(reslove, reject){ 
        //     setTimeout(function(){ 
        //         console.log('bbx', reject);
        //         reslove();
        //     }, 1000);
        // }).then(function(reslove, reject){ 
        //     consle.log('mmx', reslove, reject);
        // });

        // 创建基础页面
        var AppPage = jet.Page.extend({
            constructor: function(options) {
                this.control = control;
                AppPage.__super__.constructor.call(this, options);
            },
            init: function(options) {
                AppPage.__super__.init.call(this, options);
                this.$el = $(this._el);
            },
            display: function(cb) {
                this.control.active(this, cb);
            },
            render: function() {
                this.display();
            }
        });
        // 应用控制器
        var AppControl = jet.PageControl.extend({
            render: function(route, PageClass) {
                var page = new PageClass();
                page.render(route);
            }
        });
        var control = new AppControl();
        control.AppPage = AppPage;

        //导出
        window.App = {
            Page: AppPage,
            control: control,
            api: api,
            store: store,
            version: "@!VERSION"
        };

        //代理对话框
        ['process', 'info', 'success', 'danger', 'alert', 'confirm', 'input', 'query', 'alertOk'].forEach(function(it) {
            App[it] = function() {
                var args = arguments;
                jet.use('component/dialog.js', function(dlg) {
                    dlg[it].apply(null, args);
                });
            };
        });

        App.tips = function() {
            var args = arguments;
            jet.use('component/dialog.js', function(dlg) {
                dlg.tips.apply(null, args);
            });
        };
        ['info', 'success', 'danger', 'process'].forEach(function(it) {
            App.tips[it] = function(content) {
                return App.tips(it, content);
            };
        });

        //代理请求提示, 默认处理post请求和带tip选项的请求，跳过带ntip的请求 , 这里比较别扭
        api.process(null, function(handler) {
            if (handler.getnTipProcess()) { //@NOTE 跳过强制不提示的请求
                return;
            }
            if (handler.type === 'post' || handler.getTipProcess()) {
                App.process(jet.tr('text.in_process'));
            }
        }).fail(null, function(recv, handler) {
            if (handler.getnTipFail()) { //@NOTE 跳过强制不提示的请求
                App.danger();
                return;
            }
            if (handler.type === 'post' || handler.getTipFail()) {
                var errMsg;
                if (api.skipNotices.indexOf(recv.error) === -1) {
                    errMsg = recv.msg;
                    if (isNaN(Number(recv.error))) {
                        errMsg = jet.tr('err', recv.error);
                    }
                }
                App.tips.danger(errMsg);
                App.danger();
            }
        }).success(null, function(data, handler) {
            if (handler.getnTipSuccess()) { //@NOTE 跳过强制不提示的请求
                App.success();
                return;
            }
            if (handler.type === 'post' || handler.getTipSuccess()) {
                App.tips.success(jet.tr('text.success'));
                App.success();
            }
        });

        //路由及权限控制
        var prev = jet.bridge('route', function(req) {
            prev(req);
            //这里对登陆状态做验证
            if (req.use) {
                if (!api.isLogin()) {
                    if (!req.unauth) {
                        return jet.redirect('login');
                    }
                }
                req.send(function(handle) {
                    if (!handle) {
                        if (req.id !== '500') {
                            return req.redirect('500', { error: 'no_resource' });
                        }
                    }
                    control.render(req, handle);
                });
            } else { // 404
                if (req.id !== '404') {
                    req.redirect('404');
                }
            }
        });

        var routes = {
            //@DEBUG
            '/test': {
                id: 'test',
                unauth: true,
                use: 'page/test.js'
            },
            //!DEBUG
            '/': {
                id: 'index',
                use: 'page/index.js'
            },
            '/login': {
                id: 'login',
                unauth: true,
                use: 'page/login.js'
            },
            '/404': {
                id: '404',
                unauth: true,
                use: 'page/404.js'
            },
            '/500/:error': {
                id: '500',
                unauth: true,
                use: 'page/500.js'
            }
        };

        //定义页面树
        var menuTree = [
            '/department', //组织管理页面

            '/role', //角色管理页面
            '/role/create', //角色创建页面
            '/role/edit/:id', //角色编辑页面
            '/role/users/:id', //关联用户页面

            '/member', //人员管理页面
            '/member/factory/:id?', //人员新建+编辑页面
            '/member/batch', //批量新建人员
            //'/member/create',          //人员新建页面
            // '/member/edit/:id',     //人员编辑页面
            //课程设置
            '/course/index/:id?',
            '/course/manage',
            '/course/detail/:id?',
            //线索管理
            '/roster/signup/:id?/:flag?',
            '/roster/market/:hide?',
            '/roster/majorreport/:type/:rosterid?/:id?', //线索管理/专业测试报告
            '/roster/manager/:flag/:type?/:hide?', //名单管理/名单管理
            '/roster/search', //名单管理/全局搜索
            '/roster/import', //数据管理/数据导入
            '/schedue/manager/:flag', //排班管理/排班表
            '/schedue/create/:flag', //排班管理/新增排班
            '/schedue/settings/:flag', //排班管理/班次配置
            '/roster/recycle/:flag', //规则配置/回收规则
            '/roster/limit/:flag', //规则配置/上限配置
            '/report/callrecordlist/:rosterid?/:studentid?', //通话录音
            '/roster/detail/:type/:id/:flag?', //名单管理/定单详情
            '/roster/poollog/:type/:id/:flag?',
            '/roster/school', //校园行
            '/roster/adid', //adid管理
            '/roster/adid_create', //ADID生成
            '/roster/adid_export', //ADID导出
            '/roster/adid_batch', //ADID批量查询
            '/roster/adid_account', //新增账户
            '/roster/adid_plan', //新增计划
            '/roster/phone/:flag',
            //学员管理
            '/student/index',
            '/student/detail/:id',
            //活动管理
            '/activity/index',
            '/activity/detail/:id?',
            '/roster/activity/:id?',
            //排课管理
            '/lessonplan/teacher',
            '/lessonplan/prearrange', //预排列表
            '/lessonplan/manage/:id/:flag?/:type?', //id用户ID flag正试课 试听课(0_2) type:给老师排还是学生排
            '/lessonplan/record',
            '/lessonplan/detail/:id',
            //表单管理
            '/form/manage',
            '/form/data',
            '/form/detail/:id?',
            //教师管理
            '/teacher/manage/:flag?',
            '/teacher/edumanage',
            '/teacher/lib',
            '/teacher/detail/:id?/:flag?',
            '/teacher/course/:id/:flag?',
            '/teacher/edu/:id/:flag?',
            //统计报表
            '/report/comm_detail', //沟通详情统计
            '/report/comm_result', //沟通结果统计
            '/report/refusal_reason', //拒绝原因统计
            '/report/conversion_rate', //转化率统计

            //知识管理
            '/knowledge_point', //知识点列表页面
            '/knowledge_point/knowledge_base', //知识库列表页面
            '/knowledge_point/edit_basic_information/:id/:type', //知识点编辑页面
            '/knowledge_point/edit_position/:id/:type', //知识点编辑定位
            '/knowledge_point/edit_combing/:id/:type', //知识点编辑定位
            '/knowledge_point/relevance_question/:id/:type', //知识点关联题目
            '/knowledge_point/history/:id/:type', //知识点历史记录

            //题目
            '/quiz',
            '/quiz/quizbank', //题库
            '/quiz/customquiz_list', //自定义题目
            '/quiz/customquiz_detail/:autoQuizId?', //题目详情
            '/quiz/bulk_upload', //批量上传
            '/quiz/edit_quiz/:quizChangeId/:autoQuizId?', //编辑和新建题目

            //资源审核
            '/resources', //知识点列表
            '/resources/quizbank', //题库列表

            //数据管理
            '/datamanage', //知识点
            '/datamanage/subject', //学科
            '/datamanage/questions', //题型
            '/datamanage/occasion', //适用场景
            '/datamanage/relate/:id?', //关联课程

            //微课管理
            '/microlesson',
            '/microlesson/template',
            '/microlesson/template_edit_add/:id',
            '/microlesson/arrange/:id/:subjectId?',

            //设班单管理
            '/lessonplanorder/list',
            '/lessonplanorder/search',
            '/lessonplanorder/list_student/:type/:id?/:flag?',
            '/lessonplanorder/create/:category?/:type?/:id?/:flag?', //设班单编辑,cid（试用0，正式1,编辑页面cid为正式值，其余菜单参数全部缺省），其余参数均为菜单所用
            '/lessonplanorder/update/:cid?',
            '/lessonplanorder/detail/:type/:id/:source?', //设班单查看
            '/lessonplanorder/stsbddetail/:type/:id/:source?', //试听设班单查看
            '/message/list/:type?',

            '/student/remainingtime/:id?/:type?/:flag?',

            '/report/qcoperationlist',
            '/report/qcsalestagelist',
            '/report/lessonplanrecord',
            //学习情况
            '/learningsituation/history/:type/:id/:flag?',
            '/learningsituation/create/:type/:id/:flag?',

            '/roster/repeatingdata',
            '/correction/list',
            '/correction/detail/:type/:id',
            '/roster/im_list/:type/:rosterId/:id/:flag?',
            //流程管理
            '/flow/approvelist', //流程审批列表
            '/flow/approve_detail/:flag', //流程审批详情
            '/flow/flow_detail/:id',
            //成单
            '/contract/create/:rosterId',
            '/contract/student_list/:rosterid',
            '/contract/detail/:flag/:contractId',
            '/contract/list',
            '/contract/paylist',
            //礼品管理
            '/contractdata/activitylist',
            '/contractdata/create/:flag?',
            '/contractdata/giftlist',
            '/contractdata/quotelist',
            '/contractdata/giftlistcopy',
            '/contractdata/giftlistcopy1'

        ];

        jet.each(menuTree, function(key, value) {
            key = value;
            value = value.replace(/(\/\w+)(\/\w+){0,}/, function(id, m1, m2) {
                if (!m2) {
                    m2 = '/index';
                }
                id = m1 + m2;
                routes[key] = {
                    id: id.replace(/\//g, '_').substr(1, id.length),
                    use: 'page' + id + '.js'
                };
            });
            //@DEBUG
            if (!key.match(/(\/\w+){1,2}/)) {
                console.error('can not make route:', value);
            }

            //!DEBUG
        });

        // 定义默认路由
        //对入口做判断设定默认路由
        if (worker.isIframe) {
            worker.ready(function() {
                jet.bootstrap({
                    routers: routes
                });
            })
        } else {
            jet.bootstrap({
                routers: routes
            });
        }

    });

})();