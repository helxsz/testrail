window.Question = Backbone.Model.extend({
	urlRoot:"http://localhost:8080/quiz/questions",
	defaults:{
		"id":"",
		"question":"li",
		"answer":"",
		"tags":[],
		"level":0,
		"type":0
	},
	 idAttribute: "_id",
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
	        
	        /*
	        this.on("change", function() {
	        	console.log('on change ......');
	        	  if (question.hasChanged("question")) {
	        	    console.log("change the question");
	        	  }
	        });
	        */
	 }	 
});

window.questionCollection = Backbone.Collection.extend({
  model: Question,
  url:"/quiz/questions",
  initialize:function(){
	this.bind('reset',this.showAll);
	this.on("add", function(question) {
		  console.log("add   Ahoy " + question.get("name") + "!");
	});

	this.on("remove", function(question) {
		  console.log("remove   Ahoy " + question.get("name") + "!");
	})
  }
  ,
  showAll:function(){
      this.each(function(model){
          console.log(model.get('question')+','+model.get('_id'))
   })
   }
});


window.AppRouter = Backbone.Router.extend({	 
    routes:{
    	'':'home'
    },
    initialize:function () {
    	console.log('init route');    	
    	var questions = new questionCollection();     	
        questions.fetch({
    		url:"http://localhost:8080/quiz/questions",
    	    success:function(collection,response){
    	    	console.log("success  router");
    	        collection.each(function(data){
    	            console.log(data.get('_id'));
    	            $('body').append( new QuestionItemView({model:data}).render().el) ;
    	        })
    	    },
    	    error:function(collection, response){
    	    	console.log("error  router");
    	        console.log(collection);
    	        console.log(response);   
    	        throw new Error(" fetch did get collection from API");
    	    }
    	});  
        //$('boby').append( new ExampleView().render().el);
        $('body').append( new HeaderView().render().el) ;
        $('body').append( new LoginView().render().el) ;
        //$('body').append( new QuestionFormView().render().el) ; 
        
 	   //$('boby').append(new TwitterWidget().render().el);
 	    
    },
    home:function(){
    	console.log('home');
    }
});


/****
 * 
 *    
 *          Session login and logout
 * 
 */
/*
var AppView = Backbone.View.extend({
    
    initialize: function () {
        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        // Your server goes below
        options.url = 'http://localhost:8000' + options.url;
        //options.url = 'http://cross-domain.nodejitsu.com' + options.url;
      });
        
        console.log('AppView  start');
    
    },
    render: function () {
      var that = this;
      //$(this.el).html(layoutTemplate);
      // This is the entry point to your app, therefore
      // when the user refreshes the page we should
      // really know if they're authed. We will give it
      // A call back when we know what the auth status is
      Session.getAuth(function () {
        Backbone.history.start();
      })
    } 
});

*/
var SessionModel = Backbone.Model.extend({
	
	validate : function(attrs) { //新增，验证属性是否合法
		/*
		 if (attrs.username.length<6 || attrs.username.length>12) {
		        return "Username contains 6-12 characters.";
		  }
		 var obj = $.ajax({
		    url : "./rest/user/validate/" + attrs.username, 
		    async : false,
		 });
		 if (obj.responseText == "false") {
		      return "Username has been used.";
		 }
		 if (attrs.password.length<6 || attrs.password.length>12) {
		      return "Password contains 6-12 characters.";
		 }
		 if (attrs.email.length == 0) {
		      return "Please enter your email.";
		 }
		 if(!attrs.email.match(/^\w{3,}@\w+(\.\w+)+$/)){
		       return "Invalid email format.";
		  }
		 */
	},	
	save: function(attrs, options) {
	        options || (options = {});

	        options.contentType = 'application/json';
	        options.data = JSON.stringify(attrs);

	        Backbone.Model.prototype.save.call(this, attrs, options);
	},
    urlRoot: '/sessions',
    initialize: function () {
      var that = this;
      console.log("set up session model");
      // Hook into jquery
      // Use withCredentials to send the server cookies
      // The server must allow this through response headers
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
        // If we have a csrf token send it through with the next request
        if(typeof that.get('_csrf') !== 'undefined') {
          jqXHR.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
          console.log('csrf  request  has');
        }
      });
    },
    login: function(creds) {
      // Do a POST to /session and send the serialized form creds
    	console.log("login the user     "+creds.username+"   "+creds.password);
      this.save({username: "Teddy"}, {
         success: function (responseText, status, xhr) {
        	  console.log('user login success' +responseText);
        	  console.log('user login success' +status);
        	  console.log('user login success' +xhr);

         },
         error : function(m,error) { //显示错误信息
        	 console.log('err login ');
       	     //$(".error").html(error);
         }
      });
    },
    logout: function() {
      // Do a DELETE to /session and clear the clientside data
    	console.log("log out the user");
      var that = this;
      this.destroy({
        success: function (model, resp) {
          model.clear()
          model.id = null;
          // Set auth to false to trigger a change:auth event
          // The server also returns a new csrf token so that
          // the user can relogin without refreshing the page
          that.set({auth: false, _csrf: resp._csrf});
          
        }
      });      
    },
    getAuth: function(callback) {
      // getAuth is wrapped around our router
      // before we start any routers let us see if the user is valid
      this.fetch({
          success: callback
      });
    }
    
 });



