// Actualités affichées sur l'accueil et détaillées dans la page /news/:id
// Les images sont des liens NASA (rien n'est stocké dans le projet).
// Les liens `source` viennent des fichiers apollo_1.txt, apollo_13.txt et mir_fire.txt.

export const news = [
  {
    id: 'apollo-1',
    title: 'The Apollo 1 Fire',
    headline: 'Apollo 1: the launch-pad fire that reshaped spacecraft safety',
    category: 'SPACECRAFT FIRE SAFETY',
    date: 'January 27, 1967',
    description:
      'A cabin fire during a launch-pad test took the lives of three astronauts and changed how NASA designs, tests and manages crewed spacecraft.',
    image: 'https://www.nasa.gov/wp-content/uploads/2019/02/apollo_1_-_resize.jpg',
    imageCaption: 'Apollo 1 fire. Image credit: NASA.',
    summary: [
      'On January 27, 1967, astronauts Virgil "Gus" Grissom, Ed White and Roger Chaffee were inside their Apollo command module on the launch pad at Kennedy Space Center. They were taking part in a "plugs-out" test, a rehearsal of the countdown in which the spacecraft runs on its own power.',
      'At 6:31 p.m. Eastern, a fire started in the cabin. The capsule ruptured within about 15 seconds. It took the ground crew roughly five minutes to get through the three hatches, and all three astronauts died.',
      'The review board could not identify with certainty what started the fire, but it pointed to a combination of conditions: a sealed cabin filled with pure oxygen, a large amount of combustible material inside, vulnerable wiring carrying spacecraft power, plumbing that carried a combustible and corrosive coolant, and inadequate provisions for escape and rescue.',
      'The Apollo program did not fly again for 21 months, even though the goal of landing on the Moon before the end of the decade was close. During that time the spacecraft was redesigned and the way NASA managed the program was reviewed.',
    ],
    facts: [
      { label: 'Date', value: 'January 27, 1967' },
      { label: 'Place', value: 'Launch pad, Kennedy Space Center' },
      { label: 'Crew', value: 'Grissom, White, Chaffee' },
      { label: 'Program pause', value: '21 months' },
    ],
    lessonsTitle: 'Changes made after the fire',
    lessons: [
      'Metal covers were fitted over wiring and plumbing, and a removable hard floor was added.',
      'The oxygen pressure and concentration used on the ground were reduced.',
      'Around a thousand changes were made to the spacecraft before the next crewed flight.',
      'George Low replaced Joe Shea as Apollo program manager and ran a change control board to decide on every proposed modification.',
      'Management walk-through inspections became mandatory before the spacecraft was closed out for flight.',
      'Quality assurance and safety teams at the Johnson Space Center began reporting directly to the center director.',
    ],
    relevance:
      'The Apollo 1 fire is a founding case for spacecraft fire safety. Questions about which materials burn, how fast flames spread and how the atmosphere changes the risk are exactly what today\'s microgravity combustion investigations, such as SoFIE, FLARE and BASS, continue to study.',
    askQuestion: 'What did NASA learn from the Apollo 1 fire about spacecraft fire safety?',
    source: 'https://sma.nasa.gov/sma-disciplines/accllp/apollo-1',
  },

  {
    id: 'apollo-13',
    title: 'Apollo 13 Crisis',
    headline: 'Apollo 13: an oxygen tank failure and a safe return to Earth',
    category: 'MISSION SAFETY',
    date: 'April 11–17, 1970',
    description:
      'An oxygen tank failure turned NASA\'s third lunar landing mission into a rescue, and left lessons that are still shared with industry today.',
    image: 'https://www.nasa.gov/wp-content/uploads/2020/04/apollo_13_liftoff_square.jpg',
    imageCaption: 'Liftoff of Apollo 13 from Launch Pad 39A on April 11, 1970. Image credit: NASA.',
    summary: [
      'Apollo 13 lifted off from Launch Pad 39A at Kennedy Space Center on April 11, 1970, carrying James Lovell, Jack Swigert and Fred Haise on what was meant to be NASA\'s third lunar landing.',
      'The accident came from an apparent explosion of oxygen tank No. 2 in the service module. Before launch, a countdown test had left the team unable to empty the tank, and engineers used its heaters to boil the oxygen off. The tank\'s temperature gauge could not read above 80°F, so nobody could see that the temperature inside had climbed far higher, reportedly to around 1,000°F, damaging the insulation on the wiring.',
      'During the flight, the crew switched on the tank fans. A brief loss of telemetry was followed by a low-voltage alert and a loud bang. Two fuel cells were lost and oxygen began to run out, so the crew moved into the lunar module and used it as a lifeboat.',
      'Mission Control chose a free-return trajectory around the Moon. The crew and the ground teams carefully rationed water, battery power and oxygen, and used lithium hydroxide canisters to remove carbon dioxide. The service module was jettisoned about 138 hours into the flight, and the command module splashed down in the Pacific Ocean on April 17, 1970, after 5 days, 22 hours and 54 minutes.',
    ],
    facts: [
      { label: 'Mission', value: 'April 11–17, 1970' },
      { label: 'Crew', value: 'Lovell, Swigert, Haise' },
      { label: 'Flight time', value: '5 days 22 h 54 min' },
      { label: 'Outcome', value: 'Crew recovered safely' },
    ],
    lessonsTitle: 'Investigation and lessons learned',
    lessons: [
      'Corrective actions were carried out over the following nine months to prevent a similar failure on later Apollo flights.',
      'The investigation reconstructed the sequence of events and errors that led to the tank failure, from pre-launch handling to the in-flight fault.',
      'Using the lunar module as a lifeboat and managing consumables showed the value of improvising with the resources available.',
      'NASA\'s Apollo Challenger Columbia Lessons Learned Program now shares the lessons of Apollo 13 with agencies, companies and universities.',
    ],
    relevance:
      'Apollo 13 shows how a failure in an oxygen-rich system, where heat damaged wire insulation, can threaten a whole mission. Understanding how materials and equipment behave in oxygen-rich, reduced-gravity environments is a central goal of NASA\'s combustion and flammability research.',
    askQuestion: 'What caused the Apollo 13 accident and what lessons did NASA learn?',
    source: 'https://sma.nasa.gov/sma-disciplines/accllp/apollo-13',
  },

  {
    id: 'mir-fire',
    title: 'Fire Aboard Mir',
    headline: 'Fire aboard Mir: when an oxygen generator caught fire in orbit',
    category: 'SPACE STATION SAFETY',
    date: 'February 24, 1997',
    description:
      'A burning oxygen canister filled the Russian space station Mir with smoke and flame, and shaped the oxygen systems used on the International Space Station.',
    image:
      'https://www.nasa.gov/wp-content/uploads/2022/02/mir_fire_1_from_sts_81_jan_1997_sts081-328-013.jpg',
    imageCaption: 'Mir seen from the departing space shuttle Atlantis during STS-81, January 1997. Image credit: NASA.',
    summary: [
      'On February 24, 1997, six people were aboard the Russian space station Mir during a crew handover: cosmonauts Valeri Korzun, Aleksandr Kaleri, Vasili Tsibliyev and Aleksandr Lazutkin, NASA astronaut Jerry Linenger, and German astronaut Reinhold Ewald, who was visiting for a short mission.',
      'Shortly after dinner, Lazutkin activated a solid-fuel oxygen generator in the Kvant-1 module. The canister ignited and produced a flame, sparks, molten metal and dense smoke. The flame blocked the way to the Soyuz escape vehicle docked at Kvant-1.',
      'The crew put on oxygen masks. Korzun fought the flame with fire extinguishers while Linenger held him in place and the others passed him more extinguishers. The flame eventually went out on its own. Some panels in Kvant-1 were charred, but the station\'s structure was not significantly damaged, and the life support system cleared the smoke over several hours.',
      'The damaged generator was brought back on a later shuttle mission. After two years of study, investigators concluded that hydrocarbons in the canister raised the risk of failure, and that the most likely source was latex from a work glove that had accidentally got inside. These generators had been used more than 2,500 times on Mir before the fire.',
    ],
    facts: [
      { label: 'Date', value: 'February 24, 1997' },
      { label: 'Place', value: 'Kvant-1 module, Mir' },
      { label: 'People aboard', value: 'Six' },
      { label: 'Likely cause', value: 'Contaminated oxygen canister' },
    ],
    lessonsTitle: 'What changed afterwards',
    lessons: [
      'Russian officials changed how crews train for emergencies and how ground controllers support them during one.',
      'The way oxygen generator canisters are prepared on the ground was changed.',
      'The International Space Station relies on several redundant oxygen systems: three Elektron units in the Russian segment and the Oxygen Generation System in the U.S. segment.',
      'A solid-fuel oxygen generator remains available as a backup or for larger crews, with added safety measures.',
    ],
    relevance:
      'A flame in a closed, weightless habitat behaves differently from a fire on Earth, and the crew had very little room for error. Investigations such as SoFIE, FLARE and SAFFIRE study exactly how flames start, spread and go out in microgravity to make future spacecraft safer.',
    askQuestion: 'What happened during the fire aboard the Mir space station in 1997?',
    source: 'https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/',
  },
]

export const getNews = (id) => news.find((item) => item.id === id)