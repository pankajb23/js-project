/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 11/27/14
 * Time: 11:01 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','underscore','backbone','headerCollection','mediator'],function($,_,Backbone,HeaderCollection,mediator){
    //console.log(mediator);
    var rowHeaderCellView=Backbone.View.extend({
         tagName:'th',
         className:'row-header-cell',
         columnId:'',
         sortId:'',
         initialize:function(){
             this.template=_.template($('#row-header-template').html());
             this.columnId=this.model.attributes.label;
            this.sortId=this.model.attributes.sortted;
         },
         events:{
            'click a':'sortColumn'
         },
         sortColumn:function(){
             //console.log(this.model);
             if(this.model.attributes.sortted==1){
                 this.model.attributes.sortted=-1;
             }else{
                 this.model.attributes.sortted=1;
             }
             this.sortId=this.model.attributes.sortted;
             mediator.trigger('sortTable',this.columnId,this.sortId);
         },
         render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
         }
    });
    var rowHeaderView=Backbone.View.extend({
        tagName:'tr',
        className:'row-header',
        model:HeaderCollection,
        maxxSize:0,
        initialize:function(){

        },
        render:function(){
            var self=this;
            self.$el.html('');
            this.maxxSize=HeaderCollection.model.length;
            _.each(this.model.toArray(),function(tableData,i){
                self.$el.append(new rowHeaderCellView({model:tableData}).render().$el);
            });
            return this;
        }
    });
    return new rowHeaderView().render();
});