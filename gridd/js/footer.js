/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 11/29/14
 * Time: 11:20 AM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','underscore','backbone','headerView','logic','mediator'],function($,_,Backbone,headerView,logic,mediator){
    var footerlistItem=Backbone.Model.extend({
        defaults:{
            isNumber:false,
            isfront:false,
            isBack:false,
            Number:'',
            display:''
        }
    });
    var footerUlItem=Backbone.Collection.extend({
         model:footerlistItem
    });
    var liItemView=Backbone.View.extend({
         tagName:'li',
         className:'',
         events:{
            'click .li-bottom-footer':'anotherPage'
         },
         anotherPage:function(){
                 switch(this.model.attributes.Number){
                     case  -1:
                         // <<
                         if(Ulitem.current_held >=0){
                             Ulitem.current_held-=5;
                             Ulitem.current_held=Math.max(Ulitem.current_held,0);
                             mediator.trigger("display",Ulitem.current_held*Ulitem.frameHeight);
                         }
                         break;
                     case  -2:
                         //<
                         if(Ulitem.current_held > 0){
                             Ulitem.current_held-=1;
                             Ulitem.current_held=Math.max(Ulitem.current_held,0);
                             mediator.trigger('display',Ulitem.current_held*Ulitem.frameHeight);
                         }
                         break;
                     case  -3:
                         //>
                         var size=Math.ceil(logic.dummyModel.length/5);
                         if(Ulitem.current_held < size ){
                             Ulitem.current_held +=1;
                             Ulitem.current_held=Math.min(Ulitem.current_held,size-1);
                             mediator.trigger('display',Ulitem.current_held*Ulitem.frameHeight);
                         }
                         break;
                     case  -4:
                         //>>
                         var size=Math.ceil(logic.dummyModel.length/5);
                         if(Ulitem.current_held+5 < size){
                             Ulitem.current_held+=5;
                             Ulitem.current_held=Math.min(Ulitem.current_held,size-1);
                             mediator.trigger('display',Ulitem.current_held*Ulitem.frameHeight);
                         }
                         break;
                     default:
                         if(Ulitem.current_held !== this.model.attributes.Number){
                            Ulitem.current_held = this.model.attributes.Number;
                             mediator.trigger('display',Ulitem.current_held*Ulitem.frameHeight);
                         }
                 }
         },
         initialize:function(){
             this.template=_.template($('#listItem-footer-template').html());
         },
         render:function(){
             this.$el.html(this.template(this.model.toJSON()));
             return this;
         }
    });
    var UlItemView=Backbone.View.extend({
         model:new footerUlItem(),
         el:$('#bottom-footer'),
         className:'',
         current_held:0,
         footerVal:0,
         frameHeight:5,
         initialize:function(){
                mediator.on('redraw',this.displayFooter,this);
         },
         ceil:function(a,b){
               return Math.ceil(a/b);
         },
         displayFooter:function(startVal){
                    this.footerVal=Math.floor(startVal/(5*this.frameHeight));
                    this.render();
         },
         render:function(){
             var self=this,size=logic.dummyModel.length;
             self.$el.html('');
             var footerUl=new footerUlItem();
             footerUl.add(new footerlistItem({isfront:true,Number:-1,display:'<<'}));
             footerUl.add(new footerlistItem({isfront:true,Number:-2,display:'<'}));
             var  startVal=this.footerVal*this.frameHeight*5;
             for(var i=this.footerVal*5,j=0; startVal<=size && j<5; i++,startVal+=this.frameHeight,j++){
                 footerUl.add(new footerlistItem({Number:i,display:(i+1)}));
             }
             footerUl.add(new footerlistItem({isBack:true,Number:-3,display:'>'}));
             footerUl.add(new footerlistItem({isBack:true,Number:-4,display:'>>'}));
             _.each(footerUl.toArray(),function(liItem,i){
                    self.$el.append(new liItemView({model:liItem}).render().$el);
             });
             return this;
         }
    });
    var Ulitem=new UlItemView();
    return Ulitem;
});