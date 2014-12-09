/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 11/27/14
 * Time: 11:00 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','underscore','backbone'],function($,_,Backbone){
    var contacts=[
        {
            name:'check',
            label:'CheckBox',
            cellType:'false',
            sortted:''
        },
        {
            name:'id',
            label:'Id',
            cellType:'false',
            sortted:''

        },{
            name:'name',
            label:'Name',
            cellType:'true',
            sortted:1
        },{
            name:'value',
            label:'Value',
            cellType:'true',
            sortted:1
        }
    ];
     var rowHeader=Backbone.Model.extend({
        defaults:{
                name:'',
                label:'',
                cellType:'',
                sortted:''
            }
     });
    var rowHeaderCollection=Backbone.Collection.extend({
        model:rowHeader
    });
    var rowHeaderCollectionList=new rowHeaderCollection();
    for(var i=0;i<contacts.length;i++){
        var newHeadobj=new rowHeader({name:contacts[i].name,label:contacts[i].label,cellType:contacts[i].cellType});
        rowHeaderCollectionList.add(newHeadobj);
    }
    return rowHeaderCollectionList;
});