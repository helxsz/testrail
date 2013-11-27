
window.Question = Backbone.Model.extend({
	//urlRoot:"http://localhost:8080/quiz/testSet",
	defaults:{
		"id":"",
		"question":"li",
		"answer":"",
		"tags":[],
		"level":0,
		"type":0
	},
	 idAttribute: "_id",
	 
	 /*
	    url : function(){
	        if (this.has("_id")){
	            return "/api/message/" + this.get("_id");
	        }
	        return "/api/404";
	    },
     */

	    initialize: function () {
	        this.validators = {};

	        this.validators.name = function (value) {
	            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
	        };

	        this.validators.grapes = function (value) {
	            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a grape variety"};
	        };

	        this.validators.country = function (value) {
	            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
	        };
	        
	        this.on("change", function() {
	        	console.log('on change ......');
	        	  if (question.hasChanged("question")) {
	        	    console.log("change the question");
	        	  }
	        });
	    }

});

/*

var question = new Question({'question':'afafa','answer':'who are you','id':'id1'});
console.log(question.get('question')+"   "+question.get('answer'));
console.log(question);

question.set('question','questionquestion');

console.log(question);
console.log(question.has('title')+"   "+question.has('age')+"   "+question.get('id'));
console.log(question.isNew()+"   "+question.id+"   "+question.cid);
console.log(JSON.stringify(question.toJSON())+"     "+question.url());

Backbone.sync = function(method, model) {
	  console.log(method + ": " + JSON.stringify(model));
	  model.id = 1;
};

question.save({error: function(model, xhr, options){ console.log(xhr); }});
console.log(question.change());
*/

/////////////////////////////////////////////////////////////////////////////////////////////////

window.questionCollection = Backbone.Collection.extend({
  model: Question,
  url:"/quiz/testSet",
  initialize:function(){
      //this.bind('reset',this.showAll);
      this.on("add", function(question) {
    	  console.log("add   Ahoy " + question.get("name") + "!");
      });

      this.on("remove", function(question) {
    	  console.log("remove   Ahoy " + question.get("name") + "!");
      })
  },
  showAll:function(){
      this.each(function(model){
          console.log(model.get('question')+','+model.get('_id'))
      })
  }
  /*
  ,parse : function(data) {
      // 'data' contains the raw JSON object
      console.log(data);
  }
  ,
  Book.url = function() {
  return this.urlRoot + '/' + this.id + '?details=true';
};
  */
});



var questions = new questionCollection;
function getTestData(){
	console.log('get test data');
	questions.fetch({
	    success:function(collection,response){
	    	console.log('success');
	        collection.each(function(data){
	            console.log(data.get('_id'));
	        })
	    },
	    error:function(collection, response){
	        console.log(collection);
	        console.log(response);
	        console.log('error');
	    }
	})	
}

getTestData();
/**/

console.log('question');

	
/*
questions.add([
	               new Question({name: "Flying Dutchman",id:'id1'}),
	               new Question({name: "Black Pearl",id:'id2'}),
	               new Question({name: "Black Pearl",id:'id3'})
	             ]);
console.log(questions.get('id1')+"    "+questions.where({name:'Black Pearl'}));
console.log("length:"+questions.length);

questions.remove({id:'id3'});
*/


/**/
Backbone.sync = function(method, model) {
	  console.log(method + ": " + JSON.stringify(model));
	  //model.id = 1;
};

