def([
    'page/common.js',
    'view/contractdata/giftlistcopy1.html',
    'js/validate.js',
    'component/dialog.js',
    'component/paging.js',
    'component/simpletable.js',
    'component/addins/popselect.js',
    'component/addins/popselectm.js'

], function(CommonPage, tpl, Validate, Dialog) {
    var Page = CommonPage.extend({
        menu: 'contractdata/activitylist',
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
                    rows: [],
                    cols: {},
                    columns: ["id", "name", "value", "opertion"],
                    module: 'Giftlistcopy1', // 模块
                    flags: {},
                    partials: {
                        opertion: 'gift-del-action'
                    },
                    url: route.path,
                    options: {
                        "status": [{ text: "数学", value: "0" }, { text: "语文", value: "1" }, { text: "英语", value: "2" }, { text: "历史", value: "3" }, { text: "物理", value: "4" }, { text: "化学", value: "5" }, { text: "生物", value: "6" }],
                        "instructionTypes": []
                    },
                    query: {
                        "urgency": rquery.urgency || "",
                        "instructionType": rquery.instructionType || []
                    },

                },
                computed: {},
                watch: {},
                compiled: function() {
                    this.getGiftlistcopy1();
                    this.fetchCondition();
                },
                methods: {
                    getGiftlistcopy1: function() {
                        var self = this;
                        App.api.get('contractData_giftList', jet.extend({}, {})).success(
                            function(data) {
                                self.rows = data.content;
                            }
                        )
                    },
                    fetchCondition: function() {
                        var self = this;
                        App.api.get('teacher_Giftlistcopy1', {}).success(function(data) {
                            self.options.instructionTypes = data.instructionTypes
                        })
                    },



                }
            });
            this.display();
        }
    });
    return Page;
});