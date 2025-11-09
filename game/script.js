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
        this.moveHistory = []; // 移动历史记录

        // 初始化DOM元素
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameStatusElement = document.getElementById('game-status');
        this.restartButton = document.getElementById('restart-btn');
        this.undoButton = document.getElementById('undo-btn');

        // 绑定事件处理器以便后续移除
        this.handleClickBound = this.handleClick.bind(this);

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
        this.moveHistory = []; // 清空移动历史

        // 更新UI
        this.updateUI();
        this.updateUndoButton();

        // 绘制棋盘
        this.drawBoard();

        // 绑定事件监听器
        this.bindEvents();
    }

    // 绑定事件监听器
    bindEvents() {
        this.canvas.addEventListener('click', this.handleClickBound);
        this.restartButton.addEventListener('click', () => this.init());
        this.undoButton.addEventListener('click', () => this.undoMove());
        this.canvas.style.cursor = 'pointer'; // 启用棋盘点击
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
        // 检查边界
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
            return false;
        }

        // 检查位置是否为空
        if (this.board[row][col] !== null) {
            return false;
        }

        // 检查游戏是否结束
        if (this.gameOver) {
            return false;
        }

        return true;
    }

    // 执行移动
    makeMove(row, col) {
        // 记录移动历史
        this.moveHistory.push({ row, col, player: this.currentPlayer });

        // 放置棋子
        this.board[row][col] = this.currentPlayer;

        // 绘制棋子
        this.drawPiece(row, col, this.currentPlayer);

        // 更新撤销按钮状态
        this.updateUndoButton();

        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            const winner = this.currentPlayer === 'black' ? '黑棋' : '白棋';
            this.gameStatusElement.textContent = `${winner}获胜！`;
            this.gameStatusElement.style.color = '#e74c3c';
            this.disableBoard(); // 游戏结束后禁用棋盘
        } else if (this.isBoardFull()) {
            // 检查平局（棋盘填满）
            this.gameOver = true;
            this.gameStatusElement.textContent = '平局！';
            this.gameStatusElement.style.color = '#f39c12';
            this.disableBoard(); // 游戏结束后禁用棋盘
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
            let winningLine = [{ row, col }]; // 记录获胜连线

            // 正向检查（最多检查4个位置）
            for (let i = 1; i <= 4; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (this.isInBounds(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                    winningLine.push({ row: newRow, col: newCol });
                } else {
                    break;
                }
            }

            // 反向检查（最多检查4个位置）
            for (let i = 1; i <= 4; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (this.isInBounds(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                    winningLine.unshift({ row: newRow, col: newCol });
                } else {
                    break;
                }
            }

            // 如果连续棋子数达到5个或更多，则获胜
            if (count >= 5) {
                this.highlightWinningLine(winningLine);
                return true;
            }
        }

        return false;
    }

    // 高亮显示获胜连线
    highlightWinningLine(winningLine) {
        const { ctx, cellSize } = this;

        // 绘制高亮效果
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);

        // 绘制获胜连线
        if (winningLine.length >= 2) {
            const first = winningLine[0];
            const last = winningLine[winningLine.length - 1];

            const startX = first.col * cellSize + cellSize / 2;
            const startY = first.row * cellSize + cellSize / 2;
            const endX = last.col * cellSize + cellSize / 2;
            const endY = last.row * cellSize + cellSize / 2;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        ctx.setLineDash([]); // 重置虚线样式
    }

    // 检查坐标是否在棋盘范围内
    isInBounds(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }

    // 检查棋盘是否已满（平局检测）
    isBoardFull() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    return false; // 还有空位
                }
            }
        }
        return true; // 棋盘已满
    }

    // 禁用棋盘点击（游戏结束后）
    disableBoard() {
        this.canvas.style.cursor = 'not-allowed';
        // 移除点击事件监听器
        this.canvas.removeEventListener('click', this.handleClickBound);
    }

    // 更新UI
    updateUI() {
        const playerText = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        this.currentPlayerElement.textContent = playerText;
        this.currentPlayerElement.style.color = this.currentPlayer === 'black' ? '#000' : '#666';
    }

    // 更新撤销按钮状态
    updateUndoButton() {
        this.undoButton.disabled = this.moveHistory.length === 0 || this.gameOver;
    }

    // 撤销上一步移动
    undoMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;

        // 获取最后一步移动
        const lastMove = this.moveHistory.pop();

        // 从棋盘上移除棋子
        this.board[lastMove.row][lastMove.col] = null;

        // 恢复当前玩家
        this.currentPlayer = lastMove.player;

        // 重新绘制棋盘和棋子
        this.drawBoard();

        // 更新UI
        this.updateUI();
        this.updateUndoButton();

        // 重置游戏状态（如果之前游戏结束）
        if (this.gameOver) {
            this.gameOver = false;
            this.gameStatusElement.textContent = '游戏进行中';
            this.gameStatusElement.style.color = '#27ae60';
            this.canvas.style.cursor = 'pointer';
            this.canvas.addEventListener('click', this.handleClickBound);
        }
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

        // 播放棋子放置音效（如果支持）
        this.playPlaceSound();
    }

    // 播放棋子放置音效
    playPlaceSound() {
        // 创建简单的音效
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // 频率
            oscillator.type = 'sine'; // 波形

            gainNode.gain.value = 0.1; // 音量
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // 如果音效不可用，静默失败
            console.log('音效不可用');
        }
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