// Territory board. Replace this array with a fetch from the control panel when it goes live.
const FACTIONS = [
  {name:'Prontera', v:'--prt', castles:['Prontera','Prontera','Prontera','Geffen','—']},
  {name:'Morroc',   v:'--moc', castles:['Morroc','Morroc','—','Morroc','Morroc']},
  {name:'Geffen',   v:'--gef', castles:['Geffen','Geffen','Prontera','Geffen','Geffen']},
  {name:'Payon',    v:'--pay', castles:['Payon','Payon','Payon','—','Payon']},
  {name:'Alberta',  v:'--alb', castles:['Alberta','—','Alberta','Alberta','Morroc']},
];
const VAR = {Prontera:'--prt',Morroc:'--moc',Geffen:'--gef',Payon:'--pay',Alberta:'--alb'};

const rows = document.getElementById('rows');
let step = 0;
FACTIONS.forEach(f=>{
  const row = document.createElement('div'); row.className='row';

  const name = document.createElement('div'); name.className='fac';
  name.innerHTML = `<span class="pip" style="background:var(${f.v})"></span>${f.name}`;

  const grid = document.createElement('div'); grid.className='castles';
  let own = 0;
  f.castles.forEach((holder,i)=>{
    const c = document.createElement('div');
    c.className = 'castle';
    c.dataset.n = i+1;
    c.style.animationDelay = (step*45)+'ms';
    step++;
    if(holder !== '—'){
      c.classList.add('held');
      c.style.background = `var(${VAR[holder]})`;
      if(holder === f.name) own++;
      else c.title = `${f.name} castle ${i+1} — held by ${holder}`;
    }else{
      c.classList.add('contested');
      c.title = `${f.name} castle ${i+1} — unclaimed`;
    }
    grid.appendChild(c);
  });

  const tally = document.createElement('div'); tally.className='tally';
  const foreign = f.castles.filter(h=>h!=='—'&&h!==f.name).length;
  tally.innerHTML = `<b>${own}</b>/5 own${foreign?` · <b>${foreign}</b> occupied`:''}`;

  row.append(name, grid, tally);
  rows.appendChild(row);
});
