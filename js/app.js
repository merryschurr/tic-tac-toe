$(function() {

  new Game('#game-container', '#game-box')

});


var Game = function(element, box){

	this.element = $(element);
	this._box = box;
	this.init = function(){
	this.over = false;
	this.moves = 0;
	this._winPiece = [];
	this.Player = [];
	this.Board = null;
	this.activePlayer = 0; 
	this.updateMovesCount();
    if (!this.box){
    this.box = $(this._box).html()
    this.element.append(this.box)
    this.bindEvents()

    }
}

this.bindEvents = function(){
    var self = this;

    $('#restart', this.element).click(function(e){
    e.preventDefault();

    if (self.moves < 1) return;
    self.hideMenu()

    $('td.X, td.O', this.element).addClass('animated zoomOut')
    setTimeout(function(){
    self.restart();
    }, 750);
});

    $('#game tr td', this.element).click(function(el, a, b){

    if(self.over) return;

    var col = $(this).index();

    var row = $(this).closest('tr').index();
    self.move( row +' '+ col );
    self.showMenu()
});

    $('#game tr td', this.element).hover(function(){

    if(self.over) return;

    $(this).addClass('hover-'+ self.activePlayer);
    }, function(){

    if(self.over) return;

    $(this).removeClass('hover-0 hover-1');
    })
}

  	this.start = function(){
    this.hideMenu();
    this.init();

    $('#game tr td').attr('class', '');

    $('#status').removeClass('show');

    this.Player.push( new Player(0) );
    this.Player.push( new Player(1) );
    this.Board = new Board();
    this.Board.update();
};

  	this.showMenu = function(){
    $('#menu').attr('class', '')
  	}

  	this.hideMenu = function(){
    $('#menu').attr('class', 'hidden')
  	}

 	this.parseInput = function(v){
    v = v.split(' ');
    var pos = Number(v[1]);

    if(v[0] == 1) pos = (pos+3);
    if(v[0] == 2) pos = (pos+6);
    return {
    row: v[0],
    col: v[1],
    index: pos
    };
};

  	this.tryMove = function(input){
    if(this.Board.board[input] == '_') return true;
    return false;
};

  	this.move = function(v){
    var Player = this.Player[ this.activePlayer ];
    v = this.parseInput(v);
    if(!this.tryMove(v.index)) return false;

    Player.moves.push( v.index );
    this.moves++;
    this.Board.board[v.index] = Player.symbol;
    this.activePlayer = (Player._id) ? 0 : 1; 
    this.Board.update();
    this.updateMovesCount();

    if(this.hasWon(Player)){
      this.gameOver(Player);
      return true;
    }

    if(this.moves >= 9) this.gameOver(null)

    return true;
};

  	this.gameOver = function(Player){
    if (!Player){
    $('td.X, td.O', this.element).addClass('animated swing')
    return $('#status').text('It\'s a Draw!').addClass('show');
    }

}

  	this.hasWon = function(Player){
    var won = false;
    var wins = Player.moves.join(' ');
    var self = this;

};

  	this.updateMovesCount = function(){
    $('#time').text('Moves: '+ this.moves );
  	}

 	this.start()

};

	var Player = function(id){
 	this._id = id;
 	this.symbol = (id == 0) ? 'X' : 'O';
  	this.moves = [];
};


var Board = function(){
  // empty board (3x3)
  this.board = [
    '_','_','_',
    '_','_','_',
    '_','_','_'
  ];

  // array of possible win scenarios
  this.wins = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6],
    [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];

  this.update = function(){
    var board = this.board;
    $('#game tr').each(function(x, el){
      $('td', el).each(function(i, td){
        var pos = Number(i);
        if(x == 1) pos = (pos+3);
        if(x == 2) pos = (pos+6);
        var txt = (board[pos] == '_') ? '' : board[pos];
        $(this).html( txt ).addClass( txt );
      });
    });
  };

};