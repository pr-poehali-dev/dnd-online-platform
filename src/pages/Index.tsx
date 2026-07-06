import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Divider, Panel } from '@/components/dnd/Ornament';

type Screen = 'landing' | 'auth' | 'mode' | 'master' | 'player';

const MAP_IMG =
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/46718763-04bb-494a-925d-12cc6fcbeed6.jpg';
const AVATAR_IMG =
  'https://cdn.poehali.dev/projects/967f7ffd-40c6-4f5a-91c5-5266de35741c/files/31d6a2ef-3f02-4589-b883-c62ad3dad838.jpg';

const DICE = [
  { name: 'd4', sides: 4, icon: 'Triangle' },
  { name: 'd6', sides: 6, icon: 'Dice6' },
  { name: 'd8', sides: 8, icon: 'Diamond' },
  { name: 'd10', sides: 10, icon: 'Pentagon' },
  { name: 'd12', sides: 12, icon: 'Hexagon' },
  { name: 'd20', sides: 20, icon: 'Sparkles' },
] as const;

export default function Index() {
  const [screen, setScreen] = useState<Screen>('landing');

  return (
    <div className="min-h-screen relative vignette overflow-x-hidden">
      <Header screen={screen} setScreen={setScreen} />
      <main className="relative z-10">
        {screen === 'landing' && <Landing go={setScreen} />}
        {screen === 'auth' && <Auth go={setScreen} />}
        {screen === 'mode' && <ModeSelect go={setScreen} />}
        {screen === 'master' && <MasterPanel />}
        {screen === 'player' && <PlayerPanel />}
      </main>
      <footer className="relative z-10 text-center py-8 text-muted-foreground text-sm border-t border-border/50 mt-10">
        <span className="font-rune tracking-wide">Аркана</span> · платформа для настольных приключений
      </footer>
    </div>
  );
}