var Session = new SessionModel();

/*
window.HeaderView = Backbone.View.extend({
    template:_.template($("#headerTemplate").html()),
    initialize: function (para) {
    	console.log(para.head);
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	//this.$el.html(this.template); 
    	this.setElement(this.template());
        return this;
    }
})
*/

window.HeaderView = Backbone.View.extend({
    template:_.template($("#headerTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	//this.$el.html(this.template); 
    	this.setElement(this.template());
        return this;
    }
})


window.ExampleView = Backbone.View.extend({
    template:_.template($("#headerTemplate").html()),
    logoutTemplate:_.template($("#logoutWidget").html()),
    //loginTemplate:_.template($("#loginWidget").html()),
    initialize: function () {
    },
    render: function () {
    	console.log(this.loginTemplate());

    	this.setElement(this.loginTemplate());
        return this;
    }
})


// Bind to the Session auth attribute so we
// make our view act recordingly when auth changes
/*
Session.on('change:auth', function (session) {
	  console.log("auth change");
    that.render();
});
*/


    
/*
if(Session.get('auth')){
	  console.log('session get auth');
	  this.setElement(this.logoutTemplate({'username': Session.get('username')}));
} else {
  console.log("set up login page ......");
	  this.setElement(this.template());
}
*/

    /*
     * 
     ,
    events: {
      'submit form.login': 'login', // On form submission
      'click .logout': 'logout'
    },
    login: function (ev) {
      // Disable the button
      $('[type=submit]', ev.currentTarget).val('Logging in').attr('disabled', 'disabled');
      // Serialize the form into an object using a jQuery plgin
      var creds = $(ev.currentTarget).serializeObject();
      Session.login(creds);
      return false;
    },
    logout: function (ev) {
      // Disable the button
      $(ev.currentTarget).text('Logging out').attr('disabled', 'disabled');
      Session.logout();
    }
    */




/**
 * 
 *   other views
 * 
 */




window.LoginView = Backbone.View.extend({
    template:_.template($("#loginTemplate").html()),
    logoutTemplate:_.template($("#logoutWidget").html()),
    initialize: function () {
    	
    	Session.on('change:auth', function (session) {
    		  console.log("auth change");  	    
    	});
       
    },
    events:{
    	//"submit form.form-signin"  : "login",
        "click input[type=button]": "doSearch",
        'click .logout': 'logout',
        "click #submit"  : "login",
    },    
    render: function () {
    	//console.log(this.template);
    	//this.$el.html(this.template); 
    	if(Session.get('auth')){
    		  console.log('session get auth');
    		  this.setElement(this.logoutTemplate({'username': Session.get('username')}));
    	} else {
    	  console.log("set up login page ......");
      	  this.setElement(this.template());
    	  //this.setElement(this.logoutTemplate({'username':'abcs'}));
    	}
        return this;
    },
    login: function (ev) {
        // Disable the button
    	console.log("login");
        $('[type=submit]', ev.currentTarget).val('Logging in').attr('disabled', 'disabled');
        // Serialize the form into an object using a jQuery plgin
        //var creds = $(ev.currentTarget).serializeObject();
        var email = $("input[name='email']").val();
        var password = $("input[name='password']").val();          
        var creds = {'username':email,'password':password};
        console.log(email+'    '+password+"   "+creds.username+"    "+creds.password);
        Session.login(creds);
        return false;
    },
    logout: function (ev) {
        // Disable the button
        $(ev.currentTarget).text('Logging out').attr('disabled', 'disabled');
        Session.logout();
    },

    doSearch: function( event ){
        // Button clicked, you can access the element that was clicked with event.currentTarget
        console.log( "Search for " + event.target.val() );
    }
});


window.QuestionFormView = Backbone.View.extend({
    template:_.template($("#questionFormTemplate").html()),
    initialize: function () {
        this.render();
    },
    events:{
    	"change"        : "change",
    	"drop .pictureContainer" : "dropHandler",
    	"click .save": "saveQuestion",
    	"click .delete": "deleteQuestion"
    },
    dropHandler: function (event) {
    	console.log('drophandler');
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
    render: function () {
    	//console.log(this.template);
    	//this.$el.html(this.template); 
    	this.setElement(this.template());
        return this;
    },
    change: function (event) {
        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
    deleteQuestion:function(){
    	console.log('delete question');
    	
    	var model = new Question();
        model.destroy({
            success: function () {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;    	
    },
    saveQuestion: function(){
    	console.log('save question');
        var self = this;
        console.log('before save   '+this.$('input[name=question]').val());
    	var model = new Question({question:'this is a new question',answer:'this is a new answer'});

    	console.log(model.isNew()+  "    "+model.get('question')+"   "+model.get('answer'));
        model.save( {
            success: function (model) {
            	console.log("save success");
                self.render();
                //app.navigate('wines/' + model.id, false);
            },
            error: function () {
            	console.log("save failure");
            }
        });    	
    }
});




window.QuestionItemView = Backbone.View.extend({

    initialize: function () {
        this.model.bind("change", this.render, this);
        //this.model.bind('add',this.add,this);
        this.model.bind("destroy", this.close, this);
    },
    events:{
    	'click .edit':'edit',
    	'click .delete':'delete'
    },
    template:_.template($("#questionListTemplate").html()),
    render: function () {
    	console.log(this.model.toJSON());
    	//this.$el.html(this.template(this.model.toJSON())); 
    	this.setElement(this.template(this.model.toJSON()));
    	var type = this.model.get('type');
    	var level = this.model.get('level');
    
        return this;
    },
    close:function(){
    	
    },
    showTip:function(){
    	
    },
    edit:function(){
    	console.log('edit ' +$(this.el).attr('id')+"   "+this.model.isNew());
    	
    	
    },
    delete:function(){
    	console.log('delete  '+$(this.el).attr('id')+"    "+this.model.isNew());
        this.model.destroy({
            success: function () {
                alert('Wine deleted successfully');
                window.history.back();
            },
            error: function (e) {
            	console.log("delete failure  "+e);
            }
        });
    	
    }
});





 /////////////////////////////////////////////////////////////////////////
//////////////////////////////////   http://backbonetutorials.com/infinite-scrolling/
/////////////////////////////////////////

var TwitterWidget = Backbone.View.extend({
    el: '.twitter-widget',
    initialize: function () {
      // isLoading is a useful flag to make sure we don't send off more than
      // one request at a time
      this.isLoading = false;
      //this.twitterCollection = new TwitterCollection();
    },
    render: function () {
      this.loadResults();
      return this;
    },
    loadResults: function () {
      console.log('load results');
      var that = this;
      // we are starting a new load of results so set isLoading to true
      this.isLoading = true;
      // fetch is Backbone.js native function for calling and parsing the collection url
      /*
      this.twitterCollection.fetch({ 
        success: function (tweets) {
          // Once the results are returned lets populate our template
          $(that.el).append(_.template(TwitterListTemplate, {tweets: tweets.models, _:_}));
          // Now we have finished loading set isLoading back to false
          that.isLoading = false;
        }
      });
        */    
    },
    // This will simply listen for scroll events on the current el
    events: {
      'scroll': 'checkScroll'
    },
    checkScroll: function () {
      var triggerPoint = 100; // 100px from the bottom
        if( !this.isLoading && this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight ) {
          //this.twitterCollection.page += 1; // Load next page
          this.loadResults();
        }
    }
  });


$(function(){

	   console.log('abc    abc    abc');
	   var app = new AppRouter();
	   Backbone.history.start({pushState : true});
	   

})

/*

  remove: function() {
    this.model.unbind('change:name',  this.renderName,  this);
    this.model.unbind('change:email', this.renderEmail, this);
    Backbone.View.prototype.remove.apply(this, arguments);
  }












window.DetailView = Backbone.View.extend({
    template:_.template($("#detailTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	this.$el.html(this.template);  	
        return this;
    }	
})



window.QuizListView = Backbone.View.extend({
    template:_.template($("#quizListTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	this.$el.html(this.template);  	
        return this;
    }	
})

window.QuizDetailView = Backbone.View.extend({
    template:_.template($("#quizDetailTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	this.$el.html(this.template);  	
        return this;
    }	
})


window.PersonDetailView = Backbone.View.extend({
    template:_.template($("#personDetailTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	this.$el.html(this.template);  	
        return this;
    }	
})

window.GroupView = Backbone.View.extend({
    template:_.template($("#groupTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	this.$el.html(this.template);  	
        return this;
    }	
})




*/


/*
 *   if sync is used, then fetch won't work in the view or router
Backbone.sync = function(method, model) {
	  //console.log(method + ": " + JSON.stringify(model));
	  //model.id = 1;
	  
	  logSyncOperation(method,model);
	  
	  if(method =='read'){
	      if(model.id){
		   // get specific item from id 
		   var person = getPersonInServer(model.id);
		   if(person){
		      options.success(person,200,null);
		   }else{
		      optinos.error('not found');
		    }		   
		  }
	  }else{
	       // get a list of items 
		   var person = getPeopleFromServer();
		   if(person){
		      options.success(person,200,null);
		   }else{
		      optinos.error('unknown');
		   }
		   
		   
	  }else if(method == 'create'){
	      options.success(create(model.toJSON()),200,null);
	  }else if(method == 'update'){
	      // update 
		  var person = updatePersonInServer(model.toJSON());
		  if(person){
		      options.success(person,200,null);
		  }else{
		      optinos.error('not found');
		  }
	  }
};
*/