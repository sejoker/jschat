/** @jsx React.DOM */
var _ = require('underscore');
var RoomFactory = require('../models/RoomFactory');

var roomContact = function(roomId){
  var room = RoomFactory.getRoomModel(roomId);
  return <div className={room.get('id') == this.props.room.get('id') && "current"}>
    <a href={'#room/' + room.get('id')} target="_self">{room.get('name')}</a>
  </div>
}

module.exports = React.createClass({
  mixins: [require('../models/ModelMixin')],
  getBackboneModels: function(){
    return [
      this.props.me,
      this.props.room,
      this.props.rooms
      ]
  },
  render: function(){
    var rooms = this.props.me.get('rooms');
    return <div className="contactList">
      <h3>Rooms</h3>
      {rooms.map(roomContact, this)}
    </div>
  }
})
