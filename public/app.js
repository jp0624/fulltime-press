const stories = [
  ['above-the-rim', 'Basketball', 'Above the rim', 'hero', 'A player reaching for a dunk', 'The split second between takeoff and touchdown, and everything it takes to get there.', [
    'A dunk begins low to the floor. The penultimate step is often the longest one, giving the player room to lower their hips while carrying speed into the plant. By the time the crowd looks up, most of the decision has been made.',
    'A defender can change the whole picture by taking half a step toward the restricted area. Now the ball has to move to the outside hand, or the player has to pass before the window closes. The leap is spectacular precisely because the choices that set it up are easy to miss.',
    'Watch a replay from the baseline, then watch the same play from the sideline. One angle shows the space over the rim. The other shows who cleared the lane, when the help arrived, and how little room the player actually needed.'
  ]],
  ['edges-of-the-game', 'Hockey', 'Edges of the game', 'hockey', 'A hockey skater cutting through ice spray', 'What a good skater can do with a few inches of steel.', [
    'A defender in a tight corner can widen their stance and use an inside edge to push away from pressure. A forward coming down the wall can use the outside edge to stay balanced while cutting toward the middle. Neither change takes much space.',
    'Watch the blades when a skater stops to receive a pass. A small turn of the feet can open the hips and leave the player facing up ice, ready to play the puck before the forecheck arrives.',
    'One giveaway is where the spray lands. The loud stop throws ice toward the boards. In the quieter cut, the skater keeps enough speed to make the next play.'
  ]],
  ['around-the-wall', 'Soccer', 'Around the wall', 'soccer', 'A footballer striking the ball under floodlights', 'How a free-kick taker finds a gap that barely exists.', [
    'The wall covers one side of the goal. The goalkeeper takes responsibility for the other, then tries to see the ball through a group of bodies. That leaves the taker with a choice between height, bend, and a strike through an opening.',
    'An angled run-up can give the kicking foot room to brush across the ball. A little more height clears the jumping wall. A little too much gives the keeper time or sends it over the bar.',
    'Set pieces make for good replays because the starting positions are clear. Pause just before the strike and look at the goalkeeper’s first step. It can tell you how far the shot traveled before anyone knew which way it was going.'
  ]],
  ['the-wet-line', 'Motorsport', 'The wet line', 'motorsport', 'An orange race car cutting through spray on a wet track', 'When rain arrives, the quickest route around a corner can move.', [
    'On a dry track, the usual racing line gets covered with rubber. Once it rains, that strip can become slick enough to send drivers looking for grip a lane wider.',
    'The useful patches can change lap by lap. Puddles form in depressions, spray hides braking references, and a drying line eventually rewards drivers who can keep a tyre on it without overheating the tread.',
    'Compare two laps from the same onboard camera. Pay attention to where the driver first turns the wheel and how long they wait before adding throttle. Those choices reveal where the car is finding grip.'
  ]],
  ['space-between', 'Basketball', 'The space between', 'court', 'A basketball guard protecting the ball on an outdoor court', 'A guard only needs half a step to change a possession.', [
    'Start with the defender’s lead foot. When it points toward the sideline, the middle may be open for a moment. A hesitation dribble can make that foot turn. A quick crossover can take advantage before it settles.',
    'The screener plays a part even without setting a hard pick. Just stepping toward the defender forces a choice about which side to cover. The ball handler reads that choice as the rest of the floor moves.',
    'The best place to watch may be in the weak-side corner. From there you can see the help defender decide whether to guard the paint or stay with the shooter, often before the guard has reached the lane.'
  ]],
  ['four-shots', 'Tennis', 'The first four shots', 'tennis', 'A tennis player serving on a clay court', 'The opening exchange often decides who controls a point.', [
    'A serve out wide pulls the returner away from the centre. The server then has a choice between hitting into the open court and going back behind a player who has already started recovering.',
    'On clay a returner standing deep can buy a little more time. A high, deep return down the middle takes away some sharp angles and gives them a chance to recover.',
    'Count the serve as one and the return as two. By four, notice where each player is standing. You can often tell who dictated the exchange before a winner or error settles it.'
  ]],
  ['window-downfield', 'Football', 'A window downfield', 'football', 'A football receiver going up for a catch', 'A deep completion depends on two players agreeing on empty space.', [
    'On a deep route, the quarterback may release the ball before the receiver has turned to look. They’re aiming for a spot the receiver can reach ahead of the defender.',
    'A receiver can sell the inside route for a step, then bring the defender’s hips across before breaking outside. The change only creates a small gap, but it gives the passer room to put the ball where the sideline protects it.',
    'Watch the receiver’s feet at the top of the route. Then look back at the pocket. A good throw often begins just as the receiver makes the move that opens the window.'
  ]]
].map(([id, sport, title, image, alt, dek, body]) => ({id, sport, title, image, alt, dek, body}));

const filters = document.querySelector('#filters');
const grid = document.querySelector('#story-grid');
const results = document.querySelector('#results-count');
const reader = document.querySelector('#reader');
const article = document.querySelector('#article');
const closeReader = document.querySelector('#close-reader');
let returnHash = '';
let trigger;

const categories = ['All', ...new Set(stories.map(story => story.sport))];
for (const sport of categories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.filter = sport;
  button.textContent = sport === 'All' ? 'All stories' : sport;
  filters.append(button);
}

function renderGrid(sport) {
  const matches = stories.filter(story => sport === 'All' ? story.id !== 'above-the-rim' : story.sport === sport);
  for (const button of filters.children) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === sport));
  }
  grid.innerHTML = matches.map(story => `
    <a class="card" href="#story/${story.id}" data-story="${story.id}">
      <div class="card-photo"><img src="/images/${story.image}.webp" alt="" loading="lazy"></div>
      <div class="card-info">
        <p class="card-meta">${story.sport}</p>
        <h3>${story.title}</h3>
        <p class="card-dek">${story.dek}</p>
      </div>
    </a>
  `).join('');
  results.textContent = `${matches.length} ${matches.length === 1 ? 'story' : 'stories'} shown`;
}

function syncReader() {
  const id = location.hash.startsWith('#story/') ? location.hash.slice(7) : '';
  const story = stories.find(item => item.id === id);
  if (!story) {
    if (reader.open) reader.close();
    return;
  }

  article.innerHTML = `
    <img src="/images/${story.image}.webp" alt="${story.alt}">
    <div class="article-copy">
      <p class="card-meta">${story.sport}</p>
      <h2 id="article-title">${story.title}</h2>
      <p class="article-dek">${story.dek}</p>
      ${story.body.map(paragraph => `<p>${paragraph}</p>`).join('')}
    </div>
  `;
  if (!reader.open) reader.showModal();
  reader.scrollTop = 0;
  closeReader.focus();
}

document.addEventListener('click', event => {
  const filter = event.target.closest('[data-filter]');
  if (filter) renderGrid(filter.dataset.filter);

  const link = event.target.closest('[data-story]');
  if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    returnHash = location.hash;
    trigger = link;
  }
});

closeReader.addEventListener('click', () => reader.close());
reader.addEventListener('close', () => {
  if (location.hash.startsWith('#story/')) {
    history.replaceState(null, '', returnHash || location.pathname + location.search);
  }
  trigger?.focus({preventScroll: true});
  trigger = undefined;
  returnHash = '';
});
window.addEventListener('hashchange', syncReader);
renderGrid('All');
syncReader();