function Header({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <header className="relative z-20 flex items-center justify-between px-5 md:px-10 py-4 border-b border-border/60 backdrop-blur-sm">
      <button onClick={() => setScreen('landing')} className="flex items-center gap-3 hover-scale">
        <div className="w-10 h-10 rounded-full gold-border flex items-center justify-center glow-gold">
          <Icon name="Sparkles" size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl leading-none gold-text">Аркана</p>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Dungeons & Dragons</p>
        </div>
      </button>
      {screen !== 'landing' && screen !== 'auth' && (
        <div className="flex items-center gap-2">
          {screen !== 'mode' && (
            <Button variant="ghost" size="sm" onClick={() => setScreen('mode')} className="gap-2">
              <Icon name="Repeat" size={15} /> <span className="hidden sm:inline">Сменить режим</span>
            </Button>
          )}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/50">
            <img src={AVATAR_IMG} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- LANDING ---------- */
function Landing({ go }: { go: (s: Screen) => void }) {
  return (
    <section className="max-w-4xl mx-auto text-center px-5 pt-20 pb-16 animate-fade-in">
      <p className="font-rune text-primary tracking-[0.4em] uppercase text-sm mb-6 animate-flicker">
        Открой врата приключений
      </p>
      <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
        Твоя легенда начинается <span className="gold-text">здесь</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
        Веди кампании как Мастер или создавай героев как Игрок. Интерактивная карта,
        живые кубики и помощник-нейросеть — всё в одном столе.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Button size="lg" onClick={() => go('auth')} className="gap-2 text-base glow-gold">
          <Icon name="Swords" size={18} /> Войти в игру
        </Button>
        <Button size="lg" variant="outline" onClick={() => go('mode')} className="gap-2 text-base">
          <Icon name="Eye" size={18} /> Осмотреться
        </Button>
      </div>
      <Divider />
      <div className="grid md:grid-cols-3 gap-5 mt-4">
        {[
          { i: 'BookOpen', t: 'Книга кампании', d: 'Пиши историю мира вместе с ИИ-помощником' },
          { i: 'Map', t: 'Живая карта', d: 'Фишки, туман войны и генерация локаций' },
          { i: 'Dices', t: 'Броски кубиков', d: 'Красивая физика от d4 до d20 прямо на столе' },
        ].map((f) => (
          <Panel key={f.t} className="text-left hover-scale">
            <Icon name={f.i} size={26} className="text-primary mb-3" />
            <h3 className="font-display text-xl mb-1">{f.t}</h3>
            <p className="text-sm text-muted-foreground">{f.d}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}

/* ---------- AUTH ---------- */
function Auth({ go }: { go: (s: Screen) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  return (
    <section className="max-w-md mx-auto px-5 pt-16 pb-20 animate-fade-in">
      <Panel className="parchment">
        <div className="text-center text-card-foreground">
          <Icon name="ScrollText" size={30} className="text-accent mx-auto mb-2" />
          <h2 className="font-display text-3xl">
            {mode === 'register' ? 'Скрепи договор кровью' : 'С возвращением, странник'}
          </h2>
          <p className="text-sm opacity-70 mt-1">
            {mode === 'register' ? 'Создай учётную запись героя' : 'Войди в свои владения'}
          </p>
        </div>
        <Divider className="!my-5" />
        <div className="space-y-3">
          {mode === 'register' && (
            <Field icon="User" placeholder="Имя героя" />
          )}
          <Field icon="Mail" placeholder="Электронная почта" />
          <Field icon="Lock" placeholder="Заклинание-пароль" type="password" />
          <Button className="w-full gap-2 glow-gold" onClick={() => go('mode')}>
            <Icon name="DoorOpen" size={16} />
            {mode === 'register' ? 'Начать путь' : 'Войти'}
          </Button>
        </div>
        <p className="text-center text-sm mt-4 text-card-foreground/70">
          {mode === 'register' ? 'Уже есть свиток?' : 'Впервые в этих землях?'}{' '}
          <button
            onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
            className="text-accent underline underline-offset-4"
          >
            {mode === 'register' ? 'Войти' : 'Регистрация'}
          </button>
        </p>
      </Panel>
    </section>
  );
}

function Field({
  icon,
  placeholder,
  type = 'text',
}: {
  icon: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <Icon
        name={icon}
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/70"
      />
      <Input
        type={type}
        placeholder={placeholder}
        className="pl-9 bg-background/40 border-accent/30 text-card-foreground placeholder:text-card-foreground/50"
      />
    </div>
  );
}

/* ---------- MODE SELECT ---------- */
function ModeSelect({ go }: { go: (s: Screen) => void }) {
  return (
    <section className="max-w-4xl mx-auto px-5 pt-16 pb-20 text-center animate-fade-in">
      <h2 className="font-display text-4xl md:text-5xl mb-2">Выбери свою роль</h2>
      <p className="text-muted-foreground mb-2">За чьими глазами ты войдёшь в приключение?</p>
      <Divider />
      <div className="grid md:grid-cols-2 gap-6">
        <RoleCard
          onClick={() => go('master')}
          icon="Crown"
          title="Мастер Подземелий"
          desc="Плети сюжет, управляй миром, картой и монстрами. ИИ поможет создать историю, лут и врагов."
          tags={['Книга кампании', 'Боевая карта', 'ИИ-генерация']}
        />
        <RoleCard
          onClick={() => go('player')}
          icon="Shield"
          title="Игрок"
          desc="Создавай героев, веди библиотеку персонажей и подключайся к столу Мастера."
          tags={['Конструктор героя', 'Заклинания', 'ИИ-аватарки']}
        />
      </div>
    </section>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  tags,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left group">
      <Panel className="h-full hover-scale group-hover:glow-gold transition-shadow">
        <div className="w-14 h-14 rounded-full gold-border flex items-center justify-center mb-4">
          <Icon name={icon} size={26} className="text-primary" />
        </div>
        <h3 className="font-display text-3xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{desc}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-secondary border border-border">
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-primary text-sm mt-4 font-medium">
          Войти <Icon name="ArrowRight" size={15} />
        </span>
      </Panel>
    </button>
  );
}

/* ---------- MASTER PANEL ---------- */
function MasterPanel() {
  const [tab, setTab] = useState<'book' | 'room' | 'battle'>('book');
  const tabs = [
    { id: 'book', label: 'Книга кампании', icon: 'BookOpen' },
    { id: 'room', label: 'Комната', icon: 'Castle' },
    { id: 'battle', label: 'Боевая карта', icon: 'Map' },
  ] as const;
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 animate-fade-in">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Icon name="Crown" size={22} className="text-primary" />
        <h2 className="font-display text-3xl">Панель Мастера</h2>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition ${
              tab === t.id
                ? 'bg-primary text-primary-foreground border-primary glow-gold'
                : 'bg-secondary/60 border-border hover:border-primary/50'
            }`}
          >
            <Icon name={t.icon} size={16} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'book' && <CampaignBook />}
      {tab === 'room' && <RoomManager />}
      {tab === 'battle' && <BattleMap />}
    </section>
  );
}

function CampaignBook() {
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Panel className="parchment lg:col-span-2 min-h-[420px]">
        <div className="text-card-foreground">
          <input
            defaultValue="Тени над Невервинтером"
            className="font-display text-3xl bg-transparent w-full outline-none border-b border-accent/30 pb-2 mb-4"
          />
          <Textarea
            defaultValue="Глава I. Холодный ветер несёт запах гари над руинами древнего города. Отряд авантюристов прибывает в таверну «Треснувший щит», где старый жрец шепчет о пробудившемся зле в катакомбах..."
            className="bg-transparent border-none resize-none min-h-[300px] text-base leading-relaxed text-card-foreground/90"
          />
        </div>
      </Panel>
      <Panel className="flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Wand2" size={18} className="text-primary" />
          <h3 className="font-display text-xl">ИИ-помощник</h3>
        </div>
        <div className="flex-1 space-y-3 text-sm">
          <div className="bg-secondary/60 rounded-lg p-3">
            <p className="text-muted-foreground text-xs mb-1">Хранитель историй</p>
            Что таится в катакомбах под городом? Опиши главного злодея этой главы.
          </div>
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            Предлагаю: культ Мёртвого Пламени во главе с личом <b>Морвеном</b>, что стремится
            возродить древнего дракона...
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {['Продолжить сюжет', 'Придумать NPC', 'Описать локацию'].map((c) => (
            <span key={c} className="text-xs px-2 py-1 rounded-full bg-secondary border border-border cursor-pointer hover:border-primary/50">
              {c}
            </span>
          ))}
        </div>
        <div className="relative">
          <Textarea placeholder="Спроси у ИИ..." className="pr-11 resize-none min-h-[52px] bg-background/50" />
          <Button size="icon" className="absolute right-1.5 bottom-1.5 h-8 w-8">
            <Icon name="Send" size={15} />
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function RoomManager() {
  const players = [
    { name: 'Лираэль', race: 'Эльф', cls: 'Следопыт', hp: 24, max: 28, lvl: 4 },
    { name: 'Торин', race: 'Дворф', cls: 'Воин', hp: 38, max: 38, lvl: 5 },
    { name: 'Зара', race: 'Тифлинг', cls: 'Чародей', hp: 16, max: 22, lvl: 4 },
  ];
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Panel className="lg:col-span-1">
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
          <Icon name="Castle" size={20} className="text-primary" /> Создать комнату
        </h3>
        <div className="space-y-3">
          <Field icon="Type" placeholder="Название стола" />
          <Field icon="KeyRound" placeholder="Пароль для входа" />
          <Button className="w-full gap-2 glow-gold">
            <Icon name="Plus" size={16} /> Открыть стол
          </Button>
        </div>
        <Divider className="!my-5" />
        <div className="bg-secondary/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground text-xs mb-1">Код приглашения</p>
          <div className="flex items-center justify-between">
            <span className="font-rune text-primary text-lg tracking-widest">NVR-7X2</span>
            <Icon name="Copy" size={15} className="text-muted-foreground cursor-pointer" />
          </div>
        </div>
      </Panel>
      <Panel className="lg:col-span-2">
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" /> Герои за столом
        </h3>
        <div className="space-y-3">
          {players.map((p) => (
            <div key={p.name} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary transition">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/40 shrink-0">
                <img src={AVATAR_IMG} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg leading-none">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.race} · {p.cls} · Ур. {p.lvl}
                </p>
              </div>
              <div className="w-28 shrink-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">HP</span>
                  <span>{p.hp}/{p.max}</span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-destructive"
                    style={{ width: `${(p.hp / p.max) * 100}%` }}
                  />
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------- BATTLE MAP ---------- */
function BattleMap() {
  const [rolling, setRolling] = useState<null | { name: string; value: number }>(null);
  const [tokens, setTokens] = useState([
    { id: 1, x: 25, y: 35, type: 'player', label: 'Лираэль', hp: 86, color: '#4ade80' },
    { id: 2, x: 55, y: 55, type: 'enemy', label: 'Гоблин', hp: 40, color: '#ef4444' },
    { id: 3, x: 70, y: 30, type: 'npc', label: 'Торговец', hp: 100, color: '#60a5fa' },
    { id: 4, x: 42, y: 70, type: 'prop', label: 'Сундук', hp: 100, color: '#d99a3a' },
  ]);

  const roll = (name: string, sides: number) => {
    const value = Math.floor(Math.random() * sides) + 1;
    setRolling({ name, value });
    setTimeout(() => setRolling(null), 2200);
  };

  const tokenIcon = (t: string) =>
    t === 'player' ? 'User' : t === 'enemy' ? 'Skull' : t === 'npc' ? 'MessageCircle' : 'Box';

  return (
    <div className="grid lg:grid-cols-4 gap-5">
      {/* Map */}
      <div className="lg:col-span-3">
        <Panel className="p-2 relative overflow-hidden">
          <div className="relative rounded-md overflow-hidden aspect-[16/10]">
            <img src={MAP_IMG} alt="карта боя" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:8%_12.5%]" />
            {tokens.map((t) => (
              <div
                key={t.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 animate-float-token cursor-grab"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <div
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 shadow-lg"
                  style={{ borderColor: t.color, background: `${t.color}22`, boxShadow: `0 0 12px ${t.color}88` }}
                >
                  <Icon name={tokenIcon(t.type)} size={16} style={{ color: t.color }} />
                </div>
                <div className="mt-1 w-full h-1 rounded-full bg-black/50 overflow-hidden">
                  <div className="h-full" style={{ width: `${t.hp}%`, background: t.color }} />
                </div>
                <p className="text-[9px] text-center text-white/90 drop-shadow mt-0.5">{t.label}</p>
              </div>
            ))}

            {/* flying dice */}
            {rolling && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="animate-dice flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl gold-border flex items-center justify-center glow-gold bg-card/90 backdrop-blur">
                    <span className="font-rune text-5xl gold-text">{rolling.value}</span>
                  </div>
                  <span className="mt-2 text-primary font-display text-lg">
                    {rolling.name}: выпало {rolling.value}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* Dice tray */}
        <Panel className="mt-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-display text-xl flex items-center gap-2">
              <Icon name="Dices" size={18} className="text-primary" /> Броски кубиков
            </h3>
            <span className="text-xs text-muted-foreground">Нажми на кубик, чтобы бросить</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DICE.map((d) => (
              <button
                key={d.name}
                onClick={() => roll(d.name, d.sides)}
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-secondary/60 border border-border hover:border-primary hover:glow-gold transition hover-scale"
              >
                <Icon name={d.icon} size={22} className="text-primary" />
                <span className="text-sm font-medium">{d.name}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* Sidebar tools */}
      <div className="space-y-4">
        <Panel>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2">
            <Icon name="Wand2" size={17} className="text-primary" /> ИИ-мастерская
          </h3>
          <div className="space-y-2">
            {[
              { i: 'Image', t: 'Сгенерировать карту' },
              { i: 'Skull', t: 'Создать врага' },
              { i: 'Gem', t: 'Придумать лут' },
              { i: 'MessageCircle', t: 'Оживить NPC' },
            ].map((a) => (
              <button
                key={a.t}
                className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-secondary/60 border border-border hover:border-primary/50 transition text-left"
              >
                <Icon name={a.i} size={15} className="text-primary" /> {a.t}
              </button>
            ))}
          </div>
        </Panel>
        <Panel>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2">
            <Icon name="Plus" size={17} className="text-primary" /> Добавить фишку
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { i: 'User', t: 'Игрок', c: '#4ade80' },
              { i: 'Skull', t: 'Враг', c: '#ef4444' },
              { i: 'MessageCircle', t: 'NPC', c: '#60a5fa' },
              { i: 'Box', t: 'Мебель', c: '#d99a3a' },
            ].map((a) => (
              <button
                key={a.t}
                onClick={() =>
                  setTokens((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      x: 30 + Math.random() * 40,
                      y: 30 + Math.random() * 40,
                      type: a.t === 'Игрок' ? 'player' : a.t === 'Враг' ? 'enemy' : a.t === 'NPC' ? 'npc' : 'prop',
                      label: a.t,
                      hp: 100,
                      color: a.c,
                    },
                  ])
                }
                className="flex flex-col items-center gap-1 py-2 rounded-lg bg-secondary/60 border border-border hover:border-primary/50 transition"
              >
                <Icon name={a.i} size={17} style={{ color: a.c }} />
                <span className="text-xs">{a.t}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- PLAYER PANEL ---------- */
function PlayerPanel() {
  const chars = [
    { name: 'Лираэль', race: 'Лесной эльф', cls: 'Следопыт', lvl: 4, hp: 28 },
    { name: 'Каэль', race: 'Человек', cls: 'Паладин', lvl: 6, hp: 52 },
  ];
  const spells = [
    { name: 'Огненный шар', lvl: 3, icon: 'Flame', color: '#ef4444' },
    { name: 'Лечение ран', lvl: 1, icon: 'Heart', color: '#4ade80' },
    { name: 'Щит веры', lvl: 1, icon: 'Shield', color: '#60a5fa' },
    { name: 'Молния', lvl: 3, icon: 'Zap', color: '#facc15' },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={22} className="text-primary" />
          <h2 className="font-display text-3xl">Библиотека героев</h2>
        </div>
        <Button className="gap-2 glow-gold">
          <Icon name="Swords" size={16} /> Подключиться к игре
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {chars.map((c) => (
          <Panel key={c.name} className="hover-scale">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 glow-gold">
                <img src={AVATAR_IMG} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.race} · {c.cls}</p>
                <span className="text-xs text-primary">Уровень {c.lvl}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              {[
                { l: 'Сила', v: 14 },
                { l: 'Ловк', v: 18 },
                { l: 'Тело', v: 13 },
              ].map((s) => (
                <div key={s.l} className="bg-secondary/60 rounded-lg py-2 border border-border">
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                  <p className="font-display text-xl">{s.v}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <Icon name="Pencil" size={14} /> Редактировать
            </Button>
          </Panel>
        ))}

        {/* Create new with AI */}
        <Panel className="border-dashed flex flex-col items-center justify-center text-center py-8 hover-scale">
          <div className="w-16 h-16 rounded-full gold-border flex items-center justify-center mb-3">
            <Icon name="Wand2" size={24} className="text-primary" />
          </div>
          <h3 className="font-display text-2xl mb-1">Создать героя</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-[220px]">
            Нейросеть придумает историю, характеристики и нарисует аватарку
          </p>
          <Button className="gap-2">
            <Icon name="Plus" size={16} /> Новый персонаж
          </Button>
        </Panel>
      </div>

      <Divider />

      {/* Quick spells bar */}
      <Panel>
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
          <Icon name="Sparkles" size={20} className="text-primary" /> Быстрая панель заклинаний
        </h3>
        <div className="flex flex-wrap gap-3">
          {spells.map((s) => (
            <button
              key={s.name}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/60 border border-border hover:border-primary hover:glow-gold transition hover-scale"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border"
                style={{ borderColor: s.color, background: `${s.color}22` }}
              >
                <Icon name={s.icon} size={18} style={{ color: s.color }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">Круг {s.lvl}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Icon name="Info" size={13} /> На боевой карте применённые заклинания подсвечиваются эффектом вокруг фишки
        </p>
      </Panel>
    </section>
  );
}
