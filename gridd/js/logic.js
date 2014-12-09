/**
 * Created by JetBrains WebStorm.
 * User: pabhardw
 * Date: 11/24/14
 * Time: 11:43 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','underscore','backbone','headerView','mediator','mockjax'],function($,_,Backbone,HeaderView,mediator){
    var urlRoot='../rest/inputData';
    var RowData=Backbone.Model.extend({
        defaults:{
            check:false,
            index:'',
            uid:'',
            name:''
        },
        url:urlRoot,
        idAttribute:'objectId'
    });
    var RowCollection=Backbone.Collection.extend({
        model:RowData,
        url:function(){
            return urlRoot;
        }
    });
    var rowCollection=new RowCollection();
    var rowView=Backbone.View.extend({
        model:RowData,
        tagName:'tr',
        className:'row-data',
        events:{
            'click .edit1':'editItem1',
            'blur .edit1':'close1',
            'click .edit':'editItem',
            'blur .edit':'close',
            'change input[name=check-box]':'changeCheckBox'
        },
        editItem1:function(ev){
              ev.preventDefault();
        },
        close:function(ev){
              ev.preventDefault();
        },
        editItem:function(ev){
              ev.preventDefault();
              this.$('.edit').attr('contenteditable',true).focus();

        },
        close:function(ev){
               ev.preventDefault();
               this.$('.edit').removeAttr('contenteditable');
               this.model.attributes.uid=this.$('.edit').val();
        },
        initialize:function(){
            this.template=_.template($('#row-template').html());
        },
        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        changeCheckBox:function(){
            this.model.attributes.check=!this.model.attributes.check;
        }
    });
    $.mockjax({
        url:'../rest/inputData',
        responseTime:0,
        dataType:'json',
        proxy:'js/data.json'
    });
    var tableView=Backbone.View.extend({
        model: rowCollection,
        dummyModel:[],
        el:$('#content-table'),
        documents:'',
        beginVal:0,
        searchText:'',
        frameHeight:5,
        initialize:function(){
            this.model.on('add',this.render,this);
            mediator.on('sortTable',this.sortColumn,this);
            mediator.on("display",this.showTable,this);
            mediator.on("safeSearch",this.safeSearch,this);
            this.loadAjax();
        },
        loadAjax:function(){
            var deferred=$.Deferred(),documents=new RowCollection();
            var self=this;
            documents.fetch({
                success:function(){
                    deferred.resolve();
                    self.model=documents;
                    self.refine();
                },error:function(){
                    deferred.reject();
                }
            });
            return deferred.promise();
        },
        safeSearch:function(textToSearch){
            this.searchText=textToSearch;
            this.refine();
        },
        isSubstr:function(a,b){
            if(isNaN(a) && a.indexOf(b)>-1)return true;
            return false;
        },
        refine:function(){
                    this.dummyModel=[];
                    for(var i=0;i<this.model.length;i++){
                        var flag=false;
                        for(j in this.model.models[i].attributes){
                                    if(this.isSubstr(this.model.models[i].attributes[j],this.searchText)){
                                        flag=true;
                                        break;
                                    }
                        }
                        if(flag)
                            this.dummyModel.push(this.model.models[i]);
                    }
            this.render();
         },
        sortColumn:function(column,side){
            switch(column){
                case 'Id':{
                    this.model.models.sort(function(a,b){
                        return a.attributes.index > b.attributes.index ?1*side :a.attributes.index < b.attributes.index?(-1)*side:0;
                    });
                } break;
                case 'Value':{
                    this.model.models.sort(function(a,b){
                        return a.attributes.name > b.attributes.name ? 1*side :a.attributes.name < b.attributes.name?(-1)*side:0;
                    });
                } break;
                case 'Name':{
                    this.model.models.sort(function(a,b){
                        return a.attributes.uid > b.attributes.uid?1*side :a.attributes.uid < b.attributes.uid?(-1)*side:0;
                    });
                } break;
            }
            this.refine();
        },
        showTable:function(startVal){
            this.beginVal=startVal;
            this.refine();
        },
        events:{

        },
        render:function(){
            var self=this;
            self.$el.html('');
            self.$el.append(HeaderView.render().$el);
            for(var i=this.beginVal,j=0; i<this.dummyModel.length && j<this.frameHeight; i++,j++){
                var row=this.dummyModel[i];
                row.attributes.index=i+1;
                var viewDatum=new rowView({model:row});
                var viewElement=viewDatum.render().$el;
                self.$el.append(viewElement);
                if(viewDatum.model.attributes.check==true){
                    viewDatum.$('input[name=check-box]').attr('checked','checked');
                }else{
                    viewDatum.$('input[name=check-box').removeAttr('checked');
                }
            }
            mediator.trigger('redraw',this.beginVal);
            return this;
        }
    });
    var table=new tableView();
    table.refine();
    $(document).ready(function(){
        $('#input-template').submit(function(){
            var newRow=new RowData({ uid:$('#user-uid').val(),name:$('#user-name').val() });
            table.model.add(newRow);
            return false;
        });
    });
    return table;
});