/**/
window.AppRouter = Backbone.Router.extend({	 
    routes:{
    	'':'home',
    	// 'http://localhost:8080/quiz/testSet':"list",
        "questions/add"         : "addQuestion",
        "questions/:id"         : "questionDetails",
        "about"             : "about",
        
        'quiz/add' : 'addQuiz',
        'quiz/:id' : 'quizDetail',
        'quiz/list': 'quizList',
        'user/:id/quizlist': 'userquizList'
    },
    initialize:function () {
    	console.log('init route');
        //$('#header').html(new HeaderView().render().el);
    	//this.list();
    	
    	this.questionListView = new QuestionListView({model:questions});
    	
        $('body').html(this.questionListView.render().el);        
        $('body').append(new helloworld({model:questions}).render().el);
    	
    	// can't work properly
        getTestData();
        
    	var questions = new questionCollection();     	
        new questionCollection().fetch({
    		url:"http://localhost:8080/quiz/testSet",
    	    success:function(collection,response){
    	    	console.log("success");
    	        collection.each(function(data){
    	            console.log(data.get('_id'));
    	        })
    	    },
    	    error:function(collection, response){
    	    	 console.log("error");
    	        console.log(collection);
    	        console.log(response);   	       
    	    }
    	});
        
    },
    list:function() {
    	console.log("list   ......");
    	/*
        var jqxhr = $.getJSON("http://localhost:8080/quiz/testSet")
        .success(function(data, status, xhr) { 
        	console.log('json success');
          $.each(data, function(i,item){

          });
          
        })
        .error(function() { console.log("json  error"); })
        .complete(function() {
              console.log("fetch complete + " + this);
        });
    	*/	  
    	console.log('fucking problem');

    },

    addQuestion:function(){
    	console.log("addquestion");
    },
    questionDetail:function(){
    	console.log("questionDetail");    	
    },
    home:function(){
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },
    about:function(){
    	console.log("about");    	
    },
    
    addQuiz:function(){
    	console.log("addQuiz");    	
    },
    quizDetail:function(){
    	console.log("quizDetail");    	
    },
    quizList:function(){
    	console.log("quizList");    	
    },
    userquizList:function(){
    	console.log("userquizList");    	
    }
});

/// view 



// http://jsfiddle.net/thomas/C9wew/6/
var helloworld = Backbone.View.extend({
    tagName: 'h3',
    //template: _.template("<ul class='thumbnails'>ddddddddd</ul>"),
    //template: $("<span>hello-container-template</span>").html(),
    template: 'hello',
    el: $('body'),
    initialize:function () {
    	console.log('init helloworld');
        //this.model.bind("reset", this.render, this);
        //this.model.bind("add", function (wine) {
            //$(self.el).append(new WineListItemView({model:wine}).render().el);
        //});
    	
    	var questions = new questionCollection();     	
        new questionCollection().fetch({

    	    success:function(collection,response){
    	    	console.log("success");
    	        collection.each(function(data){
    	            console.log(data.get('_id'));
    	        })
    	    },
    	    error:function(collection, response){
    	    	 console.log("error");
    	        console.log(collection);
    	        console.log(response);   	       
    	    }
    	});
    	
        this.render();
    },
    render: function() {
    	console.log('hello world render');
    	$(this.el).append("<ul> <li>hello world</li> </ul>");
        //this.$el.html( 'Hello World' );
        //$(this.el).html('<label>Search</label><input type="text" id="search_input" /><input type="button" id="search_button" value="Search" />'); 
        var self = this;
        $.get("/templates/" + this.template + ".html", function(template){
          var t = $(template).tmpl();
          console.log(t);
          self.$el.html(t);
        });      	
        
        return this;
    },
    events: {
        'click': 'showWorld',
        'keypress':'keypress',
        'keyup':'keyup',
        "click input[type=button]": "doSearch"
        /*
        "dblclick" : "open",
        "click .icon.doc"         : "select",
        "contextmenu .icon.doc"   : "showMenu",
        "click .show_notes"       : "toggleNotes",
        "click .title .lock"      : "editAccessLevel",
        "mouseover .title .date"  : "showTooltip"   
        */     
    },
    showWorld: function() {
        this.$el.append( ' World' );
        return this;
    },
    keypress:function(e){
    	console.log('keypress  '+e.code);
    },
    keyup:function(e){
    	console.log('keyup   '+e.code);
    },
    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    },
    saveWine: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('wines/' + model.id, false);
                //utils.showAlert('Success!', 'Wine saved successfully', 'alert-success');
            },
            error: function () {
                //utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteWine: function () {
        this.model.destroy({
            success: function () {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    doSearch: function( event ){
        // Button clicked, you can access the element that was clicked with event.currentTarget
        console.log( "Search for " + $("#search_input").val() );
    }
}); 


//http://jsfiddle.net/thomas/C9wew/6/
var helloworld = Backbone.View.extend({
    //1el: $('body'),  //ERROR
    tagName: 'h3',
    template: 'hello',
    initialize:function () {
    	console.log('init helloworld');    	
   	
    },
    render: function() {
        this.$el.html( 'Hello World' );
        //$(this.el).html('<label>Search</label><input type="text" id="search_input" /><input type="button" id="search_button" value="Search" />');        
    	var self = this;
        $.get("/templates/" + this.template + ".html", function(template){
            var t = $(template).tmpl();
            console.log(t);
            self.$el.html(t);
          });              	
        return this;
    },
    events: {
        'click': 'showWorld'  
    },
    showWorld: function() {
        this.$el.append( ' World' );
        return this;
    }
}); 

//Views

window.QuestionListView = Backbone.View.extend({
 
    tagName:'ul', 
    initialize:function () {
        //this.model.bind("reset", this.render, this);
        var self = this;
        //this.model.bind("add", function (wine) {
            //$(self.el).append(new WineListItemView({model:wine}).render().el);
        //});
    }, 
    render:function (eventName) {
    	
        _.each(this.model.models, function (wine) {
            //$(this.el).append(new WineListItemView({model:wine}).render().el);
        }, this);
       
        return this;
    }
});

window.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});

