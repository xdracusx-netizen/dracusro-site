/* Territory board.
   PRE-LAUNCH STATE: no castle has an owner yet. Every castle is unclaimed and
   MVP-guarded until the first siege window opens.

   When the season starts, replace CASTLES below with a fetch against the control
   panel. Expected shape per faction: { name, v, castles: [ownerName|null x5] }
   where ownerName is one of the five faction names, or null for unclaimed. */

const FACTIONS = [
  { name: 'Prontera', v: '--prt', seat: 'Aldebaran' },
  { name: 'Morroc',   v: '--moc', seat: 'Comodo' },
  { name: 'Geffen',   v: '--gef', seat: 'Juno' },
  { name: 'Payon',    v: '--pay', seat: 'Amatsu' },
  { name: 'Alberta',  v: '--alb', seat: 'The islands' },
];

// null = unclaimed. Season 1 has not started, so every castle is null.
const OWNERSHIP = Object.fromEntries(FACTIONS.map(f => [f.name, [null,null,null,null,null]]));

const VAR = Object.fromEntries(FACTIONS.map(f => [f.name, f.v]));
const rows = document.getElementById('rows');

if (rows) {
  let step = 0;
  FACTIONS.forEach(f => {
    const row = document.createElement('div');
    row.className = 'row';

    const name = document.createElement('div');
    name.className = 'fac';
    name.innerHTML = `<span class="pip" style="background:var(${f.v})"></span>${f.name}`;

    const grid = document.createElement('div');
    grid.className = 'castles';
    let held = 0;

    OWNERSHIP[f.name].forEach((owner, i) => {
      const c = document.createElement('div');
      c.className = 'castle';
      c.dataset.n = i + 1;
      c.style.animationDelay = (step * 40) + 'ms';
      step++;
      const where = i < 3 ? f.name : f.seat;
      if (owner) {
        c.classList.add('held');
        c.style.background = `var(${VAR[owner]})`;
        c.title = `${where} castle ${i + 1} — held by ${owner}`;
        if (owner === f.name) held++;
      } else {
        c.classList.add('unclaimed');
        c.title = `${where} castle ${i + 1} — unclaimed, MVP-guarded`;
      }
      grid.appendChild(c);
    });

    const tally = document.createElement('div');
    tally.className = 'tally';
    tally.innerHTML = held ? `<b>${held}</b>/5 held` : 'unclaimed';

    row.append(name, grid, tally);
    rows.appendChild(row);
  });
}
