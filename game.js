const squares = [
	1, 1, 1, 2, 2, 2, 3, 3, 3,
	1, 1, 1, 2, 2, 2, 3, 3, 3,
	1, 1, 1, 2, 2, 2, 3, 3, 3,
	4, 4, 4, 5, 5, 5, 6, 6, 6,
	4, 4, 4, 5, 5, 5, 6, 6, 6,
	4, 4, 4, 5, 5, 5, 6, 6, 6,
	7, 7, 7, 8, 8, 8, 9, 9, 9,
	7, 7, 7, 8, 8, 8, 9, 9, 9,
	7, 7, 7, 8, 8, 8, 9, 9, 9,
];

var canvas = null, ctx = null;
var canvasImages = {};

var lockedNums = [];
var nums = [];
var selectedCell = 40;

var startX = 0;
var startY = 0;
var cellSize = 0;

function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (canvas.width > canvas.height) {
		startX = canvas.width / 2 - canvas.height / 2;
		startY = 0;
		cellSize = canvas.height / 11;
	} else {
		startX = 0;
		startY = canvas.height / 2 - canvas.width / 2;
		cellSize = canvas.width / 11;
	}
        draw();
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#323232";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function canvasClick(event) {
	var mouseX = event.clientX;
	var mouseY = event.clientY;
	if (checkGame() && nextGameUrl != null && mouseX >= startX && mouseX < startX + cellSize * 11 && mouseY >= startY + cellSize * 5 && mouseY < startY + cellSize * 6) {
		window.location.href = nextGameUrl;
	}
	for (var y = 0; y < 9; ++y) {
		var cellOffsetY = 0;
		if (y >= 6) {
			cellOffsetY = 1.0;
		} else if (y >= 3) {
			cellOffsetY = 0.5;
		}
		cellOffsetY += 0.5;
		for (var x = 0; x < 9; ++x) {
			var cellOffsetX = 0;
			if (x >= 6) {
				cellOffsetX = 1.0;
			} else if (x >= 3) {
				cellOffsetX = 0.5;
			}
			cellOffsetX += 0.5;
			var cellStartX = (x + cellOffsetX) * cellSize + startX;
			var cellStartY = (y + cellOffsetY) * cellSize + startY;
			var cellEndX = cellStartX + cellSize;
			var cellEndY = cellStartY + cellSize;
			if (mouseX > cellStartX && mouseX < cellEndX && mouseY > cellStartY && mouseY < cellEndY) {
				cellClick(x + y * 9);
				return;
			}
		}
	}
}

function drawImage(name, x, y, w, h) {
	ctx.drawImage(canvasImages[name], x, y, w, h);
}

function draw() {
	clearCanvas();
	
	for (var y = 0; y < 9; ++y) {
		var cellOffsetY = 0;
		if (y >= 6) {
			cellOffsetY = 1.0;
		} else if (y >= 3) {
			cellOffsetY = 0.5;
		}
		cellOffsetY += 0.5;
		for (var x = 0; x < 9; ++x) {
			var cellOffsetX = 0;
			if (x >= 6) {
				cellOffsetX = 1.0;
			} else if (x >= 3) {
				cellOffsetX = 0.5;
			}
			cellOffsetX += 0.5;
			var cellImage = "cell";
			if (selectedCell == x + y * 9) {
				cellImage = "selected_cell";
			}
			drawImage(cellImage, (x + cellOffsetX) * cellSize + startX, (y + cellOffsetY) * cellSize + startY, cellSize, cellSize);
			var numImage = "num_0";
			if (nums[x + y * 9] > 0) {
				numImage = "num_" + nums[x + y * 9];
			} else if (lockedNums[x + y * 9] > 0) {
				numImage = "locked_num_" + lockedNums[x + y * 9];
			}
			drawImage(numImage, (x + cellOffsetX) * cellSize + startX, (y + cellOffsetY) * cellSize + startY, cellSize, cellSize);
		}
	}
	if (checkGame()) {
		drawImage("solved_text_frame", 1.5 * cellSize + startX, 5 * cellSize + startY, cellSize * 8, cellSize);
		drawImage("solved_text", 1.5 * cellSize + startX, 5 * cellSize + startY, cellSize * 8, cellSize);
	}
}

function cellClick(cell) {
	selectedCell = cell;
	if (!checkGame() && lockedNums[cell] == 0) {
		nums[cell] = (nums[cell] + 1) % 10;
	}
	draw();
}

function checkGame() {
	var tempNumbers = [];
	for (var i = 0; i < 81; ++i) {
		if (lockedNums[i] > 0) {
			tempNumbers.push(lockedNums[i]);
		} else {
			tempNumbers.push(nums[i]);
		}
	}
	
	var solvedCount = 0;
	for (var y = 0; y < 9; ++y) {
		for (var num = 1; num < 10; ++num) {
			for (var x = 0; x < 9; ++x) {
				if (tempNumbers[x + y * 9] == num) {
					++solvedCount;
					break;
				}
			}
		}
	}
	if (solvedCount < 81) {
		return false;
	}
	
	solvedCount = 0;
	for (var x = 0; x < 9; ++x) {
		for (var num = 1; num < 10; ++num) {
			for (var y = 0; y < 9; ++y) {
				if (tempNumbers[x + y * 9] == num) {
					++solvedCount;
					break;
				}
			}
		}
	}
	if (solvedCount < 81) {
		return false;
	}
	
	solvedCount = 0;
	for (var square = 1; square < 10; ++square) {
		for (var num = 1; num < 10; ++num) {
			for (var i = 0; i < 81; ++i) {
				if (squares[i] == square && tempNumbers[i] == num) {
					++solvedCount;
					break;
				}
			}
		}
	}
	if (solvedCount < 81) {
		return false;
	}
	
	return true;
}

function init() {
	canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	for (var i = 0; i < 81; ++i) {
		lockedNums.push(gameRaw[i]);
		nums.push(0);
	}
	if (canvas.getContext('2d')) {
		ctx = canvas.getContext('2d');
		
		var lastName = "";
		for (var name in images) {
			canvasImages[name] = new Image();
			canvasImages[name].src = images[name];
			lastName = name;
		}
		canvasImages[lastName].onload = resizeCanvas;
		window.addEventListener('resize', resizeCanvas, false);
	} else {
		alert("Canvas not supported!");
	}
}

window.addEventListener("keydown", function (event) {
	if (event.defaultPrevented) {
		return;
	}
	if ("ArrowLeft" === event.key) {
		if (selectedCell % 9 == 0) {
			selectedCell += 8;
		} else {
			selectedCell -= 1;
		}
		draw();
	} else if ("ArrowRight" === event.key) {
		if (selectedCell % 9 == 8) {
			selectedCell -= 8;
		} else {
			selectedCell += 1;
		}
		draw();
	}
	if ("ArrowUp" === event.key) {
		if (Math.floor(selectedCell / 9) == 0) {
			selectedCell += 72;
		} else {
			selectedCell -= 9;
		}
		draw();
	} else if ("ArrowDown" === event.key) {
		if (Math.floor(selectedCell / 9) == 8) {
			selectedCell -= 72;
		} else {
			selectedCell += 9;
		}
		draw();
	} else if ("Enter" === event.key) {
		if (checkGame() && nextGameUrl != null) {
			window.location.href = nextGameUrl;
		} else {
			cellClick(selectedCell);
		}
	}
}, true);