window.HomeView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});

window.AboutView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});

/*
window.QuestionListItemView = Backbone.View.extend({
 
    tagName:"li", 
    template: _.template(""),
    //template:_.template($('#tpl-wine-list-item').html()),
    //template: _.template("<input type='checkbox' class='todo-check' /><div class='todo-content'></div><span class='todo-destroy'></span><input type='text' class='todo-input' />"),
    events:{
    	"keypress #new-todo" : "createOnEnter",
        "keyup #new-todo"    : "showTooltip"
    },
    initialize:function () {
        //this.model.bind("change", this.render, this);
        //this.model.bind("destroy", this.close, this);
    }, 
    render:function (eventName) {
        //$(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    close:function () {
        $(this.el).unbind();
        $(this.el).remove();
    },
    setContent: function() {      
        var content = this.model.get('content');
        this.$('.todo-content').set("html", content);
        this.$('.todo-input').setProperty("value", content);
        
        if (this.model.get('done')) {
          this.$(".todo-check").setProperty("checked", "checked");
          $(this.el).addClass("done");
        } else {
          this.$(".todo-check").removeProperty("checked");
          $(this.el).removeClass("done");
        }
        
        this.input = this.$(".todo-input");
        this.input.addEvent('blur', this.close);
    },    
    createOnEnter:function(e){
    	if (e.code != 13) return;
    	questionCollection.create({
          content: this.input.getProperty("value"),
          done:    false
        });
        this.input.setProperty("value", "");
    },
    showTooltip:function(){
    	  var tooltip = this.$(".ui-tooltip-top");
          tooltip.fade("out");
        
          if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
          
          if (this.input.getProperty("value") !== "" && this.input.getProperty("value") !== this.input.getProperty("placeholder")) {
            this.tooltipTimeout = setTimeout(function(){
              tooltip.fade("in");
            }, 1000);
          }    	
    }
})

*/



$(function(){

   console.log('abc    abc    abc');
   var app = new AppRouter();
   Backbone.history.start({pushState : true});
})

/*


*/

 

 

window.QuestionListView = Backbone.View.extend({
	tagName:'ul',
	initialize:function(){
		this.model.bind("reset",this.render,this);
		var self = this;
		this.model.bind("add",function(question){
			//$(self.el).append(new QuestionListItemView({model:question}).render().el)
			
		});
	},
	render:function(eventName){
		_.each(this.model.models,function(question){
			//$(this.el).append(new QuestionListItemView({model:question}).render().el)
			
		},this);
		return this;
	}
});

/*
window.QuestionListItemView = Backbone.View.extend({
      tagName:"li",
      template:_.template($('').html()),
      initialize:function(){
    	  this.model.bind("change",this.render,this);
    	  this.model.bind("destory",this.close,this);
      },
      render:function(eventname){
    	  $(this.el).html(this.template(this.model.toJSON()));
    	  return this;
      },
      close:function(){
    	  $(this.el).unbind();
    	  $(this.el).remove();
      }

});
*/