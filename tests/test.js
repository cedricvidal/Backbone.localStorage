$(document).ready(function() {

    window.killStorage = function (name) {
        var keys = _.select(_.keys(localStorage), function(key) { return key.indexOf(name) == 0; });
        _.each(keys, function(key) {
            localStorage.removeItem(key);
        });
    };

    module("localStorage", {
        setup: function(){
            killStorage('libraryStore');
            this.Library = Backbone.Collection.extend({
                localStorage: new window.Store("libraryStore")
            });
            this.library = new this.Library();
        },
    });

    var attrs = {
        title  : 'The Tempest',
        author : 'Bill Shakespeare',
        length : 123
    };

    // read from the library object that shouldn't exist when we start
    test("collection", function() {

        this.library.fetch();
        equals(this.library.length, 0, 'empty read');
        
        this.library.create(attrs);
        equals(this.library.length, 1, 'one item added');
        equals(this.library.first().get('title'), 'The Tempest', 'title was read');
        equals(this.library.first().get('author'), 'Bill Shakespeare', 'author was read');
        equals(this.library.first().get('length'), 123, 'length was read');

        this.library.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
        equals(this.library.first().get('id'), '1-the-tempest', 'verify ID update');
        equals(this.library.first().get('title'), 'The Tempest', 'verify title is still there');
        equals(this.library.first().get('author'), 'William Shakespeare', 'verify author update');
        equals(this.library.first().get('length'), 123, 'verify length is still there');
        this.library.each(function(book) {
            book.destroy();
        });
        equals(this.library.length, 0, 'item was destroyed and library is empty');
        
    });

    test("given a model just created, when its id is updated then previous id value should be available to listeners", function() {
        var ids = {};
        var book = this.library.create(attrs);
		var id = book.get('id');
        this.library.bind('change:id', function(model, collection) {
            ids = { before: model.previous('id'), after: model.get('id') };
        });
		book.set({id: 1});
        equals(ids.after, 1, 'new id is available');
        equals(ids.before, id, 'previous id is available too');
    });

/*

  test("sync: update", function() {
    library.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
    equals(lastRequest.url, '/library/1-the-tempest');
    equals(lastRequest.type, 'PUT');
    equals(lastRequest.dataType, 'json');
    var data = JSON.parse(lastRequest.data);
    equals(data.id, '1-the-tempest');
    equals(data.title, 'The Tempest');
    equals(data.author, 'William Shakespeare');
    equals(data.length, 123);
  });

  test("sync: update with emulateHTTP and emulateJSON", function() {
    Backbone.emulateHTTP = Backbone.emulateJSON = true;
    library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
    equals(lastRequest.url, '/library/2-the-tempest');
    equals(lastRequest.type, 'POST');
    equals(lastRequest.dataType, 'json');
    equals(lastRequest.data._method, 'PUT');
    var data = JSON.parse(lastRequest.data.model);
    equals(data.id, '2-the-tempest');
    equals(data.author, 'Tim Shakespeare');
    equals(data.length, 123);
    Backbone.emulateHTTP = Backbone.emulateJSON = false;
  });

  test("sync: update with just emulateHTTP", function() {
    Backbone.emulateHTTP = true;
    library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
    equals(lastRequest.url, '/library/2-the-tempest');
    equals(lastRequest.type, 'POST');
    equals(lastRequest.contentType, 'application/json');
    var data = JSON.parse(lastRequest.data);
    equals(data.id, '2-the-tempest');
    equals(data.author, 'Tim Shakespeare');
    equals(data.length, 123);
    Backbone.emulateHTTP = false;
  });

  test("sync: update with just emulateJSON", function() {
    Backbone.emulateJSON = true;
    library.first().save({id: '2-the-tempest', author: 'Tim Shakespeare'});
    equals(lastRequest.url, '/library/2-the-tempest');
    equals(lastRequest.type, 'PUT');
    equals(lastRequest.contentType, 'application/x-www-form-urlencoded');
    var data = JSON.parse(lastRequest.data.model);
    equals(data.id, '2-the-tempest');
    equals(data.author, 'Tim Shakespeare');
    equals(data.length, 123);
    Backbone.emulateJSON = false;
  });

  test("sync: read model", function() {
    library.first().fetch();
    equals(lastRequest.url, '/library/2-the-tempest');
    equals(lastRequest.type, 'GET');
    ok(_.isEmpty(lastRequest.data));
  });



  test("sync: destroy with emulateHTTP", function() {
    Backbone.emulateHTTP = Backbone.emulateJSON = true;
    library.first().destroy();
    equals(lastRequest.url, '/library/2-the-tempest');
    equals(lastRequest.type, 'POST');
    equals(JSON.stringify(lastRequest.data), '{"_method":"DELETE"}');
    Backbone.emulateHTTP = Backbone.emulateJSON = false;
  });

  test("sync: urlError", function() {
    model = new Backbone.Model();
    raises(function() {
      model.fetch();
    });
    model.fetch({url: '/one/two'});
    equals(lastRequest.url, '/one/two');
  });
*/

});