function Cell(x, y) {
	var self = this;
	self.owner = ko.observable('');
	self.x = x;
	self.y = y;
	self.clicked = false;
}

function TicTacToeViewModel() {
	var self = this;

	self.cells = ko.observableArray([
		new Cell(0, 0),
		new Cell(0, 1),
		new Cell(0, 2),
		new Cell(1, 0),
		new Cell(1, 1),
		new Cell(1, 2),
		new Cell(2, 0),
		new Cell(2, 1),
		new Cell(2, 2)
	]);

	self.currentPlayer = 'O';
	self.clicks = 0;
	self.isDraw = ko.observable(false);
	self.winner = ko.observable('');

	self.checkCells = function (cells) {
		var xCount, oCount;

		// see if x won
		xCount = _.filter(cells, function (cell) {
			return cell.owner() === 'X' ? true : false; 
		});
		if (xCount.length === 3) {
			self.winner('X');
			return true;
		} else {
			oCount = _.filter(cells, function (cell) {
				return cell.owner() === 'O' ? true : false; 
			});
			if (oCount.length === 3) {
				self.winner('O');
				return true;
			}
		}
		return false;
	};

	self.checkWinner = function () {
		var cells = self.cells(),
			i,
			row,
			col,
			diag;

		// for each row
		for (i = 0; i <= 2; i++) {
			row = _.filter(cells, {'x': i});
			if (self.checkCells(row)) {
				return;
			}
		};

		// for each col
		for (i = 0; i <= 2; i++) {
			col = _.filter(cells, {'y': i});
			if (self.checkCells(col)) {
				return;
			}
		};
		
		// check diags
		diag = _.filter(cells, function (cell) {
			switch (true) {
				case cell.x === 0 && cell.y === 0:
					return true;
				case cell.x === 1 && cell.y === 1:
					return true;
				case cell.x === 2 && cell.y === 2:
					return true;
				default:
					return false;
			}
		});
		if (self.checkCells(diag)) {
			return;
		}

		diag = _.filter(cells, function (cell) {
			switch (true) {
				case cell.x === 0 && cell.y === 2:
					return true;
				case cell.x === 1 && cell.y === 1:
					return true;
				case cell.x === 2 && cell.y === 0:
					return true;
				default:
					return false;
			}
		});
		if (self.checkCells(diag)) {
			return;
		}

	};

	self.getCurrentPlayer = function () {
		return self.currentPlayer = (self.currentPlayer === 'X') ? 'O' : 'X';
	}

	self.updateCell = function (cell) {
		if (cell.clicked === true || self.winner() !== '') {
			return;
		}
		cell.clicked = true;
		cell.owner(self.getCurrentPlayer());

		self.clicks++;
		self.checkWinner();

		if (self.winner() === '' && self.clicks === self.cells().length) {
			self.isDraw(true);
		}
	};

	self.reset = function () {
		ko.utils.arrayForEach(self.cells(), function (cell) {
			cell.clicked = false;
			cell.owner('');
		});

		self.currentPlayer = 'O';
		self.clicks = 0;
		self.isDraw(false);
		self.winner('');
	};
}

ko.applyBindings(new TicTacToeViewModel());
