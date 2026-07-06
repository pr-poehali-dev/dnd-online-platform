import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'join';
  onSuccess: (title: string, code: string) => void;
}

export default function RoomModal({ open, onOpenChange, mode, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleCreate = () => {
    if (!title.trim() || !password.trim()) {
      toast({ title: 'Заполни название и пароль', variant: 'destructive' });
      return;
    }
    const generatedCode =
      (title.replace(/[^а-яА-Яa-zA-Z]/g, '').toUpperCase() + 'XYZ').slice(0, 3) +
      '-' +
      (Math.floor(Math.random() * 900) + 100);
    onSuccess(title, generatedCode);
    onOpenChange(false);
    toast({ title: 'Стол открыт!', description: `Код приглашения: ${generatedCode}` });
    setTitle('');
    setPassword('');
  };

  const handleJoin = () => {
    if (!code.trim() || !password.trim()) {
      toast({ title: 'Введи код комнаты и пароль', variant: 'destructive' });
      return;
    }
    onSuccess(code, code);
    onOpenChange(false);
    toast({ title: 'Ты присоединился к столу!', description: code });
    setCode('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gold-border parchment">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-card-foreground flex items-center gap-2">
            <Icon name={mode === 'create' ? 'Castle' : 'Swords'} size={20} className="text-accent" />
            {mode === 'create' ? 'Открыть новый стол' : 'Подключиться к игре'}
          </DialogTitle>
        </DialogHeader>
        {mode === 'create' ? (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-card-foreground/70">Название стола</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Тени над Невервинтером" />
            </div>
            <div>
              <Label className="text-xs text-card-foreground/70">Пароль для входа</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            </div>
            <Button className="w-full gap-2 glow-gold" onClick={handleCreate}>
              <Icon name="Plus" size={16} /> Открыть стол
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-card-foreground/70">Код или название комнаты</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Например: NVR-742" />
            </div>
            <div>
              <Label className="text-xs text-card-foreground/70">Пароль</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            </div>
            <Button className="w-full gap-2 glow-gold" onClick={handleJoin}>
              <Icon name="DoorOpen" size={16} /> Войти в игру
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}