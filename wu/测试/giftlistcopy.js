def([
    'page/common.js',
    'view/contractdata/giftlistcopy.html',
    'js/validate.js',
    'component/dialog.js',
    'component/paging.js',
    'component/simpletable.js',
    'component/addins/popselect.js'
], function(CommonPage, tpl, Validate, Dialog) {
    var Page = CommonPage.extend({
        detach: function() {
            this.vm.$destroy(true);
        },
        render: function(route) {
            var rquery = route.query;
            var vm = this.vm = new Vue({
                el: this._el,
                replace: false,
                template: tpl,
                data: {
                    module: 'GiftListCopy', //引用假数据模板名字
                    columns: ["id", "name", "value", "operation"], //列表头
                    partials: { //  自定义片段
                        operation: 'Gift-to-delete' //删除
                    },
                    flags: {},
                    rows: [], //行数据
                    url: route.path,
                    query: {

                    },
                    paging: {
                        pageNo: rquery.pageNo || 1, // 当前第几页数据(从1开始)
                        pageSize: rquery.pageSize || 10, // 一页显示多少条数据
                        pageCount: 1,
                        dataCount: 0
                    },
                    op: {}

                },
                watch: {},
                compiled: function() {
                    this.getGiftListCopy();
                },

                methods: {
                    getGiftListCopy: function() {
                        var self = this;
                        App.api.get('contractData_giftList', jet.extend({}, {
                            pageNo: self.paging.pageNo,
                            pageSize: self.paging.pageSize
                        })).success(
                            function(data) {
                                self.rows = data.content;
                                self.paging.pageCount = data.pageCount;
                                self.paging.pageNo = data.pageNo;
                                self.paging.pageSize = data.pageSize;
                                self.paging.dataCount = data.dataCount;
                            }
                        )
                    }
                },
                events: {
                    delGift: function(entery) {
                        var self = this;
                        Dialog.confirm({
                            title: '礼品操作提醒：',
                            content: entery.name + '将被删除'
                        }, function(r) {
                            if (r === "accept") {
                                var reqBody = {
                                    id: entery.id
                                };
                                App.api.post('contractData_giftDelete', reqBody).success(function(data) {
                                    App.tips.success('操作成功');
                                    self.getGiftListCopy();
                                }).fail(App.api.notice);
                            }
                        });

                    }
                }

            });
            this.display();
        }
    });
    return Page;
});