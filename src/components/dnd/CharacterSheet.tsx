import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Divider } from '@/components/dnd/Ornament';
import {
  Character,
  RACES,
  CLASSES,
  AVATAR_POOL,
  generateBackstory,
  randomStats,
} from '@/components/dnd/types';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  character: Character | null;
  mode: 'create' | 'edit' | 'view';
  onSave: (c: Character) => void;
}

const emptyChar = (): Character => ({
  id: Date.now(),
  name: '',
  race: RACES[0],
  cls: CLASSES[0],
  lvl: 1,
  hp: 20,
  maxHp: 20,
  avatar: AVATAR_POOL[0],
  backstory: '',
  stats: randomStats(),
});

export default function CharacterSheet({ open, onOpenChange, character, mode, onSave }: Props) {
  const [draft, setDraft] = useState<Character>(character ?? emptyChar());
  const [editing, setEditing] = useState(mode !== 'view');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(character ?? emptyChar());
      setEditing(mode !== 'view');
    }
  }, [open, character, mode]);

  const set = <K extends keyof Character>(key: K, value: Character[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setStat = (key: keyof Character['stats'], value: number) =>
    setDraft((d) => ({ ...d, stats: { ...d.stats, [key]: value } }));

  const aiGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newAvatar = AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)];
      setDraft((d) => ({
        ...d,
        backstory: generateBackstory(d.name, d.race, d.cls),
        stats: randomStats(),
        avatar: newAvatar,
      }));
      setGenerating(false);
      toast({ title: 'Нейросеть создала персонажа', description: 'История, характеристики и аватар обновлены' });
    }, 1100);
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      toast({ title: 'Укажи имя персонажа', variant: 'destructive' });
      return;
    }
    onSave(draft);
    onOpenChange(false);
    toast({ title: mode === 'create' ? 'Персонаж создан' : 'Персонаж сохранён' });
  };

  const readOnly = !editing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto gold-border parchment">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-card-foreground flex items-center gap-2">
            <Icon name="ScrollText" size={22} className="text-accent" />
            {mode === 'create' ? 'Новый персонаж' : readOnly ? draft.name || 'Персонаж' : 'Редактирование'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-5 text-card-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/50 glow-gold">
              <img src={draft.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 w-full"
                onClick={aiGenerate}
                disabled={generating}
              >
                <Icon name={generating ? 'Loader2' : 'Wand2'} size={14} className={generating ? 'animate-spin' : ''} />
                {generating ? 'Генерация...' : 'ИИ: сгенерировать всё'}
              </Button>
            )}
            {!readOnly && (
              <div className="flex gap-1">
                {AVATAR_POOL.map((a) => (
                  <button
                    key={a}
                    onClick={() => set('avatar', a)}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
                      draft.avatar === a ? 'border-primary' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={a} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <Label className="text-xs text-card-foreground/70">Имя</Label>
              {readOnly ? (
                <p className="font-display text-2xl">{draft.name || '—'}</p>
              ) : (
                <Input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Имя героя" />
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-card-foreground/70">Раса</Label>
                {readOnly ? (
                  <p>{draft.race}</p>
                ) : (
                  <Select value={draft.race} onValueChange={(v) => set('race', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RACES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label className="text-xs text-card-foreground/70">Класс</Label>
                {readOnly ? (
                  <p>{draft.cls}</p>
                ) : (
                  <Select value={draft.cls} onValueChange={(v) => set('cls', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label className="text-xs text-card-foreground/70">Уровень</Label>
                {readOnly ? (
                  <p>{draft.lvl}</p>
                ) : (
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={draft.lvl}
                    onChange={(e) => set('lvl', Number(e.target.value))}
                  />
                )}
              </div>
            </div>
            <div>
              <Label className="text-xs text-card-foreground/70">Здоровье (HP)</Label>
              {readOnly ? (
                <p>{draft.hp} / {draft.maxHp}</p>
              ) : (
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={draft.hp}
                    onChange={(e) => set('hp', Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-muted-foreground text-sm">из</span>
                  <Input
                    type="number"
                    value={draft.maxHp}
                    onChange={(e) => set('maxHp', Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider className="!my-3" />

        <div>
          <Label className="text-xs text-card-foreground/70">Характеристики</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-1">
            {(Object.keys(draft.stats) as (keyof typeof draft.stats)[]).map((k) => (
              <div key={k} className="bg-secondary/60 rounded-lg py-2 text-center border border-border">
                <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
                {readOnly ? (
                  <p className="font-display text-xl">{draft.stats[k]}</p>
                ) : (
                  <input
                    type="number"
                    value={draft.stats[k]}
                    onChange={(e) => setStat(k, Number(e.target.value))}
                    className="w-full text-center bg-transparent font-display text-xl outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Divider className="!my-3" />

        <div>
          <Label className="text-xs text-card-foreground/70">История персонажа</Label>
          {readOnly ? (
            <p className="text-sm leading-relaxed mt-1 whitespace-pre-line">
              {draft.backstory || 'История ещё не написана.'}
            </p>
          ) : (
            <Textarea
              value={draft.backstory}
              onChange={(e) => set('backstory', e.target.value)}
              placeholder="Расскажи о прошлом героя или доверь это нейросети..."
              className="min-h-[100px] bg-background/40"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {readOnly ? (
            <Button className="gap-2" onClick={() => setEditing(true)}>
              <Icon name="Pencil" size={15} /> Редактировать
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
              <Button className="gap-2 glow-gold" onClick={handleSave}>
                <Icon name="Check" size={15} /> Сохранить
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
