import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Divider, Panel } from '@/components/dnd/Ornament';
import CharacterSheet from '@/components/dnd/CharacterSheet';
import RoomModal from '@/components/dnd/RoomModal';
import { toast } from '@/hooks/use-toast';
import {
  Character,
  AVATAR_POOL,
  MAP_POOL,
  randomStats,
} from '@/components/dnd/types';

type Screen = 'landing' | 'auth' | 'mode' | 'master' | 'player';

const AVATAR_IMG = AVATAR_POOL[0];

type DieShape = 'triangle' | 'square' | 'diamond' | 'kite' | 'pentagon' | 'hexagon';

const DICE = [
  { name: 'd4', sides: 4, shape: 'triangle' as DieShape },
  { name: 'd6', sides: 6, shape: 'square' as DieShape },
  { name: 'd8', sides: 8, shape: 'diamond' as DieShape },
  { name: 'd10', sides: 10, shape: 'kite' as DieShape },
  { name: 'd12', sides: 12, shape: 'pentagon' as DieShape },
  { name: 'd20', sides: 20, shape: 'hexagon' as DieShape },
] as const;

const SHAPE_CLIP: Record<DieShape, string> = {
  triangle: 'polygon(50% 4%, 96% 94%, 4% 94%)',
  square: 'polygon(8% 8%, 92% 8%, 92% 92%, 8% 92%)',
  diamond: 'polygon(50% 2%, 98% 50%, 50% 98%, 2% 50%)',
  kite: 'polygon(50% 0%, 90% 38%, 50% 100%, 10% 38%)',
  pentagon: 'polygon(50% 2%, 98% 40%, 79% 98%, 21% 98%, 2% 40%)',
  hexagon: 'polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 26%, 5% 74%)',
};

