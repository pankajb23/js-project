/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 12/4/14
 * Time: 11:40 PM
 * To change this template use File | Settings | File Templates.
 */
require(['jquery','underscore','backbone','mediator'],function($,_,Backbone,mediator){
    var searchBar=Backbone.View.extend({
       el:$('#sideSearchBar'),
       events:{
           'keyup .searchBar':'filter'
       } ,
       initialize:function(){

       },
       render:function(){

       },
       filter:function(){
           var text=$('input.searchBar').val();
           mediator.trigger("safeSearch",text);
       }
    });
    var searchBarobj=new searchBar();
});