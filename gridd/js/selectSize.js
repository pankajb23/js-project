/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 12/7/14
 * Time: 3:59 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','underscore','backbone','mediator','footer','logic'],function($,_,Backbone,mediator,UlitemView,logic){
    var gridSize=Backbone.View.extend({
        el:$('#bottom-right'),
        dropVal:5,
        events:{
            'change #select-drop-down':'redraw'
        },
        initialize:function(){

        },
        render:function(){

        },
        redraw:function(){
            this.dropVal=$('#select-drop-down').val();
            UlitemView.frameHeight=parseInt(this.dropVal);
            logic.frameHeight=parseInt(this.dropVal);
            logic.render();
        }
    });
    var gridInstance=new gridSize();
});