function DiceShape({
  shape,
  children,
  className = '',
  style,
}: {
  shape: DieShape;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        clipPath: SHAPE_CLIP[shape],
        background: 'linear-gradient(150deg, #f4d488 0%, #d99a3a 55%, #8a5518 100%)',
        ...style,
      }}
    >
      <span
        className="absolute inset-[2px]"
        style={{
          clipPath: SHAPE_CLIP[shape],
          background: 'linear-gradient(150deg, #3a2a14, #1c130a)',
        }}
      />
      <span className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </span>
    </div>
  );
}

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
  const [roomOpen, setRoomOpen] = useState(false);
  const [room, setRoom] = useState<{ title: string; code: string } | null>(null);
  const [selected, setSelected] = useState<Character | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [players, setPlayers] = useState<Character[]>([
    { id: 1, name: 'Лираэль', race: 'Эльф', cls: 'Следопыт', hp: 24, maxHp: 28, lvl: 4, avatar: AVATAR_POOL[0], backstory: 'Хранительница леса Тень-Шёпот, ищущая пропавшего брата.', stats: randomStats() },
    { id: 2, name: 'Торин', race: 'Дворф', cls: 'Воин', hp: 38, maxHp: 38, lvl: 5, avatar: AVATAR_POOL[1], backstory: 'Бывший страж горного клана, изгнанный за отказ поднять оружие на невиновных.', stats: randomStats() },
    { id: 3, name: 'Зара', race: 'Тифлинг', cls: 'Чародей', hp: 16, maxHp: 22, lvl: 4, avatar: AVATAR_POOL[2], backstory: 'Дитя запретного пакта, скрывающееся от охотников на ведьм.', stats: randomStats() },
  ]);

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Panel className="lg:col-span-1">
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
          <Icon name="Castle" size={20} className="text-primary" /> Комната
        </h3>
        {room ? (
          <div className="space-y-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Активный стол</p>
              <p className="font-display text-xl">{room.title}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-sm">
              <p className="text-muted-foreground text-xs mb-1">Код приглашения</p>
              <div className="flex items-center justify-between">
                <span className="font-rune text-primary text-lg tracking-widest">{room.code}</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(room.code);
                    toast({ title: 'Код скопирован' });
                  }}
                >
                  <Icon name="Copy" size={15} className="text-muted-foreground cursor-pointer hover:text-primary" />
                </button>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={() => setRoom(null)}>
              <Icon name="X" size={15} /> Закрыть стол
            </Button>
          </div>
        ) : (
          <Button className="w-full gap-2 glow-gold" onClick={() => setRoomOpen(true)}>
            <Icon name="Plus" size={16} /> Открыть стол
          </Button>
        )}
      </Panel>
      <Panel className="lg:col-span-2">
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" /> Герои за столом
        </h3>
        <div className="space-y-3">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelected(p);
                setSheetOpen(true);
              }}
              className="w-full flex items-center gap-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary transition text-left"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/40 shrink-0">
                <img src={p.avatar} alt="" className="w-full h-full object-cover" />
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
                  <span>{p.hp}/{p.maxHp}</span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-destructive"
                    style={{ width: `${(p.hp / p.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </Panel>
      <RoomModal open={roomOpen} onOpenChange={setRoomOpen} mode="create" onSuccess={(title, code) => setRoom({ title, code })} />
      <CharacterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        character={selected}
        mode="view"
        onSave={(updated) => setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
      />
    </div>
  );
}

interface Token {
  id: number;
  x: number;
  y: number;
  type: 'player' | 'enemy' | 'npc' | 'prop';
  label: string;
  hp: number;
  color: string;
  avatar?: string;
}

/* ---------- BATTLE MAP ---------- */
function BattleMap() {
  const [rolling, setRolling] = useState<null | { name: string; value: number; shape: DieShape }>(null);
  const [mapImg, setMapImg] = useState(MAP_POOL[0]);
  const [generatingMap, setGeneratingMap] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([
    { id: 1, x: 25, y: 35, type: 'player', label: 'Лираэль', hp: 86, color: '#4ade80', avatar: AVATAR_POOL[0] },
    { id: 2, x: 55, y: 55, type: 'enemy', label: 'Гоблин', hp: 40, color: '#ef4444' },
    { id: 3, x: 70, y: 30, type: 'npc', label: 'Торговец', hp: 100, color: '#60a5fa' },
  ]);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<number | null>(null);

  const roll = (name: string, sides: number, shape: DieShape) => {
    const value = Math.floor(Math.random() * sides) + 1;
    setRolling({ name, value, shape });
    setTimeout(() => setRolling(null), 2200);
  };

  const tokenIcon = (t: Token['type']) =>
    t === 'player' ? 'User' : t === 'enemy' ? 'Skull' : t === 'npc' ? 'MessageCircle' : 'Box';

  const generateMap = () => {
    setGeneratingMap(true);
    setTimeout(() => {
      const options = MAP_POOL.filter((m) => m !== mapImg);
      setMapImg(options[Math.floor(Math.random() * options.length)] ?? MAP_POOL[0]);
      setGeneratingMap(false);
      toast({ title: 'Карта сгенерирована нейросетью' });
    }, 1200);
  };

  const addToken = (type: Token['type']) => {
    const presets: Record<Token['type'], { color: string; label: string }> = {
      player: { color: '#4ade80', label: 'Игрок' },
      enemy: { color: '#ef4444', label: 'Враг' },
      npc: { color: '#60a5fa', label: 'NPC' },
      prop: { color: '#d99a3a', label: 'Мебель' },
    };
    const p = presets[type];
    setTokens((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        type,
        label: p.label,
        hp: 100,
        color: p.color,
        avatar: type === 'player' ? AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)] : undefined,
      },
    ]);
  };

  const removeToken = (id: number) => setTokens((prev) => prev.filter((t) => t.id !== id));

  const onPointerDown = (id: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    dragId.current = id;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragId.current === null || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.min(96, Math.max(4, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(96, Math.max(4, ((e.clientY - rect.top) / rect.height) * 100));
    setTokens((prev) => prev.map((t) => (t.id === dragId.current ? { ...t, x, y } : t)));
  };

  const stopDrag = () => {
    dragId.current = null;
  };

  return (
    <div className="grid lg:grid-cols-4 gap-5">
      {/* Map */}
      <div className="lg:col-span-3">
        <Panel className="p-2 relative overflow-hidden">
          <div
            ref={mapRef}
            className="relative rounded-md overflow-hidden aspect-[16/10] select-none"
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
          >
            <img src={mapImg} alt="карта боя" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:8%_12.5%]" />

            {generatingMap && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 z-20">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
                <span className="text-primary font-display text-lg">Нейросеть рисует карту...</span>
              </div>
            )}

            {tokens.map((t) => (
              <div
                key={t.id}
                onPointerDown={onPointerDown(t.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group touch-none cursor-grab active:cursor-grabbing"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToken(t.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                >
                  <Icon name="X" size={10} />
                </button>
                <div
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 shadow-lg overflow-hidden animate-float-token"
                  style={{ borderColor: t.color, background: `${t.color}22`, boxShadow: `0 0 12px ${t.color}88` }}
                >
                  {t.avatar ? (
                    <img src={t.avatar} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                  ) : (
                    <Icon name={tokenIcon(t.type)} size={16} style={{ color: t.color }} />
                  )}
                </div>
                <div className="mt-1 w-full h-1 rounded-full bg-black/50 overflow-hidden">
                  <div className="h-full" style={{ width: `${t.hp}%`, background: t.color }} />
                </div>
                <p className="text-[9px] text-center text-white/90 drop-shadow mt-0.5">{t.label}</p>
              </div>
            ))}

            {/* flying dice */}
            {rolling && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div className="animate-dice flex flex-col items-center">
                  <DiceShape shape={rolling.shape} className="w-28 h-28 glow-gold">
                    <span className="font-rune text-5xl gold-text">{rolling.value}</span>
                  </DiceShape>
                  <span className="mt-3 text-primary font-display text-lg">
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
                onClick={() => roll(d.name, d.sides, d.shape)}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-secondary/60 border border-border hover:border-primary hover:glow-gold transition hover-scale"
              >
                <DiceShape shape={d.shape} className="w-11 h-11">
                  <span className="font-rune text-sm gold-text">{d.name}</span>
                </DiceShape>
                <span className="text-xs font-medium text-muted-foreground">{d.name}</span>
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
            <button
              onClick={generateMap}
              disabled={generatingMap}
              className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-secondary/60 border border-border hover:border-primary/50 transition text-left disabled:opacity-50"
            >
              <Icon name={generatingMap ? 'Loader2' : 'Image'} size={15} className={`text-primary ${generatingMap ? 'animate-spin' : ''}`} />
              {generatingMap ? 'Рисуем карту...' : 'Сгенерировать карту'}
            </button>
            {[
              { i: 'Skull', t: 'Создать врага', type: 'enemy' as const },
              { i: 'Gem', t: 'Придумать лут' },
              { i: 'MessageCircle', t: 'Оживить NPC', type: 'npc' as const },
            ].map((a) => (
              <button
                key={a.t}
                onClick={() => {
                  if (a.type) addToken(a.type);
                  toast({ title: a.t, description: 'Нейросеть добавила результат на стол' });
                }}
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
          <p className="text-xs text-muted-foreground mb-2">Перетаскивай фишки прямо на карте</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { i: 'User', t: 'Игрок', type: 'player' as const },
              { i: 'Skull', t: 'Враг', type: 'enemy' as const },
              { i: 'MessageCircle', t: 'NPC', type: 'npc' as const },
              { i: 'Box', t: 'Мебель', type: 'prop' as const },
            ].map((a) => (
              <button
                key={a.t}
                onClick={() => addToken(a.type)}
                className="flex flex-col items-center gap-1 py-2 rounded-lg bg-secondary/60 border border-border hover:border-primary/50 transition"
              >
                <Icon name={a.i} size={17} className="text-primary" />
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
  const [chars, setChars] = useState<Character[]>([
    { id: 1, name: 'Лираэль', race: 'Эльф', cls: 'Следопыт', lvl: 4, hp: 28, maxHp: 28, avatar: AVATAR_POOL[0], backstory: 'Хранительница леса Тень-Шёпот, ищущая пропавшего брата.', stats: randomStats() },
    { id: 2, name: 'Каэль', race: 'Человек', cls: 'Паладин', lvl: 6, hp: 52, maxHp: 52, avatar: AVATAR_POOL[2], backstory: 'Странствующий рыцарь, поклявшийся защищать слабых.', stats: randomStats() },
  ]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selected, setSelected] = useState<Character | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);

  const spells = [
    { name: 'Огненный шар', lvl: 3, icon: 'Flame', color: '#ef4444' },
    { name: 'Лечение ран', lvl: 1, icon: 'Heart', color: '#4ade80' },
    { name: 'Щит веры', lvl: 1, icon: 'Shield', color: '#60a5fa' },
    { name: 'Молния', lvl: 3, icon: 'Zap', color: '#facc15' },
  ];
  const [activeSpell, setActiveSpell] = useState<string | null>(null);

  const openCreate = () => {
    setSelected(null);
    setSheetMode('create');
    setSheetOpen(true);
  };

  const openEdit = (c: Character) => {
    setSelected(c);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const handleSave = (c: Character) => {
    setChars((prev) => {
      const exists = prev.some((p) => p.id === c.id);
      return exists ? prev.map((p) => (p.id === c.id ? c : p)) : [...prev, c];
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-16 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={22} className="text-primary" />
          <h2 className="font-display text-3xl">Библиотека героев</h2>
        </div>
        <Button className="gap-2 glow-gold" onClick={() => setJoinOpen(true)}>
          <Icon name="Swords" size={16} /> Подключиться к игре
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {chars.map((c) => (
          <Panel key={c.id} className="hover-scale">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 glow-gold">
                <img src={c.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.race} · {c.cls}</p>
                <span className="text-xs text-primary">Уровень {c.lvl}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              {[
                { l: 'СИЛ', v: c.stats.str },
                { l: 'ЛОВ', v: c.stats.dex },
                { l: 'ТЕЛ', v: c.stats.con },
              ].map((s) => (
                <div key={s.l} className="bg-secondary/60 rounded-lg py-2 border border-border">
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                  <p className="font-display text-xl">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => { setSelected(c); setSheetMode('view'); setSheetOpen(true); }}>
                <Icon name="Eye" size={14} /> Открыть
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => openEdit(c)}>
                <Icon name="Pencil" size={14} /> Изменить
              </Button>
            </div>
          </Panel>
        ))}

        {/* Create new with AI */}
        <button onClick={openCreate} className="text-left">
          <Panel className="border-dashed flex flex-col items-center justify-center text-center py-8 hover-scale h-full">
            <div className="w-16 h-16 rounded-full gold-border flex items-center justify-center mb-3">
              <Icon name="Wand2" size={24} className="text-primary" />
            </div>
            <h3 className="font-display text-2xl mb-1">Создать героя</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-[220px]">
              Нейросеть придумает историю, характеристики и нарисует аватарку
            </p>
            <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground">
              <Icon name="Plus" size={16} /> Новый персонаж
            </span>
          </Panel>
        </button>
      </div>

      <CharacterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        character={selected}
        mode={sheetMode}
        onSave={handleSave}
      />
      <RoomModal open={joinOpen} onOpenChange={setJoinOpen} mode="join" onSuccess={() => {}} />

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
              onClick={() => {
                setActiveSpell(s.name);
                toast({ title: `Применено: ${s.name}`, description: 'Эффект отобразится вокруг фишки на боевой карте' });
                setTimeout(() => setActiveSpell(null), 1500);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/60 border transition hover-scale ${
                activeSpell === s.name ? 'border-primary glow-gold' : 'border-border hover:border-primary'
              }`}
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