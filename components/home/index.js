// components/home/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    options: {
        addGlobalClass: true,
    },

    /**
     * 组件的初始数据
     */
    data: { },

    /**
     * 组件的方法列表
     */
    methods: {
        scanCodeTap: function() {
            this.triggerEvent('scanCodeTap');
        }
    }
})