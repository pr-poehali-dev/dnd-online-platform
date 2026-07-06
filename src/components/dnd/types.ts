export interface Stats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Character {
  id: number;
  name: string;
  race: string;
  cls: string;
  lvl: number;
  hp: number;
  maxHp: number;
  avatar: string;
  backstory: string;
  stats: Stats;
}

export const RACES = ['Эльф', 'Дворф', 'Человек', 'Тифлинг', 'Полурослик', 'Драконорождённый'];
export const CLASSES = ['Воин', 'Следопыт', 'Чародей', 'Паладин', 'Плут', 'Жрец', 'Волшебник', 'Варвар'];

export const AVATAR_POOL = [
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/31d6a2ef-3f02-4589-b883-c62ad3dad838.jpg',
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/e60bb910-970b-445f-9f15-113b03b995fe.jpg',
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/b49a7bb7-4115-470c-898a-3d9bdf69ad8a.jpg',
];

export const MAP_POOL = [
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/46718763-04bb-494a-925d-12cc6fcbeed6.jpg',
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/0441835d-79d7-47b5-90e7-563fe1d8c37a.jpg',
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/c96b7e5c-0917-43de-9449-906edfa8e84a.jpg',
];

const BACKSTORY_TEMPLATES = [
  (n: string, r: string, c: string) =>
    `${n} родом из земель, забытых картографами. Выбрав путь ${c.toLowerCase()}а, ${r.toLowerCase()} покинул(а) родной дом после того, как древнее пророчество назвало имя героя, способного остановить надвигающуюся тьму.`,
  (n: string, r: string, c: string) =>
    `Немногие знают, что ${n} когда-то был(а) простым торговцем, пока встреча с странствующим магом не пробудила в ${r.toLowerCase()}е скрытый дар ${c.toLowerCase()}а. Теперь ${n} ищет способ отплатить старый долг.`,
  (n: string, r: string, c: string) =>
    `${n} — последний(яя) из своего рода. После падения родного города ${r.toLowerCase()} поклялся(лась) отомстить и стал(а) ${c.toLowerCase()}ом, чьё имя нагоняет страх на врагов и надежду на союзников.`,
];

export function generateBackstory(name: string, race: string, cls: string): string {
  const tpl = BACKSTORY_TEMPLATES[Math.floor(Math.random() * BACKSTORY_TEMPLATES.length)];
  return tpl(name || 'Герой', race, cls);
}

export function randomStats(): Stats {
  const roll = () => 8 + Math.floor(Math.random() * 10);
  return { str: roll(), dex: roll(), con: roll(), int: roll(), wis: roll(), cha: roll() };
}

export function makeRoomCode(title: string): string {
  const letters = (title.replace(/[^а-яА-Яa-zA-Z]/g, '').toUpperCase() + 'XYZ').slice(0, 3);
  const num = Math.floor(Math.random() * 900) + 100;
  return `${letters}-${num}`;
}
