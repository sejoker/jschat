/** @jsx React.DOM */
var ContactFactory = require('../models/ContactFactory');


module.exports = function(itemClass){
  return React.createClass({
    mixins: [require('../models/ModelMixin')],
    _edge: 100,
    componentDidMount: function(){
      this.controlEdges();
      // populate User model inside object
      this.props.renderedItems.models.forEach(function(model){
        populateUser(model,this)
      }.bind(this));
      this.props.renderedItems.on('change add remove', function(){
        this.props.renderedItems.models.forEach(function(model){
          if(model.__user && !model.__user.injected) populateUser(model, this);
        }.bind(this));
      }.bind(this));

      function populateUser(message, component){
        message.__user.injected = true;
        component.injectModel(message.__user);
      };
    },
    scrollToBottom: function(){
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    },
    onScroll: function(){
      this.controlEdges(true);
    },
    getBackboneModels: function(){
      return [this.props.renderedItems]
    },
    componentWillUpdate: function() {
      var node = this.getDOMNode();
      this._scrollHeight = node.scrollHeight;
      this._scrollTop = node.scrollTop;
      this.shouldStayTop = this._scrollTop <= this._edge;
      this.shouldScrollBottom = (this._scrollTop + node.offsetHeight) >= node.scrollHeight - this._edge;
      console.log(this.shouldStayTop, this.shouldScrollBottom);
    },
    //  hold items on adding top and bottom
    componentDidUpdate: function() {
      var node = this.getDOMNode();
      if(this.shouldScrollBottom){
        node.scrollTop = node.scrollHeight;
      }
      if(this.shouldStayTop){
        node.scrollTop = this._scrollTop + (node.scrollHeight - this._scrollHeight);
      }
    },
    controlEdges: function(update){
      var scrolledFromTop = this.getDOMNode().scrollTop;
      if(scrolledFromTop < this._edge) {
        this.getDOMNode().scrollTop = this._edge;
        update && this.props.renderedItems.addToTop();
      }
      var bottom = this.refs.inner.getDOMNode().offsetHeight - this.getDOMNode().offsetHeight;
      if(scrolledFromTop > bottom - this._edge) {
        this.getDOMNode().scrollTop = bottom - this._edge;
      }
    },
    render : function(){
      return <div className="messagesList" onScroll={this.onScroll} >
        <div style={{'padding-top': this._edge,'padding-bottom':this._edge }} ref='inner' >
          {this.props.renderedItems && this.props.renderedItems.models.map(itemClass)}
          <div className="writingBar">{this.props.writingStatus}</div>
        </div>
    </div>;
    }
  });
}