import Vue from 'vue';
import moment from 'moment'
Vue.filter('timeFilter', function (value,time='YYYY-MM-DD HH:mm:ss') {
    return moment(value).format(time);
});
