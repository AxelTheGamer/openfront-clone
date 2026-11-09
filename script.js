document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((faq) => faq.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navActions = document.querySelector('.nav-actions');

  if (menuToggle && nav && navActions) {
    menuToggle.addEventListener('click', () => {
      const isVisible = nav.classList.contains('open');
      nav.classList.toggle('open', !isVisible);
      navActions.classList.toggle('open', !isVisible);

      nav.style.display = nav.classList.contains('open') ? 'flex' : 'none';
      navActions.style.display = nav.classList.contains('open') ? 'flex' : 'none';

      nav.style.position = 'absolute';
      nav.style.top = '82px';
      nav.style.left = '50%';
      nav.style.transform = 'translateX(-50%)';
      nav.style.flexDirection = 'column';
      nav.style.background = 'rgba(8, 18, 16, 0.98)';
      nav.style.border = '1px solid rgba(142, 255, 212, 0.15)';
      nav.style.padding = '16px';
      nav.style.borderRadius = '18px';
      nav.style.minWidth = '220px';

      navActions.style.position = 'absolute';
      navActions.style.top = 'calc(82px + 210px)';
      navActions.style.left = '50%';
      navActions.style.transform = 'translateX(-50%)';
      navActions.style.flexDirection = 'column';
      navActions.style.width = '220px';
    });
  }

  const gameShell = document.getElementById('gameShell');
  const closeGameBtn = document.querySelector('.close-game');
  const matchProgress = document.getElementById('match-progress');
  const queuePill = document.getElementById('queue-pill');
  const queueMessage = document.getElementById('queue-message');

  function openGame() {
    gameShell.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const steps = [
      { text: 'Searching region...', width: '18%' },
      { text: 'Found nearby enemy force...', width: '38%' },
      { text: 'Deploying forward command...', width: '62%' },
      { text: 'Battle ready...', width: '100%' }
    ];

    let idx = 0;
    const animation = setInterval(() => {
      const step = steps[idx];
      if (!step) {
        clearInterval(animation);
        queuePill.textContent = 'Live';
        queueMessage.textContent = 'Battle live — front line stable';
        return;
      }

      queuePill.textContent = step.text.includes('Battle ready') ? 'Ready' : 'Searching';
      matchProgress.style.width = step.width;
      queueMessage.textContent = step.text;
      idx++;
    }, 500);
  }

  function closeGame() {
    gameShell.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function bindAction(button, action) {
    if (!button) return;

    button.addEventListener('click', () => {
      if (action === 'start-match' || action === 'play-now') openGame();
      if (action === 'read-guide') document.getElementById('guides').scrollIntoView({ behavior: 'smooth' });
      if (action === 'view-rules') document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
      if (action === 'login') alert('Logged in as Commander Vanguard');
    });
  }

  document.querySelectorAll('[data-action]').forEach((button) => {
    bindAction(button, button.dataset.action);
  });

  closeGameBtn.addEventListener('click', closeGame);

  const board = document.getElementById('gameBoard');
  const resourceCount = document.getElementById('resourceCount');
  const unitCount = document.getElementById('unitCount');
  const turnCount = document.getElementById('turnCount');

  const state = {
    grid: Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 'neutral')),
    turn: 1,
    resources: 1800,
    units: 6,
    selected: null,
    mode: 'attack'
  };

  function numberFormat(value) {
    return new Intl.NumberFormat().format(value);
  }

  function initializeBoard() {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell neutral';
        cell.dataset.row = row;
        cell.dataset.col = col;

        if ((row === 2 && col === 2) || (row === 1 && col === 3) || (row === 3 && col === 1)) {
          cell.classList.add('player');
        }

        if ((row === 4 && col === 4) || (row === 1 && col === 5) || (row === 3 && col === 5)) {
          cell.classList.add('enemy');
        }

        cell.addEventListener('click', () => handleCellClick(row, col));
        board.appendChild(cell);
      }
    }
  }

  function updateHud() {
    resourceCount.textContent = state.resources;
    unitCount.textContent = state.units;
    turnCount.textContent = state.turn;
    document.getElementById('resources-stat').textContent = numberFormat(state.resources);
    document.getElementById('troops-stat').textContent = numberFormat(state.units * 130);
    document.getElementById('territory-stat').textContent = `${Math.min(100, Math.round((countPlayerCells() / 36) * 100))}%`;
  }

  function countPlayerCells() {
    let count = 0;
    for (const cell of board.children) {
      if (cell.classList.contains('player')) count++;
    }
    return count;
  }

  function selectCell(row, col) {
    const cell = board.children[row * 6 + col];
    if (!cell) return;

    if (cell.classList.contains('player') || cell.classList.contains('enemy')) {
      state.selected = { row, col };
      document.querySelectorAll('.cell').forEach((c) => c.classList.remove('selected'));
      cell.classList.add('selected');
    }
  }

  function handleCellClick(row, col) {
    const cell = board.children[row * 6 + col];
    if (!cell) return;

    if (cell.classList.contains('enemy')) {
      const enemyResult = Math.random() > 0.45;
      if (enemyResult) {
        cell.classList.remove('enemy');
        cell.classList.add('player');
        state.resources += 120;
        state.units += 1;
      } else {
        state.resources -= 50;
        state.units = Math.max(0, state.units - 1);
      }
      state.turn += 1;
      updateHud();
      return;
    }

    if (cell.classList.contains('player')) {
      selectCell(row, col);
      return;
    }

    selectCell(row, col);
  }

  function recruitUnits() {
    if (state.resources < 250) {
      alert('Not enough resources to recruit.');
      return;
    }

    state.resources -= 250;
    state.units += 2;
    state.turn += 1;
    updateHud();
  }

  function attackEnemy() {
    const enemyCells = [...board.children].filter((cell) => cell.classList.contains('enemy'));
    if (enemyCells.length === 0) {
      alert('Enemy positions eliminated. You control the frontier.');
      return;
    }

    const target = enemyCells[Math.floor(Math.random() * enemyCells.length)];
    target.classList.remove('enemy');
    target.classList.add('player');
    state.resources += 180;
    state.units = Math.max(0, state.units - 1);
    state.turn += 1;
    updateHud();
  }

  document.getElementById('recruitBtn').addEventListener('click', recruitUnits);
  document.getElementById('attackBtn').addEventListener('click', attackEnemy);
  document.getElementById('endTurnBtn').addEventListener('click', () => {
    state.turn += 1;
    updateHud();
  });

  initializeBoard();
  updateHud();
});
