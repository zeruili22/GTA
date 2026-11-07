const byId = id => document.getElementById(id);
const steps = Array.from({length: 8}, (_, i) => i + 1);
const padded = number => String(number).padStart(2, '0');
let step = 1;
let timer = null;

function showStep(value) {
  step = value;
  byId('episode-map').src = `assets/episode-${step}.webp`;
  byId('episode-map').alt = `Metric reconstruction at step ${step}`;
  byId('episode-views').src = `assets/views-${step}.webp`;
  byId('episode-views').alt = `Four egocentric views available at step ${step}`;
  byId('step-code').textContent = `${padded(step)} / 08`;
  byId('prev').disabled = step === 1;
  byId('next').disabled = step === steps.length;
  document.querySelectorAll('.timeline button').forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index + 1 === step));
  });
}

function pause() {
  clearInterval(timer);
  timer = null;
  byId('play').textContent = '▶  Play sequence';
}

function chooseStep(number) {
  pause();
  showStep(number);
}

const timeline = document.querySelector('.timeline');
for (const number of steps) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = padded(number);
  button.setAttribute('aria-label', `Show step ${number}`);
  button.addEventListener('click', () => chooseStep(number));
  timeline.append(button);
}
showStep(1);
byId('prev').addEventListener('click', () => chooseStep(step - 1));
byId('next').addEventListener('click', () => chooseStep(step + 1));
byId('play').addEventListener('click', () => {
  if (timer !== null) { pause(); return; }
  if (step === steps.length) showStep(1);
  byId('play').textContent = 'Ⅱ  Pause sequence';
  timer = setInterval(() => {
    showStep(step + 1);
    if (step === steps.length) pause();
  }, 1400);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

const robots = {
  wheeled: {name: 'Wheeled robot', sr: '40.0%', ne: '3.66 m', instruction: 'Go straight and walk through the bins on your both sides, turn left and stop in front of the Cardboard Mannequin.'},
  'wheeled-hydrant': {name: 'Wheeled robot', sr: '40.0%', ne: '3.66 m', instruction: 'Leave the corner and turn left, then stop in front of the hydrant.'},
  quadruped: {name: 'Quadruped', sr: '40.0%', ne: '3.59 m', instruction: 'Go straight into the room, and then turn left, stop at the red ladder.'},
  drone: {name: 'Drone', sr: '42.0%', ne: '3.50 m', instruction: 'Move to the front of the small colorful Chinese feather shuttlecock and stop.'}
};

function showTrial(trial) {
  const robot = robots[trial];
  const isWheeled = trial.startsWith('wheeled');
  byId('robot-instruction').textContent = `“${robot.instruction}”`;
  byId('robot-sr').textContent = robot.sr;
  byId('robot-ne').textContent = robot.ne;
  byId('trial-picker').hidden = !isWheeled;
  document.querySelectorAll('[data-robot]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.robot === (isWheeled ? 'wheeled' : trial)));
  });
  document.querySelectorAll('[data-trial]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.trial === trial));
  });
  [...byId('robot-frames').children].forEach((image, index) => {
    image.src = `assets/${trial}-${index + 1}.webp`;
    image.alt = `${robot.name} trial, frame ${index + 1} of 4`;
  });
}
document.querySelectorAll('[data-robot], [data-trial]').forEach(button => {
  button.addEventListener('click', () => showTrial(button.dataset.robot || button.dataset.trial));
});

const scores = {
  bench: {
    caption: 'GTA on val-unseen',
    headers: ['Evaluation set', 'Episodes', 'SR ↑', 'SPL ↑', 'nDTW ↑'],
    rows: [['R2R-CE · full','1,839','48.8','41.8','60.4'],['RxR-CE · English subset','260','46.2','39.3','57.4']],
    note: 'SR is success rate. SPL weights success by path length. nDTW measures how closely the trajectory follows the reference path.'
  },
  shared: {
    caption: 'Additional comparisons · SR / SPL',
    headers: ['Evaluation set','Baseline','Baseline SR / SPL','GTA SR / SPL'],
    rows: [['R2R-CE · Open-Nav 100','STRIDER','35.0 / 30.3','47.0 / 38.8'],['R2R-CE · same 100','STRIDER with GPT-5.1','40.0 / 36.5','47.0 / 38.8'],['R2R-CE · full 1,839','BZS-VLN','41.0 / 25.4','48.8 / 41.8'],['RxR-CE · 300 English episodes','BZS-VLN','35.7 / 21.7','46.0 / 37.9']],
    note: 'The RxR-CE comparison uses an additional 300-episode sample. The baseline episode IDs were unavailable, so the two RxR-CE samples can differ.'
  },
  ablation: {
    caption: 'Counterfactual branch reasoning · Open-Nav 100',
    headers: ['Incremental variant','SR ↑','SPL ↑','nDTW ↑'],
    rows: [['Greedy, no backtracking','31.0','27.1','34.7'],['+ Loop-triggered backtracking','37.0','31.8','45.6'],['+ Checkpoints and blocked directions','39.0','35.3','49.3'],['+ Expectation checks (full GTA)','47.0','38.8','53.6']],
    note: 'Each row adds one mechanism to the previous row. All variants use the same 100 R2R-CE episodes.'
  }
};

function showScores(name) {
  const data = scores[name];
  const table = byId('result-table');
  table.caption.textContent = data.caption;
  table.tHead.replaceChildren();
  const head = table.tHead.insertRow();
  for (const label of data.headers) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    head.append(cell);
  }
  table.tBodies[0].replaceChildren();
  for (const row of data.rows) {
    const tr = table.tBodies[0].insertRow();
    row.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      if (index === 0) cell.scope = 'row';
      cell.textContent = value;
      tr.append(cell);
    });
  }
  byId('result-note').textContent = data.note;
  document.querySelectorAll('[data-result]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.result === name));
  });
}
document.querySelectorAll('[data-result]').forEach(button => {
  button.addEventListener('click', () => showScores(button.dataset.result));
});

const dialog = byId('figure-dialog');
document.querySelectorAll('[data-figure]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || !dialog.showModal) return;
    event.preventDefault();
    byId('figure-title').textContent = link.dataset.figure;
    byId('figure-image').src = link.href;
    byId('figure-image').alt = link.dataset.figure;
    dialog.showModal();
  });
});
byId('close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

byId('copy').addEventListener('click', async () => {
  let copied = false;
  try {
    await navigator.clipboard.writeText(byId('bibtex').textContent);
    copied = true;
  } catch {
    const range = document.createRange();
    range.selectNodeContents(byId('bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copied = document.execCommand('copy');
  }
  byId('copy').textContent = copied ? 'Copied ✓' : 'Citation selected';
  setTimeout(() => { byId('copy').textContent = 'Copy citation'; }, 1800);
});
const menuLinks = [...document.querySelectorAll('.nav-wrap nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        menuLinks.forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));
      }
    }
  }, {rootMargin: '-15% 0px -65% 0px'});
  for (const link of menuLinks) observer.observe(document.querySelector(link.hash));
  observer.observe(document.querySelector('.hero'));
}
