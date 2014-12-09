/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 11/30/14
 * Time: 5:15 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','text!data.json','mockjax'],function($,dataFile){
    $.mockjax({
        url:'../rest/inputData',
        responseTime:0,
        dataType:'json',
        response:function(settings){
            this.responseText=dataFile;
        }
    });
});