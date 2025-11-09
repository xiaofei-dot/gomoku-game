// 五子棋游戏主逻辑
class GomokuGame {
    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.boardSize = 15; // 15x15的棋盘
        this.cellSize = this.canvas.width / this.boardSize;
        this.board = []; // 棋盘状态数组
        this.currentPlayer = 'black'; // 当前玩家：black或white
        this.gameOver = false;

        // 初始化DOM元素
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameStatusElement = document.getElementById('game-status');
        this.restartButton = document.getElementById('restart-btn');

        this.init();
    }

    // 初始化游戏
    init() {
        // 初始化棋盘状态
        this.board = Array(this.boardSize).fill().map(() =>
            Array(this.boardSize).fill(null)
        );

        this.currentPlayer = 'black';
        this.gameOver = false;

        // 更新UI
        this.updateUI();

        // 绘制棋盘
        this.drawBoard();

        // 绑定事件监听器
        this.bindEvents();
    }

    // 绑定事件监听器
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.restartButton.addEventListener('click', () => this.init());
    }

    // 处理点击事件
    handleClick(event) {
        if (this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 计算点击的棋盘坐标
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        // 检查位置是否有效
        if (this.isValidMove(row, col)) {
            this.makeMove(row, col);
        }
    }

    // 检查移动是否有效
    isValidMove(row, col) {
        return row >= 0 && row < this.boardSize &&
               col >= 0 && col < this.boardSize &&
               this.board[row][col] === null;
    }

    // 执行移动
    makeMove(row, col) {
        // 放置棋子
        this.board[row][col] = this.currentPlayer;

        // 绘制棋子
        this.drawPiece(row, col, this.currentPlayer);

        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            const winner = this.currentPlayer === 'black' ? '黑棋' : '白棋';
            this.gameStatusElement.textContent = `${winner}获胜！`;
            this.gameStatusElement.style.color = '#e74c3c';
        } else {
            // 切换玩家
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
            this.updateUI();
        }
    }

    // 检查获胜条件
    checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线
            [1, -1]   // 反对角线
        ];

        const player = this.board[row][col];

        for (const [dx, dy] of directions) {
            let count = 1; // 当前位置已经有一个棋子

            // 正向检查
            for (let i = 1; i <= 4; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (this.isInBounds(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }

            // 反向检查
            for (let i = 1; i <= 4; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (this.isInBounds(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查坐标是否在棋盘范围内
    isInBounds(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }

    // 更新UI
    updateUI() {
        const playerText = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        this.currentPlayerElement.textContent = playerText;
        this.currentPlayerElement.style.color = this.currentPlayer === 'black' ? '#000' : '#666';
    }

    // 绘制棋盘
    drawBoard() {
        const { ctx, cellSize, boardSize } = this;

        // 清空画布
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制棋盘背景
        ctx.fillStyle = '#deb887';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格线
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 1;

        for (let i = 0; i < boardSize; i++) {
            // 横线
            ctx.beginPath();
            ctx.moveTo(cellSize / 2, i * cellSize + cellSize / 2);
            ctx.lineTo(this.canvas.width - cellSize / 2, i * cellSize + cellSize / 2);
            ctx.stroke();

            // 竖线
            ctx.beginPath();
            ctx.moveTo(i * cellSize + cellSize / 2, cellSize / 2);
            ctx.lineTo(i * cellSize + cellSize / 2, this.canvas.height - cellSize / 2);
            ctx.stroke();
        }

        // 绘制天元和星位
        const starPoints = [3, 7, 11];
        ctx.fillStyle = '#000';

        for (const x of starPoints) {
            for (const y of starPoints) {
                ctx.beginPath();
                ctx.arc(
                    x * cellSize + cellSize / 2,
                    y * cellSize + cellSize / 2,
                    3, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }

        // 重新绘制所有棋子
        this.redrawAllPieces();
    }

    // 绘制棋子
    drawPiece(row, col, player) {
        const { ctx, cellSize } = this;
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        const radius = cellSize * 0.4;

        // 创建棋子渐变效果
        const gradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.1,
            x, y, radius
        );

        if (player === 'black') {
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 添加棋子边框
        ctx.strokeStyle = player === 'black' ? '#333' : '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // 重新绘制所有棋子
    redrawAllPieces() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col]) {
                    this.drawPiece(row, col, this.board[row][col]);
                }
            }
        }
    }
}

// 当页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});